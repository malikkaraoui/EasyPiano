import { isValidPhoneNumber } from "../lib/phone";

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone) {
  return isValidPhoneNumber(phone);
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
