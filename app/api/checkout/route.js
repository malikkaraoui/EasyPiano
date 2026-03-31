import { verifyAuth } from "@/services/auth-server";
import { errorResponse, successResponse } from "@/lib/api-response";
import {
  getStripe,
  PRICE_CENTS,
  COMMISSION_CENTS,
  CURRENCY,
} from "@/services/stripe-server";
import { ref, get } from "firebase/database";
import { db } from "@/services/firebase";

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const body = await request.json();
    const { proId, date, slot, pianoCondition } = body;

    if (!proId || !date || !slot) {
      return errorResponse("proId, date et slot requis", 400);
    }

    // Vérifier le pro
    const proSnapshot = await get(ref(db, `pros/${proId}`));
    if (!proSnapshot.exists())
      return errorResponse("Accordeur non trouvé", 404);

    const pro = proSnapshot.val();
    if (pro.status !== "validated") {
      return errorResponse("Cet accordeur n'est pas disponible", 400);
    }

    const stripe = getStripe();
    if (!stripe) return errorResponse("Paiement indisponible", 500);

    // Calcul supplément piano
    const supplements = {
      good: 0,
      "2-5years": 3000,
      "5-10years": 5000,
      "10+years": 8000,
    };
    const supplement = supplements[pianoCondition] || 0;
    const totalCents = PRICE_CENTS + supplement;
    const commissionCents = Math.round(totalCents * 0.17);

    const slotLabel =
      slot === "morning" ? "Matin (9h-12h)" : "Après-midi (14h-17h)";
    const origin = request.headers.get("origin") || "https://easypiano.ch";

    // Paramètres Checkout Session
    const sessionParams = {
      mode: "payment",
      currency: CURRENCY,
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            unit_amount: totalCents,
            product_data: {
              name: "Accordage de piano",
              description: `${date} — ${slotLabel}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        proId,
        clientId: user.uid,
        date,
        slot,
        pianoCondition: pianoCondition || "good",
        totalCents: String(totalCents),
        commissionCents: String(commissionCents),
      },
      success_url: `${origin}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking/${proId}`,
    };

    // Si le pro a un compte Stripe Connect, split payment
    if (pro.stripeAccountId && pro.stripeOnboardingComplete) {
      sessionParams.payment_intent_data = {
        application_fee_amount: commissionCents,
        transfer_data: {
          destination: pro.stripeAccountId,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return successResponse({
      sessionId: session.id,
      url: session.url,
      totalCents,
      commissionCents,
    });
  } catch (error) {
    console.error("[Stripe] Checkout session:", error.message);
    return errorResponse("Erreur lors de la création du paiement", 500);
  }
}
