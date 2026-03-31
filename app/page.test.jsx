import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock ScrollReveal (pas de Framer Motion en test)
vi.mock("@/components/animations/ScrollReveal", () => ({
  ScrollReveal: ({ children }) => (
    <div data-testid="scroll-reveal">{children}</div>
  ),
}));

// Mock HeroReveal animations
vi.mock("@/components/animations/HeroReveal", () => ({
  HeroReveal: ({ children }) => <div>{children}</div>,
  HeroSearchReveal: ({ children }) => <div>{children}</div>,
  ScrollIndicator: () => null,
}));

// Mock HeroSearchBar (client component)
vi.mock("@/components/HeroSearchBar", () => ({
  HeroSearchBar: () => (
    <form action="/search">
      <input aria-label="Lieu de recherche" />
      <input aria-label="Date souhaitée" />
      <button>Rechercher</button>
    </form>
  ),
}));

describe("HomePage", () => {
  it("affiche le titre 'On accorde votre piano'", () => {
    render(<HomePage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/on accorde/i);
    expect(heading).toHaveTextContent(/votre piano/i);
  });

  it("affiche la barre de recherche avec champ lieu et date", () => {
    render(<HomePage />);
    expect(screen.getByLabelText("Lieu de recherche")).toBeInTheDocument();
    expect(screen.getByLabelText("Date souhaitée")).toBeInTheDocument();
  });

  it("affiche le bouton Rechercher", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("button", { name: /rechercher/i }),
    ).toBeInTheDocument();
  });

  it("la barre de recherche redirige vers /search", () => {
    render(<HomePage />);
    const form = screen.getByLabelText("Lieu de recherche").closest("form");
    expect(form).toHaveAttribute("action", "/search");
  });

  it("affiche les 3 étapes 'Comment ça marche'", () => {
    render(<HomePage />);
    expect(screen.getByText("Comment ça marche ?")).toBeInTheDocument();
    expect(screen.getByText("Recherchez")).toBeInTheDocument();
    expect(screen.getByText("Réservez")).toBeInTheDocument();
    expect(screen.getByText("Profitez")).toBeInTheDocument();
  });

  it("affiche les numéros des étapes (1, 2, 3)", () => {
    render(<HomePage />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("affiche la section 'Pourquoi nous faire confiance'", () => {
    render(<HomePage />);
    expect(
      screen.getByText("Pourquoi nous faire confiance ?"),
    ).toBeInTheDocument();
  });

  it("affiche les 4 trust items", () => {
    render(<HomePage />);
    expect(screen.getByText("Pros vérifiés")).toBeInTheDocument();
    expect(screen.getByText("Prix fixe 150 CHF")).toBeInTheDocument();
    expect(screen.getByText("Paiement sécurisé")).toBeInTheDocument();
    expect(screen.getByText("Booking instantané")).toBeInTheDocument();
  });

  it("affiche la section CTA 'Devenez accordeur'", () => {
    render(<HomePage />);
    expect(
      screen.getByText("Vous êtes accordeur de piano ?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Devenez accordeur")).toBeInTheDocument();
  });

  it("le lien 'Devenez accordeur' pointe vers /login", () => {
    render(<HomePage />);
    const link = screen.getByText("Devenez accordeur");
    expect(link.closest("a")).toHaveAttribute("href", "/login");
  });

  it("utilise des ScrollReveal pour les animations", () => {
    render(<HomePage />);
    const reveals = screen.getAllByTestId("scroll-reveal");
    expect(reveals.length).toBeGreaterThanOrEqual(4);
  });
});
