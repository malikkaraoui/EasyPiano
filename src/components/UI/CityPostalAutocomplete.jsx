"use client";

import { useEffect, useRef, useState } from "react";
import { searchCityOrPostal } from "@services/locationSearch";

export default function CityPostalAutocomplete({ value, onChange, onSelect }) {
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
        const result = await searchCityOrPostal(q, 8);
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
    const onDocMouseDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  return (
    <div className="search-input-wrapper" ref={rootRef}>
      <input
        type="text"
        placeholder="Rechercher par ville, code postal ou nom..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true);
        }}
        className="search-input"
        autoComplete="off"
      />

      {loading && (
        <div className="search-loading-indicator" aria-hidden="true" />
      )}

      {open && suggestions.length > 0 && (
        <ul className="search-suggestions" role="listbox">
          {suggestions.map((item, index) => (
            <li
              key={`${item.city}-${item.postalCode}-${item.countryCode}-${index}`}
            >
              <button
                type="button"
                className="search-suggestion-item"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(item);
                  setOpen(false);
                }}
              >
                <span className="search-suggestion-main">
                  {item.city || item.postalCode}
                </span>
                <span className="search-suggestion-meta">
                  {[item.postalCode, item.country].filter(Boolean).join(" • ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
