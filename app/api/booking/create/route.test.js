import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/services/auth-server", () => ({ verifyAuth: vi.fn() }));
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  push: vi.fn(() => ({ key: "booking-abc" })),
  set: vi.fn(),
  update: vi.fn(),
  get: vi.fn(),
}));
vi.mock("@/services/firebase", () => ({ db: {} }));
vi.mock("@/services/encryption", () => ({
  encryptAddress: vi.fn((addr) => `encrypted_${addr}`),
}));

import { verifyAuth } from "@/services/auth-server";
import { get, set, update } from "firebase/database";

function makeRequest(body) {
  return {
    headers: { get: () => "Bearer token" },
    json: () => Promise.resolve(body),
  };
}

const validBody = {
  proId: "p1",
  date: "2026-04-15",
  slot: "morning",
  address: "Rue de la Gare 15, 1003 Lausanne",
  addressCity: "Lausanne",
};

describe("POST /api/booking/create", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(401);
  });

  it("retourne 400 si champs requis manquants", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    const res = await POST(makeRequest({ proId: "p1" }));
    expect(res.status).toBe(400);
  });

  it("retourne 400 si slot invalide", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    const res = await POST(makeRequest({ ...validBody, slot: "evening" }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toContain("slot");
  });

  it("retourne 404 si pro non trouvé", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({ exists: () => false });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(404);
  });

  it("retourne 400 si pro pas validé", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ status: "pending" }),
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(400);
  });

  it("crée une réservation avec succès", async () => {
    verifyAuth.mockResolvedValue({ uid: "client1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        status: "validated",
        stats: { totalBookings: 5 },
      }),
    });
    set.mockResolvedValue();
    update.mockResolvedValue();

    const res = await POST(makeRequest(validBody));
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.data.bookingId).toBe("booking-abc");
    expect(body.data.status).toBe("confirmed");
    expect(body.data.price).toBe(15000);
  });

  it("chiffre l'adresse avant stockage", async () => {
    verifyAuth.mockResolvedValue({ uid: "client1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ status: "validated", stats: {} }),
    });
    set.mockResolvedValue();
    update.mockResolvedValue();

    await POST(makeRequest(validBody));

    // Le premier set() est pour le booking
    const bookingData = set.mock.calls[0][1];
    expect(bookingData.addressEncrypted).toBe(
      "encrypted_Rue de la Gare 15, 1003 Lausanne",
    );
    expect(bookingData.addressCity).toBe("Lausanne");
  });

  it("stocke les prix en centimes", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ status: "validated", stats: {} }),
    });
    set.mockResolvedValue();
    update.mockResolvedValue();

    await POST(makeRequest(validBody));

    const bookingData = set.mock.calls[0][1];
    expect(bookingData.price).toBe(15000);
    expect(bookingData.commission).toBe(2500);
    expect(bookingData.proNet).toBe(12500);
  });

  it("met à jour les index et les stats pro", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ status: "validated", stats: { totalBookings: 10 } }),
    });
    set.mockResolvedValue();
    update.mockResolvedValue();

    await POST(makeRequest(validBody));

    // 3 set calls: booking + 2 index
    expect(set).toHaveBeenCalledTimes(3);
    // 1 update call: stats
    const statsUpdate = update.mock.calls[0][1];
    expect(statsUpdate.totalBookings).toBe(11);
  });
});
