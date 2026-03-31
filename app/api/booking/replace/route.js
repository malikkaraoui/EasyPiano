import { verifyAuth } from "@/services/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { ref, get, update } from "firebase/database";
import { db } from "@/services/firebase";

const REPLACEMENT_CREDIT_CENTS = 2000; // 20 CHF crédit si pas de remplaçant

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);
  if (user.role !== "admin") return errorResponse("Accès refusé", 403);

  try {
    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) return errorResponse("bookingId requis", 400);

    const bookingSnapshot = await get(ref(db, `bookings/${bookingId}`));
    if (!bookingSnapshot.exists()) {
      return errorResponse("Réservation non trouvée", 404);
    }

    const booking = bookingSnapshot.val();
    if (booking.status !== "confirmed") {
      return errorResponse(
        "Seules les réservations confirmées peuvent être remplacées",
        400,
      );
    }

    // Chercher un pro remplaçant disponible dans la même zone/période
    const prosSnapshot = await get(ref(db, "pros"));
    const availSnapshot = await get(ref(db, "availabilities"));
    const pros = prosSnapshot.exists() ? prosSnapshot.val() : {};
    const allAvails = availSnapshot.exists() ? availSnapshot.val() : {};

    const bookingDate = new Date(booking.date);
    let replacementProId = null;

    for (const [proId, pro] of Object.entries(pros)) {
      if (proId === booking.proId) continue; // Exclure le pro original
      if (pro.status !== "validated") continue;

      const proAvails = allAvails[proId];
      if (!proAvails) continue;

      const hasAvailability = Object.values(proAvails).some((avail) => {
        const start = new Date(avail.startDate);
        const end = new Date(avail.endDate);
        return bookingDate >= start && bookingDate <= end;
      });

      if (hasAvailability) {
        replacementProId = proId;
        break;
      }
    }

    if (replacementProId) {
      await update(ref(db, `bookings/${bookingId}`), {
        proId: replacementProId,
        replacedFrom: booking.proId,
        replacedAt: new Date().toISOString(),
      });

      return successResponse({
        bookingId,
        replacementProId,
        status: "replaced",
      });
    }

    // Pas de remplaçant → remboursement + crédit
    await update(ref(db, `bookings/${bookingId}`), {
      status: "cancelled",
      cancellation: {
        reason: "Pro indisponible — aucun remplaçant trouvé",
        refundPercent: 100,
        creditCents: REPLACEMENT_CREDIT_CENTS,
        cancelledAt: new Date().toISOString(),
      },
    });

    return successResponse({
      bookingId,
      replacementProId: null,
      status: "refunded",
      refundPercent: 100,
      creditCents: REPLACEMENT_CREDIT_CENTS,
    });
  } catch (error) {
    console.error("[API] booking/replace:", error);
    return errorResponse("Erreur lors du remplacement", 500);
  }
}
