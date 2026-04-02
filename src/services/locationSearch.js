import SWISS_LOCATIONS from "@/data/swiss-locations.json";

const normalize = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export async function searchCityOrPostal(query, limit = 5) {
  const q = normalize(String(query || "").trim());
  if (q.length < 2) return [];

  const isPostalQuery = /^\d+$/.test(q);
  const seen = new Set();

  const matches = SWISS_LOCATIONS.filter((loc) => {
    if (isPostalQuery) {
      return loc.postal.startsWith(q);
    }
    return normalize(loc.city).startsWith(q);
  })
    .filter((loc) => {
      const key = `${loc.city}|${loc.postal}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit)
    .map((loc) => ({
      city: loc.city,
      postalCode: loc.postal,
      countryCode: "ch",
      country: "Suisse",
    }));

  return matches;
}
