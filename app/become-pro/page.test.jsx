import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BecomeProPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@components/Auth/ProtectedRoute", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("@/components/UI/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/UI/input", () => ({
  Input: (props) => <input {...props} />,
}));

import { useAuth } from "@hooks/useAuth";

describe("BecomeProPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: {
        uid: "u1",
        email: "test@example.com",
        getIdToken: vi.fn().mockResolvedValue("token"),
      },
      loading: false,
    });
  });

  it("affiche le titre 'Devenez accordeur'", () => {
    render(<BecomeProPage />);
    expect(
      screen.getByRole("heading", { name: /devenez accordeur/i }),
    ).toBeInTheDocument();
  });

  it("affiche le champ 'Mon parcours' (bio)", () => {
    render(<BecomeProPage />);
    expect(screen.getByLabelText(/mon parcours/i)).toBeInTheDocument();
  });

  it("affiche le champ email pré-rempli", () => {
    render(<BecomeProPage />);
    const emailInput = screen.getByLabelText(/email professionnel/i);
    expect(emailInput.value).toBe("test@example.com");
  });

  it("affiche le sélecteur de pays", () => {
    render(<BecomeProPage />);
    expect(screen.getByLabelText(/pays de résidence/i)).toBeInTheDocument();
  });

  it("affiche le module téléphone partagé avec indicatif et numéro", () => {
    render(<BecomeProPage />);
    expect(screen.getByLabelText(/indicatif/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^numéro$/i)).toBeInTheDocument();
  });

  it("affiche les options de langues", () => {
    render(<BecomeProPage />);
    expect(screen.getByText("Français")).toBeInTheDocument();
    expect(screen.getByText("Anglais")).toBeInTheDocument();
    expect(screen.getByText("Polonais")).toBeInTheDocument();
  });

  it("permet de sélectionner/désélectionner une langue", () => {
    render(<BecomeProPage />);
    const frBtn = screen.getByText("Français");

    fireEvent.click(frBtn);
    expect(frBtn.className).toContain("bg-accent");

    fireEvent.click(frBtn);
    expect(frBtn.className).not.toContain("bg-accent");
  });

  it("affiche le bouton 'Soumettre ma candidature'", () => {
    render(<BecomeProPage />);
    expect(
      screen.getByRole("button", { name: /soumettre/i }),
    ).toBeInTheDocument();
  });

  it("affiche le champ vidéo optionnel", () => {
    render(<BecomeProPage />);
    expect(screen.getByLabelText(/vidéo de présentation/i)).toBeInTheDocument();
  });

  it("affiche un message de succès après soumission réussie", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          data: { proId: "p1", status: "pending" },
        }),
    });

    render(<BecomeProPage />);

    const bio = screen.getByLabelText(/mon parcours/i);
    fireEvent.change(bio, { target: { value: "12 ans d'expérience" } });

    fireEvent.submit(
      screen.getByRole("button", { name: /soumettre/i }).closest("form"),
    );

    await waitFor(() => {
      expect(screen.getByText(/candidature envoyée/i)).toBeInTheDocument();
    });
  });

  it("normalise le téléphone envoyé à l'API", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          data: { proId: "p1", status: "pending" },
        }),
    });

    render(<BecomeProPage />);

    fireEvent.change(screen.getByLabelText(/mon parcours/i), {
      target: { value: "12 ans d'expérience" },
    });
    fireEvent.change(screen.getByLabelText(/pays de résidence/i), {
      target: { value: "PL" },
    });
    fireEvent.click(screen.getByText("Français"));
    fireEvent.change(screen.getByLabelText(/indicatif/i), {
      target: { value: "+48" },
    });
    fireEvent.change(screen.getByLabelText(/^numéro$/i), {
      target: { value: "0601234567" },
    });

    fireEvent.submit(
      screen.getByRole("button", { name: /soumettre/i }).closest("form"),
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    const requestOptions = globalThis.fetch.mock.calls[0][1];
    expect(JSON.parse(requestOptions.body)).toEqual(
      expect.objectContaining({ phone: "+48601234567" }),
    );
  });

  it("affiche un message d'erreur si l'API échoue", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: false, error: "Bio trop courte" }),
    });

    render(<BecomeProPage />);
    fireEvent.submit(
      screen.getByRole("button", { name: /soumettre/i }).closest("form"),
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Bio trop courte");
  });
});
