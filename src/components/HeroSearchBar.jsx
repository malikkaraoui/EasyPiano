"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import CityPostalAutocomplete from "@/components/UI/CityPostalAutocomplete";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { cn } from "@/lib/utils";

const DEFAULT_SEARCH_SORT = "rating";

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

function buildSearchHref({
  location,
  date,
  sortBy,
  includeSort = false,
  basePath = "/search",
}) {
  const params = new URLSearchParams();

  if (location?.trim()) params.set("lieu", location.trim());
  if (date?.trim()) params.set("date", date.trim());
  if (includeSort && sortBy && sortBy !== DEFAULT_SEARCH_SORT) {
    params.set("sort", sortBy);
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function SharedSearchBar({
  variant = "hero",
  locationValue,
  defaultLocationValue = "",
  onLocationChange,
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

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        isHero
          ? "mx-auto mt-10 flex w-full max-w-2xl flex-col gap-3 rounded-xl border border-glow p-2 glass sm:flex-row"
          : "flex w-full flex-col gap-3 rounded-xl border border-glow p-2 glass sm:flex-row",
        className,
      )}
    >
      <CityPostalAutocomplete
        value={location}
        onChange={setLocation}
        onSelect={(selection) => setLocation(formatLocationValue(selection))}
        placeholder="Ville ou code postal"
        ariaLabel="Lieu de recherche"
        className="flex-1"
        inputClassName={cn(
          "h-12 rounded-lg",
          isHero
            ? "border-transparent bg-transparent focus-visible:ring-accent/50 focus-visible:ring-offset-0"
            : "border-border bg-background/70",
        )}
      />

      {showDate && (
        <Input
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={today}
          aria-label="Date souhaitée"
          className={cn(
            "h-12 rounded-lg sm:w-44",
            isHero
              ? "border-transparent bg-transparent focus-visible:ring-accent/50 focus-visible:ring-offset-0"
              : "border-border bg-background/70",
          )}
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

const HeroSearchBar = SharedSearchBar;

export { HeroSearchBar, SharedSearchBar, buildSearchHref, DEFAULT_SEARCH_SORT };
