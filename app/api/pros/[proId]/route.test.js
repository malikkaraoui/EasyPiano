import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";

vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
}));
vi.mock("@/services/firebase", () => ({ db: {} }));

import { get } from "firebase/database";

function makeRequest() {
  return {};
}

describe("GET /api/pros/[proId]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 404 si pro non trouvé", async () => {
    get.mockResolvedValueOnce({ exists: () => false });
    const res = await GET(makeRequest(), { params: { proId: "xxx" } });
    expect(res.status).toBe(404);
  });

  it("retourne 404 si pro pas validé", async () => {
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ status: "pending" }),
    });
    const res = await GET(makeRequest(), { params: { proId: "p1" } });
    expect(res.status).toBe(404);
  });

  it("retourne le profil public d'un pro validé", async () => {
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          status: "validated",
          bio: "Accordeur 12 ans",
          photoURL: "https://photo.jpg",
          country: "PL",
          languages: ["fr", "pl"],
          certificates: [{ name: "Conservatoire" }],
          stats: { averageRating: 4.8, totalReviews: 47, totalBookings: 100 },
          userId: "secret",
          email: "secret@mail.com",
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          a1: {
            startDate: "2026-04-10",
            endDate: "2026-04-20",
            zone: "Lausanne",
          },
        }),
      })
      .mockResolvedValueOnce({ exists: () => false });

    const res = await GET(makeRequest(), { params: { proId: "p1" } });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.bio).toBe("Accordeur 12 ans");
    expect(body.data.stats.averageRating).toBe(4.8);
    expect(body.data.availabilities).toHaveLength(1);
    expect(body.data.userId).toBeUndefined();
    expect(body.data.email).toBeUndefined();
  });

  it("retourne les avis du pro", async () => {
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          status: "validated",
          bio: "Test",
          country: "CH",
          languages: ["fr"],
        }),
      })
      .mockResolvedValueOnce({ exists: () => false })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          r1: { proId: "p1", rating: 5, comment: "Excellent" },
          r2: { proId: "p1", rating: 4, comment: "Très bien" },
          r3: { proId: "other", rating: 3, comment: "Autre pro" },
        }),
      });

    const res = await GET(makeRequest(), { params: { proId: "p1" } });
    const body = await res.json();

    expect(body.data.reviews).toHaveLength(2);
    expect(body.data.reviews[0].comment).toBe("Excellent");
  });

  it("retourne un tableau vide si pas de disponibilités", async () => {
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          status: "validated",
          bio: "Test",
          country: "FR",
          languages: ["fr"],
        }),
      })
      .mockResolvedValueOnce({ exists: () => false })
      .mockResolvedValueOnce({ exists: () => false });

    const res = await GET(makeRequest(), { params: { proId: "p1" } });
    const body = await res.json();

    expect(body.data.availabilities).toEqual([]);
    expect(body.data.reviews).toEqual([]);
  });
});
