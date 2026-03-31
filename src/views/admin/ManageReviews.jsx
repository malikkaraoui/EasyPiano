"use client";
import { useState, useEffect } from "react";
import { ref, get, update, remove } from "firebase/database";
import { db } from "../../services/firebase";
import { formatDate } from "../../utils/format";
import StarRating from "../../components/UI/StarRating";

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      const snapshot = await get(ref(db, "reviews"));
      if (!snapshot.exists()) {
        setReviews([]);
        return;
      }
      const data = snapshot.val();
      const list = Object.entries(data)
        .map(([id, r]) => ({ id, ...r }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(list);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  }

  async function clearReport(reviewId) {
    await update(ref(db, `reviews/${reviewId}`), {
      reported: false,
      reportReason: null,
    });
    loadReviews();
  }

  async function handleDelete(reviewId) {
    if (!window.confirm("Supprimer cet avis ?")) return;
    await remove(ref(db, `reviews/${reviewId}`));
    loadReviews();
  }

  const displayed = showAll ? reviews : reviews.filter((r) => r.reported);

  if (loading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Chargement...
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Modération des avis
        </h1>
        <button
          className="rounded border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-card"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Signalés uniquement" : "Voir tous les avis"}
        </button>
      </div>

      <p className="mt-4 text-sm text-muted">
        {displayed.length} avis{!showAll && " signalé(s)"}
      </p>

      <div className="mt-6 space-y-4">
        {displayed.map((review) => (
          <div
            key={review.id}
            className={`rounded-xl border p-5 ${
              review.reported
                ? "border-destructive/30 bg-destructive/5"
                : "border-border/50 bg-card"
            }`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <StarRating rating={review.rating} />
              <span className="text-xs text-muted">
                {formatDate(review.createdAt)}
              </span>
              <span className="text-xs text-muted">
                par {review.clientName}
              </span>
            </div>
            {review.title && (
              <h4 className="mt-2 font-semibold text-foreground">
                {review.title}
              </h4>
            )}
            <p className="mt-2 text-sm text-muted">{review.comment}</p>
            {review.reported && (
              <div className="mt-3 rounded border border-destructive/20 bg-destructive/10 p-3 text-sm">
                <strong className="text-destructive">Signalé :</strong>{" "}
                <span className="text-muted">{review.reportReason}</span>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              {review.reported && (
                <button
                  className="rounded border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-card"
                  onClick={() => clearReport(review.id)}
                >
                  Lever le signalement
                </button>
              )}
              <button
                className="rounded border border-destructive/30 px-3 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive/10"
                onClick={() => handleDelete(review.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {displayed.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted">
          {showAll ? "Aucun avis" : "Aucun avis signalé"}
        </p>
      )}
    </div>
  );
}
