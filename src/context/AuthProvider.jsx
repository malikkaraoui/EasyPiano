"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, db, isFirebaseConfigured } from "../services/firebase";
import { completeGoogleRedirectLogin } from "../services/auth";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      setLoading(false);
      return undefined;
    }

    let isMounted = true;
    let unsubscribe = () => {};

    async function initializeAuth() {
      try {
        await completeGoogleRedirectLogin();
      } catch (error) {
        console.error(
          "[Auth] Erreur lors de la finalisation de la connexion Google:",
          error,
        );
      }

      if (!isMounted) {
        return;
      }

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            setUser(firebaseUser);
            const adminSnap = await get(ref(db, `admins/${firebaseUser.uid}`));
            setIsAdmin(adminSnap.exists());
          } else {
            setUser(null);
            setIsAdmin(false);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      });
    }

    initializeAuth();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
