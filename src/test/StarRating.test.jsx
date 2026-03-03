import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StarRating from "../components/UI/StarRating";

describe("StarRating", () => {
  it("renders 5 stars by default", () => {
    render(<StarRating rating={3} />);
    const stars = document.querySelectorAll(".star");
    expect(stars).toHaveLength(5);
  });

  it("fills correct number of stars", () => {
    render(<StarRating rating={4} />);
    const filled = document.querySelectorAll(".star-filled");
    const empty = document.querySelectorAll(".star-empty");
    expect(filled).toHaveLength(4);
    expect(empty).toHaveLength(1);
  });

  it("renders 0 filled stars for rating 0", () => {
    render(<StarRating rating={0} />);
    const filled = document.querySelectorAll(".star-filled");
    expect(filled).toHaveLength(0);
  });

  it("calls onChange when clickable", async () => {
    const handleChange = vi.fn();
    render(<StarRating rating={2} onChange={handleChange} />);

    const stars = document.querySelectorAll(".star-clickable");
    expect(stars).toHaveLength(5);

    await userEvent.click(stars[3]);
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("is not clickable without onChange", () => {
    render(<StarRating rating={3} />);
    const clickable = document.querySelectorAll(".star-clickable");
    expect(clickable).toHaveLength(0);
  });
});
