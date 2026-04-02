import {
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { ref, set, get, update } from "firebase/database";
import { auth, googleProvider, db } from "./firebase";

const GOOGLE_REDIRECT_FALLBACK_CODES = new Set([
  "auth/cancelled-popup-request",
  "auth/operation-not-supported-in-this-environment",
  "auth/popup-blocked",
  "auth/web-storage-unsupported",
]);

function ensureFirebaseAuthReady() {
  if (!auth || !googleProvider || !db) {
    throw new Error("Firebase Auth n'est pas configuré.");
  }
}

function shouldPreferRedirectFlow() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /\b(?:Chrome|CriOS|Chromium|Edg)\/\d+/i.test(navigator.userAgent);
}

function shouldFallbackToRedirect(error) {
  const message = error?.message || "";

  return (
    GOOGLE_REDIRECT_FALLBACK_CODES.has(error?.code) ||
    /Cross-Origin-Opener-Policy|COOP|opener|Illegal url/i.test(message)
  );
}

async function syncUserProfile(user) {
  const timestamp = new Date().toISOString();
  const userRef = ref(db, `users/${user.uid}`);
  const snapshot = await get(userRef);

  const baseProfile = {
    displayName: user.displayName || "",
    email: user.email || "",
    lastLoginAt: timestamp,
    ...(user.photoURL ? { photoURL: user.photoURL } : {}),
  };

  if (!snapshot.exists()) {
    await set(userRef, {
      ...baseProfile,
      photoURL: user.photoURL || null,
      role: "client",
      isB2B: false,
      createdAt: timestamp,
    });
  } else {
    await update(userRef, baseProfile);
  }

  return user;
}

export async function loginWithGoogle() {
  ensureFirebaseAuthReady();

  if (shouldPreferRedirectFlow()) {
    await signInWithRedirect(auth, googleProvider);
    return { redirected: true };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      redirected: false,
      user: await syncUserProfile(result.user),
    };
  } catch (error) {
    if (!shouldFallbackToRedirect(error)) {
      throw error;
    }

    await signInWithRedirect(auth, googleProvider);
    return { redirected: true };
  }
}

export async function completeGoogleRedirectLogin() {
  ensureFirebaseAuthReady();

  const result = await getRedirectResult(auth);

  if (!result?.user) {
    return null;
  }

  return syncUserProfile(result.user);
}

export async function logout() {
  await signOut(auth);
}

export async function isAdmin(uid) {
  const snapshot = await get(ref(db, `admins/${uid}`));
  return snapshot.exists();
}
