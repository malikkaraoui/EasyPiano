import { ref, get, set, push, update, remove } from "firebase/database";
import { db } from "./firebase";

// --- Professionals ---

export async function getProfessionals() {
  const snapshot = await get(ref(db, "professionals"));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data).map(([id, pro]) => ({ id, ...pro }));
}

export async function getActiveProfessionals() {
  const pros = await getProfessionals();
  return pros.filter((p) => p.active && p.verified);
}

export async function getProfessionalById(proId) {
  const snapshot = await get(ref(db, `professionals/${proId}`));
  if (!snapshot.exists()) return null;
  return { id: proId, ...snapshot.val() };
}

export async function createProfessional(proData, adminUid) {
  const newRef = push(ref(db, "professionals"));
  await set(newRef, {
    ...proData,
    rating: 0,
    reviewCount: 0,
    totalBookings: 0,
    responseRate: 100,
    active: true,
    verified: false,
    createdBy: adminUid,
    createdAt: new Date().toISOString(),
  });
  return newRef.key;
}

export async function updateProfessional(proId, updates) {
  await update(ref(db, `professionals/${proId}`), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteProfessional(proId) {
  await remove(ref(db, `professionals/${proId}`));
}

// --- Bookings ---

export async function createBooking(bookingData) {
  const newRef = push(ref(db, "bookings"));
  const commission = Math.round(bookingData.amount * 0.1 * 100) / 100;
  await set(newRef, {
    ...bookingData,
    commission,
    netAmount: bookingData.amount - commission,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return newRef.key;
}

export async function getBookingsByClient(clientUid) {
  const snapshot = await get(ref(db, "bookings"));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data)
    .filter(([, b]) => b.clientUid === clientUid)
    .map(([id, b]) => ({ id, ...b }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getBookingsByPro(proId) {
  const snapshot = await get(ref(db, "bookings"));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data)
    .filter(([, b]) => b.proId === proId)
    .map(([id, b]) => ({ id, ...b }));
}

export async function getAllBookings() {
  const snapshot = await get(ref(db, "bookings"));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data)
    .map(([id, b]) => ({ id, ...b }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function updateBookingStatus(bookingId, status) {
  const updates = { status, updatedAt: new Date().toISOString() };
  if (status === "completed") updates.completedAt = new Date().toISOString();
  await update(ref(db, `bookings/${bookingId}`), updates);
}

// --- Reviews ---

export async function createReview(reviewData) {
  const newRef = push(ref(db, "reviews"));
  await set(newRef, {
    ...reviewData,
    reported: false,
    createdAt: new Date().toISOString(),
  });

  // Update pro rating
  await updateProRating(reviewData.proId);
  return newRef.key;
}

export async function getReviewsByPro(proId) {
  const snapshot = await get(ref(db, "reviews"));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data)
    .filter(([, r]) => r.proId === proId)
    .map(([id, r]) => ({ id, ...r }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function addProResponse(reviewId, response) {
  await update(ref(db, `reviews/${reviewId}`), {
    proResponse: response,
    updatedAt: new Date().toISOString(),
  });
}

export async function reportReview(reviewId, reason) {
  await update(ref(db, `reviews/${reviewId}`), {
    reported: true,
    reportReason: reason,
  });
}

async function updateProRating(proId) {
  const reviews = await getReviewsByPro(proId);
  if (reviews.length === 0) return;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await update(ref(db, `professionals/${proId}`), {
    rating: Math.round(avg * 10) / 10,
    reviewCount: reviews.length,
  });
}

// --- Search ---

export async function searchProfessionalsByCity(city) {
  const pros = await getActiveProfessionals();
  return pros.filter((p) => p.city.toLowerCase().includes(city.toLowerCase()));
}

export async function searchProfessionalsByPostalCode(postalCode) {
  const pros = await getActiveProfessionals();
  return pros.filter((p) =>
    p.postalCode.startsWith(postalCode.substring(0, 2)),
  );
}
