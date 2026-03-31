import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ProDashboard from "./ProDashboard";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "@/hooks/useAuth";

describe("ProDashboard", () => {
  const mockUser = {
    uid: "u1",
    getIdToken: vi.fn().mockResolvedValue("token-123"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it("affiche l'état de validation en attente sans charger les données métier", () => {
    useAuth.mockReturnValue({
      user: mockUser,
      proProfile: {
        proId: "p1",
        status: "pending",
        stripeOnboardingComplete: false,
      },
    });

    render(<ProDashboard />);

    expect(
      screen.getByText(/Candidature en cours de validation/i),
    ).toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("charge les rendez-vous et disponibilités pour un pro validé", async () => {
    useAuth.mockReturnValue({
      user: mockUser,
      proProfile: {
        proId: "p1",
        status: "validated",
        stripeOnboardingComplete: true,
      },
    });

    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            items: [
              {
                bookingId: "b1",
                date: "2026-04-12",
                slot: "morning",
                status: "confirmed",
                price: 15000,
                addressCity: "Lausanne",
                addressVisible: false,
                address: null,
                revealAt: "2026-04-11T08:00:00.000Z",
              },
            ],
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            items: [
              {
                id: "a1",
                zone: "Lausanne",
                startDate: "2026-04-12",
                endDate: "2026-04-14",
                radiusKm: 40,
                capacityMorning: 1,
                capacityAfternoon: 2,
              },
            ],
          },
        }),
      });

    render(<ProDashboard />);

    expect(await screen.findByText(/Emploi du temps pro/i)).toBeInTheDocument();
    expect(screen.getByText(/adresse masquée/i)).toBeInTheDocument();
    expect(screen.getByText("Lausanne")).toBeInTheDocument();
    expect(screen.getByText(/Publier cette tournée/i)).toBeInTheDocument();
  });

  it("désactive la publication tant que Stripe Connect n'est pas configuré", async () => {
    useAuth.mockReturnValue({
      user: mockUser,
      proProfile: {
        proId: "p1",
        status: "validated",
        stripeOnboardingComplete: false,
      },
    });

    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { items: [] } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { items: [] } }),
      });

    render(<ProDashboard />);

    expect(
      await screen.findByText(/Activez Stripe Connect avant de publier/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Publier cette tournée/i }),
    ).toBeDisabled();
  });

  it("publie une nouvelle disponibilité", async () => {
    useAuth.mockReturnValue({
      user: mockUser,
      proProfile: {
        proId: "p1",
        status: "validated",
        stripeOnboardingComplete: true,
      },
    });

    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { items: [] } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { items: [] } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            id: "a1",
            zone: "Genève",
            startDate: "2026-05-01",
            endDate: "2026-05-03",
            radiusKm: 50,
            capacityMorning: 1,
            capacityAfternoon: 2,
          },
        }),
      });

    render(<ProDashboard />);

    await screen.findByText(/Emploi du temps pro/i);

    fireEvent.change(screen.getByLabelText(/Date de début/i), {
      target: { value: "2026-05-01" },
    });
    fireEvent.change(screen.getByLabelText(/Date de fin/i), {
      target: { value: "2026-05-03" },
    });
    fireEvent.change(screen.getByLabelText(/Zone de tournée/i), {
      target: { value: "Genève" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Publier cette tournée/i }),
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/availabilities",
        expect.objectContaining({ method: "POST" }),
      );
    });

    expect(await screen.findByText("Genève")).toBeInTheDocument();
  });

  it("permet de modifier une disponibilité déverrouillée", async () => {
    useAuth.mockReturnValue({
      user: mockUser,
      proProfile: {
        proId: "p1",
        status: "validated",
        stripeOnboardingComplete: true,
      },
    });

    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { items: [] } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            items: [
              {
                id: "a1",
                zone: "Lausanne",
                startDate: "2026-04-12",
                endDate: "2026-04-14",
                radiusKm: 40,
                capacityMorning: 1,
                capacityAfternoon: 2,
              },
            ],
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            id: "a1",
            zone: "Berne",
            startDate: "2026-04-12",
            endDate: "2026-04-14",
            radiusKm: 30,
            capacityMorning: 1,
            capacityAfternoon: 2,
          },
        }),
      });

    render(<ProDashboard />);

    await screen.findByText(/Disponibilités publiées/i);

    fireEvent.click(
      screen.getByRole("button", { name: /Modifier la tournée Lausanne/i }),
    );

    expect(
      screen.getByRole("button", { name: /Mettre à jour cette tournée/i }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Zone de tournée/i), {
      target: { value: "Berne" },
    });
    fireEvent.change(screen.getByLabelText(/Rayon \(km\)/i), {
      target: { value: "30" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Mettre à jour cette tournée/i }),
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/availabilities",
        expect.objectContaining({ method: "PUT" }),
      );
    });

    expect(await screen.findByText("Berne")).toBeInTheDocument();
  });

  it("bloque l'édition visuelle si une réservation confirmée existe sur la tournée", async () => {
    useAuth.mockReturnValue({
      user: mockUser,
      proProfile: {
        proId: "p1",
        status: "validated",
        stripeOnboardingComplete: true,
      },
    });

    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            items: [
              {
                bookingId: "b1",
                date: "2026-04-13",
                slot: "morning",
                status: "confirmed",
                price: 15000,
                addressCity: "Lausanne",
                addressVisible: false,
                address: null,
                revealAt: "2026-04-12T08:00:00.000Z",
              },
            ],
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            items: [
              {
                id: "a1",
                zone: "Lausanne",
                startDate: "2026-04-12",
                endDate: "2026-04-14",
                radiusKm: 40,
                capacityMorning: 1,
                capacityAfternoon: 2,
              },
            ],
          },
        }),
      });

    render(<ProDashboard />);

    expect(
      await screen.findByText(
        /réservation confirmée verrouille cette tournée/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Modifier la tournée Lausanne/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Supprimer la tournée Lausanne/i }),
    ).toBeDisabled();
  });

  it("permet de démarrer puis clôturer une intervention depuis le dashboard pro", async () => {
    useAuth.mockReturnValue({
      user: mockUser,
      proProfile: {
        proId: "p1",
        status: "validated",
        stripeOnboardingComplete: true,
      },
    });

    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            items: [
              {
                bookingId: "b1",
                date: "2026-04-12",
                slot: "morning",
                status: "in_progress",
                price: 15000,
                addressCity: "Lausanne",
                addressVisible: true,
                address: "Rue du Lac 5, Lausanne",
                revealAt: "2026-04-11T08:00:00.000Z",
                maintenanceReportExists: false,
              },
            ],
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { items: [] } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            bookingId: "b1",
            date: "2026-04-12",
            slot: "morning",
            status: "completed",
            price: 15000,
            addressCity: "Lausanne",
            addressVisible: false,
            address: null,
            revealAt: "2026-04-11T08:00:00.000Z",
            maintenanceReportExists: false,
          },
        }),
      });

    render(<ProDashboard />);

    await screen.findByText(/Marquer comme terminée/i);
    fireEvent.click(
      screen.getByRole("button", { name: /Marquer comme terminée/i }),
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/bookings/pro",
        expect.objectContaining({ method: "PATCH" }),
      );
    });

    expect(
      await screen.findByText(/Rapport post-intervention/i),
    ).toBeInTheDocument();
  });

  it("permet d'envoyer un rapport post-intervention", async () => {
    useAuth.mockReturnValue({
      user: mockUser,
      proProfile: {
        proId: "p1",
        status: "validated",
        stripeOnboardingComplete: true,
      },
    });

    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            items: [
              {
                bookingId: "b1",
                date: "2026-04-12",
                slot: "morning",
                status: "completed",
                price: 15000,
                addressCity: "Lausanne",
                addressVisible: false,
                address: null,
                revealAt: "2026-04-11T08:00:00.000Z",
                maintenanceReportExists: false,
              },
            ],
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { items: [] } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            bookingId: "b1",
            condition: "Accordage stable, mécanique saine",
            recommendations: "Revoir l'harmonisation dans 12 mois",
            nextTuningDate: "2027-04-15",
          },
        }),
      });

    render(<ProDashboard />);

    await screen.findByText(/Rédiger le rapport/i);
    fireEvent.click(
      screen.getByRole("button", { name: /Rédiger le rapport/i }),
    );

    fireEvent.change(screen.getByLabelText(/État du piano/i), {
      target: { value: "Accordage stable, mécanique saine" },
    });
    fireEvent.change(screen.getByLabelText(/Recommandations/i), {
      target: { value: "Revoir l'harmonisation dans 12 mois" },
    });
    fireEvent.change(screen.getByLabelText(/Prochain accordage conseillé/i), {
      target: { value: "2027-04-15" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Enregistrer le rapport/i }),
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/maintenance-report",
        expect.objectContaining({ method: "POST" }),
      );
    });

    expect(await screen.findByText(/Rapport envoyé/i)).toBeInTheDocument();
  });
});
