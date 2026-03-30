import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../../hooks/useAuth";

describe("ProtectedRoute", () => {
  it("affiche les enfants si l'utilisateur est connecté", () => {
    useAuth.mockReturnValue({ user: { uid: "u1" }, loading: false });
    render(
      <ProtectedRoute>
        <div>Contenu protégé</div>
      </ProtectedRoute>,
    );
    expect(screen.getByText("Contenu protégé")).toBeInTheDocument();
  });

  it("redirige vers /login si non connecté", () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    render(
      <ProtectedRoute>
        <div>Contenu protégé</div>
      </ProtectedRoute>,
    );
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("affiche un état de chargement pendant la vérification", () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    const { container } = render(
      <ProtectedRoute>
        <div>Contenu protégé</div>
      </ProtectedRoute>,
    );
    expect(screen.queryByText("Contenu protégé")).not.toBeInTheDocument();
    expect(container.textContent).toContain("Chargement");
  });
});
