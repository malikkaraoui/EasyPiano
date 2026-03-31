"use client";
import { useState, useEffect } from "react";
import { getAllBookings, updateBookingStatus } from "../../services/database";
import { formatPrice, formatDate } from "../../utils/format";

const STATUS_LABELS = {
  pending: "En attente",
  confirmed: "Confirmé",
  in_progress: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
  disputed: "Litige",
};

const STATUS_COLORS = {
  pending: "bg-accent/20 text-accent",
  confirmed: "bg-success/20 text-success",
  in_progress: "bg-accent/20 text-accent",
  completed: "bg-success/20 text-success",
  cancelled: "bg-destructive/20 text-destructive",
  disputed: "bg-destructive/20 text-destructive",
};

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(bookingId, newStatus) {
    await updateBookingStatus(bookingId, newStatus);
    loadBookings();
  }

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Chargement...
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">
        Réservations ({bookings.length})
      </h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {[
          "all",
          "pending",
          "confirmed",
          "completed",
          "cancelled",
          "disputed",
        ].map((f) => (
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

      <div className="mt-8 overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-card">
            <tr>
              <th className="p-3 text-left text-xs font-medium uppercase text-muted">
                Date
              </th>
              <th className="p-3 text-left text-xs font-medium uppercase text-muted">
                Client
              </th>
              <th className="p-3 text-left text-xs font-medium uppercase text-muted">
                Professionnel
              </th>
              <th className="p-3 text-left text-xs font-medium uppercase text-muted">
                Montant
              </th>
              <th className="p-3 text-left text-xs font-medium uppercase text-muted">
                Commission
              </th>
              <th className="p-3 text-left text-xs font-medium uppercase text-muted">
                Statut
              </th>
              <th className="p-3 text-left text-xs font-medium uppercase text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr
                key={b.id}
                className="border-b border-border/30 transition-colors hover:bg-card/50"
              >
                <td className="p-3 text-muted">
                  {formatDate(b.scheduledDate)}
                </td>
                <td className="p-3 text-foreground">{b.clientName}</td>
                <td className="p-3 text-foreground">{b.proName}</td>
                <td className="p-3 text-foreground">{formatPrice(b.amount)}</td>
                <td className="p-3 text-accent">{formatPrice(b.commission)}</td>
                <td className="p-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[b.status] || "bg-card text-muted"}`}
                  >
                    {STATUS_LABELS[b.status]}
                  </span>
                </td>
                <td className="p-3">
                  <select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.id, e.target.value)}
                    className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
