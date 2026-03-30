import { successResponse, errorResponse } from "@/lib/api-response";
import { ref, get } from "firebase/database";
import { db } from "@/services/firebase";

export async function GET(request, { params }) {
  try {
    const { proId } = await params;

    const proSnapshot = await get(ref(db, `pros/${proId}`));
    if (!proSnapshot.exists()) {
      return errorResponse("Accordeur non trouvé", 404);
    }

    const pro = proSnapshot.val();
    if (pro.status !== "validated") {
      return errorResponse("Accordeur non trouvé", 404);
    }

    // Récupérer les disponibilités
    const availSnapshot = await get(ref(db, `availabilities/${proId}`));
    const availabilities = availSnapshot.exists()
      ? Object.entries(availSnapshot.val()).map(([id, data]) => ({
          id,
          ...data,
        }))
      : [];

    // Récupérer les avis
    const reviewsSnapshot = await get(ref(db, "reviews"));
    const allReviews = reviewsSnapshot.exists() ? reviewsSnapshot.val() : {};
    const reviews = Object.values(allReviews).filter((r) => r.proId === proId);

    // Profil public (sans données sensibles)
    const publicProfile = {
      proId,
      bio: pro.bio,
      photoURL: pro.photoURL,
      country: pro.country,
      languages: pro.languages,
      certificates: pro.certificates || [],
      stats: pro.stats || {},
      availabilities,
      reviews,
    };

    return successResponse(publicProfile);
  } catch (error) {
    console.error("[API] pros/[proId]:", error);
    return errorResponse("Erreur lors de la récupération du profil", 500);
  }
}
