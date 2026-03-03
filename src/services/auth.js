import { signInWithPopup, signOut } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { auth, googleProvider, db } from "./firebase";

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const userRef = ref(db, `users/${user.uid}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    await set(userRef, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: "client",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    });
  } else {
    await set(
      ref(db, `users/${user.uid}/lastLoginAt`),
      new Date().toISOString(),
    );
  }

  return user;
}

export async function logout() {
  await signOut(auth);
}

export async function isAdmin(uid) {
  const snapshot = await get(ref(db, `admins/${uid}`));
  return snapshot.exists();
}
