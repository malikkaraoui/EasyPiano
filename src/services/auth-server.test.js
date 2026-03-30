import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyAuth } from "./auth-server";

// Mock firebase-admin
vi.mock("./firebase-admin", () => ({
  getFirebaseAdmin: vi.fn(),
}));

import { getFirebaseAdmin } from "./firebase-admin";

function makeRequest(authHeader) {
  return {
    headers: {
      get: (name) => {
        if (name === "authorization") return authHeader;
        return null;
      },
    },
  };
}

describe("verifyAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne null si pas de header Authorization", async () => {
    const request = makeRequest(null);
    const result = await verifyAuth(request);
    expect(result).toBeNull();
  });

  it("retourne null si header ne commence pas par 'Bearer '", async () => {
    const request = makeRequest("Basic abc123");
    const result = await verifyAuth(request);
    expect(result).toBeNull();
  });

  it("retourne null si token vide après 'Bearer '", async () => {
    const request = makeRequest("Bearer ");
    const result = await verifyAuth(request);
    expect(result).toBeNull();
  });

  it("retourne null si Firebase Admin non initialisé", async () => {
    getFirebaseAdmin.mockReturnValue(null);
    const request = makeRequest("Bearer valid-token");
    const result = await verifyAuth(request);
    expect(result).toBeNull();
  });

  it("retourne les infos utilisateur si token valide", async () => {
    const mockAuth = {
      verifyIdToken: vi.fn().mockResolvedValue({
        uid: "user123",
        email: "test@example.com",
        role: "pro",
      }),
    };
    getFirebaseAdmin.mockReturnValue({ auth: mockAuth });

    const request = makeRequest("Bearer valid-token");
    const result = await verifyAuth(request);

    expect(result).toEqual({
      uid: "user123",
      email: "test@example.com",
      role: "pro",
    });
    expect(mockAuth.verifyIdToken).toHaveBeenCalledWith("valid-token");
  });

  it("retourne role 'client' par défaut si pas de custom claim", async () => {
    const mockAuth = {
      verifyIdToken: vi.fn().mockResolvedValue({
        uid: "user456",
        email: "client@example.com",
      }),
    };
    getFirebaseAdmin.mockReturnValue({ auth: mockAuth });

    const request = makeRequest("Bearer some-token");
    const result = await verifyAuth(request);

    expect(result.role).toBe("client");
  });

  it("retourne null si token invalide (Firebase rejette)", async () => {
    const mockAuth = {
      verifyIdToken: vi.fn().mockRejectedValue(new Error("Token expired")),
    };
    getFirebaseAdmin.mockReturnValue({ auth: mockAuth });

    const request = makeRequest("Bearer expired-token");
    const result = await verifyAuth(request);

    expect(result).toBeNull();
  });
});
