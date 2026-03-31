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

  if (loading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Chargement...
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">
        Transactions
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/50 bg-card p-6 text-center">
          <h3 className="text-sm font-medium text-muted">Total encaissé</h3>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {formatPrice(totalRevenue)}
          </p>
        </div>
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
          <h3 className="text-sm font-medium text-accent">Commissions (10%)</h3>
          <p className="mt-2 text-3xl font-bold text-accent">
            {formatPrice(totalCommission)}
          </p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6 text-center">
          <h3 className="text-sm font-medium text-muted">Reversé aux pros</h3>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {formatPrice(totalNet)}
          </p>
        </div>
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
                Net pro
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.id}
                className="border-b border-border/30 transition-colors hover:bg-card/50"
              >
                <td className="p-3 text-muted">
                  {formatDate(b.completedAt || b.createdAt)}
                </td>
                <td className="p-3 text-foreground">{b.clientName}</td>
                <td className="p-3 text-foreground">{b.proName}</td>
                <td className="p-3 text-foreground">{formatPrice(b.amount)}</td>
                <td className="p-3 text-accent">{formatPrice(b.commission)}</td>
                <td className="p-3 text-foreground">
                  {formatPrice(b.netAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted">
          Aucune transaction terminée
        </p>
      )}
    </div>
  );
}
