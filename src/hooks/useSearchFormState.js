import { useState } from "react";
import { DEFAULT_SEARCH_SORT } from "@/lib/search";

export function useSearchFormState(initialState = {}) {
  const initialLocation = initialState.location || "";
  const initialDate = initialState.date || "";
  const initialSortBy = initialState.sortBy || DEFAULT_SEARCH_SORT;
  const [location, setLocation] = useState(initialLocation);
  const [date, setDate] = useState(initialDate);
  const [sortBy, setSortBy] = useState(initialSortBy);

  return {
    location,
    date,
    sortBy,
    setLocation,
    setDate,
    setSortBy,
  };
}
