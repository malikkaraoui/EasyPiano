import { describe, it, expect } from "vitest";
import {
  calculatePrice,
  formatPriceCHF,
  BASE_PRICE_CENTS,
  COMMISSION_RATE,
} from "./pricing";

describe("calculatePrice", () => {
  it("retourne le prix de base sans supplément (bon état)", () => {
    const result = calculatePrice("good");
    expect(result.basePrice).toBe(15000);
    expect(result.supplement).toBe(0);
    expect(result.total).toBe(15000);
  });

  it("applique le supplément 2-5 ans (+30 CHF)", () => {
    const result = calculatePrice("2-5years");
    expect(result.supplement).toBe(3000);
    expect(result.total).toBe(18000);
  });

  it("applique le supplément 5-10 ans (+50 CHF)", () => {
    const result = calculatePrice("5-10years");
    expect(result.supplement).toBe(5000);
    expect(result.total).toBe(20000);
  });

  it("applique le supplément 10+ ans (+80 CHF)", () => {
    const result = calculatePrice("10+years");
    expect(result.supplement).toBe(8000);
    expect(result.total).toBe(23000);
  });

  it("calcule la commission à 17%", () => {
    const result = calculatePrice("good");
    expect(result.commission).toBe(Math.round(15000 * 0.17));
    expect(result.proNet).toBe(15000 - result.commission);
  });

  it("calcule correctement le net pro avec supplément", () => {
    const result = calculatePrice("2-5years");
    expect(result.total).toBe(result.proNet + result.commission);
  });

  it("utilise 'good' par défaut si pas d'argument", () => {
    const result = calculatePrice();
    expect(result.supplement).toBe(0);
    expect(result.total).toBe(15000);
  });

  it("retourne 0 de supplément pour une condition inconnue", () => {
    const result = calculatePrice("unknown");
    expect(result.supplement).toBe(0);
  });

  it("tous les montants sont en centimes entiers", () => {
    for (const condition of ["good", "2-5years", "5-10years", "10+years"]) {
      const result = calculatePrice(condition);
      expect(Number.isInteger(result.total)).toBe(true);
      expect(Number.isInteger(result.commission)).toBe(true);
      expect(Number.isInteger(result.proNet)).toBe(true);
    }
  });
});

describe("formatPriceCHF", () => {
  it("formate 15000 centimes en '150 CHF'", () => {
    expect(formatPriceCHF(15000)).toBe("150 CHF");
  });

  it("formate 18000 centimes en '180 CHF'", () => {
    expect(formatPriceCHF(18000)).toBe("180 CHF");
  });

  it("formate 0 en '0 CHF'", () => {
    expect(formatPriceCHF(0)).toBe("0 CHF");
  });
});

describe("constantes", () => {
  it("prix de base = 15000 centimes (150 CHF)", () => {
    expect(BASE_PRICE_CENTS).toBe(15000);
  });

  it("taux de commission = 17%", () => {
    expect(COMMISSION_RATE).toBe(0.17);
  });
});
