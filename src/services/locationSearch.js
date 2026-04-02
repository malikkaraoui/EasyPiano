import SWISS_LOCATIONS from "@/data/swiss-locations.json";

export async function searchCityOrPostal(query, limit = 5) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (q.length < 2) return [];

  const isPostalQuery = /^\d+$/.test(q);
  const seen = new Set();

  const matches = SWISS_LOCATIONS.filter((loc) => {
    if (isPostalQuery) {
      return loc.postal.startsWith(q);
    }
    return loc.city.toLowerCase().startsWith(q);
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
