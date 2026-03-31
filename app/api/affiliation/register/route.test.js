import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/services/auth-server", () => ({ verifyAuth: vi.fn() }));
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
}));
vi.mock("@/services/firebase", () => ({ db: {} }));

import { verifyAuth } from "@/services/auth-server";
import { get, set } from "firebase/database";

function makeRequest(body) {
  return {
    headers: { get: () => "Bearer token" },
    json: () => Promise.resolve(body),
  };
}

describe("POST /api/affiliation/register", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(401);
  });

  it("retourne les infos existantes si déjà inscrit", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ code: "AFF-U1XXXX-ABC" }),
    });

    const res = await POST(makeRequest({ name: "Prof", type: "teacher" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.status).toBe("already_registered");
    expect(body.data.code).toBe("AFF-U1XXXX-ABC");
  });

  it("retourne 400 si type invalide", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    get.mockResolvedValueOnce({ exists: () => false });

    const res = await POST(makeRequest({ name: "Prof", type: "invalid" }));
    expect(res.status).toBe(400);
  });

  it("crée un compte affilié avec succès", async () => {
    verifyAuth.mockResolvedValue({ uid: "user123abc" });
    get.mockResolvedValueOnce({ exists: () => false });
    set.mockResolvedValue();

    const res = await POST(
      makeRequest({ name: "Marie Dupont", type: "teacher" }),
    );
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.data.code).toMatch(/^AFF-/);
    expect(body.data.status).toBe("active");
  });

  it("génère un code affilié unique", async () => {
    verifyAuth.mockResolvedValue({ uid: "abc123xyz" });
    get.mockResolvedValueOnce({ exists: () => false });
    set.mockResolvedValue();

    const res = await POST(makeRequest({ name: "Test", type: "school" }));
    const body = await res.json();

    expect(body.data.code).toContain("AFF-ABC123");
  });
});
