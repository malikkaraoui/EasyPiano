import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
}));
vi.mock("@/services/firebase", () => ({ db: {} }));

import { get, update } from "firebase/database";

function makeRequest(body) {
  return { json: () => Promise.resolve(body) };
}

describe("POST /api/webhooks/stripe", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 400 si type manquant", async () => {
    const res = await POST(makeRequest({ data: {} }));
    expect(res.status).toBe(400);
  });

  it("gère payment_intent.succeeded", async () => {
    get.mockResolvedValueOnce({ exists: () => true });
    update.mockResolvedValue();

    const res = await POST(
      makeRequest({
        type: "payment_intent.succeeded",
        data: { bookingId: "b1", paymentIntentId: "pi_123" },
      }),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.received).toBe(true);
    expect(update).toHaveBeenCalled();
    const updateData = update.mock.calls[0][1];
    expect(updateData.stripePaymentIntentId).toBe("pi_123");
    expect(updateData.status).toBe("confirmed");
  });

  it("gère charge.refunded", async () => {
    get.mockResolvedValueOnce({ exists: () => true });
    update.mockResolvedValue();

    const res = await POST(
      makeRequest({
        type: "charge.refunded",
        data: { bookingId: "b1" },
      }),
    );

    expect(res.status).toBe(200);
    const updateData = update.mock.calls[0][1];
    expect(updateData.status).toBe("refunded");
  });

  it("gère account.updated (Stripe Connect)", async () => {
    update.mockResolvedValue();

    const res = await POST(
      makeRequest({
        type: "account.updated",
        data: { proId: "p1", stripeAccountId: "acct_123" },
      }),
    );

    expect(res.status).toBe(200);
    const updateData = update.mock.calls[0][1];
    expect(updateData.stripeAccountId).toBe("acct_123");
    expect(updateData.stripeOnboardingComplete).toBe(true);
  });

  it("gère un type inconnu sans erreur", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(makeRequest({ type: "unknown.event", data: {} }));

    expect(res.status).toBe(200);
    consoleSpy.mockRestore();
  });

  it("retourne received: true à chaque webhook traité", async () => {
    get.mockResolvedValueOnce({ exists: () => true });
    update.mockResolvedValue();

    const res = await POST(
      makeRequest({
        type: "payment_intent.succeeded",
        data: { bookingId: "b1" },
      }),
    );
    const body = await res.json();

    expect(body.success).toBe(true);
    expect(body.data.received).toBe(true);
  });
});
