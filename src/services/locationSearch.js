const COUNTRY_LABELS = {
  fr: "France",
  ch: "Suisse",
};

function pickCity(address = {}) {
  return (
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.county ||
    ""
  );
}

export async function searchCityOrPostal(query, limit = 8) {
  const q = String(query || "").trim();
  if (q.length < 2) return [];

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("countrycodes", "fr,ch");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("dedupe", "1");

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "Accept-Language": "fr",
    },
  });

  if (!response.ok) {
    throw new Error(`nominatim error (${response.status})`);
  }

  const data = await response.json();
  const seen = new Set();

  const mapped = (Array.isArray(data) ? data : [])
    .map((item) => {
      const city = pickCity(item.address);
      const postalCode = item.address?.postcode || "";
      const countryCode = (item.address?.country_code || "").toLowerCase();

      return {
        city,
        postalCode,
        countryCode,
        country: COUNTRY_LABELS[countryCode] || item.address?.country || "",
        lat: Number(item.lat),
        lng: Number(item.lon),
      };
    })
    .filter((s) => s.city || s.postalCode)
    .filter((s) => {
      const key = `${s.city}|${s.postalCode}|${s.countryCode}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  const isPostalQuery = /^\d+$/.test(q);
  return mapped.sort((a, b) => {
    if (isPostalQuery) {
      const aMatch = a.postalCode.startsWith(q) ? 0 : 1;
      const bMatch = b.postalCode.startsWith(q) ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
    }

    const qa = (a.city || "").toLowerCase().indexOf(q.toLowerCase());
    const qb = (b.city || "").toLowerCase().indexOf(q.toLowerCase());
    return (qa === -1 ? 999 : qa) - (qb === -1 ? 999 : qb);
  });
}
