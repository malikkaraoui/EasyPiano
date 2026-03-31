import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

vi.mock("../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../services/auth", () => ({
  loginWithGoogle: vi.fn(),
}));

vi.mock("@/components/UI/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

import { useAuth } from "../hooks/useAuth";
import { loginWithGoogle } from "../services/auth";

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche le titre 'Connexion'", () => {
    useAuth.mockReturnValue({ user: null });
    render(<Login />);
    expect(
      screen.getByRole("heading", { name: /connexion/i }),
    ).toBeInTheDocument();
  });

  it("affiche le bouton 'Continuer avec Google'", () => {
    useAuth.mockReturnValue({ user: null });
    render(<Login />);
    expect(
      screen.getByRole("button", { name: /continuer avec google/i }),
    ).toBeInTheDocument();
  });

  it("redirige vers /dashboard si déjà connecté", () => {
    useAuth.mockReturnValue({ user: { uid: "u1" } });
    render(<Login />);
    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
  });

  it("appelle loginWithGoogle au clic sur le bouton", async () => {
    useAuth.mockReturnValue({ user: null });
    loginWithGoogle.mockResolvedValue({ redirected: false });
    render(<Login />);

    fireEvent.click(
      screen.getByRole("button", { name: /continuer avec google/i }),
    );

    await waitFor(() => {
      expect(loginWithGoogle).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("ne navigue pas tout de suite si la connexion part en redirect", async () => {
    useAuth.mockReturnValue({ user: null });
    loginWithGoogle.mockResolvedValue({ redirected: true });
    render(<Login />);

    fireEvent.click(
      screen.getByRole("button", { name: /continuer avec google/i }),
    );

    await waitFor(() => {
      expect(loginWithGoogle).toHaveBeenCalled();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("affiche un message d'erreur si la connexion échoue", async () => {
    useAuth.mockReturnValue({ user: null });
    loginWithGoogle.mockRejectedValue(new Error("Auth failed"));
    render(<Login />);

    fireEvent.click(
      screen.getByRole("button", { name: /continuer avec google/i }),
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/erreur/i);
  });

  it("affiche la description du service", () => {
    useAuth.mockReturnValue({ user: null });
    render(<Login />);
    expect(
      screen.getByText(/connectez-vous pour réserver/i),
    ).toBeInTheDocument();
  });

  it("désactive le bouton pendant la tentative de connexion", async () => {
    useAuth.mockReturnValue({ user: null });
    loginWithGoogle.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ redirected: true }), 0),
        ),
    );
    render(<Login />);

    const button = screen.getByRole("button", {
      name: /continuer avec google/i,
    });
    fireEvent.click(button);

    expect(
      screen.getByRole("button", { name: /connexion en cours/i }),
    ).toBeDisabled();

    await waitFor(() => {
      expect(loginWithGoogle).toHaveBeenCalled();
    });
  });
});
