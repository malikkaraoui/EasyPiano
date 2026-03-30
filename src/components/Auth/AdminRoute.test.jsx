import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminRoute from "./AdminRoute";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../../hooks/useAuth";

describe("AdminRoute", () => {
  it("affiche les enfants si l'utilisateur est admin", () => {
    useAuth.mockReturnValue({
      user: { uid: "a1" },
      isAdmin: true,
      loading: false,
    });
    render(
      <AdminRoute>
        <div>Contenu admin</div>
      </AdminRoute>,
    );
    expect(screen.getByText("Contenu admin")).toBeInTheDocument();
  });

  it("redirige vers / si connecté mais pas admin", () => {
    useAuth.mockReturnValue({
      user: { uid: "u1" },
      isAdmin: false,
      loading: false,
    });
    render(
      <AdminRoute>
        <div>Contenu admin</div>
      </AdminRoute>,
    );
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("redirige vers /login si non connecté", () => {
    useAuth.mockReturnValue({ user: null, isAdmin: false, loading: false });
    render(
      <AdminRoute>
        <div>Contenu admin</div>
      </AdminRoute>,
    );
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("affiche un état de chargement pendant la vérification", () => {
    useAuth.mockReturnValue({ user: null, isAdmin: false, loading: true });
    render(
      <AdminRoute>
        <div>Contenu admin</div>
      </AdminRoute>,
    );
    expect(screen.queryByText("Contenu admin")).not.toBeInTheDocument();
  });
});
