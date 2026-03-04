import {
  isFirebaseConfigured,
  missingFirebaseEnvKeys,
} from "@services/firebase";

const isStripeConfigured = Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function ConfigBanner() {
  if (isFirebaseConfigured && isStripeConfigured) return null;

  return (
    <div className="config-banner" role="alert">
      <strong>Configuration incomplète :</strong>{" "}
      {!isFirebaseConfigured && (
        <span>
          Firebase non configuré ({missingFirebaseEnvKeys.join(", ")}).
        </span>
      )}
      {!isFirebaseConfigured && !isStripeConfigured && <span> </span>}
      {!isStripeConfigured && (
        <span>Stripe non configuré (VITE_STRIPE_PUBLISHABLE_KEY).</span>
      )}
      <span> Complète ton fichier `.env` puis redémarre le serveur.</span>
    </div>
  );
}
