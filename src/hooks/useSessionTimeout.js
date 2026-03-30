"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "./useAuth";

const PRO_SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Hook de timeout de session pour les pros.
 * Déconnecte après 30 minutes d'inactivité (FR56, NFR-S3).
 * Actif uniquement si l'utilisateur a le rôle "pro".
 *
 * @param {{ onTimeout: () => void, role?: string }} options
 */
export function useSessionTimeout({ onTimeout, role } = {}) {
  const { user } = useAuth();
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onTimeout?.();
    }, PRO_SESSION_TIMEOUT_MS);
  }, [onTimeout]);

  useEffect(() => {
    const isPro = role === "pro";
    if (!user || !isPro) return;

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, role, resetTimer]);

  return { resetTimer };
}

export { PRO_SESSION_TIMEOUT_MS };
