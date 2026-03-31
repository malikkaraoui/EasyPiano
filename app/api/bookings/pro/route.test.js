import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { GET, PATCH } from "./route";

vi.mock("@/services/auth-server", () => ({ verifyAuth: vi.fn() }));
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
}));
vi.mock("@/services/firebase", () => ({ db: {} }));
vi.mock("@/services/encryption", () => ({ decryptAddress: vi.fn() }));

import { verifyAuth } from "@/services/auth-server";
import { get, update } from "firebase/database";
import { decryptAddress } from "@/services/encryption";

function makeRequest() {
  return {
    headers: { get: () => "Bearer token" },
    json: () => Promise.resolve({}),
  };
}

describe("GET /api/bookings/pro", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);

    const res = await GET(makeRequest());

    expect(res.status).toBe(401);
  });

  it("retourne 404 si aucun profil pro n'est trouvé", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({ exists: () => false });

    const res = await GET(makeRequest());

    expect(res.status).toBe(404);
  });

  it("masque l'adresse exacte avant la fenêtre des 24h", async () => {
    vi.setSystemTime(new Date("2026-04-10T09:00:00Z"));
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ p1: { userId: "u1", status: "validated" } }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ b1: true }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          clientId: "c1",
          date: "2026-04-12",
          slot: "morning",
          status: "confirmed",
          price: 15000,
          addressCity: "Lausanne",
          addressEncrypted: "secret",
          createdAt: "2026-04-01T10:00:00.000Z",
        }),
      });

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.items[0].addressVisible).toBe(false);
    expect(body.data.items[0].address).toBeNull();
    expect(body.data.items[0].addressCity).toBe("Lausanne");
    expect(decryptAddress).not.toHaveBeenCalled();
  });

  it("révèle l'adresse exacte dans les 24h et trace la révélation", async () => {
    vi.setSystemTime(new Date("2026-04-11T10:00:00Z"));
    verifyAuth.mockResolvedValue({ uid: "u1" });
    decryptAddress.mockReturnValue("Rue du Lac 5, 1007 Lausanne");
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ p1: { userId: "u1", status: "validated" } }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ b1: true }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          clientId: "c1",
          date: "2026-04-12",
          slot: "morning",
          status: "confirmed",
          price: 15000,
          addressCity: "Lausanne",
          addressEncrypted: "secret",
          addressRevealedAt: null,
          createdAt: "2026-04-01T10:00:00.000Z",
        }),
      });

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.items[0].addressVisible).toBe(true);
    expect(body.data.items[0].address).toBe("Rue du Lac 5, 1007 Lausanne");
    expect(update).toHaveBeenCalledTimes(1);
  });

  it("indique si un rapport post-intervention existe déjà", async () => {
    vi.setSystemTime(new Date("2026-04-13T10:00:00Z"));
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ p1: { userId: "u1", status: "validated" } }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ b1: true }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          clientId: "c1",
          proId: "p1",
          date: "2026-04-12",
          slot: "morning",
          status: "completed",
          price: 15000,
          addressCity: "Lausanne",
          addressEncrypted: "secret",
          createdAt: "2026-04-01T10:00:00.000Z",
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ bookingId: "b1" }),
      });

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.items[0].maintenanceReportExists).toBe(true);
  });
});

describe("PATCH /api/bookings/pro", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("met à jour une réservation de confirmed vers in_progress", async () => {
    vi.setSystemTime(new Date("2026-04-11T10:00:00Z"));
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ p1: { userId: "u1", status: "validated" } }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          clientId: "c1",
          proId: "p1",
          date: "2026-04-12",
          slot: "morning",
          status: "confirmed",
          price: 15000,
          addressCity: "Lausanne",
          addressEncrypted: "secret",
          createdAt: "2026-04-01T10:00:00.000Z",
        }),
      });

    const res = await PATCH({
      ...makeRequest(),
      json: () => Promise.resolve({ bookingId: "b1", status: "in_progress" }),
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(update).toHaveBeenCalledTimes(1);
    expect(body.data.status).toBe("in_progress");
    expect(body.data.inProgressAt).toBe("2026-04-11T10:00:00.000Z");
  });

  it("refuse une transition invalide", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ p1: { userId: "u1", status: "validated" } }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          clientId: "c1",
          proId: "p1",
          date: "2026-04-12",
          slot: "morning",
          status: "confirmed",
          price: 15000,
          addressCity: "Lausanne",
          addressEncrypted: "secret",
          createdAt: "2026-04-01T10:00:00.000Z",
        }),
      });

    const res = await PATCH({
      ...makeRequest(),
      json: () => Promise.resolve({ bookingId: "b1", status: "completed" }),
    });

    expect(res.status).toBe(409);
    expect(update).not.toHaveBeenCalled();
  });
});
