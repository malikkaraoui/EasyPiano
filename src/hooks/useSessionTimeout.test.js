import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSessionTimeout, PRO_SESSION_TIMEOUT_MS } from "./useSessionTimeout";

vi.mock("./useAuth", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "./useAuth";

describe("useSessionTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("n'active pas le timer si pas d'utilisateur", () => {
    useAuth.mockReturnValue({ user: null });
    const onTimeout = vi.fn();

    renderHook(() => useSessionTimeout({ onTimeout, role: "pro" }));

    vi.advanceTimersByTime(PRO_SESSION_TIMEOUT_MS + 1000);
    expect(onTimeout).not.toHaveBeenCalled();
  });

  it("n'active pas le timer si le rôle n'est pas 'pro'", () => {
    useAuth.mockReturnValue({ user: { uid: "u1" } });
    const onTimeout = vi.fn();

    renderHook(() => useSessionTimeout({ onTimeout, role: "client" }));

    vi.advanceTimersByTime(PRO_SESSION_TIMEOUT_MS + 1000);
    expect(onTimeout).not.toHaveBeenCalled();
  });

  it("appelle onTimeout après 30 minutes d'inactivité pour un pro", () => {
    useAuth.mockReturnValue({ user: { uid: "u1" } });
    const onTimeout = vi.fn();

    renderHook(() => useSessionTimeout({ onTimeout, role: "pro" }));

    vi.advanceTimersByTime(PRO_SESSION_TIMEOUT_MS);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it("réinitialise le timer sur activité utilisateur", () => {
    useAuth.mockReturnValue({ user: { uid: "u1" } });
    const onTimeout = vi.fn();

    renderHook(() => useSessionTimeout({ onTimeout, role: "pro" }));

    // Avancer de 20 minutes
    vi.advanceTimersByTime(20 * 60 * 1000);

    // Simuler activité
    act(() => {
      window.dispatchEvent(new Event("mousedown"));
    });

    // Avancer de 20 minutes de plus (40 min total mais timer reset)
    vi.advanceTimersByTime(20 * 60 * 1000);
    expect(onTimeout).not.toHaveBeenCalled();

    // Avancer les 10 minutes restantes
    vi.advanceTimersByTime(10 * 60 * 1000);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it("le timeout est exactement 30 minutes", () => {
    expect(PRO_SESSION_TIMEOUT_MS).toBe(30 * 60 * 1000);
  });

  it("nettoie le timer au démontage", () => {
    useAuth.mockReturnValue({ user: { uid: "u1" } });
    const onTimeout = vi.fn();

    const { unmount } = renderHook(() =>
      useSessionTimeout({ onTimeout, role: "pro" }),
    );

    unmount();
    vi.advanceTimersByTime(PRO_SESSION_TIMEOUT_MS + 1000);
    expect(onTimeout).not.toHaveBeenCalled();
  });
});
