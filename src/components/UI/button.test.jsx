import { describe, expect, it } from "vitest";
import { buttonVariants } from "./button";

describe("buttonVariants", () => {
  it("donne au bouton principal des états repos, survol et clic visibles", () => {
    const classes = buttonVariants({ variant: "default" });

    expect(classes).toContain("bg-accent");
    expect(classes).toContain("hover:-translate-y-px");
    expect(classes).toContain("active:translate-y-px");
    expect(classes).toContain("active:scale-[0.97]");
  });
});
