import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ClientDashboard from "./ClientDashboard";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../services/database", () => ({
  getBookingsByClient: vi.fn(),
}));

vi.mock("../utils/format", () => ({
  formatPrice: (price) => `${price} CHF`,
  formatDate: (date) => date,
}));

vi.mock("@shared/constants/businessRules", () => ({
  BUSINESS_RULES: {
    CANCELLATION: { FREE_CANCELLATION_DAYS: 10 },
  },
}));

import { useAuth } from "../hooks/useAuth";
import { getBookingsByClient } from "../services/database";

describe("ClientDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: { uid: "u1" } });
  });

  it("affiche 'Chargement...' pendant le fetch", () => {
    getBookingsByClient.mockReturnValue(new Promise(() => {})); // jamais résolu
    render(<ClientDashboard />);
    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("affiche le titre 'Mes rendez-vous'", async () => {
    getBookingsByClient.mockResolvedValue([]);
    render(<ClientDashboard />);

    expect(
      await screen.findByRole("heading", { name: /mes rendez-vous/i }),
    ).toBeInTheDocument();
  });

  it("affiche les boutons de filtre", async () => {
    getBookingsByClient.mockResolvedValue([]);
    render(<ClientDashboard />);

    expect(await screen.findByText("Tous")).toBeInTheDocument();
    expect(screen.getByText("Confirmé")).toBeInTheDocument();
    expect(screen.getByText("Terminé")).toBeInTheDocument();
    expect(screen.getByText("Annulé")).toBeInTheDocument();
  });

  it("affiche un message si aucune réservation", async () => {
    getBookingsByClient.mockResolvedValue([]);
    render(<ClientDashboard />);

    expect(await screen.findByText(/aucune réservation/i)).toBeInTheDocument();
  });

  it("affiche un lien 'Trouver un accordeur' si vide", async () => {
    getBookingsByClient.mockResolvedValue([]);
    render(<ClientDashboard />);

    const link = await screen.findByText("Trouver un accordeur");
    expect(link.closest("a")).toHaveAttribute("href", "/search");
  });

  it("affiche les réservations avec date et prix", async () => {
    getBookingsByClient.mockResolvedValue([
      {
        id: "b1",
        scheduledDate: "2026-04-15",
        scheduledTime: "09:00",
        address: "Lausanne",
        amount: 150,
        status: "confirmed",
      },
    ]);
    render(<ClientDashboard />);

    expect(await screen.findByText(/2026-04-15/)).toBeInTheDocument();
    expect(screen.getAllByText("150 CHF").length).toBeGreaterThanOrEqual(1);
    // "Confirmé" apparaît dans le filtre ET le badge
    expect(screen.getAllByText("Confirmé").length).toBeGreaterThanOrEqual(2);
  });

  it("filtre les réservations par statut", async () => {
    getBookingsByClient.mockResolvedValue([
      {
        id: "b1",
        scheduledDate: "2026-04-15",
        scheduledTime: "09:00",
        address: "A",
        amount: 150,
        status: "confirmed",
      },
      {
        id: "b2",
        scheduledDate: "2026-04-16",
        scheduledTime: "14:00",
        address: "B",
        amount: 150,
        status: "cancelled",
      },
    ]);
    render(<ClientDashboard />);

    // Attendre le chargement
    await screen.findByText(/2026-04-15/);

    // Au début, 2 bookings affichés
    const bookingCards = screen.getAllByText("Accord de piano");
    expect(bookingCards).toHaveLength(2);

    // Filtrer par "Annulé" → 1 seul booking
    fireEvent.click(screen.getAllByText("Annulé")[0]); // le bouton filtre
    expect(screen.getAllByText("Accord de piano")).toHaveLength(1);
  });

  it("affiche un lien 'Laisser un avis' pour les réservations terminées", async () => {
    getBookingsByClient.mockResolvedValue([
      {
        id: "b1",
        scheduledDate: "2026-04-15",
        scheduledTime: "09:00",
        address: "A",
        amount: 150,
        status: "completed",
      },
    ]);
    render(<ClientDashboard />);

    const reviewLink = await screen.findByText("Laisser un avis");
    expect(reviewLink.closest("a")).toHaveAttribute("href", "/review/b1");
  });

  it("affiche la politique d'annulation", async () => {
    getBookingsByClient.mockResolvedValue([]);
    render(<ClientDashboard />);

    expect(
      await screen.findByText(/annulation sans frais/i),
    ).toBeInTheDocument();
  });
});
