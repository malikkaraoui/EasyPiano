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

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="manage-bookings">
      <h1>Réservations ({bookings.length})</h1>

      <div className="dashboard-filters">
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
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "Tous" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      <div className="bookings-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Client</th>
              <th>Professionnel</th>
              <th>Montant</th>
              <th>Commission</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id}>
                <td>{formatDate(b.scheduledDate)}</td>
                <td>{b.clientName}</td>
                <td>{b.proName}</td>
                <td>{formatPrice(b.amount)}</td>
                <td>{formatPrice(b.commission)}</td>
                <td>
                  <span className={`status-badge ${b.status}`}>
                    {STATUS_LABELS[b.status]}
                  </span>
                </td>
                <td>
                  <select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.id, e.target.value)}
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
