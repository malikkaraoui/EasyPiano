import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/services/auth-server", () => ({ verifyAuth: vi.fn() }));
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  update: vi.fn(),
}));
vi.mock("@/services/firebase", () => ({ db: {} }));

import { verifyAuth } from "@/services/auth-server";
import { get, set, update } from "firebase/database";

function makeRequest(body) {
  return {
    headers: { get: () => "Bearer token" },
    json: () => Promise.resolve(body),
  };
}

describe("POST /api/reviews/create", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(401);
  });

  it("retourne 400 si bookingId ou rating manquant", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    const res = await POST(makeRequest({ bookingId: "b1" }));
    expect(res.status).toBe(400);
  });

  it("retourne 400 si rating hors limites", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    const res = await POST(makeRequest({ bookingId: "b1", rating: 6 }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toContain("entre 1 et 5");
  });

  it("retourne 403 si le booking n'appartient pas au client", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ clientId: "other", status: "completed", proId: "p1" }),
    });
    const res = await POST(makeRequest({ bookingId: "b1", rating: 5 }));
    expect(res.status).toBe(403);
  });

  it("retourne 400 si booking pas terminé", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ clientId: "u1", status: "confirmed", proId: "p1" }),
    });
    const res = await POST(makeRequest({ bookingId: "b1", rating: 5 }));
    expect(res.status).toBe(400);
  });

  it("retourne 400 si avis déjà existant", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ clientId: "u1", status: "completed", proId: "p1" }),
      })
      .mockResolvedValueOnce({ exists: () => true }); // avis existe déjà
    const res = await POST(makeRequest({ bookingId: "b1", rating: 5 }));
    expect(res.status).toBe(400);
  });

  it("crée un avis et met à jour la note moyenne", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ clientId: "u1", status: "completed", proId: "p1" }),
      })
      .mockResolvedValueOnce({ exists: () => false }) // pas d'avis existant
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ totalReviews: 10, averageRating: 4.5 }),
      });
    set.mockResolvedValue();
    update.mockResolvedValue();

    const res = await POST(
      makeRequest({ bookingId: "b1", rating: 5, comment: "Excellent" }),
    );
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.data.rating).toBe(5);
    expect(body.data.averageRating).toBeDefined();

    // Vérifier que set a été appelé pour créer l'avis
    const reviewData = set.mock.calls[0][1];
    expect(reviewData.rating).toBe(5);
    expect(reviewData.comment).toBe("Excellent");
    expect(reviewData.proId).toBe("p1");
    expect(reviewData.proResponse).toBeNull();

    // Vérifier mise à jour stats
    const statsUpdate = update.mock.calls[0][1];
    expect(statsUpdate.totalReviews).toBe(11);
    expect(statsUpdate.averageRating).toBe(4.5); // (4.5*10 + 5) / 11 ≈ 4.5
  });

  it("calcule correctement la moyenne avec premier avis", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ clientId: "u1", status: "completed", proId: "p1" }),
      })
      .mockResolvedValueOnce({ exists: () => false })
      .mockResolvedValueOnce({ exists: () => false }); // pas de stats existantes
    set.mockResolvedValue();
    update.mockResolvedValue();

    const res = await POST(makeRequest({ bookingId: "b1", rating: 4 }));
    const body = await res.json();

    expect(body.data.averageRating).toBe(4);
    const statsUpdate = update.mock.calls[0][1];
    expect(statsUpdate.totalReviews).toBe(1);
    expect(statsUpdate.averageRating).toBe(4);
  });
});
