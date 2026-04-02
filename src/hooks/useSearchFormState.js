import { useState } from "react";

export function useSearchFormState(initialState) {
  const [location, setLocation] = useState(initialState.location || "");
  const [date, setDate] = useState(initialState.date || "");
  const [sortBy, setSortBy] = useState(initialState.sortBy || "rating");

  return {
    location,
    date,
    sortBy,
    setLocation,
    setDate,
    setSortBy,
  };
}
