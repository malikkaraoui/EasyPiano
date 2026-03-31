import { successResponse, errorResponse } from "@/lib/api-response";
import { ref, get, update, push, set } from "firebase/database";
import { db } from "@/services/firebase";

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return errorResponse("type et data requis", 400);
    }

    switch (type) {
      case "checkout.session.completed": {
        const { object: session } = data;
        if (!session?.metadata) break;

        const { proId, clientId, date, slot, totalCents, commissionCents } =
          session.metadata;

        // Créer le booking dans Firebase
        const bookingRef = push(ref(db, "bookings"));
        const bookingData = {
          clientId,
          proId,
          date,
          slot,
          status: "confirmed",
          addressEncrypted: null,
          addressCity: null,
          price: parseInt(totalCents, 10),
          commission: parseInt(commissionCents, 10),
          proNet: parseInt(totalCents, 10) - parseInt(commissionCents, 10),
          stripeSessionId: session.id || null,
          stripePaymentIntentId: session.payment_intent || null,
          createdAt: new Date().toISOString(),
        };

        await set(bookingRef, bookingData);

        // Mettre à jour les index
        await set(
          ref(db, `indexes/bookings_by_client/${clientId}/${bookingRef.key}`),
          true,
        );
        await set(
          ref(db, `indexes/bookings_by_pro/${proId}/${bookingRef.key}`),
          true,
        );

        // Incrémenter stats pro
        const proSnapshot = await get(ref(db, `pros/${proId}/stats`));
        const stats = proSnapshot.exists()
          ? proSnapshot.val()
          : { totalBookings: 0 };
        await update(ref(db, `pros/${proId}/stats`), {
          totalBookings: (stats.totalBookings || 0) + 1,
        });

        break;
      }

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
