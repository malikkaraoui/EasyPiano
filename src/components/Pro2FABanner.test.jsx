import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pro2FABanner } from "./Pro2FABanner";

vi.mock("@/components/UI/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock("lucide-react", () => ({
  ShieldAlert: () => <svg data-testid="shield-alert" />,
}));

describe("Pro2FABanner", () => {
  it("affiche le bandeau si pas de 2FA et a des réservations", () => {
    render(
      <Pro2FABanner has2FA={false} hasBookings={true} onSetup2FA={() => {}} />,
    );
    expect(screen.getByText(/vérification en 2 étapes/i)).toBeInTheDocument();
  });

  it("affiche le bouton 'Activer'", () => {
    render(
      <Pro2FABanner has2FA={false} hasBookings={true} onSetup2FA={() => {}} />,
    );
    expect(
      screen.getByRole("button", { name: /activer/i }),
    ).toBeInTheDocument();
  });

  it("appelle onSetup2FA au clic", () => {
    const onSetup = vi.fn();
    render(
      <Pro2FABanner has2FA={false} hasBookings={true} onSetup2FA={onSetup} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /activer/i }));
    expect(onSetup).toHaveBeenCalledTimes(1);
  });

  it("n'affiche rien si 2FA déjà activée", () => {
    const { container } = render(
      <Pro2FABanner has2FA={true} hasBookings={true} onSetup2FA={() => {}} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("n'affiche rien si pas de réservations", () => {
    const { container } = render(
      <Pro2FABanner has2FA={false} hasBookings={false} onSetup2FA={() => {}} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("a le rôle 'alert' pour l'accessibilité", () => {
    render(
      <Pro2FABanner has2FA={false} hasBookings={true} onSetup2FA={() => {}} />,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("affiche le texte d'obligation", () => {
    render(
      <Pro2FABanner has2FA={false} hasBookings={true} onSetup2FA={() => {}} />,
    );
    expect(screen.getByText(/obligatoire pour accéder/i)).toBeInTheDocument();
  });
});
