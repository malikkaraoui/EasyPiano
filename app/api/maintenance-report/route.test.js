import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, GET } from "./route";

vi.mock("@/services/auth-server", () => ({ verifyAuth: vi.fn() }));
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
}));
vi.mock("@/services/firebase", () => ({ db: {} }));

import { verifyAuth } from "@/services/auth-server";
import { get, set } from "firebase/database";

function makeRequest(
  body = null,
  url = "http://localhost/api/maintenance-report",
) {
  return {
    headers: { get: () => "Bearer token" },
    json: () => Promise.resolve(body),
    url,
  };
}

describe("POST /api/maintenance-report", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(401);
  });

  it("retourne 400 si champs requis manquants", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    const res = await POST(makeRequest({ bookingId: "b1" }));
    expect(res.status).toBe(400);
  });

  it("retourne 404 si booking non trouvé", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({ exists: () => false });
    const res = await POST(
      makeRequest({ bookingId: "b1", condition: "Bon état" }),
    );
    expect(res.status).toBe(404);
  });

  it("retourne 403 si pas le pro du booking", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ proId: "p1", clientId: "c1" }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ p1: { userId: "other-user" } }),
      });
    const res = await POST(
      makeRequest({ bookingId: "b1", condition: "Bon état" }),
    );
    expect(res.status).toBe(403);
  });

  it("crée un rapport de maintenance avec succès", async () => {
    verifyAuth.mockResolvedValue({ uid: "pro1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ proId: "p1", clientId: "c1" }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ p1: { userId: "pro1" } }),
      })
      .mockResolvedValueOnce({ exists: () => false }); // pas de rapport existant
    set.mockResolvedValue();

    const res = await POST(
      makeRequest({
        bookingId: "b1",
        condition: "Piano en bon état général",
        recommendations: "Prochain accordage dans 12 mois",
        nextTuningDate: "2027-04-15",
      }),
    );
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.data.condition).toBe("Piano en bon état général");
    expect(body.data.recommendations).toBe("Prochain accordage dans 12 mois");
    expect(body.data.nextTuningDate).toBe("2027-04-15");
  });

  it("retourne 400 si rapport déjà existant", async () => {
    verifyAuth.mockResolvedValue({ uid: "pro1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ proId: "p1", clientId: "c1" }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ p1: { userId: "pro1" } }),
      })
      .mockResolvedValueOnce({ exists: () => true }); // rapport existe déjà

    const res = await POST(makeRequest({ bookingId: "b1", condition: "Bon" }));
    expect(res.status).toBe(400);
  });
});

describe("GET /api/maintenance-report", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await GET(
      makeRequest(null, "http://localhost/api/maintenance-report?bookingId=b1"),
    );
    expect(res.status).toBe(401);
  });

  it("retourne 400 si bookingId manquant", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    const res = await GET(makeRequest());
    expect(res.status).toBe(400);
  });

  it("retourne 404 si rapport non trouvé", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({ exists: () => false });
    const res = await GET(
      makeRequest(null, "http://localhost/api/maintenance-report?bookingId=b1"),
    );
    expect(res.status).toBe(404);
  });

  it("retourne le rapport si le client y a accès", async () => {
    verifyAuth.mockResolvedValue({ uid: "c1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        clientId: "c1",
        condition: "Bon état",
        recommendations: "RAS",
      }),
    });

    const res = await GET(
      makeRequest(null, "http://localhost/api/maintenance-report?bookingId=b1"),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.condition).toBe("Bon état");
  });
});
