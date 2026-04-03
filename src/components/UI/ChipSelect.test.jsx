import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChipSelect } from "./ChipSelect";

const OPTIONS = [
  { code: "fr", label: "Français" },
  { code: "en", label: "Anglais" },
  { code: "de", label: "Allemand" },
];

describe("ChipSelect", () => {
  it("affiche toutes les options", () => {
    render(
      <ChipSelect
        options={OPTIONS}
        selected={[]}
        onToggle={() => {}}
        name="lang"
      />,
    );

    expect(screen.getByText("Français")).toBeInTheDocument();
    expect(screen.getByText("Anglais")).toBeInTheDocument();
    expect(screen.getByText("Allemand")).toBeInTheDocument();
  });

  it("affiche la légende et le hint", () => {
    render(
      <ChipSelect
        options={OPTIONS}
        selected={[]}
        onToggle={() => {}}
        name="lang"
        legend="Langues parlées"
        hint="Sélectionnez une ou plusieurs langues."
      />,
    );

    expect(screen.getByText("Langues parlées")).toBeInTheDocument();
    expect(
      screen.getByText("Sélectionnez une ou plusieurs langues."),
    ).toBeInTheDocument();
  });

  it("applique la classe sélectionnée en mode multi", () => {
    render(
      <ChipSelect
        options={OPTIONS}
        selected={["fr"]}
        onToggle={() => {}}
        name="lang"
        multi
      />,
    );

    const frLabel = screen.getByText("Français").closest("label");
    const enLabel = screen.getByText("Anglais").closest("label");

    expect(frLabel.className).toContain("bg-white");
    expect(frLabel.className).toContain("text-black");
    expect(enLabel.className).not.toContain("bg-white");
  });

  it("applique la classe sélectionnée en mode single", () => {
    render(
      <ChipSelect
        options={OPTIONS}
        selected="fr"
        onToggle={() => {}}
        name="sort"
        multi={false}
      />,
    );

    const frLabel = screen.getByText("Français").closest("label");

    expect(frLabel.className).toContain("bg-white");
    expect(frLabel.className).toContain("text-black");
  });

  it("appelle onToggle au clic", () => {
    const onToggle = vi.fn();

    render(
      <ChipSelect
        options={OPTIONS}
        selected={[]}
        onToggle={onToggle}
        name="lang"
      />,
    );

    fireEvent.click(screen.getByText("Anglais"));

    expect(onToggle).toHaveBeenCalledWith("en");
  });

  it("utilise des checkboxes en mode multi et des radios en mode single", () => {
    const { rerender } = render(
      <ChipSelect
        options={OPTIONS}
        selected={[]}
        onToggle={() => {}}
        name="lang"
        multi
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Français" });
    expect(checkbox).toBeInTheDocument();

    rerender(
      <ChipSelect
        options={OPTIONS}
        selected="fr"
        onToggle={() => {}}
        name="lang"
        multi={false}
      />,
    );

    const radio = screen.getByRole("radio", { name: "Français" });
    expect(radio).toBeInTheDocument();
  });

  it("désactive le fieldset quand disabled=true", () => {
    render(
      <ChipSelect
        options={OPTIONS}
        selected={[]}
        onToggle={() => {}}
        name="lang"
        disabled
      />,
    );

    const fieldset = screen.getByText("Français").closest("fieldset");
    expect(fieldset).toBeDisabled();
  });
});
