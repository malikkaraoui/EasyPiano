import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST, PUT, DELETE } from "./route";

vi.mock("@/services/auth-server", () => ({ verifyAuth: vi.fn() }));
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  push: vi.fn(() => ({ key: "avail-123" })),
  set: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));
vi.mock("@/services/firebase", () => ({ db: {} }));

import { verifyAuth } from "@/services/auth-server";
import { get, set, update, remove } from "firebase/database";

function makeRequest(body = null, url = "http://localhost/api/availabilities") {
  return {
    headers: { get: () => "Bearer token" },
    json: () => Promise.resolve(body),
    url,
  };
}

const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 10);
const futureEnd = new Date();
futureEnd.setDate(futureEnd.getDate() + 17);

const validBody = {
  startDate: futureDate.toISOString().split("T")[0],
  endDate: futureEnd.toISOString().split("T")[0],
  zone: "Lausanne",
  radiusKm: 50,
  capacityMorning: 1,
  capacityAfternoon: 2,
};

function _MockProFound(status = "validated", stripeComplete = true) {
  get.mockResolvedValueOnce({
    exists: () => true,
    val: () => ({
      proUser: {
        userId: "u1",
        status,
        stripeOnboardingComplete: stripeComplete,
      },
    }),
  });
}

describe("GET /api/availabilities", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it("retourne 404 si pas de profil pro", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({ exists: () => false });
    const res = await GET(makeRequest());
    expect(res.status).toBe(404);
  });

  it("retourne les disponibilités du pro", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ p1: { userId: "u1" } }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          a1: { zone: "Lausanne", startDate: "2026-04-01" },
          a2: { zone: "Genève", startDate: "2026-05-01" },
        }),
      });

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.items).toHaveLength(2);
    expect(body.data.total).toBe(2);
  });
});

describe("POST /api/availabilities", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(401);
  });

  it("retourne 400 si champs requis manquants", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        p1: {
          userId: "u1",
          status: "validated",
          stripeOnboardingComplete: true,
        },
      }),
    });

    const res = await POST(makeRequest({ startDate: "2026-04-01" }));
    expect(res.status).toBe(400);
  });

  it("retourne 400 si startDate >= endDate", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        p1: {
          userId: "u1",
          status: "validated",
          stripeOnboardingComplete: true,
        },
      }),
    });

    const res = await POST(
      makeRequest({
        ...validBody,
        startDate: "2026-06-10",
        endDate: "2026-06-01",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("crée une disponibilité avec succès", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        p1: {
          userId: "u1",
          status: "validated",
          stripeOnboardingComplete: true,
        },
      }),
    });
    set.mockResolvedValue();

    const res = await POST(makeRequest(validBody));
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.data.id).toBe("avail-123");
    expect(body.data.zone).toBe("Lausanne");
    expect(body.data.radiusKm).toBe(50);
  });

  it("retourne 400 si pro pas validé", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        p1: {
          userId: "u1",
          status: "pending",
          stripeOnboardingComplete: false,
        },
      }),
    });

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(400);
  });

  it("retourne 400 si Stripe pas configuré", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        p1: {
          userId: "u1",
          status: "validated",
          stripeOnboardingComplete: false,
        },
      }),
    });

    const res = await POST(makeRequest(validBody));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toContain("Stripe");
  });
});

describe("PUT /api/availabilities", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 400 si availabilityId manquant", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ p1: { userId: "u1" } }),
    });

    const res = await PUT(makeRequest({ zone: "Berne" }));
    expect(res.status).toBe(400);
  });

  it("modifie une disponibilité existante", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ p1: { userId: "u1" } }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          ...validBody,
          radiusKm: 50,
          capacityMorning: 1,
          capacityAfternoon: 2,
        }),
      })
      .mockResolvedValueOnce({ exists: () => false });
    update.mockResolvedValue();

    const res = await PUT(
      makeRequest({ availabilityId: "a1", zone: "Berne", radiusKm: 30 }),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.id).toBe("a1");
    expect(body.data.zone).toBe("Berne");
    expect(body.data.radiusKm).toBe(30);
  });

  it("bloque la modification si une réservation confirmée existe", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ p1: { userId: "u1" } }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          ...validBody,
          radiusKm: 50,
          capacityMorning: 1,
          capacityAfternoon: 2,
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ b1: true }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ date: validBody.startDate, status: "confirmed" }),
      });

    const res = await PUT(
      makeRequest({ availabilityId: "a1", zone: "Berne", radiusKm: 30 }),
    );
    const body = await res.json();

    expect(res.status).toBe(409);
    expect(body.error).toContain("réservations confirmées");
    expect(update).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/availabilities", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 400 si id manquant", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ p1: { userId: "u1" } }),
    });

    const res = await DELETE(
      makeRequest(null, "http://localhost/api/availabilities"),
    );
    expect(res.status).toBe(400);
  });

  it("supprime une disponibilité", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ p1: { userId: "u1" } }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => validBody,
      })
      .mockResolvedValueOnce({ exists: () => false });
    remove.mockResolvedValue();

    const res = await DELETE(
      makeRequest(null, "http://localhost/api/availabilities?id=a1"),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.deleted).toBe("a1");
  });

  it("bloque la suppression si une réservation confirmée existe", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ p1: { userId: "u1" } }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => validBody,
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ b1: true }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ date: validBody.startDate, status: "confirmed" }),
      });

    const res = await DELETE(
      makeRequest(null, "http://localhost/api/availabilities?id=a1"),
    );
    const body = await res.json();

    expect(res.status).toBe(409);
    expect(body.error).toContain("réservations confirmées");
    expect(remove).not.toHaveBeenCalled();
  });
});
