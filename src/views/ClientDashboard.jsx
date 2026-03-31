"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { getBookingsByClient } from "../services/database";
import { formatPrice, formatDate } from "../utils/format";
import { BUSINESS_RULES } from "@shared/constants/businessRules";

const STATUS_LABELS = {
  pending: "En attente",
  confirmed: "Confirmé",
  in_progress: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
  disputed: "Litige",
};

const STATUS_COLORS = {
  pending: "border-accent/50 bg-accent/10 text-accent",
  confirmed: "border-success/50 bg-success/10 text-success",
  in_progress: "border-accent/50 bg-accent/10 text-accent",
  completed: "border-success/50 bg-success/10 text-success",
  cancelled: "border-destructive/50 bg-destructive/10 text-destructive",
  disputed: "border-destructive/50 bg-destructive/10 text-destructive",
};

export default function ClientDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const data = await getBookingsByClient(user.uid);
        setBookings(data);
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user.uid]);

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Chargement...
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">
        Mes rendez-vous
      </h1>
      <p className="mt-2 text-sm text-muted">
        Annulation sans frais jusqu&apos;à{" "}
        {BUSINESS_RULES.CANCELLATION.FREE_CANCELLATION_DAYS} jours avant
        l&apos;intervention.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((f) => (
          <button
            key={f}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              filter === f
                ? "border-accent bg-accent text-background"
                : "border-border text-muted hover:border-accent hover:text-foreground"
            }`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "Tous" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-muted">
            Aucune réservation {filter !== "all" ? "avec ce statut" : ""}
          </p>
          <Link
            href="/search"
            className="mt-4 inline-flex h-10 items-center rounded bg-accent px-6 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
          >
            Trouver un accordeur
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {filtered.map((booking) => (
          <div
            key={booking.id}
            className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-5 transition-shadow hover:shadow-lg"
          >
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Accord de piano
              </h3>
              <p className="mt-1 text-sm text-muted">
                📅 {formatDate(booking.scheduledDate)} à {booking.scheduledTime}
              </p>
              <p className="text-sm text-muted">📍 {booking.address}</p>
              <p className="mt-1 font-semibold text-accent">
                {formatPrice(booking.amount)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${STATUS_COLORS[booking.status] || "border-border text-muted"}`}
              >
                {STATUS_LABELS[booking.status]}
              </span>
              {booking.status === "completed" && (
                <Link
                  href={`/review/${booking.id}`}
                  className="text-xs text-accent transition-colors hover:text-accent-hover"
                >
                  Laisser un avis
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
