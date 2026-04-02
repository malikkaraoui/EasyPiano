import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ConfirmationPage from "./page";

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key) => (key === "session_id" ? "cs_test_abc123" : null),
  }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/animations/ScrollReveal", () => ({
  ScrollReveal: ({ children }) => <div>{children}</div>,
}));

vi.mock("@/components/UI/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock("lucide-react", () => ({
  CheckCircle: () => <svg data-testid="check-icon" />,
  Calendar: () => <svg data-testid="calendar-icon" />,
  ArrowRight: () => <svg data-testid="arrow-icon" />,
}));

describe("ConfirmationPage", () => {
  it("affiche le titre Bravo", () => {
    render(<ConfirmationPage />);
    expect(screen.getByRole("heading", { name: /bravo/i })).toBeInTheDocument();
  });

  it("affiche le message de confirmation", () => {
    render(<ConfirmationPage />);
    expect(
      screen.getByText(/votre piano va enfin chanter/i),
    ).toBeInTheDocument();
  });

  it("affiche la référence session Stripe", () => {
    render(<ConfirmationPage />);
    expect(screen.getByText(/cs_test_abc123/)).toBeInTheDocument();
  });

  it("affiche le bouton Ajouter à mon agenda", () => {
    render(<ConfirmationPage />);
    expect(
      screen.getByRole("button", { name: /ajouter à mon agenda/i }),
    ).toBeInTheDocument();
  });

  it("affiche le lien Mes rendez-vous vers /dashboard", () => {
    render(<ConfirmationPage />);
    const link = screen.getByText("Mes rendez-vous");
    expect(link.closest("a")).toHaveAttribute("href", "/dashboard");
  });

  it("affiche les 3 étapes suivantes", () => {
    render(<ConfirmationPage />);
    expect(screen.getByText("Et maintenant ?")).toBeInTheDocument();
    expect(screen.getAllByText(/confirmation/i).length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getByText(/accordeur viendra/i)).toBeInTheDocument();
  });

  it("affiche l'icône CheckCircle", () => {
    render(<ConfirmationPage />);
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });
});
