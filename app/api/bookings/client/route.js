import { verifyAuth } from "@/services/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { ref, get } from "firebase/database";
import { db } from "@/services/firebase";

function buildProDisplayName(pro = {}) {
  const fullName = `${pro.firstName || ""} ${pro.lastName || ""}`.trim();
  return fullName || pro.displayName || "Accordeur EasyPiano";
}

export async function GET(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const indexSnapshot = await get(
      ref(db, `indexes/bookings_by_client/${user.uid}`),
    );

    if (!indexSnapshot.exists()) {
      return successResponse({ items: [], total: 0 });
    }

    const bookingIds = Object.keys(indexSnapshot.val());
    const bookings = [];

    for (const bookingId of bookingIds) {
      const snapshot = await get(ref(db, `bookings/${bookingId}`));
      if (snapshot.exists()) {
        const booking = snapshot.val();

        const [reportSnapshot, proSnapshot] = await Promise.all([
          get(ref(db, `maintenanceReports/${bookingId}`)),
          booking.proId
            ? get(ref(db, `pros/${booking.proId}`))
            : Promise.resolve(null),
        ]);

        const pro = proSnapshot?.exists?.() ? proSnapshot.val() : null;

        bookings.push({
          bookingId,
          proId: booking.proId,
          date: booking.date,
          slot: booking.slot,
          status: booking.status,
          price: booking.price,
          addressCity: booking.addressCity,
          createdAt: booking.createdAt,
          maintenanceReportExists: reportSnapshot.exists(),
          proName: buildProDisplayName(pro || {}),
          proPhotoURL: pro?.photoURL || null,
        });
      }
    }

    bookings.sort((a, b) => new Date(a.date) - new Date(b.date));

    return successResponse({ items: bookings, total: bookings.length });
  } catch (error) {
    console.error("[API] bookings/client:", error);
    return errorResponse(
      "Erreur lors de la récupération des réservations",
      500,
    );
  }
}
