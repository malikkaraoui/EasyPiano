import { verifyAuth } from "@/services/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { ref, get, update } from "firebase/database";
import { db } from "@/services/firebase";

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const body = await request.json();
    const { bookingId, reason } = body;

    if (!bookingId) return errorResponse("bookingId requis", 400);

    const bookingRef = ref(db, `bookings/${bookingId}`);
    const snapshot = await get(bookingRef);
    if (!snapshot.exists())
      return errorResponse("Réservation non trouvée", 404);

    const booking = snapshot.val();
    if (booking.clientId !== user.uid) {
      return errorResponse("Accès refusé", 403);
    }

    if (booking.status !== "confirmed") {
      return errorResponse("Cette réservation ne peut pas être annulée", 400);
    }

    // Calculer le remboursement selon le délai
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);

    let refundPercent = 0;
    if (hoursUntilBooking > 48) {
      refundPercent = 100;
    } else if (hoursUntilBooking > 24) {
      refundPercent = 50;
    }
    // < 24h = 0% (crédit plateforme)

    await update(bookingRef, {
      status: "cancelled",
      cancellation: {
        reason: reason || null,
        refundPercent,
        cancelledAt: new Date().toISOString(),
      },
    });

    return successResponse({
      bookingId,
      status: "cancelled",
      refundPercent,
    });
  } catch (error) {
    console.error("[API] booking/cancel:", error);
    return errorResponse("Erreur lors de l'annulation", 500);
  }
}
