/**
 * Calcul des prix EasyPiano.
 * Tous les montants sont en centimes (15000 = 150 CHF).
 */

const BASE_PRICE_CENTS = 15000; // 150 CHF
const COMMISSION_RATE = 0.17; // 17%

const PIANO_CONDITION_SUPPLEMENT = {
  good: 0, // Bon état, accordé récemment
  "2-5years": 3000, // 2-5 ans sans accordage → +30 CHF
  "5-10years": 5000, // 5-10 ans → +50 CHF
  "10+years": 8000, // 10+ ans → +80 CHF
};

export function calculatePrice(pianoCondition = "good") {
  const supplement = PIANO_CONDITION_SUPPLEMENT[pianoCondition] || 0;
  const total = BASE_PRICE_CENTS + supplement;
  const commission = Math.round(total * COMMISSION_RATE);
  const proNet = total - commission;

  return {
    basePrice: BASE_PRICE_CENTS,
    supplement,
    total,
    commission,
    proNet,
  };
}

export function formatPriceCHF(cents) {
  return `${(cents / 100).toFixed(0)} CHF`;
}

export { BASE_PRICE_CENTS, COMMISSION_RATE, PIANO_CONDITION_SUPPLEMENT };
