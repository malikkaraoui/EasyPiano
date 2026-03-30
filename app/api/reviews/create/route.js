import { verifyAuth } from "@/services/auth-server";
import { errorResponse, createdResponse } from "@/lib/api-response";
import { ref, get, set, update } from "firebase/database";
import { db } from "@/services/firebase";

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const body = await request.json();
    const { bookingId, rating, comment } = body;

    if (!bookingId || !rating) {
      return errorResponse("bookingId et rating sont requis", 400);
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return errorResponse("La note doit être entre 1 et 5", 400);
    }

    // Vérifier que le booking existe et appartient au client
    const bookingSnapshot = await get(ref(db, `bookings/${bookingId}`));
    if (!bookingSnapshot.exists()) {
      return errorResponse("Réservation non trouvée", 404);
    }

    const booking = bookingSnapshot.val();
    if (booking.clientId !== user.uid) {
      return errorResponse(
        "Vous ne pouvez noter que vos propres réservations",
        403,
      );
    }

    if (booking.status !== "completed") {
      return errorResponse(
        "Seules les réservations terminées peuvent être notées",
        400,
      );
    }

    // Vérifier qu'aucun avis n'existe déjà
    const existingReview = await get(ref(db, `reviews/${bookingId}`));
    if (existingReview.exists()) {
      return errorResponse("Un avis existe déjà pour cette réservation", 400);
    }

    const reviewData = {
      clientId: user.uid,
      proId: booking.proId,
      rating,
      comment: comment || "",
      proResponse: null,
      createdAt: new Date().toISOString(),
    };

    await set(ref(db, `reviews/${bookingId}`), reviewData);

    // Mettre à jour les stats du pro
    const proStatsRef = ref(db, `pros/${booking.proId}/stats`);
    const statsSnapshot = await get(proStatsRef);
    const stats = statsSnapshot.exists()
      ? statsSnapshot.val()
      : { totalReviews: 0, averageRating: 0 };

    const newTotal = stats.totalReviews + 1;
    const newAverage =
      (stats.averageRating * stats.totalReviews + rating) / newTotal;

    await update(proStatsRef, {
      totalReviews: newTotal,
      averageRating: Math.round(newAverage * 10) / 10,
    });

    return createdResponse({
      bookingId,
      rating,
      averageRating: Math.round(newAverage * 10) / 10,
    });
  } catch (error) {
    console.error("[API] reviews/create:", error);
    return errorResponse("Erreur lors de la création de l'avis", 500);
  }
}
