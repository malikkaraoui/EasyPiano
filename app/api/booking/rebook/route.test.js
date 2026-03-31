import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/services/auth-server", () => ({ verifyAuth: vi.fn() }));
vi.mock("firebase/database", () => ({ ref: vi.fn(), get: vi.fn() }));
vi.mock("@/services/firebase", () => ({ db: {} }));

import { verifyAuth } from "@/services/auth-server";
import { get } from "firebase/database";

function makeRequest(body) {
  return {
    headers: { get: () => "Bearer token" },
    json: () => Promise.resolve(body),
  };
}

describe("POST /api/booking/rebook", () => {
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

  it("retourne 403 si booking n'appartient pas au client", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ clientId: "other", status: "completed" }),
    });
    const res = await POST(makeRequest({ bookingId: "b1" }));
    expect(res.status).toBe(403);
  });

  it("retourne 400 si booking pas terminé", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ clientId: "u1", status: "confirmed" }),
    });
    const res = await POST(makeRequest({ bookingId: "b1" }));
    expect(res.status).toBe(400);
  });

  it("retourne les données pré-remplies pour re-booking", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        clientId: "u1",
        proId: "p1",
        status: "completed",
        addressCity: "Lausanne",
        slot: "morning",
      }),
    });

    const res = await POST(makeRequest({ bookingId: "b1" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.prefill.proId).toBe("p1");
    expect(body.data.prefill.addressCity).toBe("Lausanne");
    expect(body.data.redirectUrl).toContain("/booking/p1");
    expect(body.data.redirectUrl).toContain("rebook=true");
  });
});
