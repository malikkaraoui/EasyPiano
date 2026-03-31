import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/services/auth-server", () => ({ verifyAuth: vi.fn() }));
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
}));
vi.mock("@/services/firebase", () => ({ db: {} }));
vi.mock("@/services/stripe-server", () => ({
  getStripe: vi.fn(),
  PRICE_CENTS: 15000,
  COMMISSION_CENTS: 2500,
  CURRENCY: "chf",
}));

import { verifyAuth } from "@/services/auth-server";
import { get } from "firebase/database";
import { getStripe } from "@/services/stripe-server";

function makeRequest(body) {
  return {
    headers: {
      get: (name) =>
        name === "origin" ? "http://localhost:3000" : "Bearer token",
    },
    json: () => Promise.resolve(body),
  };
}

describe("POST /api/checkout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(401);
  });

  it("retourne 400 si champs requis manquants", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    const res = await POST(makeRequest({ proId: "p1" }));
    expect(res.status).toBe(400);
  });

  it("retourne 404 si pro non trouvé", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({ exists: () => false });
    const res = await POST(
      makeRequest({ proId: "p1", date: "2026-05-01", slot: "morning" }),
    );
    expect(res.status).toBe(404);
  });

  it("retourne 500 si Stripe non configuré", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ status: "validated" }),
    });
    getStripe.mockReturnValue(null);

    const res = await POST(
      makeRequest({ proId: "p1", date: "2026-05-01", slot: "morning" }),
    );
    expect(res.status).toBe(500);
  });

  it("crée une Checkout Session avec succès", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        status: "validated",
        stripeAccountId: null,
        stripeOnboardingComplete: false,
      }),
    });

    const mockCreate = vi.fn().mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.stripe.com/pay/cs_test_123",
    });
    getStripe.mockReturnValue({
      checkout: { sessions: { create: mockCreate } },
    });

    const res = await POST(
      makeRequest({ proId: "p1", date: "2026-05-01", slot: "morning" }),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.sessionId).toBe("cs_test_123");
    expect(body.data.url).toContain("checkout.stripe.com");
    expect(body.data.totalCents).toBe(15000);
    expect(body.data.commissionCents).toBe(2550); // 17% de 15000
  });

  it("applique le supplément piano mauvais état", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ status: "validated" }),
    });

    const mockCreate = vi.fn().mockResolvedValue({
      id: "cs_test_456",
      url: "https://checkout.stripe.com/pay/cs_test_456",
    });
    getStripe.mockReturnValue({
      checkout: { sessions: { create: mockCreate } },
    });

    const res = await POST(
      makeRequest({
        proId: "p1",
        date: "2026-05-01",
        slot: "afternoon",
        pianoCondition: "5-10years",
      }),
    );
    const body = await res.json();

    expect(body.data.totalCents).toBe(20000); // 150 + 50 = 200 CHF
  });

  it("configure le split payment si pro a Stripe Connect", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        status: "validated",
        stripeAccountId: "acct_pro123",
        stripeOnboardingComplete: true,
      }),
    });

    const mockCreate = vi.fn().mockResolvedValue({
      id: "cs_test_789",
      url: "https://checkout.stripe.com/pay/cs_test_789",
    });
    getStripe.mockReturnValue({
      checkout: { sessions: { create: mockCreate } },
    });

    await POST(
      makeRequest({ proId: "p1", date: "2026-05-01", slot: "morning" }),
    );

    const sessionParams = mockCreate.mock.calls[0][0];
    expect(sessionParams.payment_intent_data.transfer_data.destination).toBe(
      "acct_pro123",
    );
    expect(sessionParams.payment_intent_data.application_fee_amount).toBe(2550);
  });

  it("inclut les bonnes URLs success/cancel", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ status: "validated" }),
    });

    const mockCreate = vi.fn().mockResolvedValue({ id: "cs", url: "url" });
    getStripe.mockReturnValue({
      checkout: { sessions: { create: mockCreate } },
    });

    await POST(
      makeRequest({ proId: "p1", date: "2026-05-01", slot: "morning" }),
    );

    const params = mockCreate.mock.calls[0][0];
    expect(params.success_url).toContain("/confirmation?session_id=");
    expect(params.cancel_url).toContain("/booking/p1");
  });
});
