import { getFirebaseAdmin } from "./firebase-admin";

/**
 * Vérifie le token Firebase depuis le header Authorization.
 * Utilisé dans les API Routes pour protéger les endpoints.
 *
 * @param {Request} request - La requête HTTP
 * @returns {{ uid: string, email: string, role: string } | null}
 */
export async function verifyAuth(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split("Bearer ")[1];
  if (!token) {
    return null;
  }

  const admin = getFirebaseAdmin();
  if (!admin) {
    console.error("[Auth] Firebase Admin non initialisé");
    return null;
  }

  try {
    const decodedToken = await admin.auth.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      role: decodedToken.role || "client",
    };
  } catch (error) {
    console.error("[Auth] Token invalide:", error.message);
    return null;
  }
}
