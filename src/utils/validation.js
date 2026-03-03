export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone) {
  return /^(\+33|0)[1-9](\d{2}){4}$/.test(phone.replace(/\s/g, ""));
}

export function validatePostalCode(code) {
  return /^\d{5}$/.test(code);
}

export function validateRating(rating) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

export function validatePrice(price) {
  return typeof price === "number" && price > 0;
}
