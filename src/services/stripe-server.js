import Stripe from "stripe";

let stripeInstance = null;

export function getStripe() {
  if (stripeInstance) return stripeInstance;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error("[Stripe] STRIPE_SECRET_KEY non définie");
    return null;
  }

  stripeInstance = new Stripe(key);
  return stripeInstance;
}

export const PRICE_CENTS = 15000; // 150 CHF
export const COMMISSION_CENTS = 2500; // 25 CHF (17%)
export const PRO_NET_CENTS = 12500; // 125 CHF
export const CURRENCY = "chf";
