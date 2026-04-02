import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Search from "./Search";
import { getActiveProfessionals } from "../services/database";

const mockPush = vi.fn();
const mockReplace = vi.fn();
let currentSearchParams = new URLSearchParams();

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  usePathname: () => "/search",
  useSearchParams: () => currentSearchParams,
}));

vi.mock("../services/database", () => ({
  getActiveProfessionals: vi.fn(),
}));

describe("Search view", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentSearchParams = new URLSearchParams(
      "lieu=Lausanne+1000&date=2026-11-11&sort=price",
    );
  });

  it("réutilise la même barre de recherche et hydrate les filtres depuis l'URL", async () => {
    getActiveProfessionals.mockResolvedValue([
      {
        id: "pro-1",
        firstName: "Alice",
        lastName: "Martin",
        city: "Lausanne",
        postalCode: "1000",
        rating: 4.8,
        reviewCount: 12,
        basePrice: 120,
        photoURL: "",
      },
      {
        id: "pro-2",
        firstName: "Bruno",
        lastName: "Durand",
        city: "Genève",
        postalCode: "1201",
        rating: 4.9,
        reviewCount: 18,
        basePrice: 150,
        photoURL: "",
      },
    ]);

    render(<Search />);

    await screen.findByText("Alice Martin");

    expect(screen.getByLabelText("Lieu de recherche")).toHaveValue(
      "Lausanne 1000",
    );
    expect(screen.getByLabelText("Date souhaitée")).toHaveValue("2026-11-11");
    expect(screen.getByDisplayValue("Prix croissant")).toBeInTheDocument();
    expect(screen.getByText("Alice Martin")).toBeInTheDocument();
    expect(screen.queryByText("Bruno Durand")).not.toBeInTheDocument();
  });

  it("met à jour l'URL quand le tri change", async () => {
    getActiveProfessionals.mockResolvedValue([
      {
        id: "pro-1",
        firstName: "Alice",
        lastName: "Martin",
        city: "Lausanne",
        postalCode: "1000",
        rating: 4.8,
        reviewCount: 12,
        basePrice: 120,
        photoURL: "",
      },
    ]);

    render(<Search />);

    await screen.findByText("Alice Martin");
    fireEvent.change(screen.getByDisplayValue("Prix croissant"), {
      target: { value: "reviews" },
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining("sort=reviews"),
      );
    });
  });

  it("repart de l'URL quand les query params changent", async () => {
    getActiveProfessionals.mockResolvedValue([
      {
        id: "pro-1",
        firstName: "Alice",
        lastName: "Martin",
        city: "Lausanne",
        postalCode: "1000",
        rating: 4.8,
        reviewCount: 12,
        basePrice: 120,
        photoURL: "",
      },
      {
        id: "pro-2",
        firstName: "Bruno",
        lastName: "Durand",
        city: "Genève",
        postalCode: "1201",
        rating: 4.9,
        reviewCount: 18,
        basePrice: 150,
        photoURL: "",
      },
    ]);

    const { rerender } = render(<Search />);

    await screen.findByText("Alice Martin");

    currentSearchParams = new URLSearchParams(
      "lieu=Gen%C3%A8ve+1201&date=2027-01-10&sort=reviews",
    );
    rerender(<Search />);

    await waitFor(() => {
      expect(screen.getByLabelText("Lieu de recherche")).toHaveValue(
        "Genève 1201",
      );
    });

    expect(screen.getByLabelText("Date souhaitée")).toHaveValue("2027-01-10");
    expect(screen.getByDisplayValue("Plus d'avis")).toBeInTheDocument();
    expect(screen.getByText("Bruno Durand")).toBeInTheDocument();
    expect(screen.queryByText("Alice Martin")).not.toBeInTheDocument();
  });
});
