import { getFirebaseAdmin } from "./firebase-admin";
import { getDatabase } from "firebase-admin/database";

export function getAdminDb() {
  const admin = getFirebaseAdmin();
  if (!admin) return null;
  return getDatabase();
}
