import { verifyAuth } from "@/services/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { ref, get, update } from "firebase/database";
import { db } from "@/services/firebase";

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const body = await request.json();
    const { bookingId, response } = body;

    if (!bookingId || !response) {
      return errorResponse("bookingId et response sont requis", 400);
    }

    // Vérifier que l'avis existe
    const reviewRef = ref(db, `reviews/${bookingId}`);
    const reviewSnapshot = await get(reviewRef);
    if (!reviewSnapshot.exists()) {
      return errorResponse("Avis non trouvé", 404);
    }

    const review = reviewSnapshot.val();

    // Vérifier que le pro est bien celui de l'avis
    // On cherche le pro lié à l'utilisateur
    const prosSnapshot = await get(ref(db, "pros"));
    if (!prosSnapshot.exists()) {
      return errorResponse("Profil pro non trouvé", 404);
    }

    const pros = prosSnapshot.val();
    let isOwner = false;
    for (const [, proData] of Object.entries(pros)) {
      if (proData.userId === user.uid) {
        isOwner =
          review.proId ===
          Object.keys(pros).find((k) => pros[k].userId === user.uid);
        break;
      }
    }

    if (!isOwner) {
      return errorResponse(
        "Vous ne pouvez répondre qu'à vos propres avis",
        403,
      );
    }

    if (review.proResponse) {
      return errorResponse("Une réponse existe déjà pour cet avis", 400);
    }

    await update(reviewRef, {
      proResponse: response,
      respondedAt: new Date().toISOString(),
    });

    return successResponse({ bookingId, proResponse: response });
  } catch (error) {
    console.error("[API] reviews/respond:", error);
    return errorResponse("Erreur lors de la réponse", 500);
  }
}
