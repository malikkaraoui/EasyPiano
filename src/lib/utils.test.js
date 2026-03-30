import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn() helper", () => {
  it("fusionne des classes simples", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("gère les valeurs conditionnelles", () => {
    const isHidden = false;
    expect(cn("base", isHidden && "hidden", "visible")).toBe("base visible");
  });

  it("supprime les doublons Tailwind (tailwind-merge)", () => {
    expect(cn("px-4 py-2", "px-8")).toBe("py-2 px-8");
  });

  it("gère les undefined et null", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });

  it("gère un tableau de classes", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("fusionne des objets conditionnels (clsx)", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });

  it("résout les conflits de couleur Tailwind", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("résout les conflits de taille Tailwind", () => {
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("retourne une chaîne vide sans arguments", () => {
    expect(cn()).toBe("");
  });
});
