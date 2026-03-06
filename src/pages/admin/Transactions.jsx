"use client";
import { useState, useEffect } from "react";
import { getAllBookings } from "../../services/database";
import { formatPrice, formatDate } from "../../utils/format";

export default function Transactions() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllBookings();
        setBookings(data.filter((b) => b.status === "completed"));
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalCommission = bookings.reduce(
    (sum, b) => sum + (b.commission || 0),
    0,
  );
  const totalNet = bookings.reduce((sum, b) => sum + (b.netAmount || 0), 0);

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="transactions-page">
      <h1>Transactions</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total encaissé</h3>
          <p className="stat-value">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="stat-card stat-highlight">
          <h3>Commissions (10%)</h3>
          <p className="stat-value">{formatPrice(totalCommission)}</p>
        </div>
        <div className="stat-card">
          <h3>Reversé aux pros</h3>
          <p className="stat-value">{formatPrice(totalNet)}</p>
        </div>
      </div>

      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Client</th>
              <th>Professionnel</th>
              <th>Montant</th>
              <th>Commission</th>
              <th>Net pro</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{formatDate(b.completedAt || b.createdAt)}</td>
                <td>{b.clientName}</td>
                <td>{b.proName}</td>
                <td>{formatPrice(b.amount)}</td>
                <td className="commission">{formatPrice(b.commission)}</td>
                <td>{formatPrice(b.netAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <p className="empty-state">Aucune transaction terminée</p>
      )}
    </div>
  );
}
