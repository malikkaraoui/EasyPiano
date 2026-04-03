import { useState } from "react";

/**
 * Gère la sélection de chips (multi ou single).
 * @param {{ initial: string[] | string, multi?: boolean }} options
 * @returns {{ selected: string[] | string, toggle: (code: string) => void, reset: () => void }}
 */
export function useChipSelect({ initial, multi = true }) {
  const [selected, setSelected] = useState(initial);

  function toggle(code) {
    if (multi) {
      setSelected((prev) =>
        prev.includes(code)
          ? prev.filter((item) => item !== code)
          : [...prev, code],
      );
    } else {
      setSelected(code);
    }
  }

  function reset() {
    setSelected(initial);
  }

  return { selected, toggle, reset };
}
