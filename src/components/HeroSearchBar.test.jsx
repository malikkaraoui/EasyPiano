import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeroSearchBar } from "./HeroSearchBar";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/components/UI/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock("lucide-react", () => ({
  Search: () => <svg data-testid="search-icon" />,
}));

describe("HeroSearchBar", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche le champ lieu avec placeholder", () => {
    render(<HeroSearchBar />);
    expect(screen.getByLabelText("Lieu de recherche")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ville ou code postal"),
    ).toBeInTheDocument();
  });

  it("affiche le champ date", () => {
    render(<HeroSearchBar />);
    expect(screen.getByLabelText("Date souhaitée")).toBeInTheDocument();
  });

  it("le champ date a une date min = aujourd'hui", () => {
    render(<HeroSearchBar />);
    const dateInput = screen.getByLabelText("Date souhaitée");
    const today = new Date().toISOString().split("T")[0];
    expect(dateInput).toHaveAttribute("min", today);
  });

  it("affiche le bouton Rechercher", () => {
    render(<HeroSearchBar />);
    expect(
      screen.getByRole("button", { name: /rechercher/i }),
    ).toBeInTheDocument();
  });

  it("affiche des suggestions en tapant une ville", () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.change(input, { target: { value: "Lau" } });
    expect(screen.getByText("📍 Lausanne")).toBeInTheDocument();
  });

  it("sélectionne une suggestion au clic", () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.change(input, { target: { value: "Gen" } });
    fireEvent.mouseDown(screen.getByText("📍 Genève"));

    expect(input.value).toBe("Genève");
  });

  it("ne montre pas de suggestions pour moins de 2 caractères", () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.change(input, { target: { value: "L" } });
    expect(screen.queryByText("📍 Lausanne")).not.toBeInTheDocument();
  });

  it("redirige vers /search au submit", () => {
    mockPush.mockClear();
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");
    fireEvent.change(input, { target: { value: "Lausanne" } });

    fireEvent.submit(
      screen.getByRole("button", { name: /rechercher/i }).closest("form"),
    );

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("/search?lieu=Lausanne"),
    );
  });
});
