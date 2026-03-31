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
  const [isPro, setIsPro] = useState(false);
  const [proProfile, setProProfile] = useState(null);
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
            const [adminSnap, prosSnap] = await Promise.all([
              get(ref(db, `admins/${firebaseUser.uid}`)),
              get(ref(db, "pros")),
            ]);

            setIsAdmin(adminSnap.exists());

            if (prosSnap.exists()) {
              const pros = prosSnap.val();
              const matchedPro = Object.entries(pros).find(
                ([, pro]) => pro.userId === firebaseUser.uid,
              );

              if (matchedPro) {
                const [proId, profile] = matchedPro;
                setIsPro(true);
                setProProfile({ proId, ...profile });
              } else {
                setIsPro(false);
                setProProfile(null);
              }
            } else {
              setIsPro(false);
              setProProfile(null);
            }
          } else {
            setUser(null);
            setIsAdmin(false);
            setIsPro(false);
            setProProfile(null);
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
    <AuthContext.Provider value={{ user, isAdmin, isPro, proProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
