export const DEFAULT_SEARCH_SORT = "rating";

export const SEARCH_SORT_OPTIONS = [
  { value: "rating", label: "Mieux notés" },
  { value: "price", label: "Prix croissant" },
  { value: "reviews", label: "Plus d'avis" },
];

export function isSupportedSearchSort(sortBy) {
  return SEARCH_SORT_OPTIONS.some((option) => option.value === sortBy);
}

export function normalizeSearchValue(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[(),]/g, " ");
}

export function buildSearchHref({
  location,
  date,
  sortBy,
  includeSort = false,
  basePath = "/search",
}) {
  const params = new URLSearchParams();

  if (location?.trim()) params.set("lieu", location.trim());
  if (date?.trim()) params.set("date", date.trim());
  if (includeSort && sortBy && sortBy !== DEFAULT_SEARCH_SORT) {
    params.set("sort", sortBy);
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function getSearchFormStateFromParams(searchParams) {
  const sortBy = searchParams?.get("sort");

  return {
    location: searchParams?.get("lieu") || "",
    date: searchParams?.get("date") || "",
    sortBy: isSupportedSearchSort(sortBy) ? sortBy : DEFAULT_SEARCH_SORT,
  };
}

export function filterAndSortProfessionals(
  professionals = [],
  { location = "", sortBy = DEFAULT_SEARCH_SORT } = {},
) {
  const terms = normalizeSearchValue(location)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const filteredProfessionals = professionals.filter((professional) => {
    if (terms.length === 0) return true;

    const city = normalizeSearchValue(professional.city);
    const postalCode = normalizeSearchValue(
      String(professional.postalCode || ""),
    );
    const fullName = normalizeSearchValue(
      `${professional.firstName || ""} ${professional.lastName || ""}`,
    );

    return terms.every(
      (term) =>
        city.includes(term) ||
        postalCode.startsWith(term) ||
        fullName.includes(term),
    );
  });

  return filteredProfessionals.sort((a, b) => {
    if (sortBy === "price") return (a.basePrice || 0) - (b.basePrice || 0);
    if (sortBy === "reviews") {
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    }

    return (b.rating || 0) - (a.rating || 0);
  });
}
