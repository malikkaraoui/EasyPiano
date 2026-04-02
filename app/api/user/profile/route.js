import { verifyAuth } from "@/services/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getAdminDb } from "@/services/firebase-admin-db";

export async function GET(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const db = getAdminDb();
    if (!db) return errorResponse("Base de données non disponible", 500);

    const snapshot = await db.ref(`users/${user.uid}`).once("value");
    if (!snapshot.exists()) return errorResponse("Profil non trouvé", 404);

    return successResponse(snapshot.val());
  } catch (error) {
    console.error("[API] user/profile GET:", error);
    return errorResponse("Erreur lors de la récupération du profil", 500);
  }
}

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const db = getAdminDb();
    if (!db) return errorResponse("Base de données non disponible", 500);

    const body = await request.json();
    const allowedFields = ["displayName", "phone", "isB2B"];
    const updates = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse("Aucun champ à mettre à jour", 400);
    }

    updates.updatedAt = new Date().toISOString();
    await db.ref(`users/${user.uid}`).update(updates);

    return successResponse(updates);
  } catch (error) {
    console.error("[API] user/profile POST:", error);
    return errorResponse("Erreur lors de la mise à jour du profil", 500);
  }
}
