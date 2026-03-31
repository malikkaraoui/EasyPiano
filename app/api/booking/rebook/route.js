import { verifyAuth } from "@/services/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { ref, get } from "firebase/database";
import { db } from "@/services/firebase";

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) return errorResponse("bookingId requis", 400);

    const bookingSnapshot = await get(ref(db, `bookings/${bookingId}`));
    if (!bookingSnapshot.exists()) {
      return errorResponse("Réservation non trouvée", 404);
    }

    const booking = bookingSnapshot.val();
    if (booking.clientId !== user.uid) {
      return errorResponse("Accès refusé", 403);
    }

    if (booking.status !== "completed") {
      return errorResponse(
        "Seules les réservations terminées peuvent être re-réservées",
        400,
      );
    }

    return successResponse({
      prefill: {
        proId: booking.proId,
        addressCity: booking.addressCity,
        slot: booking.slot,
      },
      redirectUrl: `/booking/${booking.proId}?rebook=true&slot=${booking.slot}&city=${encodeURIComponent(booking.addressCity)}`,
    });
  } catch (error) {
    console.error("[API] booking/rebook:", error);
    return errorResponse("Erreur lors du re-booking", 500);
  }
}
