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

describe("GET /api/admin/analytics", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it("retourne 403 si pas admin", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1", role: "client" });
    const res = await GET(makeRequest());
    expect(res.status).toBe(403);
  });

  it("retourne les analytics complètes", async () => {
    verifyAuth.mockResolvedValue({ uid: "a1", role: "admin" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          p1: { status: "validated" },
          p2: { status: "pending" },
          p3: { status: "validated" },
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          b1: { status: "confirmed", commission: 2500 },
          b2: {
            status: "cancelled",
            cancellation: { reason: "Imprévu personnel" },
          },
          b3: { status: "completed", commission: 2500 },
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          r1: { rating: 5 },
          r2: { rating: 4 },
          r3: { rating: 2 },
        }),
      });

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.pros.active).toBe(2);
    expect(body.data.pros.pending).toBe(1);
    expect(body.data.bookings.total).toBe(3);
    expect(body.data.bookings.confirmed).toBe(1);
    expect(body.data.bookings.cancelled).toBe(1);
    expect(body.data.revenue.totalCommission).toBe(5000);
    expect(body.data.cancellationReasons["Imprévu personnel"]).toBe(1);
    expect(body.data.reviews.total).toBe(3);
    expect(body.data.reviews.averageRating).toBe(3.7);
    expect(body.data.reviews.negative).toBe(1);
  });

  it("gère le cas sans données", async () => {
    verifyAuth.mockResolvedValue({ uid: "a1", role: "admin" });
    get
      .mockResolvedValueOnce({ exists: () => false })
      .mockResolvedValueOnce({ exists: () => false })
      .mockResolvedValueOnce({ exists: () => false });

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.pros.active).toBe(0);
    expect(body.data.bookings.total).toBe(0);
    expect(body.data.reviews.total).toBe(0);
  });
});
