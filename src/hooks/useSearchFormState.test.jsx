import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSearchFormState } from "./useSearchFormState";

describe("useSearchFormState", () => {
  it("initialise des valeurs par défaut cohérentes", () => {
    const { result } = renderHook(() => useSearchFormState());

    expect(result.current.location).toBe("");
    expect(result.current.date).toBe("");
    expect(result.current.sortBy).toBe("rating");
  });

  it("hydrate correctement les valeurs initiales reçues", () => {
    const { result } = renderHook(() =>
      useSearchFormState({
        location: "Lausanne 1000",
        date: "2026-11-11",
        sortBy: "price",
      }),
    );

    expect(result.current.location).toBe("Lausanne 1000");
    expect(result.current.date).toBe("2026-11-11");
    expect(result.current.sortBy).toBe("price");
  });
});
