import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Header from "./Header";

// Mock useAuth
vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../services/auth", () => ({
  logout: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { useAuth } from "../../hooks/useAuth";

describe("Header", () => {
  it("affiche le logo EasyPiano", () => {
    useAuth.mockReturnValue({ user: null, isAdmin: false, isPro: false });
    render(<Header />);
    expect(screen.getByText("EasyPiano")).toBeInTheDocument();
  });

  it("affiche le lien 'Connexion' quand pas authentifié", () => {
    useAuth.mockReturnValue({ user: null, isAdmin: false, isPro: false });
    render(<Header />);
    expect(screen.getByText("Connexion")).toBeInTheDocument();
    expect(screen.getByText("Connexion").closest("a")).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("affiche 'Mes rendez-vous' et 'Déconnexion' quand authentifié", () => {
    useAuth.mockReturnValue({
      user: { displayName: "Test", photoURL: null },
      isAdmin: false,
      isPro: false,
    });
    render(<Header />);
    expect(screen.getByText("Mes rendez-vous")).toBeInTheDocument();
    expect(screen.getByText("Déconnexion")).toBeInTheDocument();
  });

  it("affiche le lien Dashboard pro pour un accordeur", () => {
    useAuth.mockReturnValue({
      user: { displayName: "Tomasz", photoURL: null },
      isAdmin: false,
      isPro: true,
    });
    render(<Header />);
    expect(screen.getByText("Dashboard pro").closest("a")).toHaveAttribute(
      "href",
      "/pro-dashboard",
    );
  });

  it("affiche le lien Admin quand isAdmin=true", () => {
    useAuth.mockReturnValue({
      user: { displayName: "Admin", photoURL: null },
      isAdmin: true,
      isPro: false,
    });
    render(<Header />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Admin").closest("a")).toHaveAttribute(
      "href",
      "/admin",
    );
  });

  it("n'affiche pas le lien Admin quand isAdmin=false", () => {
    useAuth.mockReturnValue({
      user: { displayName: "User", photoURL: null },
      isAdmin: false,
      isPro: false,
    });
    render(<Header />);
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("affiche l'avatar quand photoURL est défini", () => {
    useAuth.mockReturnValue({
      user: { displayName: "User", photoURL: "https://example.com/photo.jpg" },
      isAdmin: false,
      isPro: false,
    });
    render(<Header />);
    const avatar = screen.getByAltText("User");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "https://example.com/photo.jpg");
  });

  it("affiche des initiales si l'image de profil échoue", () => {
    useAuth.mockReturnValue({
      user: {
        displayName: "User Test",
        photoURL: "https://example.com/photo.jpg",
      },
      isAdmin: false,
      isPro: false,
    });
    render(<Header />);

    fireEvent.error(screen.getByAltText("User Test"));

    expect(screen.getByText("UT")).toBeInTheDocument();
  });

  it("contient un nav avec aria-label", () => {
    useAuth.mockReturnValue({ user: null, isAdmin: false, isPro: false });
    render(<Header />);
    expect(screen.getByLabelText("Navigation principale")).toBeInTheDocument();
  });
});
