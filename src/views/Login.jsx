"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
} from "../services/auth";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";

const FIREBASE_ERROR_MESSAGES = {
  "auth/email-already-in-use": "Un compte existe déjà avec cet email.",
  "auth/invalid-email": "Adresse email invalide.",
  "auth/weak-password": "Le mot de passe doit contenir au moins 6 caractères.",
  "auth/user-not-found": "Aucun compte trouvé avec cet email.",
  "auth/wrong-password": "Mot de passe incorrect.",
  "auth/invalid-credential": "Email ou mot de passe incorrect.",
  "auth/too-many-requests":
    "Trop de tentatives. Réessayez dans quelques minutes.",
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function Login() {
  const { user } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  async function handleGoogle() {
    try {
      setIsSubmitting(true);
      setError(null);
      const result = await loginWithGoogle();
      if (!result?.redirected) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("[Auth] Erreur de connexion:", err);
      setError("Erreur lors de la connexion. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === "register") {
        await registerWithEmail(email, password, displayName.trim() || null);
      } else {
        await loginWithEmail(email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      console.error("[Auth] Erreur:", err);
      setError(
        FIREBASE_ERROR_MESSAGES[err.code] ||
          "Erreur lors de la connexion. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8">
        <h1 className="text-center font-heading text-2xl font-bold text-foreground">
          {mode === "register" ? "Créer un compte" : "Connexion"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          {mode === "register"
            ? "Inscrivez-vous pour réserver un accordeur"
            : "Connectez-vous pour réserver un accordeur de piano"}
        </p>

        {error && (
          <p
            className="mt-4 rounded border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        <Button
          onClick={handleGoogle}
          variant="secondary"
          size="lg"
          className="mt-6 w-full gap-3"
          disabled={isSubmitting}
        >
          <GoogleIcon />
          Continuer avec Google
        </Button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">ou</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {mode === "register" && (
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
                placeholder="Jean Dupont"
                autoComplete="name"
              />
            </div>
          )}

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                mode === "register"
                  ? "Minimum 6 caractères"
                  : "Votre mot de passe"
              }
              required
              minLength={6}
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Chargement..."
              : mode === "register"
                ? "Créer mon compte"
                : "Se connecter"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {mode === "login" ? (
            <>
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className="font-medium text-accent hover:underline"
              >
                Créer un compte
              </button>
            </>
          ) : (
            <>
              Déjà un compte ?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className="font-medium text-accent hover:underline"
              >
                Se connecter
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
