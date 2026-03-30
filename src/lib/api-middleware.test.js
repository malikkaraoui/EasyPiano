import { describe, it, expect, vi, beforeEach } from "vitest";
import { withAuth } from "./api-middleware";

// Mock auth-server
vi.mock("@/services/auth-server", () => ({
  verifyAuth: vi.fn(),
}));

import { verifyAuth } from "@/services/auth-server";

function makeRequest() {
  return {
    headers: { get: () => "Bearer test-token" },
  };
}

describe("withAuth middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne 401 si l'utilisateur n'est pas authentifié", async () => {
    verifyAuth.mockResolvedValue(null);

    const handler = vi.fn();
    const wrappedHandler = withAuth(handler);
    const response = await wrappedHandler(makeRequest());
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Non autorisé");
    expect(handler).not.toHaveBeenCalled();
  });

  it("appelle le handler avec l'utilisateur si authentifié", async () => {
    const user = { uid: "u1", email: "a@b.com", role: "client" };
    verifyAuth.mockResolvedValue(user);

    const handler = vi
      .fn()
      .mockResolvedValue(
        Response.json({ success: true, data: { ok: true }, error: null }),
      );
    const wrappedHandler = withAuth(handler);
    const request = makeRequest();
    const response = await wrappedHandler(request);
    const body = await response.json();

    expect(handler).toHaveBeenCalledWith(request, user);
    expect(body.success).toBe(true);
  });

  it("retourne 403 si le rôle ne correspond pas", async () => {
    const user = { uid: "u1", email: "a@b.com", role: "client" };
    verifyAuth.mockResolvedValue(user);

    const handler = vi.fn();
    const wrappedHandler = withAuth(handler, { role: "admin" });
    const response = await wrappedHandler(makeRequest());
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error).toBe("Accès refusé");
    expect(handler).not.toHaveBeenCalled();
  });

  it("passe si le rôle correspond", async () => {
    const user = { uid: "u1", email: "a@b.com", role: "admin" };
    verifyAuth.mockResolvedValue(user);

    const handler = vi
      .fn()
      .mockResolvedValue(
        Response.json({ success: true, data: null, error: null }),
      );
    const wrappedHandler = withAuth(handler, { role: "admin" });
    await wrappedHandler(makeRequest());

    expect(handler).toHaveBeenCalledWith(expect.anything(), user);
  });

  it("passe sans vérification de rôle si pas d'option role", async () => {
    const user = { uid: "u1", email: "a@b.com", role: "pro" };
    verifyAuth.mockResolvedValue(user);

    const handler = vi
      .fn()
      .mockResolvedValue(
        Response.json({ success: true, data: null, error: null }),
      );
    const wrappedHandler = withAuth(handler);
    await wrappedHandler(makeRequest());

    expect(handler).toHaveBeenCalled();
  });
});
