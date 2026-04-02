"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/UI/button";
import LOCATIONS from "@/data/swiss-locations.json";

const normalize = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function HeroSearchBar() {
  const router = useRouter();
  const [lieu, setLieu] = useState("");
  const [date, setDate] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  const suggestions = useMemo(() => {
    if (lieu.length < 1) return [];
    const query = normalize(lieu);
    return LOCATIONS.filter(
      (loc) =>
        normalize(loc.city).startsWith(query) || loc.postal.startsWith(query),
    ).slice(0, 5);
  }, [lieu]);

  const showSuggestions = isFocused && suggestions.length > 0;

  function selectSuggestion(loc) {
    setLieu(`${loc.city} (${loc.postal})`);
    setIsFocused(false);
    setSelectedIndex(-1);
  }

  function handleKeyDown(e) {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsFocused(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (lieu) params.set("lieu", lieu);
    if (date) params.set("date", date);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-10 flex w-full max-w-2xl flex-col gap-3 rounded-xl border border-glow p-2 glass sm:flex-row"
    >
      <div className="relative flex-1">
        <input
          type="text"
          name="lieu"
          value={lieu}
          onChange={(e) => setLieu(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Ville ou code postal"
          aria-label="Lieu de recherche"
          autoComplete="off"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          className="flex h-12 w-full rounded border-transparent bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        />
        {showSuggestions && (
          <ul
            ref={listRef}
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-xl"
          >
            {suggestions.map((loc, i) => (
              <li
                key={`${loc.city}-${loc.postal}`}
                role="option"
                aria-selected={i === selectedIndex}
              >
                <button
                  type="button"
                  onMouseDown={() => selectSuggestion(loc)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                    i === selectedIndex
                      ? "bg-accent/15 text-foreground"
                      : "text-foreground hover:bg-accent/10"
                  }`}
                >
                  <span>📍 {loc.city}</span>
                  <span className="text-xs text-muted">
                    {loc.postal} · {loc.region}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        type="date"
        name="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        min={today}
        aria-label="Date souhaitée"
        className="flex h-12 rounded border-transparent bg-transparent px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 sm:w-44"
      />
      <Button type="submit" size="lg" className="h-12 gap-2 glow-gold">
        <Search className="h-4 w-4" />
        Rechercher
      </Button>
    </form>
  );
}

export { HeroSearchBar };
