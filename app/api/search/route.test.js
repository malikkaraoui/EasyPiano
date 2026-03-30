import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
}));
vi.mock("@/services/firebase", () => ({ db: {} }));

import { get } from "firebase/database";

function makeRequest(body) {
  return { json: () => Promise.resolve(body) };
}

describe("POST /api/search", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 400 si zone manquante", async () => {
    const res = await POST(makeRequest({ date: "2026-04-15" }));
    expect(res.status).toBe(400);
  });

  it("retourne 400 si date manquante", async () => {
    const res = await POST(makeRequest({ zone: "Lausanne" }));
    expect(res.status).toBe(400);
  });

  it("retourne 400 si date invalide", async () => {
    const res = await POST(makeRequest({ zone: "Lausanne", date: "invalid" }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toContain("invalide");
  });

  it("retourne une liste vide si pas de pros", async () => {
    get.mockResolvedValue({ exists: () => false });

    const res = await POST(
      makeRequest({ zone: "Lausanne", date: "2026-04-15" }),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.items).toEqual([]);
    expect(body.data.total).toBe(0);
  });

  it("retourne les pros disponibles à la date demandée", async () => {
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          p1: {
            status: "validated",
            bio: "Pro 1",
            photoURL: null,
            country: "PL",
            languages: ["fr"],
            stats: { averageRating: 4.5, totalReviews: 10, totalBookings: 20 },
          },
          p2: {
            status: "pending",
            bio: "Pro 2",
          },
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          p1: {
            a1: {
              startDate: "2026-04-10",
              endDate: "2026-04-20",
              zone: "Lausanne",
            },
          },
        }),
      });

    const res = await POST(
      makeRequest({ zone: "Lausanne", date: "2026-04-15" }),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0].proId).toBe("p1");
    expect(body.data.items[0].bio).toBe("Pro 1");
    expect(body.data.items[0].stats.averageRating).toBe(4.5);
  });

  it("exclut les pros non validés", async () => {
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          p1: { status: "pending", bio: "Pending" },
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          p1: {
            a1: { startDate: "2026-04-10", endDate: "2026-04-20" },
          },
        }),
      });

    const res = await POST(
      makeRequest({ zone: "Lausanne", date: "2026-04-15" }),
    );
    const body = await res.json();

    expect(body.data.items).toHaveLength(0);
  });

  it("exclut les pros sans disponibilité à la date", async () => {
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          p1: { status: "validated", bio: "Pro 1" },
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          p1: {
            a1: { startDate: "2026-05-01", endDate: "2026-05-10" },
          },
        }),
      });

    const res = await POST(
      makeRequest({ zone: "Lausanne", date: "2026-04-15" }),
    );
    const body = await res.json();

    expect(body.data.items).toHaveLength(0);
  });

  it("ne retourne pas de données sensibles (email, userId)", async () => {
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          p1: {
            status: "validated",
            bio: "Pro 1",
            userId: "secret-uid",
            email: "secret@email.com",
            photoURL: null,
            country: "PL",
            languages: ["fr"],
            stats: {},
          },
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          p1: {
            a1: { startDate: "2026-04-10", endDate: "2026-04-20" },
          },
        }),
      });

    const res = await POST(
      makeRequest({ zone: "Lausanne", date: "2026-04-15" }),
    );
    const body = await res.json();

    const pro = body.data.items[0];
    expect(pro.userId).toBeUndefined();
    expect(pro.email).toBeUndefined();
  });
});
