import { verifyAuth } from "@/services/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { ref, get, update } from "firebase/database";
import { db } from "@/services/firebase";

export async function GET(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const snapshot = await get(ref(db, `users/${user.uid}`));
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
    await update(ref(db, `users/${user.uid}`), updates);

    return successResponse(updates);
  } catch (error) {
    console.error("[API] user/profile POST:", error);
    return errorResponse("Erreur lors de la mise à jour du profil", 500);
  }
}
