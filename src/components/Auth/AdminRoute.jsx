"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/login");
      else if (!isAdmin) router.replace("/");
    }
  }, [user, isAdmin, loading, router]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (!user || !isAdmin) return null;

  return children;
}
