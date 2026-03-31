import { verifyAuth } from "@/services/auth-server";
import {
  successResponse,
  errorResponse,
  createdResponse,
} from "@/lib/api-response";
import { ref, get, set } from "firebase/database";
import { db } from "@/services/firebase";

async function findProByUserId(userId) {
  const prosSnapshot = await get(ref(db, "pros"));
  if (!prosSnapshot.exists()) return null;

  const pros = prosSnapshot.val();
  for (const [proId, proData] of Object.entries(pros)) {
    if (proData.userId === userId) return { proId, ...proData };
  }

  return null;
}

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const body = await request.json();
    const { bookingId, condition, recommendations, nextTuningDate } = body;

    if (!bookingId || !condition) {
      return errorResponse("bookingId et condition sont requis", 400);
    }

    // Vérifier le booking
    const bookingSnapshot = await get(ref(db, `bookings/${bookingId}`));
    if (!bookingSnapshot.exists()) {
      return errorResponse("Réservation non trouvée", 404);
    }

    const booking = bookingSnapshot.val();

    if (booking.status !== "completed") {
      return errorResponse(
        "Le rapport ne peut être envoyé qu'après une intervention terminée",
        409,
      );
    }

    // Vérifier que c'est bien le pro du booking
    const proEntry = await findProByUserId(user.uid);

    if (!proEntry || proEntry.proId !== booking.proId) {
      return errorResponse(
        "Seul l'accordeur du RDV peut remplir le rapport",
        403,
      );
    }

    // Vérifier qu'un rapport n'existe pas déjà
    const existingReport = await get(
      ref(db, `maintenanceReports/${bookingId}`),
    );
    if (existingReport.exists()) {
      return errorResponse(
        "Un rapport existe déjà pour cette réservation",
        400,
      );
    }

    const reportData = {
      bookingId,
      proId: booking.proId,
      clientId: booking.clientId,
      condition,
      recommendations: recommendations || "",
      nextTuningDate: nextTuningDate || null,
      createdAt: new Date().toISOString(),
    };

    await set(ref(db, `maintenanceReports/${bookingId}`), reportData);

    return createdResponse(reportData);
  } catch (error) {
    console.error("[API] maintenance-report:", error);
    return errorResponse("Erreur lors de la création du rapport", 500);
  }
}

export async function GET(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) return errorResponse("bookingId requis", 400);

    const reportSnapshot = await get(
      ref(db, `maintenanceReports/${bookingId}`),
    );
    if (!reportSnapshot.exists()) {
      return errorResponse("Rapport non trouvé", 404);
    }

    const report = reportSnapshot.val();

    // Vérifier que l'utilisateur est le client ou le pro
    if (report.clientId !== user.uid) {
      const pro = await findProByUserId(user.uid);
      if (!pro || pro.proId !== report.proId) {
        return errorResponse("Accès refusé", 403);
      }
    }

    return successResponse(report);
  } catch (error) {
    console.error("[API] maintenance-report GET:", error);
    return errorResponse("Erreur lors de la récupération du rapport", 500);
  }
}
