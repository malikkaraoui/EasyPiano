import { verifyAuth } from "@/services/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getAdminDb } from "@/services/firebase-admin-db";

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);
  if (user.role !== "admin") return errorResponse("Accès refusé", 403);

  const db = getAdminDb();
  if (!db) return errorResponse("Base de données non disponible", 500);

  try {
    const body = await request.json();
    const { proId, action, reason } = body;

    if (!proId || !action) {
      return errorResponse("proId et action sont requis", 400);
    }

    if (!["validate", "refuse"].includes(action)) {
      return errorResponse("Action invalide (validate ou refuse)", 400);
    }

    const snapshot = await db.ref(`pros/${proId}`).once("value");
    if (!snapshot.exists()) {
      return errorResponse("Professionnel non trouvé", 404);
    }

    const proData = snapshot.val();
    if (proData.status !== "pending") {
      return errorResponse(
        `Ce profil est déjà "${proData.status}", impossible de le modifier`,
        400,
      );
    }

    const updates = {
      status: action === "validate" ? "validated" : "refused",
      validatedAt: new Date().toISOString(),
      validatedBy: user.uid,
    };

    if (action === "refuse") {
      if (!reason) {
        return errorResponse("Un motif est requis pour un refus", 400);
      }
      updates.refusalReason = reason;
    }

    await db.ref(`pros/${proId}`).update(updates);

    if (action === "validate") {
      await db.ref(`indexes/pros_by_status/validated/${proId}`).set(true);
    }

    return successResponse({
      proId,
      status: updates.status,
      validatedAt: updates.validatedAt,
    });
  } catch (error) {
    console.error("[API] admin/validate-pro:", error);
    return errorResponse("Erreur lors de la validation", 500);
  }
}
