import { loadStripe } from "@stripe/stripe-js";

let stripePromise = null;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}

export function calculateCommission(amount) {
  const commission = Math.round(amount * 0.1 * 100) / 100;
  return {
    total: amount,
    commission,
    netAmount: amount - commission,
    commissionRate: 10,
  };
}
