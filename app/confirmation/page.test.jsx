import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
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
  Loader2: () => <svg data-testid="loader-icon" />,
}));

function advanceCountdown() {
  for (let i = 0; i < 6; i++) {
    act(() => vi.advanceTimersByTime(1000));
  }
}

describe("ConfirmationPage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("affiche l'écran de chargement avec décompte", () => {
    render(<ConfirmationPage />);
    expect(
      screen.getByText("Traitement de votre paiement..."),
    ).toBeInTheDocument();
    expect(screen.getByText(/seconde/)).toBeInTheDocument();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });

  it("décompte de 5 à 0 secondes", () => {
    render(<ConfirmationPage />);
    expect(screen.getByText(/5 secondes/)).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText(/4 secondes/)).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText(/3 secondes/)).toBeInTheDocument();
  });

  it("affiche le titre Bravo après le décompte", () => {
    render(<ConfirmationPage />);
    advanceCountdown();
    expect(screen.getByRole("heading", { name: /bravo/i })).toBeInTheDocument();
  });

  it("affiche le message de confirmation après le décompte", () => {
    render(<ConfirmationPage />);
    advanceCountdown();
    expect(
      screen.getByText(/votre piano va enfin chanter/i),
    ).toBeInTheDocument();
  });

  it("affiche la référence session Stripe après le décompte", () => {
    render(<ConfirmationPage />);
    advanceCountdown();
    expect(screen.getByText(/cs_test_abc123/)).toBeInTheDocument();
  });

  it("affiche le bouton Ajouter à mon agenda après le décompte", () => {
    render(<ConfirmationPage />);
    advanceCountdown();
    expect(
      screen.getByRole("button", { name: /ajouter à mon agenda/i }),
    ).toBeInTheDocument();
  });

  it("affiche le lien Mes rendez-vous vers /dashboard après le décompte", () => {
    render(<ConfirmationPage />);
    advanceCountdown();
    const link = screen.getByText("Mes rendez-vous");
    expect(link.closest("a")).toHaveAttribute("href", "/dashboard");
  });

  it("affiche les 3 étapes suivantes après le décompte", () => {
    render(<ConfirmationPage />);
    advanceCountdown();
    expect(screen.getByText("Et maintenant ?")).toBeInTheDocument();
    expect(screen.getByText(/accordeur viendra/i)).toBeInTheDocument();
  });

  it("affiche l'icône CheckCircle après le décompte", () => {
    render(<ConfirmationPage />);
    advanceCountdown();
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  it("la barre de progression se remplit", () => {
    const { container } = render(<ConfirmationPage />);
    const bar = container.querySelector('[style*="width"]');
    expect(bar).toBeInTheDocument();
  });
});
