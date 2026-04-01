import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StarRating from "../components/UI/StarRating";

describe("StarRating", () => {
  it("renders 5 stars by default", () => {
    const { container } = render(<StarRating rating={3} />);
    const stars = container.querySelectorAll("span");
    expect(stars).toHaveLength(5);
  });

  it("fills correct number of stars", () => {
    const { container } = render(<StarRating rating={4} />);
    const allStars = container.querySelectorAll("span");
    const filled = [...allStars].filter((s) => s.textContent === "★");
    const empty = [...allStars].filter((s) => s.textContent === "☆");
    expect(filled).toHaveLength(4);
    expect(empty).toHaveLength(1);
  });

  it("renders 0 filled stars for rating 0", () => {
    const { container } = render(<StarRating rating={0} />);
    const filled = [...container.querySelectorAll("span")].filter(
      (s) => s.textContent === "★",
    );
    expect(filled).toHaveLength(0);
  });

  it("calls onChange when clickable", async () => {
    const handleChange = vi.fn();
    render(<StarRating rating={2} onChange={handleChange} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);

    await userEvent.click(buttons[3]);
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("is not clickable without onChange", () => {
    render(<StarRating rating={3} />);
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(0);
  });
});
