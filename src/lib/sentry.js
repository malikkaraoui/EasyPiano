import * as Sentry from "@sentry/nextjs";

let initialized = false;

/**
 * Initialise Sentry si SENTRY_DSN est défini.
 * Ne crash pas si absent (mode dev sans Sentry).
 */
export function initSentry() {
  if (initialized) return;

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    debug: false,
  });

  initialized = true;
}

/**
 * Capture une erreur API avec contexte.
 * @param {Error} error
 * @param {{ route?: string, method?: string, userId?: string }} context
 */
export function captureApiError(error, context = {}) {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    console.error(`[API] ${context.route || "unknown"}:`, error.message);
    return;
  }

  Sentry.withScope((scope) => {
    if (context.route) scope.setTag("api.route", context.route);
    if (context.method) scope.setTag("api.method", context.method);
    if (context.userId) scope.setUser({ id: context.userId });
    Sentry.captureException(error);
  });
}

export function isSentryInitialized() {
  return initialized;
}
