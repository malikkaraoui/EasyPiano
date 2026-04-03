"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChipSelect } from "@/components/UI/ChipSelect";
import { HeroSearchBar } from "@components/HeroSearchBar";
import { useSearchFormState } from "@/hooks/useSearchFormState";
import {
  SEARCH_SORT_OPTIONS,
  buildSearchHref,
  filterAndSortProfessionals,
  getSearchFormStateFromParams,
} from "@/lib/search";
import { getActiveProfessionals } from "../services/database";
import { formatPrice, formatRating } from "../utils/format";

export default function Search() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pros, setPros] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialFilters = useMemo(
    () => getSearchFormStateFromParams(searchParams),
    [searchParams],
  );
  const searchStateKey = [
    initialFilters.location,
    initialFilters.date,
    initialFilters.sortBy,
  ].join("|");

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

  if (loading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Chargement des accordeurs...
      </div>
    );

  return (
    <SearchContent
      key={searchStateKey}
      initialFilters={initialFilters}
      pathname={pathname}
      pros={pros}
    />
  );
}

function SearchContent({ initialFilters, pathname, pros }) {
  const router = useRouter();
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const { location, date, sortBy, setLocation, setDate, setSortBy } =
    useSearchFormState(initialFilters);
  const filtered = useMemo(
    () => filterAndSortProfessionals(pros, { location, sortBy }),
    [location, sortBy, pros],
  );

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

  const sortChipOptions = useMemo(
    () =>
      SEARCH_SORT_OPTIONS.map((opt) => ({ code: opt.value, label: opt.label })),
    [],
  );

  function handleSortToggle(nextSort) {
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
          onLocationMenuOpenChange={setIsLocationMenuOpen}
          onDateChange={setDate}
          onSubmit={handleSearchSubmit}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {!isLocationMenuOpen ? (
            <p className="text-sm text-muted">
              {filtered.length} accordeur{filtered.length > 1 ? "s" : ""} trouvé
              {filtered.length > 1 ? "s" : ""}
            </p>
          ) : (
            <div aria-hidden="true" className="h-5" />
          )}

          <ChipSelect
            options={sortChipOptions}
            selected={sortBy}
            onToggle={handleSortToggle}
            multi={false}
            name="search-sort"
          />
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

      {filtered.length === 0 && !isLocationMenuOpen && (
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
