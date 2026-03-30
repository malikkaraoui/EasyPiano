import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { encryptAddress, decryptAddress } from "./encryption";
import { randomBytes } from "crypto";

describe("encryption (AES-256-GCM)", () => {
  let originalKey;

  beforeAll(() => {
    originalKey = process.env.ENCRYPTION_KEY;
    process.env.ENCRYPTION_KEY = randomBytes(32).toString("hex");
  });

  afterAll(() => {
    if (originalKey) {
      process.env.ENCRYPTION_KEY = originalKey;
    } else {
      delete process.env.ENCRYPTION_KEY;
    }
  });

  it("chiffre et déchiffre une adresse correctement", () => {
    const address = "Rue de la Gare 15, 1003 Lausanne";
    const encrypted = encryptAddress(address);
    const decrypted = decryptAddress(encrypted);
    expect(decrypted).toBe(address);
  });

  it("produit un résultat différent du texte original", () => {
    const address = "Avenue de Rumine 42, 1005 Lausanne";
    const encrypted = encryptAddress(address);
    expect(encrypted).not.toBe(address);
  });

  it("produit un résultat différent à chaque appel (IV aléatoire)", () => {
    const address = "Même adresse pour les deux";
    const encrypted1 = encryptAddress(address);
    const encrypted2 = encryptAddress(address);
    expect(encrypted1).not.toBe(encrypted2);
  });

  it("retourne une string base64 valide", () => {
    const encrypted = encryptAddress("Test");
    const base64Regex = /^[A-Za-z0-9+/]+=*$/;
    expect(base64Regex.test(encrypted)).toBe(true);
  });

  it("gère les caractères spéciaux et accents", () => {
    const address = "Straße 12, München — Café de l'Été";
    const encrypted = encryptAddress(address);
    const decrypted = decryptAddress(encrypted);
    expect(decrypted).toBe(address);
  });

  it("gère les adresses longues", () => {
    const address =
      "Très longue adresse " + "avec beaucoup de texte ".repeat(50);
    const encrypted = encryptAddress(address);
    const decrypted = decryptAddress(encrypted);
    expect(decrypted).toBe(address);
  });

  it("lance une erreur si la clé est manquante", () => {
    const saved = process.env.ENCRYPTION_KEY;
    delete process.env.ENCRYPTION_KEY;

    expect(() => encryptAddress("test")).toThrow("ENCRYPTION_KEY");

    process.env.ENCRYPTION_KEY = saved;
  });

  it("lance une erreur si les données chiffrées sont corrompues", () => {
    expect(() => decryptAddress("données-invalides!!!")).toThrow();
  });
});
