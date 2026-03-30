import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/services/auth-server", () => ({ verifyAuth: vi.fn() }));
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
}));
vi.mock("@/services/firebase", () => ({ db: {} }));

import { verifyAuth } from "@/services/auth-server";
import { get, update } from "firebase/database";

function makeRequest(body) {
  return {
    headers: { get: () => "Bearer token" },
    json: () => Promise.resolve(body),
  };
}

describe("POST /api/stripe/onboarding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = "sk_test_123";
  });

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await POST(makeRequest({ proId: "p1" }));
    expect(res.status).toBe(401);
  });

  it("retourne 400 si proId manquant", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("retourne 403 si le pro n'appartient pas à l'utilisateur", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValue({
      exists: () => true,
      val: () => ({ userId: "other-user", status: "validated" }),
    });

    const res = await POST(makeRequest({ proId: "p1" }));
    expect(res.status).toBe(403);
  });

  it("retourne 400 si pro pas encore validé", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValue({
      exists: () => true,
      val: () => ({ userId: "u1", status: "pending" }),
    });

    const res = await POST(makeRequest({ proId: "p1" }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toContain("validé");
  });

  it("retourne 400 si Stripe déjà configuré", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValue({
      exists: () => true,
      val: () => ({
        userId: "u1",
        status: "validated",
        stripeOnboardingComplete: true,
      }),
    });

    const res = await POST(makeRequest({ proId: "p1" }));
    expect(res.status).toBe(400);
  });

  it("retourne un lien onboarding pour un pro validé", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValue({
      exists: () => true,
      val: () => ({
        userId: "u1",
        status: "validated",
        stripeOnboardingComplete: false,
      }),
    });
    update.mockResolvedValue();

    const res = await POST(makeRequest({ proId: "p1" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.onboardingUrl).toBeDefined();
    expect(body.data.accountId).toBeDefined();
  });

  it("met à jour stripeAccountId dans Firebase", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValue({
      exists: () => true,
      val: () => ({
        userId: "u1",
        status: "validated",
        stripeOnboardingComplete: false,
      }),
    });
    update.mockResolvedValue();

    await POST(makeRequest({ proId: "p1" }));

    const updateArgs = update.mock.calls[0][1];
    expect(updateArgs.stripeAccountId).toBeDefined();
    expect(typeof updateArgs.stripeAccountId).toBe("string");
  });
});
