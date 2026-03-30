import { describe, it, expect } from "vitest";
import {
  successResponse,
  errorResponse,
  createdResponse,
} from "./api-response";

describe("successResponse", () => {
  it("retourne le format standard avec data", async () => {
    const response = successResponse({ status: "ok" });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      success: true,
      data: { status: "ok" },
      error: null,
    });
  });

  it("accepte un status custom", async () => {
    const response = successResponse({ id: "123" }, 200);
    expect(response.status).toBe(200);
  });

  it("gère data null", async () => {
    const response = successResponse(null);
    const body = await response.json();

    expect(body).toEqual({ success: true, data: null, error: null });
  });

  it("gère un tableau comme data", async () => {
    const response = successResponse({ items: [1, 2, 3], total: 3 });
    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.data.items).toEqual([1, 2, 3]);
    expect(body.data.total).toBe(3);
  });
});

describe("errorResponse", () => {
  it("retourne le format standard avec erreur", async () => {
    const response = errorResponse("Erreur de validation");
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      data: null,
      error: "Erreur de validation",
    });
  });

  it("accepte un status 401 (non authentifié)", async () => {
    const response = errorResponse("Non autorisé", 401);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Non autorisé");
  });

  it("accepte un status 403 (accès refusé)", async () => {
    const response = errorResponse("Accès refusé", 403);
    expect(response.status).toBe(403);
  });

  it("accepte un status 404 (non trouvé)", async () => {
    const response = errorResponse("Ressource non trouvée", 404);
    expect(response.status).toBe(404);
  });

  it("accepte un status 500 (erreur serveur)", async () => {
    const response = errorResponse("Erreur interne du serveur", 500);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
  });
});

describe("createdResponse", () => {
  it("retourne status 201 avec data", async () => {
    const response = createdResponse({ id: "abc123" });
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({
      success: true,
      data: { id: "abc123" },
      error: null,
    });
  });
});
