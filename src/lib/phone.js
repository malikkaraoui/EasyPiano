const DEFAULT_DIAL_CODE = "+41";
const MAX_DIAL_CODE_LENGTH = 3;
const MAX_NATIONAL_NUMBER_LENGTH = 12;

const KNOWN_DIAL_CODES = ["+385", "+380", "+49", "+48", "+41", "+33"];

function splitIntoGroups(digits, groups) {
  const parts = [];
  let cursor = 0;

  groups.forEach((groupSize) => {
    if (cursor >= digits.length) return;
    parts.push(digits.slice(cursor, cursor + groupSize));
    cursor += groupSize;
  });

  if (cursor < digits.length) {
    parts.push(digits.slice(cursor));
  }

  return parts.filter(Boolean);
}

function guessDialCodeFromDigits(digits) {
  const knownDialCode = [...KNOWN_DIAL_CODES]
    .sort((left, right) => right.length - left.length)
    .find((candidate) => digits.startsWith(candidate.slice(1)));

  if (knownDialCode) return knownDialCode;
  if (digits.length > 10) return `+${digits.slice(0, 3)}`;
  if (digits.length > 8) return `+${digits.slice(0, 2)}`;
  return `+${digits.slice(0, 1)}`;
}

export function sanitizeDialCodeInput(value) {
  const digits = `${value ?? ""}`
    .replace(/\D/g, "")
    .slice(0, MAX_DIAL_CODE_LENGTH);
  return digits ? `+${digits}` : "";
}

export function resolveDialCode(value, fallbackDialCode = DEFAULT_DIAL_CODE) {
  return sanitizeDialCodeInput(value) || fallbackDialCode;
}

export function sanitizeNationalPhoneNumber(value) {
  const digits = `${value ?? ""}`.replace(/\D/g, "").replace(/^0+/, "");
  return digits.slice(0, MAX_NATIONAL_NUMBER_LENGTH);
}

export function formatNationalPhoneNumber(value) {
  const digits = sanitizeNationalPhoneNumber(value);

  if (!digits) return "";

  if (digits.length <= 9) {
    return splitIntoGroups(digits, [2, 3, 2, 2]).join(" ");
  }

  return splitIntoGroups(digits, [2, 3, 3, 4]).join(" ");
}

export function normalizePhoneFieldValue(
  value,
  fallbackDialCode = DEFAULT_DIAL_CODE,
) {
  const dialCode = resolveDialCode(value?.dialCode, fallbackDialCode);
  const nationalNumber = formatNationalPhoneNumber(value?.nationalNumber);

  return {
    dialCode,
    nationalNumber,
  };
}

export function parseStoredPhoneNumber(
  value,
  fallbackDialCode = DEFAULT_DIAL_CODE,
) {
  const input = `${value ?? ""}`.trim();

  if (!input) {
    return {
      dialCode: fallbackDialCode,
      nationalNumber: "",
    };
  }

  if (input.startsWith("+")) {
    const digits = input.replace(/\D/g, "");
    const dialCode = guessDialCodeFromDigits(digits);
    const nationalDigits = digits.slice(dialCode.length - 1);

    return {
      dialCode,
      nationalNumber: formatNationalPhoneNumber(nationalDigits),
    };
  }

  return {
    dialCode: fallbackDialCode,
    nationalNumber: formatNationalPhoneNumber(input),
  };
}

export function composeStoredPhoneNumber(
  value,
  fallbackDialCode = DEFAULT_DIAL_CODE,
) {
  const dialCode = resolveDialCode(value?.dialCode, fallbackDialCode);
  const nationalDigits = sanitizeNationalPhoneNumber(value?.nationalNumber);

  if (!nationalDigits) return "";

  return `${dialCode}${nationalDigits}`;
}

export function isValidPhoneNumber(
  value,
  fallbackDialCode = DEFAULT_DIAL_CODE,
) {
  const parsed =
    typeof value === "string"
      ? parseStoredPhoneNumber(value, fallbackDialCode)
      : normalizePhoneFieldValue(value, fallbackDialCode);

  const dialCodeDigits = resolveDialCode(
    parsed.dialCode,
    fallbackDialCode,
  ).replace(/\D/g, "");
  const nationalDigits = sanitizeNationalPhoneNumber(parsed.nationalNumber);
  const fullDigits = `${dialCodeDigits}${nationalDigits}`;

  return (
    dialCodeDigits.length >= 1 &&
    nationalDigits.length >= 6 &&
    fullDigits.length >= 8 &&
    fullDigits.length <= 15
  );
}

export {
  DEFAULT_DIAL_CODE,
  KNOWN_DIAL_CODES,
  MAX_DIAL_CODE_LENGTH,
  MAX_NATIONAL_NUMBER_LENGTH,
};
