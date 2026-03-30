/**
 * Utilitaire parrainage EasyPiano.
 * Crédit 20 CHF réciproque (parrain + filleul) — FR53c.
 */

import { randomBytes } from "crypto";

const REFERRAL_CREDIT_CENTS = 2000; // 20 CHF

export function generateReferralCode(userId) {
  const random = randomBytes(4).toString("hex");
  return `EP-${userId.slice(0, 4).toUpperCase()}-${random}`;
}

export function calculateReferralCredit() {
  return {
    referrerCredit: REFERRAL_CREDIT_CENTS,
    refereeCredit: REFERRAL_CREDIT_CENTS,
    description: "20 CHF de crédit pour le parrain et le filleul",
  };
}

export { REFERRAL_CREDIT_CENTS };
