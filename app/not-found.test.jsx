import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("NotFound (404)", () => {
  it("affiche 404", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("affiche le titre Page introuvable", () => {
    render(<NotFound />);
    expect(
      screen.getByRole("heading", { name: /page introuvable/i }),
    ).toBeInTheDocument();
  });

  it("affiche un lien vers l'accueil", () => {
    render(<NotFound />);
    const link = screen.getByText(/retour à l'accueil/i);
    expect(link.closest("a")).toHaveAttribute("href", "/");
  });
});
