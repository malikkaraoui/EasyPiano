import { successResponse, errorResponse } from "@/lib/api-response";
import { ref, get, update } from "firebase/database";
import { db } from "@/services/firebase";

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return errorResponse("type et data requis", 400);
    }

    switch (type) {
      case "payment_intent.succeeded": {
        const { bookingId, paymentIntentId } = data;
        if (!bookingId) break;

        const bookingRef = ref(db, `bookings/${bookingId}`);
        const snapshot = await get(bookingRef);
        if (snapshot.exists()) {
          await update(bookingRef, {
            stripePaymentIntentId: paymentIntentId || null,
            status: "confirmed",
          });
        }
        break;
      }

      case "charge.refunded": {
        const { bookingId } = data;
        if (!bookingId) break;

        const bookingRef = ref(db, `bookings/${bookingId}`);
        const snapshot = await get(bookingRef);
        if (snapshot.exists()) {
          await update(bookingRef, { status: "refunded" });
        }
        break;
      }

      case "account.updated": {
        const { proId, stripeAccountId } = data;
        if (!proId) break;

        await update(ref(db, `pros/${proId}`), {
          stripeAccountId,
          stripeOnboardingComplete: true,
        });
        break;
      }

      default:
        console.error(`[Stripe] Webhook type non géré: ${type}`);
    }

    return successResponse({ received: true });
  } catch (error) {
    console.error("[Stripe] Webhook error:", error);
    return errorResponse("Erreur webhook", 500);
  }
}
