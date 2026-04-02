import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

  it("affiche des suggestions dès 1 caractère (ville)", async () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "L" } });

    expect((await screen.findAllByText("Lausanne")).length).toBeGreaterThan(0);
  });

  it("affiche des suggestions par code postal", async () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "1000" } });

    expect(await screen.findByText("Lausanne")).toBeInTheDocument();
  });

  it("affiche le code postal et la région dans les suggestions", async () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Genève" } });

    expect(await screen.findByText("1201 · GE")).toBeInTheDocument();
  });

  it("sélectionne une suggestion au clic avec ville et postal", async () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Genève" } });

    const geneveSuggestion = (await screen.findAllByText("Genève"))[0].closest(
      "button",
    );
    fireEvent.click(geneveSuggestion);

    expect(input.value).toBe("Genève 1201");
  });

  it("ne montre pas de suggestions pour 0 caractère", () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("navigue avec les flèches clavier", async () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Laus" } });
    await screen.findByRole("listbox");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(input.value).toBe("Lausanne 1000");
  });

  it("ferme les suggestions avec Escape", async () => {
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "L" } });
    await screen.findByRole("listbox");

    fireEvent.keyDown(input, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("redirige vers /search au submit", () => {
    mockPush.mockClear();
    render(<HeroSearchBar />);
    const input = screen.getByLabelText("Lieu de recherche");
    fireEvent.change(input, { target: { value: "Lausanne 1000" } });

    fireEvent.submit(
      screen.getByRole("button", { name: /rechercher/i }).closest("form"),
    );

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("/search?lieu=Lausanne+1000"),
    );
  });

  it("peut être réutilisé en mode page avec un submit contrôlé", () => {
    const onSubmit = vi.fn();

    render(
      <HeroSearchBar
        variant="page"
        locationValue="Genève 1201"
        dateValue="2026-11-11"
        onLocationChange={vi.fn()}
        onDateChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.submit(
      screen.getByRole("button", { name: /rechercher/i }).closest("form"),
    );

    expect(onSubmit).toHaveBeenCalledWith({
      location: "Genève 1201",
      date: "2026-11-11",
    });
  });

  it("rend le champ et la liste d'autocomplétion opaques sur la page de recherche", async () => {
    render(<HeroSearchBar variant="page" />);

    const input = screen.getByLabelText("Lieu de recherche");
    expect(input).toHaveClass("bg-background");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Gene" } });

    const listbox = await screen.findByRole("listbox");
    expect(listbox).toHaveClass(
      "bg-background",
      "shadow-[0_24px_48px_rgba(0,0,0,0.52)]",
    );
  });
});
