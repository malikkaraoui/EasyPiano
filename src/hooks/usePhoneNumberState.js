import { useCallback, useMemo, useState } from "react";
import {
  composeStoredPhoneNumber,
  DEFAULT_DIAL_CODE,
  normalizePhoneFieldValue,
  parseStoredPhoneNumber,
} from "@/lib/phone";

export function usePhoneNumberState({
  initialValue = "",
  defaultDialCode = DEFAULT_DIAL_CODE,
} = {}) {
  const [value, setValue] = useState(() =>
    parseStoredPhoneNumber(initialValue, defaultDialCode),
  );

  const setPhoneFields = useCallback(
    (nextValue) => {
      setValue(normalizePhoneFieldValue(nextValue, defaultDialCode));
    },
    [defaultDialCode],
  );

  const setStoredPhone = useCallback(
    (nextPhone) => {
      setValue(parseStoredPhoneNumber(nextPhone, defaultDialCode));
    },
    [defaultDialCode],
  );

  const phoneValue = useMemo(
    () => composeStoredPhoneNumber(value, defaultDialCode),
    [defaultDialCode, value],
  );

  return {
    value,
    setValue: setPhoneFields,
    setStoredPhone,
    phoneValue,
  };
}
