"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  HeroSearchBar,
  buildSearchHref,
  DEFAULT_SEARCH_SORT,
} from "@components/HeroSearchBar";
import { useSearchFormState } from "@/hooks/useSearchFormState";
import { getActiveProfessionals } from "../services/database";
import { formatPrice, formatRating } from "../utils/format";

const SEARCH_SORT_OPTIONS = [
  { value: "rating", label: "Mieux notés" },
  { value: "price", label: "Prix croissant" },
  { value: "reviews", label: "Plus d'avis" },
];

function normalizeSearchValue(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[(),]/g, " ");
}

function isSupportedSort(sortBy) {
  return SEARCH_SORT_OPTIONS.some((option) => option.value === sortBy);
}

export default function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pros, setPros] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialLocation = searchParams.get("lieu") || "";
  const initialDate = searchParams.get("date") || "";
  const initialSort = isSupportedSort(searchParams.get("sort"))
    ? searchParams.get("sort")
    : DEFAULT_SEARCH_SORT;
  const { location, date, sortBy, setLocation, setDate, setSortBy } =
    useSearchFormState({
      location: initialLocation,
      date: initialDate,
      sortBy: initialSort,
    });

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await getActiveProfessionals();
        if (isMounted) setPros(data);
      } catch (err) {
        console.error("Erreur chargement pros:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const terms = normalizeSearchValue(location)
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const results = pros.filter((pro) => {
      if (terms.length === 0) return true;

      const city = normalizeSearchValue(pro.city);
      const postalCode = normalizeSearchValue(String(pro.postalCode || ""));
      const fullName = normalizeSearchValue(
        `${pro.firstName || ""} ${pro.lastName || ""}`,
      );

      return terms.every(
        (term) =>
          city.includes(term) ||
          postalCode.startsWith(term) ||
          fullName.includes(term),
      );
    });

    return results.sort((a, b) => {
      if (sortBy === "price") return (a.basePrice || 0) - (b.basePrice || 0);
      if (sortBy === "reviews") {
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      return (b.rating || 0) - (a.rating || 0);
    });
  }, [location, sortBy, pros]);

  function handleSearchSubmit(nextFilters) {
    router.push(
      buildSearchHref({
        basePath: pathname,
        location: nextFilters.location,
        date: nextFilters.date,
        sortBy,
        includeSort: true,
      }),
    );
  }

  function handleSortChange(event) {
    const nextSort = event.target.value;
    setSortBy(nextSort);
    router.replace(
      buildSearchHref({
        basePath: pathname,
        location,
        date,
        sortBy: nextSort,
        includeSort: true,
      }),
    );
  }

  if (loading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Chargement des accordeurs...
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">
        Trouver un accordeur de piano
      </h1>

      <div className="mt-6 space-y-4">
        <HeroSearchBar
          variant="page"
          locationValue={location}
          dateValue={date}
          onLocationChange={setLocation}
          onDateChange={setDate}
          onSubmit={handleSearchSubmit}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            {filtered.length} accordeur{filtered.length > 1 ? "s" : ""} trouvé
            {filtered.length > 1 ? "s" : ""}
          </p>

          <select
            value={sortBy}
            onChange={handleSortChange}
            className="h-12 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {SEARCH_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((pro) => (
          <Link
            href={`/pro/${pro.id}`}
            key={pro.id}
            className="group rounded-xl border border-glow p-4 glass transition-all duration-300 hover:-translate-y-1"
          >
            <div className="aspect-square overflow-hidden rounded-lg bg-card">
              {pro.photoURL ? (
                <img
                  src={pro.photoURL}
                  alt={`${pro.firstName} ${pro.lastName}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-muted">
                  Photo non disponible
                </div>
              )}
            </div>
            <div className="mt-4">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {pro.firstName} {pro.lastName}
              </h3>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>
                  {pro.city} ({pro.postalCode})
                </span>
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-muted">
                  {formatRating(pro.rating || 0)} ({pro.reviewCount || 0} avis)
                </span>
              </div>
              <p className="mt-2 font-semibold text-accent">
                À partir de {formatPrice(pro.basePrice || 0)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-muted">
            Aucun accordeur trouvé pour votre recherche.
          </p>
          <p className="mt-1 text-sm text-muted">
            Essayez avec une autre ville ou un autre code postal.
          </p>
        </div>
      )}
    </div>
  );
}
