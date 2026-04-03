import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useChipSelect } from "./useChipSelect";

describe("useChipSelect", () => {
  describe("mode multi", () => {
    it("initialise avec un tableau vide", () => {
      const { result } = renderHook(() =>
        useChipSelect({ initial: [], multi: true }),
      );

      expect(result.current.selected).toEqual([]);
    });

    it("ajoute un élément au toggle", () => {
      const { result } = renderHook(() =>
        useChipSelect({ initial: [], multi: true }),
      );

      act(() => result.current.toggle("fr"));

      expect(result.current.selected).toEqual(["fr"]);
    });

    it("retire un élément déjà sélectionné au toggle", () => {
      const { result } = renderHook(() =>
        useChipSelect({ initial: ["fr", "en"], multi: true }),
      );

      act(() => result.current.toggle("fr"));

      expect(result.current.selected).toEqual(["en"]);
    });

    it("reset remet à l'état initial", () => {
      const { result } = renderHook(() =>
        useChipSelect({ initial: ["fr"], multi: true }),
      );

      act(() => result.current.toggle("en"));
      act(() => result.current.reset());

      expect(result.current.selected).toEqual(["fr"]);
    });
  });

  describe("mode single", () => {
    it("initialise avec la valeur fournie", () => {
      const { result } = renderHook(() =>
        useChipSelect({ initial: "rating", multi: false }),
      );

      expect(result.current.selected).toBe("rating");
    });

    it("remplace la valeur au toggle", () => {
      const { result } = renderHook(() =>
        useChipSelect({ initial: "rating", multi: false }),
      );

      act(() => result.current.toggle("price"));

      expect(result.current.selected).toBe("price");
    });

    it("reset remet à l'état initial", () => {
      const { result } = renderHook(() =>
        useChipSelect({ initial: "rating", multi: false }),
      );

      act(() => result.current.toggle("price"));
      act(() => result.current.reset());

      expect(result.current.selected).toBe("rating");
    });
  });
});
