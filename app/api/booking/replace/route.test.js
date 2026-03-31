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

describe("POST /api/booking/replace", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await POST(makeRequest({ bookingId: "b1" }));
    expect(res.status).toBe(401);
  });

  it("retourne 403 si pas admin", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1", role: "client" });
    const res = await POST(makeRequest({ bookingId: "b1" }));
    expect(res.status).toBe(403);
  });

  it("trouve un remplaçant et met à jour le booking", async () => {
    verifyAuth.mockResolvedValue({ uid: "a1", role: "admin" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          clientId: "c1",
          proId: "p1",
          status: "confirmed",
          date: "2026-05-15",
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          p1: { status: "validated" },
          p2: { status: "validated" },
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          p2: {
            a1: { startDate: "2026-05-10", endDate: "2026-05-20" },
          },
        }),
      });
    update.mockResolvedValue();

    const res = await POST(makeRequest({ bookingId: "b1" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.replacementProId).toBe("p2");
    expect(body.data.status).toBe("replaced");
  });

  it("rembourse + crédit 20 CHF si aucun remplaçant", async () => {
    verifyAuth.mockResolvedValue({ uid: "a1", role: "admin" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          clientId: "c1",
          proId: "p1",
          status: "confirmed",
          date: "2026-05-15",
        }),
      })
      .mockResolvedValueOnce({ exists: () => false }) // pas de pros
      .mockResolvedValueOnce({ exists: () => false }); // pas de dispos
    update.mockResolvedValue();

    const res = await POST(makeRequest({ bookingId: "b1" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.replacementProId).toBeNull();
    expect(body.data.status).toBe("refunded");
    expect(body.data.refundPercent).toBe(100);
    expect(body.data.creditCents).toBe(2000);
  });
});
