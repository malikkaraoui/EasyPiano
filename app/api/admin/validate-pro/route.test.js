import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/services/auth-server", () => ({ verifyAuth: vi.fn() }));

const mockOnce = vi.fn();
const mockUpdate = vi.fn();
const mockSet = vi.fn();

vi.mock("@/services/firebase-admin-db", () => ({
  getAdminDb: () => ({
    ref: () => ({ once: mockOnce, update: mockUpdate, set: mockSet }),
  }),
}));

import { verifyAuth } from "@/services/auth-server";

function makeRequest(body) {
  return {
    headers: { get: () => "Bearer token" },
    json: () => Promise.resolve(body),
  };
}

describe("POST /api/admin/validate-pro", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(401);
  });

  it("retourne 403 si pas admin", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1", role: "client" });
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(403);
  });

  it("retourne 400 si proId manquant", async () => {
    verifyAuth.mockResolvedValue({ uid: "a1", role: "admin" });
    const res = await POST(makeRequest({ action: "validate" }));
    expect(res.status).toBe(400);
  });

  it("retourne 400 si action invalide", async () => {
    verifyAuth.mockResolvedValue({ uid: "a1", role: "admin" });
    const res = await POST(makeRequest({ proId: "p1", action: "delete" }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toContain("Action invalide");
  });

  it("retourne 404 si pro non trouvé", async () => {
    verifyAuth.mockResolvedValue({ uid: "a1", role: "admin" });
    mockOnce.mockResolvedValue({ exists: () => false });
    const res = await POST(makeRequest({ proId: "p1", action: "validate" }));
    expect(res.status).toBe(404);
  });

  it("retourne 400 si pro déjà validé", async () => {
    verifyAuth.mockResolvedValue({ uid: "a1", role: "admin" });
    mockOnce.mockResolvedValue({
      exists: () => true,
      val: () => ({ status: "validated" }),
    });
    const res = await POST(makeRequest({ proId: "p1", action: "validate" }));
    expect(res.status).toBe(400);
  });

  it("valide un pro pending avec succès", async () => {
    verifyAuth.mockResolvedValue({ uid: "admin1", role: "admin" });
    mockOnce.mockResolvedValue({
      exists: () => true,
      val: () => ({ status: "pending" }),
    });
    mockUpdate.mockResolvedValue();
    mockSet.mockResolvedValue();

    const res = await POST(makeRequest({ proId: "p1", action: "validate" }));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.data.status).toBe("validated");
  });

  it("refuse un pro avec motif obligatoire", async () => {
    verifyAuth.mockResolvedValue({ uid: "admin1", role: "admin" });
    mockOnce.mockResolvedValue({
      exists: () => true,
      val: () => ({ status: "pending" }),
    });
    const res = await POST(makeRequest({ proId: "p1", action: "refuse" }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toContain("motif");
  });

  it("refuse un pro avec motif fourni", async () => {
    verifyAuth.mockResolvedValue({ uid: "admin1", role: "admin" });
    mockOnce.mockResolvedValue({
      exists: () => true,
      val: () => ({ status: "pending" }),
    });
    mockUpdate.mockResolvedValue();

    const res = await POST(
      makeRequest({
        proId: "p1",
        action: "refuse",
        reason: "Certificats insuffisants",
      }),
    );
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.data.status).toBe("refused");
  });
});
