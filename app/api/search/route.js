import { successResponse, errorResponse } from "@/lib/api-response";
import { ref, get } from "firebase/database";
import { db } from "@/services/firebase";

export async function POST(request) {
  try {
    const body = await request.json();
    const { zone, date } = body;

    if (!zone || !date) {
      return errorResponse("zone et date sont requis", 400);
    }

    const searchDate = new Date(date);
    if (isNaN(searchDate.getTime())) {
      return errorResponse("Date invalide", 400);
    }

    // Récupérer tous les pros validés
    const prosSnapshot = await get(ref(db, "pros"));
    if (!prosSnapshot.exists()) {
      return successResponse({ items: [], total: 0 });
    }

    const pros = prosSnapshot.val();
    const validatedPros = Object.entries(pros)
      .filter(([, pro]) => pro.status === "validated")
      .map(([proId, pro]) => ({ proId, ...pro }));

    // Récupérer les disponibilités
    const availSnapshot = await get(ref(db, "availabilities"));
    const allAvailabilities = availSnapshot.exists() ? availSnapshot.val() : {};

    // Filtrer les pros avec des disponibilités correspondantes
    const results = [];

    for (const pro of validatedPros) {
      const proAvails = allAvailabilities[pro.proId];
      if (!proAvails) continue;

      const hasMatchingAvail = Object.values(proAvails).some((avail) => {
        const start = new Date(avail.startDate);
        const end = new Date(avail.endDate);
        return searchDate >= start && searchDate <= end;
      });

      if (hasMatchingAvail) {
        results.push({
          proId: pro.proId,
          bio: pro.bio,
          photoURL: pro.photoURL,
          country: pro.country,
          languages: pro.languages,
          stats: pro.stats,
          status: pro.status,
        });
      }
    }

    return successResponse({ items: results, total: results.length });
  } catch (error) {
    console.error("[API] search:", error);
    return errorResponse("Erreur lors de la recherche", 500);
  }
}
