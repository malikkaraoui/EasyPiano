import { verifyAuth } from "@/services/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { ref, get } from "firebase/database";
import { db } from "@/services/firebase";

export async function GET(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);
  if (user.role !== "admin") return errorResponse("Accès refusé", 403);

  try {
    // Compter les pros actifs
    const prosSnapshot = await get(ref(db, "pros"));
    const pros = prosSnapshot.exists() ? prosSnapshot.val() : {};
    const activePros = Object.values(pros).filter(
      (p) => p.status === "validated",
    ).length;
    const pendingPros = Object.values(pros).filter(
      (p) => p.status === "pending",
    ).length;

    // Compter les réservations
    const bookingsSnapshot = await get(ref(db, "bookings"));
    const bookings = bookingsSnapshot.exists()
      ? Object.values(bookingsSnapshot.val())
      : [];

    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(
      (b) => b.status === "confirmed",
    ).length;
    const cancelledBookings = bookings.filter(
      (b) => b.status === "cancelled",
    ).length;

    // Revenus commissions (en centimes)
    const totalCommission = bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + (b.commission || 0), 0);

    // Motifs d'annulation
    const cancellationReasons = {};
    bookings
      .filter((b) => b.status === "cancelled" && b.cancellation?.reason)
      .forEach((b) => {
        const reason = b.cancellation.reason;
        cancellationReasons[reason] = (cancellationReasons[reason] || 0) + 1;
      });

    // Avis
    const reviewsSnapshot = await get(ref(db, "reviews"));
    const reviews = reviewsSnapshot.exists()
      ? Object.values(reviewsSnapshot.val())
      : [];
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Math.round(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10,
          ) / 10
        : 0;
    const negativeReviews = reviews.filter((r) => r.rating < 3).length;

    return successResponse({
      pros: { active: activePros, pending: pendingPros },
      bookings: {
        total: totalBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings,
      },
      revenue: { totalCommission },
      cancellationReasons,
      reviews: {
        total: totalReviews,
        averageRating,
        negative: negativeReviews,
      },
    });
  } catch (error) {
    console.error("[API] admin/analytics:", error);
    return errorResponse("Erreur lors de la récupération des analytics", 500);
  }
}
