import { verifyAuth } from "@/services/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { ref, get, update } from "firebase/database";
import { db } from "@/services/firebase";

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const body = await request.json();
    const { proId } = body;

    if (!proId) return errorResponse("proId requis", 400);

    const proSnapshot = await get(ref(db, `pros/${proId}`));
    if (!proSnapshot.exists()) return errorResponse("Pro non trouvé", 404);

    const proData = proSnapshot.val();
    if (proData.userId !== user.uid) {
      return errorResponse("Accès refusé", 403);
    }

    if (proData.status !== "validated") {
      return errorResponse(
        "Le profil doit être validé avant de configurer Stripe",
        400,
      );
    }

    if (proData.stripeOnboardingComplete) {
      return errorResponse("Stripe Connect déjà configuré", 400);
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error("[Stripe] STRIPE_SECRET_KEY non définie");
      return errorResponse("Configuration Stripe indisponible", 500);
    }

    // Stripe Connect Express account creation
    // En production : appel Stripe API pour créer le compte + lien onboarding
    // Pour le MVP, on retourne un placeholder qui sera connecté à Stripe
    const accountId = `acct_placeholder_${proId}`;
    const onboardingUrl = `https://connect.stripe.com/setup/e/${accountId}`;

    await update(ref(db, `pros/${proId}`), {
      stripeAccountId: accountId,
    });

    return successResponse({ onboardingUrl, accountId });
  } catch (error) {
    console.error("[Stripe] onboarding:", error);
    return errorResponse("Erreur lors de la configuration Stripe", 500);
  }
}
