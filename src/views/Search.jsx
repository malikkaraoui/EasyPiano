"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getActiveProfessionals } from "../services/database";
import { formatPrice, formatRating } from "../utils/format";
import CityPostalAutocomplete from "@components/UI/CityPostalAutocomplete";

export default function Search() {
  const [pros, setPros] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    async function load() {
      try {
        const data = await getActiveProfessionals();
        setPros(data);
        setFiltered(data);
      } catch (err) {
        console.error("Erreur chargement pros:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const terms = search.toLowerCase().trim().split(/\s+/).filter(Boolean);

    let results = pros.filter((p) => {
      const city = (p.city || "").toLowerCase();
      const postalCode = String(p.postalCode || "").toLowerCase();
      const fullName = `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase();

      if (terms.length === 0) return true;

      return terms.every(
        (term) =>
          city.includes(term) ||
          postalCode.startsWith(term) ||
          fullName.includes(term),
      );
    });

    results.sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "price") return (a.basePrice || 0) - (b.basePrice || 0);
      if (sortBy === "reviews")
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      return 0;
    });

    setFiltered(results);
  }, [search, sortBy, pros]);

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

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <CityPostalAutocomplete
            value={search}
            onChange={setSearch}
            onSelect={(selection) => {
              const nextValue = [selection.city, selection.postalCode]
                .filter(Boolean)
                .join(" ");
              setSearch(
                nextValue || selection.city || selection.postalCode || "",
              );
            }}
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-10 rounded border border-border bg-background px-3 text-sm text-foreground"
        >
          <option value="rating">Mieux notés</option>
          <option value="price">Prix croissant</option>
          <option value="reviews">Plus d&apos;avis</option>
        </select>
      </div>

      <p className="mt-4 text-sm text-muted">
        {filtered.length} accordeur{filtered.length > 1 ? "s" : ""} trouvé
        {filtered.length > 1 ? "s" : ""}
      </p>

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
                <div className="flex h-full w-full items-center justify-center text-4xl">
                  🎹
                </div>
              )}
            </div>
            <div className="mt-4">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {pro.firstName} {pro.lastName}
              </h3>
              <p className="mt-1 text-sm text-muted">
                📍 {pro.city} ({pro.postalCode})
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span>{"⭐".repeat(Math.round(pro.rating || 0))}</span>
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
