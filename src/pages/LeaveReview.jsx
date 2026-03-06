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
    <div className="review-page">
      <h1>Laisser un avis</h1>
      <p className="review-subtitle">
        Votre avis aide les autres utilisateurs à choisir leur accordeur
      </p>

      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Note</label>
          <StarRating
            rating={form.rating}
            onChange={(rating) => setForm((prev) => ({ ...prev, rating }))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Titre (optionnel)</label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Résumez votre expérience en quelques mots"
          />
        </div>

        <div className="form-group">
          <label htmlFor="comment">Votre commentaire</label>
          <textarea
            id="comment"
            name="comment"
            value={form.comment}
            onChange={handleChange}
            placeholder="Décrivez votre expérience avec cet accordeur..."
            rows={5}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={submitting || form.rating === 0}
        >
          {submitting ? "Envoi en cours..." : "Publier mon avis"}
        </button>
      </form>
    </div>
  );
}
