export function formatPrice(cents) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents);
}

export function formatDate(isoString) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoString));
}

export function formatDateTime(isoString) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}

export function formatRating(rating) {
  return Number(rating).toFixed(1);
}

export function truncate(str, maxLength = 100) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "...";
}
