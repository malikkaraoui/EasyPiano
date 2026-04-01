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

  if (loading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Chargement...
      </div>
    );
  if (!pro)
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Professionnel introuvable
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header du profil */}
      <div className="flex flex-col gap-8 sm:flex-row">
        <div className="h-48 w-48 shrink-0 overflow-hidden rounded-xl bg-card sm:h-52 sm:w-52">
          {pro.photoURL ? (
            <img
              src={pro.photoURL}
              alt={`${pro.firstName} ${pro.lastName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl">
              🎹
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            {pro.firstName} {pro.lastName}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={pro.rating || 0} />
            <span className="text-sm text-muted">
              {formatRating(pro.rating || 0)} ({pro.reviewCount || 0} avis)
            </span>
          </div>
          <p className="mt-2 text-sm text-muted">
            📍 {pro.city} ({pro.postalCode}) — Zone : {pro.zone} km
          </p>
          <p className="text-sm text-muted">
            {pro.experience} ans d&apos;expérience
          </p>
          <p className="mt-2 text-lg font-semibold text-accent">
            À partir de {formatPrice(pro.basePrice || 0)}
          </p>

          <div className="mt-4">
            {user ? (
              <Link
                href={`/booking/${pro.id}`}
                className="inline-flex h-10 items-center rounded-lg bg-accent shadow-sm px-6 text-sm font-medium text-background transition-colors hover:bg-accent-hover hover:shadow-md active:scale-[0.97] active:shadow-none"
              >
                Réserver un accord
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-10 items-center rounded-lg bg-accent shadow-sm px-6 text-sm font-medium text-background transition-colors hover:bg-accent-hover hover:shadow-md active:scale-[0.97] active:shadow-none"
              >
                Se connecter pour réserver
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Détails */}
      <div className="mt-10 space-y-8">
        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">
            À propos
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {pro.description}
          </p>
        </section>

        {pro.specialties?.length > 0 && (
          <section>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Spécialités
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {pro.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">
            Contact
          </h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {pro.email && (
              <a
                href={`mailto:${pro.email}`}
                className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-card"
              >
                ✉️ {pro.email}
              </a>
            )}
            {pro.phone && (
              <a
                href={`tel:${pro.phone}`}
                className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-card"
              >
                📞 {pro.phone}
              </a>
            )}
            {pro.linkedinUrl && (
              <a
                href={pro.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-card"
              >
                💼 LinkedIn
              </a>
            )}
            {pro.whatsappNumber && (
              <a
                href={`https://wa.me/${pro.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-card"
              >
                💬 WhatsApp
              </a>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">
            Tarifs
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4">
              <span className="text-sm text-muted">Accord standard</span>
              <strong className="text-accent">
                {formatPrice(pro.basePrice || 0)}
              </strong>
            </div>
            {pro.travelFee > 0 && (
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4">
                <span className="text-sm text-muted">Frais de déplacement</span>
                <strong className="text-accent">
                  {formatPrice(pro.travelFee)}
                </strong>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Avis */}
      <section className="mt-12">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Avis clients ({reviews.length})
        </h2>
        {reviews.length === 0 && (
          <p className="mt-4 text-sm text-muted">Aucun avis pour le moment</p>
        )}
        <div className="mt-4 space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-border/50 bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <StarRating rating={review.rating} />
                <span className="text-xs text-muted">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              {review.title && (
                <h4 className="mt-2 font-semibold text-foreground">
                  {review.title}
                </h4>
              )}
              <p className="mt-2 text-sm text-muted">{review.comment}</p>
              {review.proResponse && (
                <div className="mt-3 rounded border-l-2 border-accent/50 bg-accent/5 p-3">
                  <strong className="text-xs text-accent">
                    Réponse du professionnel :
                  </strong>
                  <p className="mt-1 text-sm text-muted">
                    {review.proResponse}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
