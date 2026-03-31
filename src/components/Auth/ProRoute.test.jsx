import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProRoute from "./ProRoute";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../../hooks/useAuth";

describe("ProRoute", () => {
  it("rend le contenu pour un pro authentifié", () => {
    useAuth.mockReturnValue({
      user: { uid: "u1" },
      isPro: true,
      loading: false,
    });

    render(
      <ProRoute>
        <div>Dashboard pro</div>
      </ProRoute>,
    );

    expect(screen.getByText("Dashboard pro")).toBeInTheDocument();
  });

  it("redirige vers /become-pro si l'utilisateur n'est pas pro", () => {
    useAuth.mockReturnValue({
      user: { uid: "u1" },
      isPro: false,
      loading: false,
    });

    render(
      <ProRoute>
        <div>Dashboard pro</div>
      </ProRoute>,
    );

    expect(mockReplace).toHaveBeenCalledWith("/become-pro");
  });

  it("redirige vers /login si non authentifié", () => {
    useAuth.mockReturnValue({ user: null, isPro: false, loading: false });

    render(
      <ProRoute>
        <div>Dashboard pro</div>
      </ProRoute>,
    );

    expect(mockReplace).toHaveBeenCalledWith("/login");
  });
});
