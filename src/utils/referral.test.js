import { describe, it, expect } from "vitest";
import {
  generateReferralCode,
  calculateReferralCredit,
  REFERRAL_CREDIT_CENTS,
} from "./referral";

describe("generateReferralCode", () => {
  it("génère un code au format EP-XXXX-XXXXXXXX", () => {
    const code = generateReferralCode("user123abc");
    expect(code).toMatch(/^EP-[A-Z0-9]{4}-[a-f0-9]{8}$/);
  });

  it("génère des codes différents à chaque appel", () => {
    const code1 = generateReferralCode("user1");
    const code2 = generateReferralCode("user1");
    expect(code1).not.toBe(code2);
  });

  it("utilise les 4 premiers caractères du userId", () => {
    const code = generateReferralCode("abcdefgh");
    expect(code.startsWith("EP-ABCD-")).toBe(true);
  });
});

describe("calculateReferralCredit", () => {
  it("retourne 2000 centimes (20 CHF) pour parrain et filleul", () => {
    const result = calculateReferralCredit();
    expect(result.referrerCredit).toBe(2000);
    expect(result.refereeCredit).toBe(2000);
  });

  it("les deux crédits sont égaux", () => {
    const result = calculateReferralCredit();
    expect(result.referrerCredit).toBe(result.refereeCredit);
  });

  it("contient une description", () => {
    const result = calculateReferralCredit();
    expect(result.description).toContain("20 CHF");
  });
});

describe("constantes", () => {
  it("crédit parrainage = 2000 centimes (20 CHF)", () => {
    expect(REFERRAL_CREDIT_CENTS).toBe(2000);
  });
});
