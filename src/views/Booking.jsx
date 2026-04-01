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

  const total = pro.basePrice + (pro.travelFee || 0);
  const { commission } = calculateCommission(total);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">
        Réserver un accord
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="scheduledDate"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Date souhaitée
            </label>
            <input
              type="date"
              id="scheduledDate"
              name="scheduledDate"
              value={form.scheduledDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
              className="flex h-10 w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <div>
            <label
              htmlFor="scheduledTime"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Créneau horaire
            </label>
            <select
              id="scheduledTime"
              name="scheduledTime"
              value={form.scheduledTime}
              onChange={handleChange}
              required
              className="flex h-10 w-full rounded border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <option value="">Choisir un créneau</option>
              <option value="08:00">08h00 - 10h00</option>
              <option value="10:00">10h00 - 12h00</option>
              <option value="14:00">14h00 - 16h00</option>
              <option value="16:00">16h00 - 18h00</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="address"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Adresse
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Votre adresse complète"
              required
              className="flex h-10 w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <div>
            <label
              htmlFor="pianoType"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Type de piano
            </label>
            <select
              id="pianoType"
              name="pianoType"
              value={form.pianoType}
              onChange={handleChange}
              className="flex h-10 w-full rounded border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <option value="droit">Piano droit</option>
              <option value="queue">Piano à queue</option>
              <option value="numerique">Piano numérique</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="pianoModel"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Modèle (optionnel)
            </label>
            <input
              type="text"
              id="pianoModel"
              name="pianoModel"
              value={form.pianoModel}
              onChange={handleChange}
              placeholder="Ex: Yamaha U1, Steinway B..."
              className="flex h-10 w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Notes complémentaires
            </label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Informations supplémentaires..."
              rows={3}
              className="flex w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-accent shadow-sm px-8 text-sm font-medium text-background transition-colors hover:bg-accent-hover hover:shadow-md active:scale-[0.97] active:shadow-none disabled:opacity-50"
            disabled={submitting}
          >
            {submitting
              ? "Réservation en cours..."
              : "Confirmer la réservation"}
          </button>
        </form>

        <div className="rounded-xl border border-border/50 bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Récapitulatif
          </h2>
          <div className="mt-4 border-b border-border/30 pb-4">
            <strong className="text-foreground">
              {pro.firstName} {pro.lastName}
            </strong>
            <p className="mt-1 text-sm text-muted">📍 {pro.city}</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Accord piano</span>
              <span className="text-foreground">
                {formatPrice(pro.basePrice)}
              </span>
            </div>
            {pro.travelFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted">Déplacement</span>
                <span className="text-foreground">
                  {formatPrice(pro.travelFee)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-border/30 pt-2 text-base font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-accent">{formatPrice(total)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">
            Commission plateforme : {formatPrice(commission)} (10%)
          </p>
        </div>
      </div>
    </div>
  );
}
