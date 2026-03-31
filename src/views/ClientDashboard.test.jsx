import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

function createResponse(payload, ok = true) {
  return {
    ok,
    json: () => Promise.resolve(payload),
  };
}

describe("ClientDashboard", () => {
  const mockUser = {
    uid: "u1",
    getIdToken: vi.fn().mockResolvedValue("token-123"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
    useAuth.mockReturnValue({ user: mockUser });
  });

  it("affiche 'Chargement...' pendant le fetch", () => {
    globalThis.fetch.mockReturnValue(new Promise(() => {})); // jamais résolu
    render(<ClientDashboard />);
    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("affiche le titre 'Mes rendez-vous'", async () => {
    globalThis.fetch.mockResolvedValue(createResponse({ data: { items: [] } }));
    render(<ClientDashboard />);

    expect(
      await screen.findByRole("heading", { name: /mes rendez-vous/i }),
    ).toBeInTheDocument();
  });

  it("affiche les boutons de filtre", async () => {
    globalThis.fetch.mockResolvedValue(createResponse({ data: { items: [] } }));
    render(<ClientDashboard />);

    expect(await screen.findByText("Tous")).toBeInTheDocument();
    expect(screen.getByText("Confirmé")).toBeInTheDocument();
    expect(screen.getByText("En cours")).toBeInTheDocument();
    expect(screen.getByText("Terminé")).toBeInTheDocument();
    expect(screen.getByText("Annulé")).toBeInTheDocument();
  });

  it("affiche un message si aucune réservation", async () => {
    globalThis.fetch.mockResolvedValue(createResponse({ data: { items: [] } }));
    render(<ClientDashboard />);

    expect(await screen.findByText(/aucune réservation/i)).toBeInTheDocument();
  });

  it("affiche un lien 'Trouver un accordeur' si vide", async () => {
    globalThis.fetch.mockResolvedValue(createResponse({ data: { items: [] } }));
    render(<ClientDashboard />);

    const link = await screen.findByText("Trouver un accordeur");
    expect(link.closest("a")).toHaveAttribute("href", "/search");
  });

  it("affiche les réservations avec date, prix et nom du pro", async () => {
    globalThis.fetch.mockResolvedValue(
      createResponse({
        data: {
          items: [
            {
              bookingId: "b1",
              date: "2026-04-15",
              slot: "morning",
              addressCity: "Lausanne",
              price: 15000,
              status: "confirmed",
              proName: "Clara Stein",
              proPhotoURL: null,
              maintenanceReportExists: false,
            },
          ],
        },
      }),
    );
    render(<ClientDashboard />);

    expect(await screen.findByText(/2026-04-15/)).toBeInTheDocument();
    expect(screen.getAllByText("15000 CHF").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Clara Stein")).toBeInTheDocument();
    // "Confirmé" apparaît dans le filtre ET le badge
    expect(screen.getAllByText("Confirmé").length).toBeGreaterThanOrEqual(2);
  });

  it("filtre les réservations par statut", async () => {
    globalThis.fetch.mockResolvedValue(
      createResponse({
        data: {
          items: [
            {
              bookingId: "b1",
              date: "2026-04-15",
              slot: "morning",
              addressCity: "A",
              price: 15000,
              status: "confirmed",
              proName: "Anna Key",
              proPhotoURL: null,
              maintenanceReportExists: false,
            },
            {
              bookingId: "b2",
              date: "2026-04-16",
              slot: "afternoon",
              addressCity: "B",
              price: 15000,
              status: "cancelled",
              proName: "Boris Tune",
              proPhotoURL: null,
              maintenanceReportExists: false,
            },
          ],
        },
      }),
    );
    render(<ClientDashboard />);

    // Attendre le chargement
    await screen.findByText(/2026-04-15/);

    // Au début, 2 bookings affichés
    const bookingCards = screen.getAllByRole("article");
    expect(bookingCards).toHaveLength(2);

    // Filtrer par "Annulé" → 1 seul booking
    fireEvent.click(screen.getAllByText("Annulé")[0]); // le bouton filtre
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Boris Tune")).toBeInTheDocument();
  });

  it("affiche un lien 'Laisser un avis' pour les réservations terminées", async () => {
    globalThis.fetch.mockResolvedValue(
      createResponse({
        data: {
          items: [
            {
              bookingId: "b1",
              date: "2026-04-15",
              slot: "morning",
              addressCity: "A",
              price: 15000,
              status: "completed",
              proName: "Lina Forte",
              proPhotoURL: null,
              maintenanceReportExists: false,
            },
          ],
        },
      }),
    );
    render(<ClientDashboard />);

    const reviewLink = await screen.findByText("Laisser un avis");
    expect(reviewLink.closest("a")).toHaveAttribute("href", "/review/b1");
  });

  it("affiche un bouton pour consulter le carnet d'entretien quand le rapport existe", async () => {
    globalThis.fetch.mockResolvedValue(
      createResponse({
        data: {
          items: [
            {
              bookingId: "b1",
              date: "2026-04-15",
              slot: "morning",
              addressCity: "A",
              price: 15000,
              status: "completed",
              proName: "Lina Forte",
              proPhotoURL: null,
              maintenanceReportExists: true,
            },
          ],
        },
      }),
    );

    render(<ClientDashboard />);

    expect(
      await screen.findByRole("button", {
        name: /voir le carnet d’entretien/i,
      }),
    ).toBeInTheDocument();
  });

  it("charge et affiche le carnet d'entretien dans une modale", async () => {
    globalThis.fetch
      .mockResolvedValueOnce(
        createResponse({
          data: {
            items: [
              {
                bookingId: "b1",
                date: "2026-04-15",
                slot: "morning",
                addressCity: "A",
                price: 15000,
                status: "completed",
                proName: "Lina Forte",
                proPhotoURL: null,
                maintenanceReportExists: true,
              },
            ],
          },
        }),
      )
      .mockResolvedValueOnce(
        createResponse({
          data: {
            condition: "Accordage stable, mécanique saine",
            recommendations: "Prévoir un contrôle d’humidité en hiver.",
            nextTuningDate: "2027-04-15",
            createdAt: "2026-04-15T10:30:00.000Z",
          },
        }),
      );

    render(<ClientDashboard />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: /voir le carnet d’entretien/i,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/accordage stable, mécanique saine/i),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(/prévoir un contrôle d’humidité en hiver/i),
    ).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      2,
      "/api/maintenance-report?bookingId=b1",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer token-123" }),
      }),
    );
  });

  it("affiche la politique d'annulation", async () => {
    globalThis.fetch.mockResolvedValue(createResponse({ data: { items: [] } }));
    render(<ClientDashboard />);

    expect(
      await screen.findByText(/annulation sans frais/i),
    ).toBeInTheDocument();
  });
});
