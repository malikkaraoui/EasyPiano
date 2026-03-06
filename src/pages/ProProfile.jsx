"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProfessionalById, getReviewsByPro } from "../services/database";
import { useAuth } from "../hooks/useAuth";
import { formatPrice, formatRating, formatDate } from "../utils/format";
import StarRating from "../components/UI/StarRating";

export default function ProProfile() {
  const { proId } = useParams();
  const { user } = useAuth();
  const [pro, setPro] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [proData, reviewsData] = await Promise.all([
          getProfessionalById(proId),
          getReviewsByPro(proId),
        ]);
        setPro(proData);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [proId]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (!pro) return <div className="not-found">Professionnel introuvable</div>;

  return (
    <div className="pro-profile">
      <div className="pro-header">
        <div className="pro-photo">
          {pro.photoURL ? (
            <img src={pro.photoURL} alt={`${pro.firstName} ${pro.lastName}`} />
          ) : (
            <div className="pro-photo-placeholder">🎹</div>
          )}
        </div>

        <div className="pro-info">
          <h1>
            {pro.firstName} {pro.lastName}
          </h1>
          <div className="pro-rating">
            <StarRating rating={pro.rating || 0} />
            <span>
              {formatRating(pro.rating || 0)} ({pro.reviewCount || 0} avis)
            </span>
          </div>
          <p className="pro-location">
            📍 {pro.city} ({pro.postalCode}) — Zone : {pro.zone} km
          </p>
          <p className="pro-experience">
            {pro.experience} ans d&apos;expérience
          </p>
          <p className="pro-price">
            À partir de {formatPrice(pro.basePrice || 0)}
          </p>

          {user && (
            <Link href={`/booking/${pro.id}`} className="btn-primary">
              Réserver un accord
            </Link>
          )}
          {!user && (
            <Link href="/login" className="btn-primary">
              Se connecter pour réserver
            </Link>
          )}
        </div>
      </div>

      <div className="pro-details">
        <section className="pro-bio">
          <h2>À propos</h2>
          <p>{pro.description}</p>
        </section>

        {pro.specialties?.length > 0 && (
          <section className="pro-specialties">
            <h2>Spécialités</h2>
            <div className="tags">
              {pro.specialties.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="pro-contact">
          <h2>Contact</h2>
          <div className="contact-links">
            {pro.email && (
              <a href={`mailto:${pro.email}`} className="contact-link">
                ✉️ {pro.email}
              </a>
            )}
            {pro.phone && (
              <a href={`tel:${pro.phone}`} className="contact-link">
                📞 {pro.phone}
              </a>
            )}
            {pro.linkedinUrl && (
              <a
                href={pro.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                💼 LinkedIn
              </a>
            )}
            {pro.whatsappNumber && (
              <a
                href={`https://wa.me/${pro.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                💬 WhatsApp
              </a>
            )}
          </div>
        </section>

        <section className="pro-tarifs">
          <h2>Tarifs</h2>
          <div className="tarif-grid">
            <div className="tarif-item">
              <span>Accord standard</span>
              <strong>{formatPrice(pro.basePrice || 0)}</strong>
            </div>
            {pro.travelFee > 0 && (
              <div className="tarif-item">
                <span>Frais de déplacement</span>
                <strong>{formatPrice(pro.travelFee)}</strong>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="pro-reviews">
        <h2>Avis clients ({reviews.length})</h2>
        {reviews.length === 0 && (
          <p className="no-reviews">Aucun avis pour le moment</p>
        )}
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <StarRating rating={review.rating} />
              <span className="review-date">
                {formatDate(review.createdAt)}
              </span>
            </div>
            {review.title && <h4 className="review-title">{review.title}</h4>}
            <p className="review-comment">{review.comment}</p>
            {review.proResponse && (
              <div className="review-response">
                <strong>Réponse du professionnel :</strong>
                <p>{review.proResponse}</p>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
