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

  it("affiche des suggestions dès 1 caractère (ville)", () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Lau" } });
    expect(screen.getAllByText("📍 Lausanne").length).toBeGreaterThanOrEqual(1);
  });

  it("affiche des suggestions par code postal", () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "1000" } });
    expect(screen.getByText("📍 Lausanne")).toBeInTheDocument();
  });

  it("affiche le code postal et la région dans les suggestions", () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Genève" } });
    expect(screen.getByText("1201 · GE")).toBeInTheDocument();
  });

  it("sélectionne une suggestion au clic avec ville et postal", () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Genève" } });
    fireEvent.mouseDown(screen.getAllByText("📍 Genève")[0]);

    expect(input.value).toBe("Genève (1201)");
  });

  it("ne montre pas de suggestions pour 0 caractère", () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("navigue avec les flèches clavier", () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "L" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(input.value).toContain("Lausanne");
  });

  it("ferme les suggestions avec Escape", () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "L" } });
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
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
