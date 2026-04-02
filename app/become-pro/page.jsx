"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@hooks/useAuth";
import ProtectedRoute from "@components/Auth/ProtectedRoute";
import { PhoneNumberField } from "@/components/UI/phone-number-field";
import { usePhoneNumberState } from "@/hooks/usePhoneNumberState";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";

const LANGUAGE_OPTIONS = [
  { code: "fr", label: "Français" },
  { code: "en", label: "Anglais" },
  { code: "de", label: "Allemand" },
  { code: "pl", label: "Polonais" },
  { code: "hr", label: "Croate" },
  { code: "uk", label: "Ukrainien" },
  { code: "it", label: "Italien" },
];

const COUNTRY_OPTIONS = [
  { code: "PL", label: "Pologne" },
  { code: "HR", label: "Croatie" },
  { code: "UA", label: "Ukraine" },
  { code: "CH", label: "Suisse" },
  { code: "FR", label: "France" },
  { code: "DE", label: "Allemagne" },
];

function BecomeProForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [languages, setLanguages] = useState([]);
  const [videoURL, setVideoURL] = useState("");
  const {
    value: phoneInputValue,
    setValue: setPhoneInputValue,
    phoneValue,
  } = usePhoneNumberState();

  useEffect(() => {
    setMounted(true);
    if (user?.email) setEmail(user.email);
  }, [user]);

  function toggleLanguage(code) {
    setLanguages((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code],
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/pros/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio,
          email,
          phone: phoneValue,
          country,
          languages,
          videoURL,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Erreur inconnue");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Chargement...
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="rounded-lg border border-success/50 bg-success/10 p-8">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Candidature envoyée !
          </h2>
          <p className="mt-3 text-muted">
            Votre candidature est en cours de traitement. Nous vous contacterons
            pour organiser une rencontre de validation.
          </p>
          <Button
            variant="secondary"
            className="mt-6"
            onClick={() => router.push("/")}
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground">
        Devenez accordeur
      </h1>
      <p className="mt-2 text-sm text-muted">
        Rejoignez EasyPiano et accédez à de nouveaux clients en Suisse et en
        Europe.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="bio"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Mon parcours *
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            rows={4}
            placeholder="Décrivez votre expérience, formation, conservatoire..."
            className="flex w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>

        <div>
          <label
            htmlFor="pro-email"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Email professionnel *
          </label>
          <Input
            id="pro-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <PhoneNumberField
          id="become-pro-phone"
          label="Téléphone"
          value={phoneInputValue}
          onValueChange={setPhoneInputValue}
          hint="Utilisez le même module de saisie que dans votre profil : un champ pour l'indicatif, un champ pour le numéro."
        />

        <div>
          <label
            htmlFor="country"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Pays de résidence *
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className="flex h-10 w-full rounded border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="">Sélectionnez un pays</option>
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-foreground">
            Langues parlées *
          </legend>
          <div className="flex flex-wrap gap-2">
            {LANGUAGE_OPTIONS.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => toggleLanguage(lang.code)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  languages.includes(lang.code)
                    ? "border-accent bg-accent text-background"
                    : "border-border text-muted hover:border-accent hover:text-foreground"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="video"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Vidéo de présentation (optionnel)
          </label>
          <Input
            id="video"
            type="url"
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Envoi en cours..." : "Soumettre ma candidature"}
        </Button>
      </form>
    </div>
  );
}

export default function BecomeProPage() {
  return (
    <ProtectedRoute>
      <BecomeProForm />
    </ProtectedRoute>
  );
}
