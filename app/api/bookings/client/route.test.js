import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";

vi.mock("@/services/auth-server", () => ({ verifyAuth: vi.fn() }));
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
}));
vi.mock("@/services/firebase", () => ({ db: {} }));

import { verifyAuth } from "@/services/auth-server";
import { get } from "firebase/database";

function makeRequest() {
  return { headers: { get: () => "Bearer token" } };
}

describe("GET /api/bookings/client", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it("retourne une liste vide si pas de réservations", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({ exists: () => false });

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.items).toEqual([]);
  });

  it("retourne les réservations du client triées par date", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ b1: true, b2: true }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          proId: "p1",
          date: "2026-05-01",
          slot: "morning",
          status: "confirmed",
          price: 15000,
          addressCity: "Lausanne",
          createdAt: "2026-04-01",
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          proId: "p2",
          date: "2026-04-15",
          slot: "afternoon",
          status: "confirmed",
          price: 15000,
          addressCity: "Genève",
          createdAt: "2026-03-28",
        }),
      });

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(body.data.items).toHaveLength(2);
    expect(body.data.items[0].date).toBe("2026-04-15"); // trié par date
    expect(body.data.items[1].date).toBe("2026-05-01");
  });

  it("ne retourne pas l'adresse chiffrée", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ b1: true }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          proId: "p1",
          date: "2026-04-15",
          slot: "morning",
          status: "confirmed",
          price: 15000,
          addressCity: "Lausanne",
          addressEncrypted: "secret_encrypted_data",
          createdAt: "2026-04-01",
        }),
      });

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(body.data.items[0].addressEncrypted).toBeUndefined();
    expect(body.data.items[0].addressCity).toBe("Lausanne");
  });
});
