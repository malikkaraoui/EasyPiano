import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/health", () => {
  it("retourne status 200 avec format standard", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual({ status: "ok" });
    expect(body.error).toBeNull();
  });

  it("retourne le format exact { success, data, error }", async () => {
    const response = await GET();
    const body = await response.json();

    expect(Object.keys(body)).toEqual(
      expect.arrayContaining(["success", "data", "error"]),
    );
  });
});
