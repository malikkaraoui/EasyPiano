"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/UI/button";

const CITIES = [
  "Lausanne",
  "Genève",
  "Zürich",
  "Berne",
  "Bâle",
  "Lucerne",
  "Montreux",
  "Neuchâtel",
  "Fribourg",
  "Sion",
  "Nyon",
  "Morges",
  "Vevey",
  "Yverdon-les-Bains",
  "Renens",
  "La Chaux-de-Fonds",
  "Bienne",
  "Thoune",
  "Winterthour",
  "Saint-Gall",
  "Lyon",
  "Paris",
  "Annecy",
  "Strasbourg",
  "Mulhouse",
  "München",
  "Berlin",
  "Frankfurt",
  "Stuttgart",
];

function HeroSearchBar() {
  const router = useRouter();
  const [lieu, setLieu] = useState("");
  const [date, setDate] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  function handleLieuChange(value) {
    setLieu(value);
    if (value.length >= 2) {
      const matches = CITIES.filter((city) =>
        city.toLowerCase().startsWith(value.toLowerCase()),
      ).slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function selectSuggestion(city) {
    setLieu(city);
    setSuggestions([]);
    setShowSuggestions(false);
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
      className="mt-10 mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-xl border border-glow p-2 glass sm:flex-row"
    >
      <div className="relative flex-1">
        <input
          type="text"
          name="lieu"
          value={lieu}
          onChange={(e) => handleLieuChange(e.target.value)}
          onFocus={() =>
            lieu.length >= 2 && setShowSuggestions(suggestions.length > 0)
          }
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Ville ou code postal"
          aria-label="Lieu de recherche"
          autoComplete="off"
          className="flex h-12 w-full rounded border-transparent bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        />
        {showSuggestions && (
          <ul className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-border bg-card py-1 shadow-lg">
            {suggestions.map((city) => (
              <li key={city}>
                <button
                  type="button"
                  onMouseDown={() => selectSuggestion(city)}
                  className="w-full px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent/10"
                >
                  📍 {city}
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
