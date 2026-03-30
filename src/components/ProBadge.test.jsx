import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProBadge } from "./ProBadge";

vi.mock("@/components/UI/badge", () => ({
  Badge: ({ children, title, className }) => (
    <span title={title} className={className}>
      {children}
    </span>
  ),
}));

vi.mock("lucide-react", () => ({
  ShieldCheck: () => <svg data-testid="shield-icon" />,
}));

describe("ProBadge", () => {
  it("affiche le badge si status est 'validated'", () => {
    render(<ProBadge status="validated" />);
    expect(screen.getByText("Validé par EasyPiano")).toBeInTheDocument();
  });

  it("affiche l'icône ShieldCheck", () => {
    render(<ProBadge status="validated" />);
    expect(screen.getByTestId("shield-icon")).toBeInTheDocument();
  });

  it("n'affiche rien si status est 'pending'", () => {
    const { container } = render(<ProBadge status="pending" />);
    expect(container.innerHTML).toBe("");
  });

  it("n'affiche rien si status est 'refused'", () => {
    const { container } = render(<ProBadge status="refused" />);
    expect(container.innerHTML).toBe("");
  });

  it("contient un tooltip explicatif (title)", () => {
    render(<ProBadge status="validated" />);
    expect(screen.getByTitle(/rencontré et vérifié/i)).toBeInTheDocument();
  });
});
