"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { createReview } from "../services/database";
import StarRating from "../components/UI/StarRating";

export default function LeaveReview() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    rating: 0,
    title: "",
    comment: "",
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.rating === 0 || !form.comment.trim()) return;

    setSubmitting(true);
    try {
      await createReview({
        bookingId,
        clientUid: user.uid,
        clientName: user.displayName,
        ...form,
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">
        Laisser un avis
      </h1>
      <p className="mt-2 text-sm text-muted">
        Votre avis aide les autres utilisateurs à choisir leur accordeur
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Note
          </label>
          <StarRating
            rating={form.rating}
            onChange={(rating) => setForm((prev) => ({ ...prev, rating }))}
          />
        </div>

        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Titre (optionnel)
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Résumez votre expérience en quelques mots"
            className="flex h-10 w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>

        <div>
          <label
            htmlFor="comment"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Votre commentaire
          </label>
          <textarea
            id="comment"
            name="comment"
            value={form.comment}
            onChange={handleChange}
            placeholder="Décrivez votre expérience avec cet accordeur..."
            rows={5}
            required
            className="flex w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-10 w-full items-center justify-center rounded bg-accent px-6 text-sm font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
          disabled={submitting || form.rating === 0}
        >
          {submitting ? "Envoi en cours..." : "Publier mon avis"}
        </button>
      </form>
    </div>
  );
}
