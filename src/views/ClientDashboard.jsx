"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/UI/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { useAuth } from "../hooks/useAuth";
import { formatPrice, formatDate } from "../utils/format";
import { BUSINESS_RULES } from "@shared/constants/businessRules";

const SLOT_LABELS = {
  morning: "Matin",
  afternoon: "Après-midi",
};

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

function formatScheduleLabel(date, slot) {
  return `${formatDate(date)} · ${SLOT_LABELS[slot] || slot}`;
}

function formatDateTime(dateLike) {
  if (!dateLike) return "—";

  return new Intl.DateTimeFormat("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateLike));
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function BookingCard({ booking, children }) {
  const proName = booking.proName || "Accordeur EasyPiano";

  return (
    <article className="rounded-2xl border border-border/60 bg-card/70 p-5 transition-shadow hover:shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background text-sm font-semibold text-accent">
            {booking.proPhotoURL ? (
              <img
                src={booking.proPhotoURL}
                alt={proName}
                className="h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span aria-hidden="true">{getInitials(proName) || "EP"}</span>
            )}
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {proName}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {formatScheduleLabel(booking.date, booking.slot)}
            </p>
            <p className="mt-1 text-sm text-muted">
              Zone client : {booking.addressCity || "Non renseignée"}
            </p>
            <p className="mt-2 font-semibold text-accent">
              {formatPrice(booking.price || 0)}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${STATUS_COLORS[booking.status] || "border-border text-muted"}`}
          >
            {STATUS_LABELS[booking.status] || booking.status}
          </span>
          {children}
        </div>
      </div>
    </article>
  );
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!user) return;

      setLoading(true);
      setError("");

      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/bookings/client", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const payload = await res.json();

        if (!res.ok) {
          throw new Error(
            payload.error || "Impossible de charger vos rendez-vous.",
          );
        }

        if (!ignore) {
          setBookings(payload.data?.items || []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Erreur lors du chargement du dashboard.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [user]);

  const filteredBookings = useMemo(
    () =>
      filter === "all"
        ? bookings
        : bookings.filter((booking) => booking.status === filter),
    [bookings, filter],
  );

  const upcomingBookings = useMemo(
    () =>
      [...filteredBookings]
        .filter(
          (booking) => !["completed", "cancelled"].includes(booking.status),
        )
        .sort((left, right) => left.date.localeCompare(right.date)),
    [filteredBookings],
  );

  const historyBookings = useMemo(
    () =>
      [...filteredBookings]
        .filter((booking) =>
          ["completed", "cancelled"].includes(booking.status),
        )
        .sort((left, right) => right.date.localeCompare(left.date)),
    [filteredBookings],
  );

  async function openMaintenanceReport(booking) {
    if (!user) return;

    setSelectedBooking(booking);
    setSelectedReport(null);
    setReportError("");
    setReportLoading(true);
    setReportDialogOpen(true);

    try {
      const token = await user.getIdToken();
      const res = await fetch(
        `/api/maintenance-report?bookingId=${booking.bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(
          payload.error || "Impossible de charger le carnet d’entretien.",
        );
      }

      setSelectedReport(payload.data || null);
    } catch (err) {
      setReportError(err.message || "Erreur lors du chargement du rapport.");
    } finally {
      setReportLoading(false);
    }
  }

  function closeMaintenanceReport() {
    setReportDialogOpen(false);
    setReportLoading(false);
    setReportError("");
    setSelectedBooking(null);
    setSelectedReport(null);
  }

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

      {error && (
        <div className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {[
          "all",
          "pending",
          "confirmed",
          "in_progress",
          "completed",
          "cancelled",
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

      {filteredBookings.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-muted">
            Aucune réservation {filter !== "all" ? "avec ce statut" : ""}
          </p>
          <Link
            href="/search"
            className="mt-4 inline-flex h-10 items-center rounded-lg bg-accent shadow-sm px-6 text-sm font-medium text-background transition-colors hover:bg-accent-hover hover:shadow-md active:scale-[0.97] active:shadow-none"
          >
            Trouver un accordeur
          </Link>
        </div>
      )}

      {filteredBookings.length > 0 && (
        <div className="mt-10 space-y-10">
          <section>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Prochains rendez-vous
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Retrouvez ici vos interventions à venir et leur statut en
                  temps réel.
                </p>
              </div>
              <p className="text-sm text-muted">
                {upcomingBookings.length} rendez-vous affiché
                {upcomingBookings.length > 1 ? "s" : ""}
              </p>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-border/60 bg-card/50 p-5 text-sm text-muted">
                Pas de rendez-vous prévu pour l’instant. Vous pouvez lancer une
                nouvelle recherche quand vous le souhaitez.
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.bookingId} booking={booking}>
                    <span className="text-xs text-muted">
                      Réservation en cours de préparation
                    </span>
                  </BookingCard>
                ))}
              </div>
            )}
          </section>

          <section>
            <div>
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                Historique & carnet d’entretien
              </h2>
              <p className="mt-1 text-sm text-muted">
                Consultez vos interventions passées, laissez un avis et relisez
                les recommandations de l’accordeur.
              </p>
            </div>

            {historyBookings.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-border/60 bg-card/50 p-5 text-sm text-muted">
                Aucun rendez-vous passé pour le moment.
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {historyBookings.map((booking) => {
                  const openingThisReport =
                    reportLoading &&
                    selectedBooking?.bookingId === booking.bookingId;

                  return (
                    <BookingCard key={booking.bookingId} booking={booking}>
                      {booking.status === "completed" &&
                      booking.maintenanceReportExists ? (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => openMaintenanceReport(booking)}
                          disabled={openingThisReport}
                        >
                          {openingThisReport
                            ? "Chargement..."
                            : "Voir le carnet d’entretien"}
                        </Button>
                      ) : null}

                      {booking.status === "completed" &&
                      !booking.maintenanceReportExists ? (
                        <span className="text-xs text-muted">
                          Rapport post-intervention en attente.
                        </span>
                      ) : null}

                      {booking.status === "completed" ? (
                        <Link
                          href={`/review/${booking.bookingId}`}
                          className="text-xs text-accent transition-colors hover:text-accent-hover"
                        >
                          Laisser un avis
                        </Link>
                      ) : null}
                    </BookingCard>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      <DialogContent
        open={reportDialogOpen}
        onClose={reportLoading ? undefined : closeMaintenanceReport}
        className="max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>Carnet d’entretien du piano</DialogTitle>
          <DialogDescription>
            {selectedBooking
              ? `Intervention du ${formatScheduleLabel(selectedBooking.date, selectedBooking.slot)}.`
              : "Retrouvez ici les observations transmises par votre accordeur."}
          </DialogDescription>
        </DialogHeader>

        {reportLoading ? (
          <div className="rounded-2xl border border-border/60 bg-card/50 p-5 text-sm text-muted">
            Chargement du carnet d’entretien...
          </div>
        ) : reportError ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive">
            {reportError}
          </div>
        ) : selectedReport ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-accent/80">
                Diagnostic
              </p>
              <p className="mt-2 text-sm text-foreground">
                {selectedReport.condition}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-accent/80">
                  Rapport envoyé le
                </p>
                <p className="mt-2 text-sm text-foreground">
                  {formatDateTime(selectedReport.createdAt)}
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-accent/80">
                  Prochain accordage conseillé
                </p>
                <p className="mt-2 text-sm text-foreground">
                  {selectedReport.nextTuningDate
                    ? formatDate(selectedReport.nextTuningDate)
                    : "Aucune date proposée pour le moment."}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-accent/80">
                Recommandations
              </p>
              <p className="mt-2 whitespace-pre-line text-sm text-foreground">
                {selectedReport.recommendations ||
                  "Aucune recommandation complémentaire n’a été transmise."}
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={closeMaintenanceReport}
              >
                Fermer
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </div>
  );
}
