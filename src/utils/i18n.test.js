import { describe, it, expect, beforeEach } from "vitest";
import {
  getTranslation,
  setLocale,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
} from "./i18n";

describe("getTranslation", () => {
  it("retourne la traduction FR par défaut", () => {
    expect(getTranslation("fr", "common.search")).toBe("Rechercher");
  });

  it("retourne la traduction EN", () => {
    expect(getTranslation("en", "common.search")).toBe("Search");
  });

  it("retourne la clé si traduction manquante", () => {
    expect(getTranslation("fr", "inexistant.key")).toBe("inexistant.key");
  });

  it("fallback sur FR si locale non supportée", () => {
    expect(getTranslation("de", "common.search")).toBe("Rechercher");
  });

  it("gère les clés imbriquées", () => {
    expect(getTranslation("fr", "landing.title")).toBe(
      "On accorde votre piano",
    );
  });

  it("retourne le titre EN de la landing", () => {
    expect(getTranslation("en", "landing.title")).toBe("We tune your piano");
  });

  it("retourne les traductions booking", () => {
    expect(getTranslation("fr", "booking.morning")).toBe("Matin (9h-12h)");
    expect(getTranslation("en", "booking.morning")).toBe("Morning (9am-12pm)");
  });
});

describe("setLocale", () => {
  beforeEach(() => {
    globalThis.localStorage = {
      store: {},
      getItem(key) {
        return this.store[key] || null;
      },
      setItem(key, value) {
        this.store[key] = value;
      },
    };
  });

  it("accepte 'fr'", () => {
    expect(setLocale("fr")).toBe(true);
  });

  it("accepte 'en'", () => {
    expect(setLocale("en")).toBe(true);
  });

  it("refuse une locale non supportée", () => {
    expect(setLocale("de")).toBe(false);
  });

  it("refuse une locale vide", () => {
    expect(setLocale("")).toBe(false);
  });
});

describe("constantes", () => {
  it("locales supportées = fr, en", () => {
    expect(SUPPORTED_LOCALES).toEqual(["fr", "en"]);
  });

  it("locale par défaut = fr", () => {
    expect(DEFAULT_LOCALE).toBe("fr");
  });
});
