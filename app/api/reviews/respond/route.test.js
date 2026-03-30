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

describe("POST /api/reviews/respond", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(401);
  });

  it("retourne 400 si champs manquants", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    const res = await POST(makeRequest({ bookingId: "b1" }));
    expect(res.status).toBe(400);
  });

  it("retourne 404 si avis non trouvé", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({ exists: () => false });
    const res = await POST(
      makeRequest({ bookingId: "b1", response: "Merci !" }),
    );
    expect(res.status).toBe(404);
  });

  it("retourne 400 si réponse déjà existante", async () => {
    verifyAuth.mockResolvedValue({ uid: "pro1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          proId: "p1",
          proResponse: "Déjà répondu",
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ p1: { userId: "pro1" } }),
      });

    const res = await POST(
      makeRequest({ bookingId: "b1", response: "Nouvelle réponse" }),
    );
    expect(res.status).toBe(400);
  });

  it("crée une réponse pro avec succès", async () => {
    verifyAuth.mockResolvedValue({ uid: "pro1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          proId: "p1",
          proResponse: null,
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ p1: { userId: "pro1" } }),
      });
    update.mockResolvedValue();

    const res = await POST(
      makeRequest({
        bookingId: "b1",
        response: "Merci pour votre avis !",
      }),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.proResponse).toBe("Merci pour votre avis !");
  });
});
