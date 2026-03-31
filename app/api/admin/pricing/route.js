import { verifyAuth } from "@/services/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { ref, get, set } from "firebase/database";
import { db } from "@/services/firebase";

const DEFAULT_PRICE_CENTS = 15000; // 150 CHF

export async function GET(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);
  if (user.role !== "admin") return errorResponse("Accès refusé", 403);

  try {
    const snapshot = await get(ref(db, "pricing"));
    const pricing = snapshot.exists() ? snapshot.val() : {};

    return successResponse({
      defaultPrice: DEFAULT_PRICE_CENTS,
      zones: pricing,
    });
  } catch (error) {
    console.error("[API] admin/pricing GET:", error);
    return errorResponse("Erreur", 500);
  }
}

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);
  if (user.role !== "admin") return errorResponse("Accès refusé", 403);

  try {
    const body = await request.json();
    const { zone, priceCents } = body;

    if (!zone || !priceCents) {
      return errorResponse("zone et priceCents requis", 400);
    }

    if (
      typeof priceCents !== "number" ||
      priceCents < 5000 ||
      priceCents > 50000
    ) {
      return errorResponse("Prix entre 50 CHF et 500 CHF", 400);
    }

    await set(ref(db, `pricing/${zone}`), {
      priceCents,
      updatedAt: new Date().toISOString(),
      updatedBy: user.uid,
    });

    return successResponse({ zone, priceCents });
  } catch (error) {
    console.error("[API] admin/pricing POST:", error);
    return errorResponse("Erreur lors de la configuration du prix", 500);
  }
}
