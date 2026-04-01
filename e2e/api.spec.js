import { test, expect } from "@playwright/test";

test.describe("API Routes", () => {
  test("GET /api/health retourne status ok", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe("ok");
  });

  test("POST /api/search retourne 400 sans paramètres", async ({ request }) => {
    const response = await request.post("/api/search", {
      data: {},
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test("POST /api/booking/create retourne 401 sans auth", async ({ request }) => {
    const response = await request.post("/api/booking/create", {
      data: { proId: "test", date: "2026-05-01", slot: "morning" },
    });
    expect(response.status()).toBe(401);
  });

  test("POST /api/reviews/create retourne 401 sans auth", async ({ request }) => {
    const response = await request.post("/api/reviews/create", {
      data: { bookingId: "test", rating: 5 },
    });
    expect(response.status()).toBe(401);
  });

  test("GET /api/user/profile retourne 401 sans auth", async ({ request }) => {
    const response = await request.get("/api/user/profile");
    expect(response.status()).toBe(401);
  });

  test("POST /api/checkout retourne 401 sans auth", async ({ request }) => {
    const response = await request.post("/api/checkout", {
      data: { proId: "test", date: "2026-05-01", slot: "morning" },
    });
    expect(response.status()).toBe(401);
  });

  test("POST /api/admin/validate-pro retourne 401 sans auth", async ({ request }) => {
    const response = await request.post("/api/admin/validate-pro", {
      data: { proId: "test", action: "validate" },
    });
    expect(response.status()).toBe(401);
  });

  test("GET /api/admin/analytics retourne 401 sans auth", async ({ request }) => {
    const response = await request.get("/api/admin/analytics");
    expect(response.status()).toBe(401);
  });
});
