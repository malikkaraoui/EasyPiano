import { describe, expect, it } from "vitest";
import {
  composeStoredPhoneNumber,
  formatNationalPhoneNumber,
  isValidPhoneNumber,
  parseStoredPhoneNumber,
} from "./phone";

describe("phone helpers", () => {
  it("parse un numéro suisse stocké en séparant indicatif et numéro", () => {
    expect(parseStoredPhoneNumber("+41791234567")).toEqual({
      dialCode: "+41",
      nationalNumber: "79 123 45 67",
    });
  });

  it("compose un numéro stocké à partir des deux champs", () => {
    expect(
      composeStoredPhoneNumber({
        dialCode: "+48",
        nationalNumber: "601 234 567",
      }),
    ).toBe("+48601234567");
  });

  it("retire le zéro local et reformate le corps du numéro", () => {
    expect(formatNationalPhoneNumber("0791234567")).toBe("79 123 45 67");
  });

  it("valide les numéros internationaux cohérents", () => {
    expect(isValidPhoneNumber("+41791234567")).toBe(true);
    expect(isValidPhoneNumber("+48 601 234 567")).toBe(true);
    expect(isValidPhoneNumber("079 123 45 67")).toBe(true);
  });

  it("rejette les numéros incomplets", () => {
    expect(isValidPhoneNumber("+41 12")).toBe(false);
    expect(isValidPhoneNumber("abc")).toBe(false);
  });
});
