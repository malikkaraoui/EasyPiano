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

const profileData = {
  displayName: "Jean Dupont",
  phone: "+41791234567",
  isB2B: false,
  email: "test@example.com",
};

function mockFetchProfile() {
  globalThis.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ success: true, data: profileData }),
  });
}

async function renderProfilePageAndWait() {
  render(<ProfilePage />);
  await waitFor(() => {
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
}

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchProfile();
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

  it("affiche le titre 'Mon profil'", async () => {
    await renderProfilePageAndWait();
    expect(
      screen.getByRole("heading", { name: /mon profil/i }),
    ).toBeInTheDocument();
  });

  it("affiche le champ email en lecture seule", async () => {
    await renderProfilePageAndWait();
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeDisabled();
    expect(emailInput.value).toBe("test@example.com");
  });

  it("affiche le champ nom pré-rempli", async () => {
    await renderProfilePageAndWait();
    const nameInput = screen.getByLabelText(/nom complet/i);
    expect(nameInput.value).toBe("Jean Dupont");
  });

  it("affiche le champ téléphone", async () => {
    await renderProfilePageAndWait();
    expect(screen.getByLabelText(/indicatif/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^numéro$/i)).toBeInTheDocument();
  });

  it("affiche le toggle B2B", async () => {
    await renderProfilePageAndWait();
    const checkbox = screen.getByLabelText(/professionnel/i);
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(false);
  });

  it("le toggle B2B change d'état au clic", async () => {
    await renderProfilePageAndWait();
    const checkbox = screen.getByLabelText(/professionnel/i);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it("affiche le bouton 'Enregistrer'", async () => {
    await renderProfilePageAndWait();
    expect(
      screen.getByRole("button", { name: /enregistrer/i }),
    ).toBeInTheDocument();
  });

  it("rend le bouton Enregistrer comme une vraie action principale", async () => {
    await renderProfilePageAndWait();
    expect(screen.getByRole("button", { name: /enregistrer/i })).toHaveClass(
      "w-full",
      "sm:min-w-48",
      "sm:w-auto",
    );
  });

  it("appelle l'API au submit du formulaire", async () => {
    await renderProfilePageAndWait();

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

  it("normalise le téléphone avec indicatif et numéro séparés", async () => {
    await renderProfilePageAndWait();

    fireEvent.change(screen.getByLabelText(/indicatif/i), {
      target: { value: "+41" },
    });
    fireEvent.change(screen.getByLabelText(/^numéro$/i), {
      target: { value: "0791234567" },
    });

    fireEvent.submit(
      screen.getByRole("button", { name: /enregistrer/i }).closest("form"),
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    });

    const requestOptions = globalThis.fetch.mock.calls[1][1];
    expect(JSON.parse(requestOptions.body)).toEqual(
      expect.objectContaining({ phone: "+41791234567" }),
    );
  });

  it("affiche un message de succès après mise à jour", async () => {
    await renderProfilePageAndWait();

    fireEvent.submit(
      screen.getByRole("button", { name: /enregistrer/i }).closest("form"),
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/succès/i);
  });

  it("affiche l'état d'enregistrement pendant la sauvegarde", async () => {
    await renderProfilePageAndWait();

    let resolveRequest;
    globalThis.fetch = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );

    fireEvent.submit(
      screen.getByRole("button", { name: /enregistrer/i }).closest("form"),
    );

    const savingButton = screen.getByRole("button", {
      name: /enregistrement/i,
    });

    expect(savingButton).toBeDisabled();
    expect(savingButton).toHaveAttribute("aria-busy", "true");

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(resolveRequest).toBeTypeOf("function");
    });

    resolveRequest({
      json: () => Promise.resolve({ success: true, data: {} }),
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /enregistrer/i }),
      ).not.toBeDisabled();
    });
  });

  it("indique que l'email ne peut pas être modifié", async () => {
    await renderProfilePageAndWait();
    expect(
      screen.getByText(/email ne peut pas être modifié/i),
    ).toBeInTheDocument();
  });
});
