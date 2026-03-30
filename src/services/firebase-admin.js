import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getFirebaseAdmin() {
  if (getApps().length > 0) {
    return { auth: getAuth() };
  }

  const credential = process.env.FIREBASE_ADMIN_CREDENTIAL;
  if (!credential) {
    console.error("[Auth] FIREBASE_ADMIN_CREDENTIAL non définie");
    return null;
  }

  try {
    const serviceAccount = JSON.parse(credential);
    initializeApp({ credential: cert(serviceAccount) });
    return { auth: getAuth() };
  } catch (error) {
    console.error(
      "[Auth] Erreur initialisation Firebase Admin:",
      error.message,
    );
    return null;
  }
}

export { getFirebaseAdmin };
