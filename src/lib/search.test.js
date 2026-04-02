import { describe, expect, it } from "vitest";
import {
  buildSearchHref,
  DEFAULT_SEARCH_SORT,
  filterAndSortProfessionals,
  getSearchFormStateFromParams,
} from "./search";

const professionals = [
  {
    id: "pro-1",
    firstName: "Alice",
    lastName: "Martin",
    city: "Lausanne",
    postalCode: "1000",
    rating: 4.6,
    reviewCount: 8,
    basePrice: 130,
  },
  {
    id: "pro-2",
    firstName: "Bruno",
    lastName: "Durand",
    city: "Genève",
    postalCode: "1201",
    rating: 4.9,
    reviewCount: 18,
    basePrice: 150,
  },
  {
    id: "pro-3",
    firstName: "Chloé",
    lastName: "Favre",
    city: "Lausanne",
    postalCode: "1003",
    rating: 4.8,
    reviewCount: 25,
    basePrice: 110,
  },
];

describe("search shared logic", () => {
  it("construit une URL de recherche propre", () => {
    expect(
      buildSearchHref({
        location: "Lausanne 1000",
        date: "2026-11-11",
        sortBy: DEFAULT_SEARCH_SORT,
        includeSort: true,
      }),
    ).toBe("/search?lieu=Lausanne+1000&date=2026-11-11");

    expect(
      buildSearchHref({
        basePath: "/search",
        location: "Genève 1201",
        sortBy: "reviews",
        includeSort: true,
      }),
    ).toBe("/search?lieu=Gen%C3%A8ve+1201&sort=reviews");
  });

  it("hydrate les filtres depuis les query params", () => {
    expect(
      getSearchFormStateFromParams(
        new URLSearchParams("lieu=Gen%C3%A8ve+1201&date=2026-11-11&sort=price"),
      ),
    ).toEqual({
      location: "Genève 1201",
      date: "2026-11-11",
      sortBy: "price",
    });

    expect(
      getSearchFormStateFromParams(new URLSearchParams("sort=unsupported")),
    ).toEqual({
      location: "",
      date: "",
      sortBy: DEFAULT_SEARCH_SORT,
    });
  });

  it("filtre et trie les pros depuis la logique mutualisée", () => {
    expect(
      filterAndSortProfessionals(professionals, {
        location: "Lausanne",
        sortBy: "reviews",
      }).map((professional) => professional.id),
    ).toEqual(["pro-3", "pro-1"]);

    expect(
      filterAndSortProfessionals(professionals, {
        location: "Bruno",
        sortBy: "price",
      }).map((professional) => professional.id),
    ).toEqual(["pro-2"]);
  });
});
