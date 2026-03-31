import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";

vi.mock("@/services/auth-server", () => ({ verifyAuth: vi.fn() }));
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
}));
vi.mock("@/services/firebase", () => ({ db: {} }));

import { verifyAuth } from "@/services/auth-server";
import { get, set } from "firebase/database";

function makeRequest(body = null) {
  return {
    headers: { get: () => "Bearer token" },
    json: () => Promise.resolve(body),
  };
}

describe("GET /api/admin/pricing", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 403 si pas admin", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1", role: "client" });
    const res = await GET(makeRequest());
    expect(res.status).toBe(403);
  });

  it("retourne la config pricing", async () => {
    verifyAuth.mockResolvedValue({ uid: "a1", role: "admin" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        lausanne: { priceCents: 15000 },
        geneve: { priceCents: 18000 },
      }),
    });

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.defaultPrice).toBe(15000);
    expect(body.data.zones.lausanne.priceCents).toBe(15000);
  });
});

describe("POST /api/admin/pricing", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 400 si prix hors limites", async () => {
    verifyAuth.mockResolvedValue({ uid: "a1", role: "admin" });
    const res = await POST(makeRequest({ zone: "zurich", priceCents: 100000 }));
    expect(res.status).toBe(400);
  });

  it("configure le prix d'une zone", async () => {
    verifyAuth.mockResolvedValue({ uid: "a1", role: "admin" });
    set.mockResolvedValue();

    const res = await POST(
      makeRequest({ zone: "lausanne", priceCents: 16000 }),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.zone).toBe("lausanne");
    expect(body.data.priceCents).toBe(16000);
  });
});
