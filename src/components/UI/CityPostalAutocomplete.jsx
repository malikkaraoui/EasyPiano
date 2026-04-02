"use client";

import { useEffect, useRef, useState } from "react";
import { searchCityOrPostal } from "@services/locationSearch";

export default function CityPostalAutocomplete({
  value,
  onChange,
  onSelect,
  onOpenChange,
}) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const q = value?.trim() || "";
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return undefined;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const result = await searchCityOrPostal(q, 5);
        if (!cancelled) {
          setSuggestions(result);
          setOpen(result.length > 0);
        }
      } catch (error) {
        console.error("Erreur auto-complétion:", error);
        if (!cancelled) {
          setSuggestions([]);
          setOpen(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    const onDocMouseDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <input
        type="text"
        placeholder="Rechercher par ville, code postal ou nom..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true);
        }}
        className="flex h-10 w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        autoComplete="off"
      />

      {loading && (
        <div
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-muted border-t-accent"
          aria-hidden="true"
        />
      )}

      {open && suggestions.length > 0 && (
        <ul
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-xl"
          role="listbox"
        >
          {suggestions.map((item, index) => (
            <li
              key={`${item.city}-${item.postalCode}-${item.countryCode}-${index}`}
            >
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent/10"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(item);
                  setOpen(false);
                }}
              >
                <span className="font-medium">
                  {item.city || item.postalCode}
                </span>
                <span className="text-xs text-muted">
                  {[item.postalCode, item.country].filter(Boolean).join(" · ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
