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

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Administration</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Professionnels</h3>
          <p className="stat-value">{stats.totalPros}</p>
          <p className="stat-detail">{stats.activePros} actifs</p>
        </div>
        <div className="stat-card">
          <h3>Réservations</h3>
          <p className="stat-value">{stats.totalBookings}</p>
          <p className="stat-detail">{stats.completedBookings} terminées</p>
        </div>
        <div className="stat-card">
          <h3>Chiffre d&apos;affaires</h3>
          <p className="stat-value">{formatPrice(stats.totalRevenue)}</p>
          <p className="stat-detail">Total encaissé</p>
        </div>
        <div className="stat-card stat-highlight">
          <h3>Commissions</h3>
          <p className="stat-value">{formatPrice(stats.totalCommission)}</p>
          <p className="stat-detail">10% par réservation</p>
        </div>
      </div>

      <div className="admin-nav">
        <Link href="/admin/pros" className="admin-nav-card">
          <h3>Gérer les professionnels</h3>
          <p>Ajouter, modifier, activer/désactiver</p>
        </Link>
        <Link href="/admin/bookings" className="admin-nav-card">
          <h3>Réservations</h3>
          <p>Voir toutes les réservations</p>
        </Link>
        <Link href="/admin/reviews" className="admin-nav-card">
          <h3>Avis</h3>
          <p>Modérer les avis signalés</p>
        </Link>
        <Link href="/admin/transactions" className="admin-nav-card">
          <h3>Transactions</h3>
          <p>Suivi des paiements et commissions</p>
        </Link>
      </div>
    </div>
  );
}
