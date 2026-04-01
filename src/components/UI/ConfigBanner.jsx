"use client";

import { isFirebaseConfigured } from "@services/firebase";

const isStripeConfigured = Boolean(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export default function ConfigBanner() {
  if (isFirebaseConfigured && isStripeConfigured) return null;

  return (
    <div
      className="border-b border-yellow-600/30 bg-yellow-900/20 px-4 py-2 text-center text-xs text-yellow-200"
      role="alert"
    >
      <strong>Configuration incomplète :</strong>{" "}
      {!isFirebaseConfigured && <span>Firebase non configuré.</span>}
      {!isFirebaseConfigured && !isStripeConfigured && <span> </span>}
      {!isStripeConfigured && (
        <span>Stripe non configuré (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).</span>
      )}
      <span> Complète ton fichier `.env` puis redémarre le serveur.</span>
    </div>
  );
}
