import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock @sentry/nextjs avant l'import
vi.mock("@sentry/nextjs", () => ({
  init: vi.fn(),
  withScope: vi.fn((callback) =>
    callback({ setTag: vi.fn(), setUser: vi.fn() }),
  ),
  captureException: vi.fn(),
}));

import * as Sentry from "@sentry/nextjs";

describe("sentry", () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env.NEXT_PUBLIC_SENTRY_DSN;
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_SENTRY_DSN = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;
    }
  });

  describe("initSentry", () => {
    it("ne crash pas si SENTRY_DSN est absent", async () => {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;
      const { initSentry } = await import("./sentry");

      expect(() => initSentry()).not.toThrow();
      expect(Sentry.init).not.toHaveBeenCalled();
    });

    it("initialise Sentry si DSN est présent", async () => {
      process.env.NEXT_PUBLIC_SENTRY_DSN = "https://test@sentry.io/123";
      const { initSentry } = await import("./sentry");

      initSentry();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          dsn: "https://test@sentry.io/123",
        }),
      );
    });
  });

  describe("captureApiError", () => {
    it("log console.error si pas de DSN", async () => {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const { captureApiError } = await import("./sentry");

      captureApiError(new Error("test error"), { route: "/api/test" });

      expect(consoleSpy).toHaveBeenCalledWith("[API] /api/test:", "test error");
      consoleSpy.mockRestore();
    });

    it("appelle Sentry.captureException si DSN présent", async () => {
      process.env.NEXT_PUBLIC_SENTRY_DSN = "https://test@sentry.io/123";
      const { captureApiError } = await import("./sentry");

      const error = new Error("api error");
      captureApiError(error, { route: "/api/booking", method: "POST" });

      expect(Sentry.withScope).toHaveBeenCalled();
      expect(Sentry.captureException).toHaveBeenCalledWith(error);
    });
  });

  describe("isSentryInitialized", () => {
    it("retourne false avant initialisation", async () => {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;
      const { isSentryInitialized } = await import("./sentry");
      expect(isSentryInitialized()).toBe(false);
    });
  });
});
