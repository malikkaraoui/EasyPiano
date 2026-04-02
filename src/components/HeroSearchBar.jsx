"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import CityPostalAutocomplete from "@/components/UI/CityPostalAutocomplete";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { buildSearchHref } from "@/lib/search";
import { cn } from "@/lib/utils";

function useControllableValue(controlledValue, defaultValue, onChange) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const value = controlledValue ?? uncontrolledValue;

  function setValue(nextValue) {
    if (controlledValue === undefined) {
      setUncontrolledValue(nextValue);
    }
    onChange?.(nextValue);
  }

  return [value, setValue];
}

function formatLocationValue(selection) {
  return [selection.city, selection.postalCode]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function HeroSearchBar({
  variant = "hero",
  locationValue,
  defaultLocationValue = "",
  onLocationChange,
  onLocationMenuOpenChange,
  dateValue,
  defaultDateValue = "",
  onDateChange,
  onSubmit,
  showDate = true,
  submitLabel = "Rechercher",
  className,
}) {
  const router = useRouter();
  const [location, setLocation] = useControllableValue(
    locationValue,
    defaultLocationValue,
    onLocationChange,
  );
  const [date, setDate] = useControllableValue(
    dateValue,
    defaultDateValue,
    onDateChange,
  );

  const today = new Date().toISOString().split("T")[0];

  function handleSubmit(e) {
    e.preventDefault();

    const values = {
      location: location?.trim() || "",
      date: date?.trim() || "",
    };

    if (onSubmit) {
      onSubmit(values);
      return;
    }

    router.push(buildSearchHref(values));
  }

  const isHero = variant === "hero";
  const sharedSearchFieldClasses = isHero
    ? "surface-solid border-border/70 shadow-[0_14px_30px_rgba(0,0,0,0.24)] focus-visible:ring-accent/60 focus-visible:ring-offset-0"
    : "surface-solid-strong border-border/90 shadow-[0_16px_32px_rgba(0,0,0,0.34)] focus-visible:ring-accent focus-visible:ring-offset-0";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        isHero
          ? "relative isolate z-20 mx-auto mt-10 flex w-full max-w-2xl flex-col gap-3 rounded-xl border border-glow p-2 glass sm:flex-row"
          : "relative isolate z-20 flex w-full flex-col gap-3 rounded-xl border border-glow p-2 glass sm:flex-row",
        className,
      )}
    >
      <CityPostalAutocomplete
        value={location}
        onChange={setLocation}
        onSelect={(selection) => setLocation(formatLocationValue(selection))}
        onOpenChange={onLocationMenuOpenChange}
        placeholder="Ville ou code postal"
        ariaLabel="Lieu de recherche"
        className="flex-1"
        inputClassName={cn("h-12 rounded-lg", sharedSearchFieldClasses)}
      />

      {showDate && (
        <Input
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={today}
          aria-label="Date souhaitée"
          className={cn("h-12 rounded-lg sm:w-44", sharedSearchFieldClasses)}
        />
      )}

      <Button
        type="submit"
        size="lg"
        className={cn("h-12 gap-2", isHero ? "glow-gold" : "sm:min-w-40")}
      >
        <Search className="h-4 w-4" />
        {submitLabel}
      </Button>
    </form>
  );
}

export { HeroSearchBar };
