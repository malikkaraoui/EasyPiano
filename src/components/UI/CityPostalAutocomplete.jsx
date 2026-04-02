"use client";

import { useEffect, useRef, useState } from "react";
import { searchCityOrPostal } from "@services/locationSearch";
import { Input } from "@/components/UI/input";
import { cn } from "@/lib/utils";

export default function CityPostalAutocomplete({
  value,
  onChange,
  onSelect,
  onOpenChange,
  placeholder = "Rechercher par ville, code postal ou nom...",
  ariaLabel = "Lieu de recherche",
  className,
  inputClassName,
  listClassName,
  optionClassName,
  minQueryLength = 1,
}) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!isFocused) {
      setOpen(false);
      setActiveIndex(-1);
      return undefined;
    }

    const q = value?.trim() || "";
    if (q.length < minQueryLength) {
      setSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
      return undefined;
    }

    let cancelled = false;

    async function loadSuggestions() {
      try {
        setLoading(true);
        const result = await searchCityOrPostal(q, 5);
        if (!cancelled) {
          setSuggestions(result);
          setOpen(result.length > 0);
          setActiveIndex(-1);
        }
      } catch (error) {
        console.error("Erreur auto-complétion:", error);
        if (!cancelled) {
          setSuggestions([]);
          setOpen(false);
          setActiveIndex(-1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSuggestions();

    return () => {
      cancelled = true;
    };
  }, [value, minQueryLength, isFocused]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    const onDocMouseDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
        setActiveIndex(-1);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  function handleSelect(item) {
    onSelect(item);
    setOpen(false);
    setActiveIndex(-1);
    setIsFocused(false);
  }

  function handleKeyDown(event) {
    if (!open || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((previous) =>
        previous < suggestions.length - 1 ? previous + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((previous) =>
        previous > 0 ? previous - 1 : suggestions.length - 1,
      );
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      handleSelect(suggestions[activeIndex]);
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      setIsFocused(false);
    }
  }

  return (
    <div className={cn("relative", className)} ref={rootRef}>
      <Input
        type="text"
        placeholder={placeholder}
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setIsFocused(true);
          if (suggestions.length > 0) setOpen(true);
        }}
        autoComplete="off"
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-autocomplete="list"
        className={inputClassName}
      />

      {loading && (
        <div
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-muted border-t-accent"
          aria-hidden="true"
        />
      )}

      {open && suggestions.length > 0 && (
        <ul
          className={cn(
            "absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-xl",
            listClassName,
          )}
          role="listbox"
        >
          {suggestions.map((item, index) => (
            <li
              key={`${item.city}-${item.postalCode}-${item.countryCode}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
            >
              <button
                type="button"
                className={cn(
                  "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-foreground transition-colors",
                  index === activeIndex
                    ? "bg-accent/15 text-foreground"
                    : "hover:bg-accent/10",
                  optionClassName,
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(item)}
              >
                <span className="font-medium">
                  {item.city || item.postalCode}
                </span>
                <span className="text-xs text-muted">
                  {[item.postalCode, item.region || item.country]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
