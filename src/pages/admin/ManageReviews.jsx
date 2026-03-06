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

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="manage-reviews">
      <div className="page-header">
        <h1>Modération des avis</h1>
        <button className="btn-secondary" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Signalés uniquement" : "Voir tous les avis"}
        </button>
      </div>

      <p className="results-count">
        {displayed.length} avis{displayed.length > 1 ? "" : ""}
        {!showAll && " signalé(s)"}
      </p>

      {displayed.map((review) => (
        <div
          key={review.id}
          className={`review-card-admin ${review.reported ? "reported" : ""}`}
        >
          <div className="review-header">
            <StarRating rating={review.rating} />
            <span>{formatDate(review.createdAt)}</span>
            <span className="review-author">par {review.clientName}</span>
          </div>
          {review.title && <h4>{review.title}</h4>}
          <p>{review.comment}</p>
          {review.reported && (
            <div className="report-info">
              <strong>Signalé :</strong> {review.reportReason}
            </div>
          )}
          <div className="review-actions">
            {review.reported && (
              <button
                className="btn-secondary"
                onClick={() => clearReport(review.id)}
              >
                Lever le signalement
              </button>
            )}
            <button
              className="btn-delete"
              onClick={() => handleDelete(review.id)}
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}

      {displayed.length === 0 && (
        <p className="empty-state">
          {showAll ? "Aucun avis" : "Aucun avis signalé"}
        </p>
      )}
    </div>
  );
}
