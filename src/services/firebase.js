import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const env = (key) => (process.env[key] || "").trim();

const firebaseConfig = {
  apiKey: env("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: env("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  databaseURL: env("NEXT_PUBLIC_FIREBASE_DATABASE_URL"),
  projectId: env("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: env("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: env("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: env("NEXT_PUBLIC_FIREBASE_APP_ID"),
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.databaseURL &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.appId,
);

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;
export const googleProvider = app ? new GoogleAuthProvider() : null;
export const db = app ? getDatabase(app) : null;
export const storage = app ? getStorage(app) : null;

if (auth) {
  auth.languageCode = "fr";
}

if (googleProvider) {
  googleProvider.setCustomParameters({
    prompt: "select_account",
  });
}

export default app;
