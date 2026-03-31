"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/UI/button";

const LOCATIONS = [
  { city: "Lausanne", postal: "1000", region: "VD" },
  { city: "Genève", postal: "1200", region: "GE" },
  { city: "Zürich", postal: "8000", region: "ZH" },
  { city: "Berne", postal: "3000", region: "BE" },
  { city: "Bâle", postal: "4000", region: "BS" },
  { city: "Lucerne", postal: "6000", region: "LU" },
  { city: "Montreux", postal: "1820", region: "VD" },
  { city: "Neuchâtel", postal: "2000", region: "NE" },
  { city: "Fribourg", postal: "1700", region: "FR" },
  { city: "Sion", postal: "1950", region: "VS" },
  { city: "Nyon", postal: "1260", region: "VD" },
  { city: "Morges", postal: "1110", region: "VD" },
  { city: "Vevey", postal: "1800", region: "VD" },
  { city: "Yverdon-les-Bains", postal: "1400", region: "VD" },
  { city: "Renens", postal: "1020", region: "VD" },
  { city: "La Chaux-de-Fonds", postal: "2300", region: "NE" },
  { city: "Bienne", postal: "2500", region: "BE" },
  { city: "Thoune", postal: "3600", region: "BE" },
  { city: "Winterthour", postal: "8400", region: "ZH" },
  { city: "Saint-Gall", postal: "9000", region: "SG" },
  { city: "Lugano", postal: "6900", region: "TI" },
  { city: "Delémont", postal: "2800", region: "JU" },
  { city: "Martigny", postal: "1920", region: "VS" },
  { city: "Bulle", postal: "1630", region: "FR" },
  { city: "Aigle", postal: "1860", region: "VD" },
  { city: "Pully", postal: "1009", region: "VD" },
  { city: "Meyrin", postal: "1217", region: "GE" },
  { city: "Carouge", postal: "1227", region: "GE" },
  { city: "Lyon", postal: "69000", region: "FR" },
  { city: "Paris", postal: "75000", region: "FR" },
  { city: "Annecy", postal: "74000", region: "FR" },
  { city: "Mulhouse", postal: "68000", region: "FR" },
  { city: "Strasbourg", postal: "67000", region: "FR" },
  { city: "München", postal: "80331", region: "DE" },
  { city: "Berlin", postal: "10115", region: "DE" },
  { city: "Frankfurt", postal: "60311", region: "DE" },
  { city: "Stuttgart", postal: "70173", region: "DE" },
];

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
    const query = lieu.toLowerCase();
    return LOCATIONS.filter(
      (loc) =>
        loc.city.toLowerCase().startsWith(query) ||
        loc.postal.startsWith(query),
    ).slice(0, 8);
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
