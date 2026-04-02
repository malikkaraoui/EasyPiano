import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";

vi.mock("@/services/auth-server", () => ({
  verifyAuth: vi.fn(),
}));

const mockOnce = vi.fn();
const mockUpdate = vi.fn();

vi.mock("@/services/firebase-admin-db", () => ({
  getAdminDb: () => ({
    ref: () => ({ once: mockOnce, update: mockUpdate }),
  }),
}));

import { verifyAuth } from "@/services/auth-server";

function makeRequest(body = null) {
  return {
    headers: { get: () => "Bearer test-token" },
    json: () => Promise.resolve(body),
  };
}

describe("GET /api/user/profile", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it("retourne 404 si profil non trouvé", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    mockOnce.mockResolvedValue({ exists: () => false });
    const res = await GET(makeRequest());
    expect(res.status).toBe(404);
  });

  it("retourne le profil si authentifié et existant", async () => {
    const profileData = { displayName: "Test", email: "t@t.com", isB2B: false };
    verifyAuth.mockResolvedValue({ uid: "u1" });
    mockOnce.mockResolvedValue({ exists: () => true, val: () => profileData });

    const res = await GET(makeRequest());
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.data.displayName).toBe("Test");
  });
});

describe("POST /api/user/profile", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await POST(makeRequest({ displayName: "New" }));
    expect(res.status).toBe(401);
  });

  it("retourne 400 si aucun champ valide", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    const res = await POST(makeRequest({ email: "hack@evil.com" }));
    expect(res.status).toBe(400);
  });

  it("met à jour les champs autorisés uniquement", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    mockUpdate.mockResolvedValue();

    const res = await POST(
      makeRequest({
        displayName: "Nouveau",
        phone: "+41791234567",
        isB2B: true,
        email: "hack",
        role: "admin",
      }),
    );
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.data.displayName).toBe("Nouveau");
    expect(body.data.isB2B).toBe(true);
    expect(body.data.email).toBeUndefined();
    expect(body.data.role).toBeUndefined();
  });

  it("ajoute updatedAt au payload", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    mockUpdate.mockResolvedValue();
    const res = await POST(makeRequest({ displayName: "Test" }));
    const body = await res.json();
    expect(body.data.updatedAt).toBeDefined();
  });
});
