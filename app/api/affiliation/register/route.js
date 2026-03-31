import { verifyAuth } from "@/services/auth-server";
import {
  successResponse,
  errorResponse,
  createdResponse,
} from "@/lib/api-response";
import { ref, get, set } from "firebase/database";
import { db } from "@/services/firebase";

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    // Vérifier si déjà inscrit
    const existingRef = ref(db, `affiliates/${user.uid}`);
    const snapshot = await get(existingRef);
    if (snapshot.exists()) {
      const existing = snapshot.val();
      return successResponse({
        affiliateId: user.uid,
        code: existing.code,
        status: "already_registered",
      });
    }

    const body = await request.json();
    const { name, type } = body;

    if (!name || !type) {
      return errorResponse("name et type requis", 400);
    }

    if (!["teacher", "school", "other"].includes(type)) {
      return errorResponse("type doit être teacher, school ou other", 400);
    }

    const code = `AFF-${user.uid.slice(0, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const affiliateData = {
      userId: user.uid,
      name,
      type,
      code,
      totalConversions: 0,
      totalCommission: 0,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    await set(existingRef, affiliateData);

    return createdResponse({
      affiliateId: user.uid,
      code,
      status: "active",
    });
  } catch (error) {
    console.error("[API] affiliation/register:", error);
    return errorResponse("Erreur lors de l'inscription", 500);
  }
}
