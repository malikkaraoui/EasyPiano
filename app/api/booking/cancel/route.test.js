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

// Date dans 3 jours (> 48h)
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 3);
const futureDateStr = futureDate.toISOString().split("T")[0];

// Date demain (24-48h)
describe("POST /api/booking/cancel", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await POST(makeRequest({ bookingId: "b1" }));
    expect(res.status).toBe(401);
  });

  it("retourne 400 si bookingId manquant", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("retourne 404 si booking non trouvé", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({ exists: () => false });
    const res = await POST(makeRequest({ bookingId: "b1" }));
    expect(res.status).toBe(404);
  });

  it("retourne 403 si le booking n'appartient pas au client", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ clientId: "other-user", status: "confirmed" }),
    });
    const res = await POST(makeRequest({ bookingId: "b1" }));
    expect(res.status).toBe(403);
  });

  it("retourne 400 si le booking n'est pas 'confirmed'", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ clientId: "u1", status: "cancelled" }),
    });
    const res = await POST(makeRequest({ bookingId: "b1" }));
    expect(res.status).toBe(400);
  });

  it("annule avec 100% remboursement si > 48h avant", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        clientId: "u1",
        status: "confirmed",
        date: futureDateStr,
      }),
    });
    update.mockResolvedValue();

    const res = await POST(
      makeRequest({ bookingId: "b1", reason: "Imprévu personnel" }),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.status).toBe("cancelled");
    expect(body.data.refundPercent).toBe(100);
  });

  it("annule avec 0% si < 24h avant", async () => {
    const todayDate = new Date();
    todayDate.setHours(todayDate.getHours() + 5); // dans 5h

    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        clientId: "u1",
        status: "confirmed",
        date: todayDate.toISOString().split("T")[0],
      }),
    });
    update.mockResolvedValue();

    const res = await POST(makeRequest({ bookingId: "b1" }));
    const body = await res.json();

    expect(body.data.refundPercent).toBe(0);
  });

  it("enregistre le motif d'annulation", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        clientId: "u1",
        status: "confirmed",
        date: futureDateStr,
      }),
    });
    update.mockResolvedValue();

    await POST(makeRequest({ bookingId: "b1", reason: "Problème de santé" }));

    const updateArgs = update.mock.calls[0][1];
    expect(updateArgs.cancellation.reason).toBe("Problème de santé");
    expect(updateArgs.status).toBe("cancelled");
  });
});
