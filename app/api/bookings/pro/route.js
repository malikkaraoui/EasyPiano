import { verifyAuth } from "@/services/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { ref, get, update } from "firebase/database";
import { db } from "@/services/firebase";
import { decryptAddress } from "@/services/encryption";

const SLOT_START_HOURS = {
  morning: 8,
  afternoon: 14,
};

const BOOKING_STATUS_TRANSITIONS = {
  confirmed: "in_progress",
  in_progress: "completed",
};

function getSlotStartDate(date, slot) {
  const slotStart = new Date(`${date}T00:00:00`);
  slotStart.setHours(SLOT_START_HOURS[slot] ?? 8, 0, 0, 0);
  return slotStart;
}

function getRevealAt(date, slot) {
  return new Date(getSlotStartDate(date, slot).getTime() - 24 * 60 * 60 * 1000);
}

function canRevealAddress(booking, now = new Date()) {
  if (!booking?.date) return false;
  if (!["confirmed", "in_progress"].includes(booking.status)) return false;
  return now >= getRevealAt(booking.date, booking.slot);
}

function tryRevealAddress(addressEncrypted) {
  if (!addressEncrypted) return null;

  try {
    return decryptAddress(addressEncrypted);
  } catch {
    return addressEncrypted;
  }
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

async function serializeBooking(bookingId, booking, now = new Date()) {
  const addressVisible = canRevealAddress(booking, now);
  let maintenanceReportExists = false;

  if (booking.status === "completed") {
    const maintenanceReportSnapshot = await get(
      ref(db, `maintenanceReports/${bookingId}`),
    );
    maintenanceReportExists = maintenanceReportSnapshot.exists();
  }

  return {
    bookingId,
    clientId: booking.clientId,
    date: booking.date,
    slot: booking.slot,
    status: booking.status,
    price: booking.price,
    addressCity: booking.addressCity,
    address: addressVisible ? tryRevealAddress(booking.addressEncrypted) : null,
    addressVisible,
    revealAt: getRevealAt(booking.date, booking.slot).toISOString(),
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt || null,
    inProgressAt: booking.inProgressAt || null,
    completedAt: booking.completedAt || null,
    maintenanceReportExists,
  };
}

export async function GET(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const pro = await findProByUserId(user.uid);
    if (!pro) return errorResponse("Profil pro non trouvé", 404);

    const indexSnapshot = await get(
      ref(db, `indexes/bookings_by_pro/${pro.proId}`),
    );
    if (!indexSnapshot.exists()) {
      return successResponse({ items: [], total: 0, proId: pro.proId });
    }

    const bookingIds = Object.keys(indexSnapshot.val());
    const bookings = [];
    const revealUpdates = [];
    const now = new Date();

    for (const bookingId of bookingIds) {
      const snapshot = await get(ref(db, `bookings/${bookingId}`));
      if (!snapshot.exists()) continue;

      const booking = snapshot.val();
      const addressVisible = canRevealAddress(booking, now);

      if (addressVisible && !booking.addressRevealedAt) {
        revealUpdates.push(
          update(ref(db, `bookings/${bookingId}`), {
            addressRevealedAt: now.toISOString(),
          }),
        );
      }

      bookings.push(await serializeBooking(bookingId, booking, now));
    }

    if (revealUpdates.length > 0) {
      await Promise.all(revealUpdates);
    }

    bookings.sort((a, b) => {
      const dateDiff = new Date(a.date) - new Date(b.date);
      if (dateDiff !== 0) return dateDiff;
      return (SLOT_START_HOURS[a.slot] ?? 0) - (SLOT_START_HOURS[b.slot] ?? 0);
    });

    return successResponse({
      items: bookings,
      total: bookings.length,
      proId: pro.proId,
    });
  } catch (error) {
    console.error("[API] bookings/pro:", error);
    return errorResponse(
      "Erreur lors de la récupération des réservations",
      500,
    );
  }
}

export async function PATCH(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const body = await request.json();
    const { bookingId, status } = body || {};

    if (!bookingId || !status) {
      return errorResponse("bookingId et status sont requis", 400);
    }

    const pro = await findProByUserId(user.uid);
    if (!pro) return errorResponse("Profil pro non trouvé", 404);

    const bookingSnapshot = await get(ref(db, `bookings/${bookingId}`));
    if (!bookingSnapshot.exists()) {
      return errorResponse("Réservation non trouvée", 404);
    }

    const booking = bookingSnapshot.val();
    if (booking.proId !== pro.proId) {
      return errorResponse("Accès refusé pour cette réservation", 403);
    }

    const allowedNextStatus = BOOKING_STATUS_TRANSITIONS[booking.status];
    if (!allowedNextStatus || allowedNextStatus !== status) {
      return errorResponse(
        `Transition invalide depuis ${booking.status || "inconnu"}`,
        409,
      );
    }

    const now = new Date();
    const nowIso = now.toISOString();
    const updates = {
      status,
      updatedAt: nowIso,
    };

    if (status === "in_progress") {
      updates.inProgressAt = nowIso;
    }

    if (status === "completed") {
      updates.completedAt = nowIso;
    }

    await update(ref(db, `bookings/${bookingId}`), updates);

    const updatedBooking = await serializeBooking(
      bookingId,
      { ...booking, ...updates },
      now,
    );

    return successResponse(updatedBooking);
  } catch (error) {
    console.error("[API] bookings/pro PATCH:", error);
    return errorResponse(
      "Erreur lors de la mise à jour de la réservation",
      500,
    );
  }
}

export { canRevealAddress, getRevealAt, getSlotStartDate };
