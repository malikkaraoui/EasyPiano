import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/services/firebase-admin";
import { getDatabase } from "firebase-admin/database";

export async function POST(request) {
  try {
    const { email, secret } = await request.json();

    if (secret !== process.env.ADMIN_SETUP_SECRET) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const admin = getFirebaseAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Firebase Admin non configuré" },
        { status: 500 },
      );
    }

    const userRecord = await admin.auth.getUserByEmail(email);
    const db = getDatabase();
    await db.ref(`admins/${userRecord.uid}`).set(true);

    return NextResponse.json({
      ok: true,
      uid: userRecord.uid,
      email: userRecord.email,
      message: `${email} est maintenant admin`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Erreur interne" },
      { status: 500 },
    );
  }
}
