"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { getProfessionalById, createBooking } from "../services/database";
import { calculateCommission } from "../services/stripe";
import { formatPrice } from "../utils/format";

export default function Booking() {
  const { proId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [pro, setPro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    scheduledDate: "",
    scheduledTime: "",
    address: "",
    pianoType: "droit",
    pianoModel: "",
    notes: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getProfessionalById(proId);
        setPro(data);
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [proId]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.scheduledDate || !form.scheduledTime || !form.address) return;

    setSubmitting(true);
    try {
      const amount = pro.basePrice + (pro.travelFee || 0);
      const { commission, netAmount } = calculateCommission(amount);

      await createBooking({
        clientUid: user.uid,
        clientName: user.displayName,
        clientEmail: user.email,
        proId: pro.id,
        proName: `${pro.firstName} ${pro.lastName}`,
        ...form,
        amount,
        commission,
        netAmount,
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("Erreur réservation:", err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="loading">Chargement...</div>;
  if (!pro) return <div className="not-found">Professionnel introuvable</div>;

  const total = pro.basePrice + (pro.travelFee || 0);
  const { commission } = calculateCommission(total);

  return (
    <div className="booking-page">
      <h1>Réserver un accord</h1>

      <div className="booking-layout">
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="scheduledDate">Date souhaitée</label>
            <input
              type="date"
              id="scheduledDate"
              name="scheduledDate"
              value={form.scheduledDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="scheduledTime">Créneau horaire</label>
            <select
              id="scheduledTime"
              name="scheduledTime"
              value={form.scheduledTime}
              onChange={handleChange}
              required
            >
              <option value="">Choisir un créneau</option>
              <option value="08:00">08h00 - 10h00</option>
              <option value="10:00">10h00 - 12h00</option>
              <option value="14:00">14h00 - 16h00</option>
              <option value="16:00">16h00 - 18h00</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="address">Adresse</label>
            <input
              type="text"
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Votre adresse complète"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pianoType">Type de piano</label>
            <select
              id="pianoType"
              name="pianoType"
              value={form.pianoType}
              onChange={handleChange}
            >
              <option value="droit">Piano droit</option>
              <option value="queue">Piano à queue</option>
              <option value="numerique">Piano numérique</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="pianoModel">Modèle (optionnel)</label>
            <input
              type="text"
              id="pianoModel"
              name="pianoModel"
              value={form.pianoModel}
              onChange={handleChange}
              placeholder="Ex: Yamaha U1, Steinway B..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes complémentaires</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Informations supplémentaires..."
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting
              ? "Réservation en cours..."
              : "Confirmer la réservation"}
          </button>
        </form>

        <div className="booking-summary">
          <h2>Récapitulatif</h2>
          <div className="summary-pro">
            <strong>
              {pro.firstName} {pro.lastName}
            </strong>
            <p>📍 {pro.city}</p>
          </div>
          <div className="summary-pricing">
            <div className="pricing-row">
              <span>Accord piano</span>
              <span>{formatPrice(pro.basePrice)}</span>
            </div>
            {pro.travelFee > 0 && (
              <div className="pricing-row">
                <span>Déplacement</span>
                <span>{formatPrice(pro.travelFee)}</span>
              </div>
            )}
            <div className="pricing-row pricing-total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <p className="pricing-note">
            Commission plateforme : {formatPrice(commission)} (10%)
          </p>
        </div>
      </div>
    </div>
  );
}
