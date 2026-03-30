import { verifyAuth } from "@/services/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { ref, get, push, set, update, remove } from "firebase/database";
import { db } from "@/services/firebase";

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
    const {
      startDate,
      endDate,
      zone,
      radiusKm,
      capacityMorning,
      capacityAfternoon,
    } = body;

    if (!startDate || !endDate || !zone) {
      return errorResponse("startDate, endDate et zone sont requis", 400);
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return errorResponse(
        "La date de fin doit être après la date de début",
        400,
      );
    }

    const now = new Date();
    if (new Date(startDate) < now) {
      return errorResponse("La date de début doit être dans le futur", 400);
    }

    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    if (new Date(endDate) > sixMonthsFromNow) {
      return errorResponse("Les disponibilités sont limitées à 6 mois", 400);
    }

    const availRef = push(ref(db, `availabilities/${pro.proId}`));
    const availData = {
      startDate,
      endDate,
      zone,
      zoneCoords: body.zoneCoords || null,
      radiusKm: radiusKm || 50,
      capacityMorning: capacityMorning || 1,
      capacityAfternoon: capacityAfternoon || 2,
      createdAt: new Date().toISOString(),
    };

    await set(availRef, availData);

    return successResponse({ id: availRef.key, ...availData }, 201);
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
    if (!snapshot.exists())
      return errorResponse("Disponibilité non trouvée", 404);

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

    filtered.updatedAt = new Date().toISOString();
    await update(availRef, filtered);

    return successResponse(filtered);
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

    await remove(ref(db, `availabilities/${pro.proId}/${availabilityId}`));

    return successResponse({ deleted: availabilityId });
  } catch (error) {
    console.error("[API] availabilities DELETE:", error);
    return errorResponse("Erreur lors de la suppression", 500);
  }
}
