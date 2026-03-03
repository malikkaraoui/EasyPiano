import { describe, it, expect } from "vitest";
import { formatPrice, formatRating, truncate } from "../utils/format";
import {
  validateEmail,
  validatePhone,
  validatePostalCode,
  validateRating,
  validatePrice,
} from "../utils/validation";
import { calculateCommission } from "../services/stripe";

describe("formatPrice", () => {
  it("formats price in EUR", () => {
    const result = formatPrice(100);
    expect(result).toContain("100");
    expect(result).toContain("€");
  });

  it("handles zero", () => {
    const result = formatPrice(0);
    expect(result).toContain("0");
  });
});

describe("formatRating", () => {
  it("formats rating to one decimal", () => {
    expect(formatRating(4.567)).toBe("4.6");
    expect(formatRating(3)).toBe("3.0");
  });
});

describe("truncate", () => {
  it("truncates long strings", () => {
    const long = "a".repeat(200);
    expect(truncate(long, 100)).toHaveLength(103);
    expect(truncate(long, 100)).toContain("...");
  });

  it("keeps short strings unchanged", () => {
    expect(truncate("hello", 100)).toBe("hello");
  });
});

describe("validateEmail", () => {
  it("accepts valid emails", () => {
    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("a.b@c.fr")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(validateEmail("invalid")).toBe(false);
    expect(validateEmail("@test.com")).toBe(false);
    expect(validateEmail("test@")).toBe(false);
  });
});

describe("validatePhone", () => {
  it("accepts valid French phones", () => {
    expect(validatePhone("0612345678")).toBe(true);
    expect(validatePhone("+33612345678")).toBe(true);
    expect(validatePhone("06 12 34 56 78")).toBe(true);
  });

  it("rejects invalid phones", () => {
    expect(validatePhone("123")).toBe(false);
    expect(validatePhone("abcdefghij")).toBe(false);
  });
});

describe("validatePostalCode", () => {
  it("accepts valid postal codes", () => {
    expect(validatePostalCode("75001")).toBe(true);
    expect(validatePostalCode("69002")).toBe(true);
  });

  it("rejects invalid postal codes", () => {
    expect(validatePostalCode("7500")).toBe(false);
    expect(validatePostalCode("750011")).toBe(false);
    expect(validatePostalCode("abcde")).toBe(false);
  });
});

describe("validateRating", () => {
  it("accepts valid ratings (1-5)", () => {
    expect(validateRating(1)).toBe(true);
    expect(validateRating(5)).toBe(true);
    expect(validateRating(3)).toBe(true);
  });

  it("rejects invalid ratings", () => {
    expect(validateRating(0)).toBe(false);
    expect(validateRating(6)).toBe(false);
    expect(validateRating(3.5)).toBe(false);
  });
});

describe("validatePrice", () => {
  it("accepts positive numbers", () => {
    expect(validatePrice(100)).toBe(true);
    expect(validatePrice(0.5)).toBe(true);
  });

  it("rejects invalid prices", () => {
    expect(validatePrice(0)).toBe(false);
    expect(validatePrice(-10)).toBe(false);
    expect(validatePrice("100")).toBe(false);
  });
});

describe("calculateCommission", () => {
  it("calculates 10% commission", () => {
    const result = calculateCommission(100);
    expect(result.total).toBe(100);
    expect(result.commission).toBe(10);
    expect(result.netAmount).toBe(90);
    expect(result.commissionRate).toBe(10);
  });

  it("handles decimal amounts", () => {
    const result = calculateCommission(75.5);
    expect(result.commission).toBe(7.55);
    expect(result.netAmount).toBe(67.95);
  });

  it("rounds commission to 2 decimals", () => {
    const result = calculateCommission(33.33);
    expect(result.commission).toBe(3.33);
  });
});
