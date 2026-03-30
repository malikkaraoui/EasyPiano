import { verifyAuth } from "@/services/auth-server";
import { errorResponse, createdResponse } from "@/lib/api-response";
import { ref, push, set, update, get } from "firebase/database";
import { db } from "@/services/firebase";
import { encryptAddress } from "@/services/encryption";

const PRICE_CENTS = 15000; // 150 CHF
const COMMISSION_CENTS = 2500; // 25 CHF (17%)
const PRO_NET_CENTS = 12500; // 125 CHF

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return errorResponse("Non autorisé", 401);

  try {
    const body = await request.json();
    const { proId, date, slot, address, addressCity } = body;

    if (!proId || !date || !slot || !address || !addressCity) {
      return errorResponse(
        "proId, date, slot, address et addressCity sont requis",
        400,
      );
    }

    if (!["morning", "afternoon"].includes(slot)) {
      return errorResponse("slot doit être 'morning' ou 'afternoon'", 400);
    }

    // Vérifier que le pro existe et est validé
    const proSnapshot = await get(ref(db, `pros/${proId}`));
    if (!proSnapshot.exists())
      return errorResponse("Accordeur non trouvé", 404);

    const pro = proSnapshot.val();
    if (pro.status !== "validated") {
      return errorResponse("Cet accordeur n'est pas disponible", 400);
    }

    // Chiffrer l'adresse
    let addressEncrypted;
    try {
      addressEncrypted = encryptAddress(address);
    } catch {
      // En dev sans ENCRYPTION_KEY, stocker en clair (à ne pas faire en prod)
      addressEncrypted = address;
    }

    const bookingRef = push(ref(db, "bookings"));
    const bookingData = {
      clientId: user.uid,
      proId,
      date,
      slot,
      status: "confirmed",
      addressEncrypted,
      addressCity,
      addressRevealedAt: null,
      price: PRICE_CENTS,
      commission: COMMISSION_CENTS,
      proNet: PRO_NET_CENTS,
      stripePaymentIntentId: null, // sera mis à jour par le webhook Stripe
      cancellation: {
        reason: null,
        refundPercent: 0,
        cancelledAt: null,
      },
      createdAt: new Date().toISOString(),
    };

    await set(bookingRef, bookingData);

    // Mettre à jour les index
    await set(
      ref(db, `indexes/bookings_by_client/${user.uid}/${bookingRef.key}`),
      true,
    );
    await set(
      ref(db, `indexes/bookings_by_pro/${proId}/${bookingRef.key}`),
      true,
    );

    // Incrémenter stats pro
    const currentBookings = pro.stats?.totalBookings || 0;
    await update(ref(db, `pros/${proId}/stats`), {
      totalBookings: currentBookings + 1,
    });

    return createdResponse({
      bookingId: bookingRef.key,
      status: "confirmed",
      price: PRICE_CENTS,
      date,
      slot,
    });
  } catch (error) {
    console.error("[API] booking/create:", error);
    return errorResponse("Erreur lors de la réservation", 500);
  }
}
