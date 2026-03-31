"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getProfessionals, getAllBookings } from "../../services/database";
import { formatPrice } from "../../utils/format";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPros: 0,
    activePros: 0,
    totalBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    totalCommission: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pros, bookings] = await Promise.all([
          getProfessionals(),
          getAllBookings(),
        ]);

        const completed = bookings.filter((b) => b.status === "completed");
        setStats({
          totalPros: pros.length,
          activePros: pros.filter((p) => p.active).length,
          totalBookings: bookings.length,
          completedBookings: completed.length,
          totalRevenue: completed.reduce((sum, b) => sum + (b.amount || 0), 0),
          totalCommission: completed.reduce(
            (sum, b) => sum + (b.commission || 0),
            0,
          ),
        });
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Chargement...
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">
        Administration
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/50 bg-card p-6 text-center">
          <h3 className="text-sm font-medium text-muted">Professionnels</h3>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {stats.totalPros}
          </p>
          <p className="mt-1 text-xs text-muted">{stats.activePros} actifs</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6 text-center">
          <h3 className="text-sm font-medium text-muted">Réservations</h3>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {stats.totalBookings}
          </p>
          <p className="mt-1 text-xs text-muted">
            {stats.completedBookings} terminées
          </p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6 text-center">
          <h3 className="text-sm font-medium text-muted">
            Chiffre d&apos;affaires
          </h3>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {formatPrice(stats.totalRevenue)}
          </p>
          <p className="mt-1 text-xs text-muted">Total encaissé</p>
        </div>
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
          <h3 className="text-sm font-medium text-accent">Commissions</h3>
          <p className="mt-2 text-3xl font-bold text-accent">
            {formatPrice(stats.totalCommission)}
          </p>
          <p className="mt-1 text-xs text-muted">10% par réservation</p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/pros"
          className="group rounded-xl border border-border/50 bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg"
        >
          <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-accent">
            Gérer les professionnels
          </h3>
          <p className="mt-1 text-sm text-muted">
            Ajouter, modifier, activer/désactiver
          </p>
        </Link>
        <Link
          href="/admin/bookings"
          className="group rounded-xl border border-border/50 bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg"
        >
          <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-accent">
            Réservations
          </h3>
          <p className="mt-1 text-sm text-muted">
            Voir toutes les réservations
          </p>
        </Link>
        <Link
          href="/admin/reviews"
          className="group rounded-xl border border-border/50 bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg"
        >
          <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-accent">
            Avis
          </h3>
          <p className="mt-1 text-sm text-muted">Modérer les avis signalés</p>
        </Link>
        <Link
          href="/admin/transactions"
          className="group rounded-xl border border-border/50 bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg"
        >
          <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-accent">
            Transactions
          </h3>
          <p className="mt-1 text-sm text-muted">
            Suivi des paiements et commissions
          </p>
        </Link>
      </div>
    </div>
  );
}
