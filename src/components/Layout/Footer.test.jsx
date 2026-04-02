import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Footer", () => {
  it("affiche le logo EasyPiano", () => {
    render(<Footer />);
    expect(screen.getByText("EasyPiano")).toBeInTheDocument();
  });

  it("affiche le lien 'Trouver un accordeur'", () => {
    render(<Footer />);
    expect(screen.getByText("Trouver un accordeur")).toBeInTheDocument();
  });

  it("affiche le lien 'Devenez accordeur'", () => {
    render(<Footer />);
    expect(screen.getByText("Devenez accordeur")).toBeInTheDocument();
  });

  it("affiche le lien 'Connexion'", () => {
    render(<Footer />);
    expect(screen.getByText("Connexion")).toBeInTheDocument();
  });

  it("affiche l'email de contact", () => {
    render(<Footer />);
    expect(screen.getByText("contact@easypiano.ch")).toBeInTheDocument();
    expect(
      screen.getByText("contact@easypiano.ch").closest("a"),
    ).toHaveAttribute("href", "mailto:contact@easypiano.ch");
  });

  it("applique les états interactifs partagés aux liens du footer", () => {
    render(<Footer />);
    expect(screen.getByText("Trouver un accordeur").closest("a")).toHaveClass(
      "hover:bg-card",
      "active:bg-card/80",
      "focus-visible:ring-2",
    );
    expect(screen.getByText("Devenez accordeur").closest("a")).toHaveClass(
      "hover:bg-accent/10",
      "active:bg-accent/5",
      "focus-visible:ring-2",
    );
  });

  it("affiche 'Mentions légales'", () => {
    render(<Footer />);
    expect(screen.getByText("Mentions légales")).toBeInTheDocument();
  });

  it("affiche le copyright avec l'année courante", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`${year}.*EasyPiano`)),
    ).toBeInTheDocument();
  });
});
