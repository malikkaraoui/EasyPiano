/**
 * Infrastructure i18n EasyPiano.
 * FR par défaut, EN disponible, architecture prête pour DE.
 */

const translations = {
  fr: {
    common: {
      search: "Rechercher",
      login: "Connexion",
      logout: "Déconnexion",
      save: "Enregistrer",
      cancel: "Annuler",
      loading: "Chargement...",
      error: "Une erreur est survenue",
    },
    landing: {
      title: "On accorde votre piano",
      subtitle:
        "Trouvez et réservez un accordeur qualifié en Suisse. Prix fixe, booking instantané, pros validés physiquement.",
      searchPlaceholder: "Ville ou code postal",
      howItWorks: "Comment ça marche ?",
      whyTrust: "Pourquoi nous faire confiance ?",
    },
    booking: {
      morning: "Matin (9h-12h)",
      afternoon: "Après-midi (14h-17h)",
      confirm: "Confirmer la réservation",
      price: "150 CHF",
    },
  },
  en: {
    common: {
      search: "Search",
      login: "Log in",
      logout: "Log out",
      save: "Save",
      cancel: "Cancel",
      loading: "Loading...",
      error: "An error occurred",
    },
    landing: {
      title: "We tune your piano",
      subtitle:
        "Find and book a qualified tuner in Switzerland. Fixed price, instant booking, verified professionals.",
      searchPlaceholder: "City or postal code",
      howItWorks: "How it works",
      whyTrust: "Why trust us?",
    },
    booking: {
      morning: "Morning (9am-12pm)",
      afternoon: "Afternoon (2pm-5pm)",
      confirm: "Confirm booking",
      price: "150 CHF",
    },
  },
};

const SUPPORTED_LOCALES = ["fr", "en"];
const DEFAULT_LOCALE = "fr";

export function getTranslation(locale, key) {
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const keys = key.split(".");
  let value = translations[lang];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return key; // Retourne la clé si traduction manquante
    }
  }

  return typeof value === "string" ? value : key;
}

export function getLocale() {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  return localStorage.getItem("easypiano-locale") || DEFAULT_LOCALE;
}

export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return false;
  if (typeof window !== "undefined") {
    localStorage.setItem("easypiano-locale", locale);
  }
  return true;
}

export { translations, SUPPORTED_LOCALES, DEFAULT_LOCALE };
