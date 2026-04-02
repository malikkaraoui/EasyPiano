import { verifyAuth } from "@/services/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getAdminDb } from "@/services/firebase-admin-db";

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const db = getAdminDb();
    if (!db) return errorResponse("Base de données non disponible", 500);

    const body = await request.json();

    const requiredFields = ["bio", "email", "country", "languages"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return errorResponse(`Le champ "${field}" est obligatoire`, 400);
      }
    }

    if (!Array.isArray(body.languages) || body.languages.length === 0) {
      return errorResponse("Au moins une langue est requise", 400);
    }

    const proRef = db.ref("pros").push();
    const proData = {
      userId: user.uid,
      bio: body.bio,
      email: body.email,
      country: body.country,
      languages: body.languages,
      phone: body.phone || null,
      photoURL: body.photoURL || null,
      certificates: body.certificates || [],
      videoURL: body.videoURL || null,
      status: "pending",
      validatedAt: null,
      validatedBy: null,
      refusalReason: null,
      stripeAccountId: null,
      stripeOnboardingComplete: false,
      stats: {
        totalBookings: 0,
        averageRating: 0,
        totalReviews: 0,
      },
      createdAt: new Date().toISOString(),
    };

    await proRef.set(proData);

    return successResponse({ proId: proRef.key, status: "pending" }, 201);
  } catch (error) {
    console.error("[API] pros/register:", error);
    return errorResponse("Erreur lors de l'inscription", 500);
  }
}
