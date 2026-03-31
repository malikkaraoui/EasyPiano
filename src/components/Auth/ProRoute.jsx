"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function ProRoute({ children }) {
  const { user, isPro, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/login");
      else if (!isPro) router.replace("/become-pro");
    }
  }, [user, isPro, loading, router]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (!user || !isPro) return null;

  return children;
}
