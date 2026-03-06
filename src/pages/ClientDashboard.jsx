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

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="client-dashboard">
      <h1>Mes rendez-vous</h1>
      <p className="dashboard-policy">
        Annulation sans frais jusqu'à{" "}
        {BUSINESS_RULES.CANCELLATION.FREE_CANCELLATION_DAYS} jours avant
        l'intervention.
      </p>

      <div className="dashboard-filters">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "Tous" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p>Aucune réservation {filter !== "all" ? "avec ce statut" : ""}</p>
          <Link href="/search" className="btn-primary">
            Trouver un accordeur
          </Link>
        </div>
      )}

      <div className="bookings-list">
        {filtered.map((booking) => (
          <div
            key={booking.id}
            className={`booking-card status-${booking.status}`}
          >
            <div className="booking-info">
              <h3>Accord de piano</h3>
              <p className="booking-date">
                📅 {formatDate(booking.scheduledDate)} à {booking.scheduledTime}
              </p>
              <p className="booking-address">📍 {booking.address}</p>
              <p className="booking-price">{formatPrice(booking.amount)}</p>
            </div>
            <div className="booking-status">
              <span className={`status-badge ${booking.status}`}>
                {STATUS_LABELS[booking.status]}
              </span>
              {booking.status === "completed" && (
                <Link href={`/review/${booking.id}`} className="btn-review">
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
