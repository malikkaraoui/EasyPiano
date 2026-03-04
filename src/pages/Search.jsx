import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    return <div className="loading">Chargement des accordeurs...</div>;

  return (
    <div className="search-page">
      <h1>Trouver un accordeur de piano</h1>

      <div className="search-controls">
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
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="rating">Mieux notés</option>
          <option value="price">Prix croissant</option>
          <option value="reviews">Plus d&apos;avis</option>
        </select>
      </div>

      <p className="results-count">
        {filtered.length} accordeur{filtered.length > 1 ? "s" : ""} trouvé
        {filtered.length > 1 ? "s" : ""}
      </p>

      <div className="pros-grid">
        {filtered.map((pro) => (
          <Link to={`/pro/${pro.id}`} key={pro.id} className="pro-card">
            <div className="pro-card-photo">
              {pro.photoURL ? (
                <img
                  src={pro.photoURL}
                  alt={`${pro.firstName} ${pro.lastName}`}
                />
              ) : (
                <div className="pro-card-placeholder">🎹</div>
              )}
            </div>
            <div className="pro-card-info">
              <h3>
                {pro.firstName} {pro.lastName}
              </h3>
              <p className="pro-card-city">
                📍 {pro.city} ({pro.postalCode})
              </p>
              <div className="pro-card-rating">
                <span className="stars">
                  {"⭐".repeat(Math.round(pro.rating || 0))}
                </span>
                <span className="rating-text">
                  {formatRating(pro.rating || 0)} ({pro.reviewCount || 0} avis)
                </span>
              </div>
              <p className="pro-card-price">
                À partir de {formatPrice(pro.basePrice || 0)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="no-results">
          <p>Aucun accordeur trouvé pour votre recherche.</p>
          <p>Essayez avec une autre ville ou un autre code postal.</p>
        </div>
      )}
    </div>
  );
}
