import { verifyAuth } from "@/services/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { ref, get, push, set, update, remove } from "firebase/database";
import { db } from "@/services/firebase";

const BLOCKING_BOOKING_STATUSES = new Set([
  "confirmed",
  "in_progress",
  "completed",
]);

function parseDateOnly(value) {
  return new Date(`${value}T12:00:00`);
}

function isDateWithinRange(date, startDate, endDate) {
  return Boolean(
    date && startDate && endDate && date >= startDate && date <= endDate,
  );
}

function normalizeAvailabilityInput(body) {
  return {
    startDate: body.startDate,
    endDate: body.endDate,
    zone: body.zone?.trim(),
    zoneCoords: body.zoneCoords ?? null,
    radiusKm: Number(body.radiusKm) || 50,
    capacityMorning: Number(body.capacityMorning) || 1,
    capacityAfternoon: Number(body.capacityAfternoon) || 2,
  };
}

function validateAvailabilityPayload(
  { startDate, endDate, zone },
  now = new Date(),
) {
  if (!startDate || !endDate || !zone) {
    return "startDate, endDate et zone sont requis";
  }

  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (start >= end) {
    return "La date de fin doit être après la date de début";
  }

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  if (start < today) {
    return "La date de début doit être dans le futur";
  }

  const sixMonthsFromNow = new Date(today);
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
  if (end > sixMonthsFromNow) {
    return "Les disponibilités sont limitées à 6 mois";
  }

  return null;
}

async function getBlockingBookingsForAvailability(proId, availability) {
  const bookingIndexSnapshot = await get(
    ref(db, `indexes/bookings_by_pro/${proId}`),
  );
  if (!bookingIndexSnapshot.exists()) {
    return [];
  }

  const bookingIds = Object.keys(bookingIndexSnapshot.val());
  const bookingSnapshots = await Promise.all(
    bookingIds.map(async (bookingId) => {
      const snapshot = await get(ref(db, `bookings/${bookingId}`));
      return { bookingId, snapshot };
    }),
  );

  return bookingSnapshots
    .filter(({ snapshot }) => snapshot.exists())
    .map(({ bookingId, snapshot }) => ({ bookingId, ...snapshot.val() }))
    .filter(
      (booking) =>
        BLOCKING_BOOKING_STATUSES.has(booking.status) &&
        isDateWithinRange(
          booking.date,
          availability.startDate,
          availability.endDate,
        ),
    );
}

async function findProByUserId(userId) {
  const prosSnapshot = await get(ref(db, "pros"));
  if (!prosSnapshot.exists()) return null;

  const pros = prosSnapshot.val();
  for (const [proId, proData] of Object.entries(pros)) {
    if (proData.userId === userId) return { proId, ...proData };
  }
  return null;
}

export async function GET(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const pro = await findProByUserId(user.uid);
    if (!pro) return errorResponse("Profil pro non trouvé", 404);

    const snapshot = await get(ref(db, `availabilities/${pro.proId}`));
    const availabilities = snapshot.exists() ? snapshot.val() : {};

    const items = Object.entries(availabilities).map(([id, data]) => ({
      id,
      ...data,
    }));

    return successResponse({ items, total: items.length });
  } catch (error) {
    console.error("[API] availabilities GET:", error);
    return errorResponse(
      "Erreur lors de la récupération des disponibilités",
      500,
    );
  }
}

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const pro = await findProByUserId(user.uid);
    if (!pro) return errorResponse("Profil pro non trouvé", 404);

    if (pro.status !== "validated") {
      return errorResponse("Votre profil doit être validé", 400);
    }

    if (!pro.stripeOnboardingComplete) {
      return errorResponse("Configurez Stripe Connect avant de publier", 400);
    }

    const body = await request.json();
    const availData = normalizeAvailabilityInput(body);

    const validationError = validateAvailabilityPayload(availData);
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    const availRef = push(ref(db, `availabilities/${pro.proId}`));
    const createdAvailability = {
      ...availData,
      createdAt: new Date().toISOString(),
    };

    await set(availRef, createdAvailability);

    return successResponse({ id: availRef.key, ...createdAvailability }, 201);
  } catch (error) {
    console.error("[API] availabilities POST:", error);
    return errorResponse("Erreur lors de la publication", 500);
  }
}

export async function PUT(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const pro = await findProByUserId(user.uid);
    if (!pro) return errorResponse("Profil pro non trouvé", 404);

    const body = await request.json();
    const { availabilityId, ...updates } = body;

    if (!availabilityId) return errorResponse("availabilityId requis", 400);

    const availRef = ref(db, `availabilities/${pro.proId}/${availabilityId}`);
    const snapshot = await get(availRef);
    if (!snapshot.exists()) {
      return errorResponse("Disponibilité non trouvée", 404);
    }

    const currentAvailability = snapshot.val();

    const allowedFields = [
      "startDate",
      "endDate",
      "zone",
      "zoneCoords",
      "radiusKm",
      "capacityMorning",
      "capacityAfternoon",
    ];
    const filtered = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) filtered[field] = updates[field];
    }

    if (Object.keys(filtered).length === 0) {
      return errorResponse("Aucune modification fournie", 400);
    }

    const mergedAvailability = {
      ...currentAvailability,
      ...normalizeAvailabilityInput({ ...currentAvailability, ...filtered }),
    };

    const validationError = validateAvailabilityPayload(mergedAvailability);
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    const blockingBookings = await getBlockingBookingsForAvailability(
      pro.proId,
      mergedAvailability,
    );
    if (blockingBookings.length > 0) {
      return errorResponse(
        "Cette disponibilité a déjà des réservations confirmées et ne peut plus être modifiée.",
        409,
      );
    }

    filtered.updatedAt = new Date().toISOString();
    await update(availRef, filtered);

    return successResponse({
      id: availabilityId,
      ...currentAvailability,
      ...filtered,
    });
  } catch (error) {
    console.error("[API] availabilities PUT:", error);
    return errorResponse("Erreur lors de la modification", 500);
  }
}

export async function DELETE(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const pro = await findProByUserId(user.uid);
    if (!pro) return errorResponse("Profil pro non trouvé", 404);

    const { searchParams } = new URL(request.url);
    const availabilityId = searchParams.get("id");
    if (!availabilityId) return errorResponse("id requis", 400);

    const availRef = ref(db, `availabilities/${pro.proId}/${availabilityId}`);
    const snapshot = await get(availRef);
    if (!snapshot.exists()) {
      return errorResponse("Disponibilité non trouvée", 404);
    }

    const blockingBookings = await getBlockingBookingsForAvailability(
      pro.proId,
      snapshot.val(),
    );
    if (blockingBookings.length > 0) {
      return errorResponse(
        "Cette disponibilité a déjà des réservations confirmées et ne peut plus être supprimée.",
        409,
      );
    }

    await remove(availRef);

    return successResponse({ deleted: availabilityId });
  } catch (error) {
    console.error("[API] availabilities DELETE:", error);
    return errorResponse("Erreur lors de la suppression", 500);
  }
}
