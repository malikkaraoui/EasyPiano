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
  loginWithEmail: vi.fn(),
  registerWithEmail: vi.fn(),
}));

vi.mock("@/components/UI/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/UI/input", () => ({
  Input: (props) => <input {...props} />,
}));

import { useAuth } from "../hooks/useAuth";
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
} from "../services/auth";

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: null });
  });

  it("affiche le titre 'Connexion'", () => {
    render(<Login />);
    expect(
      screen.getByRole("heading", { name: /connexion/i }),
    ).toBeInTheDocument();
  });

  it("affiche le bouton 'Continuer avec Google'", () => {
    render(<Login />);
    expect(
      screen.getByRole("button", { name: /continuer avec google/i }),
    ).toBeInTheDocument();
  });

  it("affiche les champs email et mot de passe", () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
  });

  it("affiche le bouton 'Se connecter'", () => {
    render(<Login />);
    expect(
      screen.getByRole("button", { name: /se connecter/i }),
    ).toBeInTheDocument();
  });

  it("affiche le lien 'Créer un compte'", () => {
    render(<Login />);
    expect(
      screen.getByRole("button", { name: /créer un compte/i }),
    ).toBeInTheDocument();
  });

  it("bascule en mode inscription au clic sur 'Créer un compte'", () => {
    render(<Login />);
    fireEvent.click(screen.getByRole("button", { name: /créer un compte/i }));
    expect(
      screen.getByRole("heading", { name: /créer un compte/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/nom complet/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /créer mon compte/i }),
    ).toBeInTheDocument();
  });

  it("bascule retour en mode connexion", () => {
    render(<Login />);
    fireEvent.click(screen.getByRole("button", { name: /créer un compte/i }));
    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));
    expect(
      screen.getByRole("heading", { name: /connexion/i }),
    ).toBeInTheDocument();
  });

  it("redirige vers /dashboard si déjà connecté", () => {
    useAuth.mockReturnValue({ user: { uid: "u1" } });
    render(<Login />);
    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
  });

  it("appelle loginWithGoogle au clic", async () => {
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

  it("appelle loginWithEmail au submit du formulaire", async () => {
    loginWithEmail.mockResolvedValue({ uid: "u1" });
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "password123" },
    });
    fireEvent.submit(
      screen.getByRole("button", { name: /se connecter/i }).closest("form"),
    );

    await waitFor(() => {
      expect(loginWithEmail).toHaveBeenCalledWith(
        "test@test.com",
        "password123",
      );
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("appelle registerWithEmail en mode inscription", async () => {
    registerWithEmail.mockResolvedValue({ uid: "u2" });
    render(<Login />);

    fireEvent.click(screen.getByRole("button", { name: /créer un compte/i }));
    fireEvent.change(screen.getByLabelText(/nom complet/i), {
      target: { value: "Marie Curie" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "marie@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "secret123" },
    });
    fireEvent.submit(
      screen.getByRole("button", { name: /créer mon compte/i }).closest("form"),
    );

    await waitFor(() => {
      expect(registerWithEmail).toHaveBeenCalledWith(
        "marie@test.com",
        "secret123",
        "Marie Curie",
      );
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("affiche une erreur Firebase traduite", async () => {
    loginWithEmail.mockRejectedValue({ code: "auth/invalid-credential" });
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "wrong" },
    });
    fireEvent.submit(
      screen.getByRole("button", { name: /se connecter/i }).closest("form"),
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/email ou mot de passe incorrect/i);
  });

  it("affiche un message d'erreur si la connexion Google échoue", async () => {
    loginWithGoogle.mockRejectedValue(new Error("Auth failed"));
    render(<Login />);

    fireEvent.click(
      screen.getByRole("button", { name: /continuer avec google/i }),
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/erreur/i);
  });
});
