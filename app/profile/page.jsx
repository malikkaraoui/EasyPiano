"use client";

import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { useAuth } from "@hooks/useAuth";
import ProtectedRoute from "@components/Auth/ProtectedRoute";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";

function ProfileForm() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [isB2B, setIsB2B] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!user) return;

    async function loadProfile() {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.data) {
          setDisplayName(data.data.displayName || user.displayName || "");
          if (data.data.phone) {
            let raw = data.data.phone.replace(/\D/g, "");
            if (raw.startsWith("41")) raw = raw.slice(2);
            if (raw.startsWith("0")) raw = raw.slice(1);
            const parts = [];
            if (raw.length > 0) parts.push(raw.slice(0, 2));
            if (raw.length > 2) parts.push(raw.slice(2, 5));
            if (raw.length > 5) parts.push(raw.slice(5, 7));
            if (raw.length > 7) parts.push(raw.slice(7, 9));
            setPhone(parts.join(" "));
          }
          setIsB2B(data.data.isB2B || false);
        } else {
          setDisplayName(user.displayName || "");
        }
      } catch {
        setDisplayName(user.displayName || "");
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName,
          phone: phone.trim() ? `+41${phone.replace(/\s/g, "")}` : "",
          isB2B,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Profil mis à jour avec succès" });
      } else {
        setMessage({ type: "error", text: data.error || "Erreur inconnue" });
      }
    } catch {
      setMessage({ type: "error", text: "Erreur de connexion au serveur" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground">
        Mon profil
      </h1>
      <p className="mt-2 text-sm text-muted">
        Gérez vos informations personnelles
      </p>

      {message && (
        <p
          role="alert"
          className={`mt-4 rounded border p-3 text-sm ${
            message.type === "success"
              ? "border-success/50 bg-success/10 text-success"
              : "border-destructive/50 bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </p>
      )}

      {loadingProfile && (
        <p className="mt-4 text-sm text-muted">Chargement du profil...</p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={user?.email || ""}
            disabled
            className="opacity-60"
          />
          <p className="mt-1 text-xs text-muted">
            L'email ne peut pas être modifié (provient de Google)
          </p>
        </div>

        <div>
          <label
            htmlFor="displayName"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Nom complet
          </label>
          <Input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Votre nom"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Téléphone
          </label>
          <div className="flex gap-2">
            <div className="flex h-10 items-center gap-1.5 rounded border border-border bg-card px-3 text-sm text-muted">
              <span role="img" aria-label="Suisse">
                🇨🇭
              </span>
              <span>+41</span>
            </div>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                let raw = e.target.value.replace(/\D/g, "");
                if (raw.startsWith("41")) raw = raw.slice(2);
                if (raw.startsWith("0")) raw = raw.slice(1);
                if (raw.length > 9) raw = raw.slice(0, 9);
                const parts = [];
                if (raw.length > 0) parts.push(raw.slice(0, 2));
                if (raw.length > 2) parts.push(raw.slice(2, 5));
                if (raw.length > 5) parts.push(raw.slice(5, 7));
                if (raw.length > 7) parts.push(raw.slice(7, 9));
                setPhone(parts.join(" "));
              }}
              placeholder="79 123 45 67"
              maxLength={12}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="isB2B"
            type="checkbox"
            checked={isB2B}
            onChange={(e) => setIsB2B(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          <label htmlFor="isB2B" className="text-sm text-foreground">
            Je suis un professionnel (B2B)
          </label>
        </div>

        <div className="flex justify-end border-t border-border/80 pt-6">
          <Button
            type="submit"
            size="lg"
            disabled={saving}
            aria-busy={saving}
            className="w-full sm:min-w-48 sm:w-auto"
          >
            {saving ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : (
              <Save aria-hidden="true" className="h-4 w-4" />
            )}
            <span>{saving ? "Enregistrement..." : "Enregistrer"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileForm />
    </ProtectedRoute>
  );
}
