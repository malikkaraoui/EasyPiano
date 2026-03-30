import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfilePage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
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

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: {
        uid: "u1",
        email: "test@example.com",
        displayName: "Jean Dupont",
        getIdToken: vi.fn().mockResolvedValue("token123"),
      },
      loading: false,
    });
  });

  it("affiche le titre 'Mon profil'", () => {
    render(<ProfilePage />);
    expect(
      screen.getByRole("heading", { name: /mon profil/i }),
    ).toBeInTheDocument();
  });

  it("affiche le champ email en lecture seule", () => {
    render(<ProfilePage />);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeDisabled();
    expect(emailInput.value).toBe("test@example.com");
  });

  it("affiche le champ nom pré-rempli", () => {
    render(<ProfilePage />);
    const nameInput = screen.getByLabelText(/nom complet/i);
    expect(nameInput.value).toBe("Jean Dupont");
  });

  it("affiche le champ téléphone", () => {
    render(<ProfilePage />);
    expect(screen.getByLabelText(/téléphone/i)).toBeInTheDocument();
  });

  it("affiche le toggle B2B", () => {
    render(<ProfilePage />);
    const checkbox = screen.getByLabelText(/professionnel/i);
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(false);
  });

  it("le toggle B2B change d'état au clic", () => {
    render(<ProfilePage />);
    const checkbox = screen.getByLabelText(/professionnel/i);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it("affiche le bouton 'Enregistrer'", () => {
    render(<ProfilePage />);
    expect(
      screen.getByRole("button", { name: /enregistrer/i }),
    ).toBeInTheDocument();
  });

  it("appelle l'API au submit du formulaire", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: {} }),
    });

    render(<ProfilePage />);
    fireEvent.submit(
      screen.getByRole("button", { name: /enregistrer/i }).closest("form"),
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/user/profile",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  it("affiche un message de succès après mise à jour", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: {} }),
    });

    render(<ProfilePage />);
    fireEvent.submit(
      screen.getByRole("button", { name: /enregistrer/i }).closest("form"),
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/succès/i);
  });

  it("indique que l'email ne peut pas être modifié", () => {
    render(<ProfilePage />);
    expect(
      screen.getByText(/email ne peut pas être modifié/i),
    ).toBeInTheDocument();
  });
});
