import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/services/auth-server", () => ({
  verifyAuth: vi.fn(),
}));

const mockSet = vi.fn();
const mockPushRef = { key: "pro-abc123", set: mockSet };

vi.mock("@/services/firebase-admin-db", () => ({
  getAdminDb: () => ({
    ref: () => ({ push: () => mockPushRef }),
  }),
}));

import { verifyAuth } from "@/services/auth-server";

function makeRequest(body) {
  return {
    headers: { get: () => "Bearer token" },
    json: () => Promise.resolve(body),
  };
}

const validBody = {
  bio: "Accordeur depuis 12 ans, conservatoire de Cracovie",
  email: "tomasz@example.com",
  country: "PL",
  languages: ["fr", "en", "pl"],
  phone: "+48123456789",
};

describe("POST /api/pros/register", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retourne 401 si non authentifié", async () => {
    verifyAuth.mockResolvedValue(null);
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(401);
  });

  it("retourne 400 si bio manquante", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    const res = await POST(makeRequest({ ...validBody, bio: "" }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toContain("bio");
  });

  it("retourne 400 si email manquant", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    const res = await POST(makeRequest({ ...validBody, email: "" }));
    expect(res.status).toBe(400);
  });

  it("retourne 400 si languages vide", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    const res = await POST(makeRequest({ ...validBody, languages: [] }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toContain("langue");
  });

  it("crée le pro avec status 'pending' et retourne 201", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    mockSet.mockResolvedValue();

    const res = await POST(makeRequest(validBody));
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.data.proId).toBe("pro-abc123");
    expect(body.data.status).toBe("pending");
  });

  it("stocke userId, status pending, stats initialisées", async () => {
    verifyAuth.mockResolvedValue({ uid: "user42" });
    mockSet.mockResolvedValue();

    await POST(makeRequest(validBody));

    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user42",
        status: "pending",
        stripeOnboardingComplete: false,
        stats: { totalBookings: 0, averageRating: 0, totalReviews: 0 },
      }),
    );
  });

  it("accepte les champs optionnels", async () => {
    verifyAuth.mockResolvedValue({ uid: "u1" });
    mockSet.mockResolvedValue();

    const res = await POST(
      makeRequest({
        ...validBody,
        videoURL: "https://youtube.com/watch?v=123",
        certificates: [{ name: "Diplôme", fileURL: "url" }],
      }),
    );
    expect(res.status).toBe(201);
    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        videoURL: "https://youtube.com/watch?v=123",
      }),
    );
  });
});
