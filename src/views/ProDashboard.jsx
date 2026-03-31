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
import { Input } from "@/components/UI/input";
import { useAuth } from "@/hooks/useAuth";

const EMPTY_AVAILABILITY_FORM = {
  startDate: "",
  endDate: "",
  zone: "",
  radiusKm: 50,
  capacityMorning: 1,
  capacityAfternoon: 2,
};

const EMPTY_REPORT_FORM = {
  condition: "",
  recommendations: "",
  nextTuningDate: "",
};

const LOCKED_BOOKING_STATUSES = new Set([
  "confirmed",
  "in_progress",
  "completed",
]);

const REPORT_CONDITION_OPTIONS = [
  "Accordage stable, mécanique saine",
  "Légères irrégularités à surveiller",
  "Usure mécanique à prévoir",
  "Intervention complémentaire recommandée",
];

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
};

const STATUS_CLASSES = {
  pending: "border-accent/40 bg-accent/10 text-accent",
  confirmed: "border-success/40 bg-success/10 text-success",
  in_progress: "border-success/40 bg-success/10 text-success",
  completed: "border-border/60 bg-card text-foreground",
  cancelled: "border-destructive/40 bg-destructive/10 text-destructive",
};

function formatMoney(cents = 0) {
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: "CHF",
  }).format(cents / 100);
}

function formatDateLabel(date, slot) {
  const formattedDate = new Intl.DateTimeFormat("fr-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));

  return `${formattedDate} · ${SLOT_LABELS[slot] || slot}`;
}

function formatRevealLabel(isoString) {
  return new Intl.DateTimeFormat("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}

function getBlockingBookingsCount(availability, bookings) {
  return bookings.filter(
    (booking) =>
      LOCKED_BOOKING_STATUSES.has(booking.status) &&
      booking.date >= availability.startDate &&
      booking.date <= availability.endDate,
  ).length;
}

function AvailabilityCard({
  availability,
  bookingCount,
  isEditing,
  onDelete,
  onEdit,
}) {
  const isLocked = bookingCount > 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">
            {availability.zone}
          </h3>
          <p className="mt-1 text-sm text-muted">
            Du {availability.startDate} au {availability.endDate}
          </p>
          <p className="mt-1 text-sm text-muted">
            Rayon {availability.radiusKm} km · Capacité matin{" "}
            {availability.capacityMorning} · après-midi{" "}
            {availability.capacityAfternoon}
          </p>
          {isLocked && (
            <p className="mt-2 text-xs text-accent">
              {bookingCount} réservation{bookingCount > 1 ? "s" : ""} confirmée
              {bookingCount > 1 ? "s verrouillent" : " verrouille"} cette
              tournée. Créez une nouvelle disponibilité si vous devez ajuster la
              suite.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onEdit(availability)}
            disabled={isLocked}
            aria-label={`Modifier la tournée ${availability.zone}`}
          >
            {isEditing ? "En modification" : "Modifier"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(availability.id)}
            disabled={isLocked}
            aria-label={`Supprimer la tournée ${availability.zone}`}
          >
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProDashboard() {
  const { user, proProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [bookings, setBookings] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [editingAvailabilityId, setEditingAvailabilityId] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [redirectingToStripe, setRedirectingToStripe] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportBooking, setReportBooking] = useState(null);
  const [submittingReport, setSubmittingReport] = useState(false);
  const [form, setForm] = useState(EMPTY_AVAILABILITY_FORM);
  const [reportForm, setReportForm] = useState(EMPTY_REPORT_FORM);

  const isValidated = proProfile?.status === "validated";
  const stripeReady = Boolean(proProfile?.stripeOnboardingComplete);

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      if (!user) return;

      if (!isValidated) {
        if (!ignore) {
          setBookings([]);
          setAvailabilities([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError("");

      try {
        const token = await user.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [bookingsRes, availabilitiesRes] = await Promise.all([
          fetch("/api/bookings/pro", { headers }),
          fetch("/api/availabilities", { headers }),
        ]);

        const [bookingsPayload, availabilitiesPayload] = await Promise.all([
          bookingsRes.json(),
          availabilitiesRes.json(),
        ]);

        if (!bookingsRes.ok) {
          throw new Error(
            bookingsPayload.error ||
              "Impossible de charger les rendez-vous du dashboard pro.",
          );
        }

        if (!availabilitiesRes.ok) {
          throw new Error(
            availabilitiesPayload.error ||
              "Impossible de charger les disponibilités du dashboard pro.",
          );
        }

        if (!ignore) {
          setBookings(bookingsPayload.data?.items || []);
          setAvailabilities(availabilitiesPayload.data?.items || []);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError.message || "Erreur de chargement du dashboard pro.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [user, isValidated]);

  const upcomingBookings = useMemo(
    () => bookings.filter((booking) => booking.status !== "cancelled"),
    [bookings],
  );

  const estimatedRevenue = useMemo(
    () =>
      upcomingBookings.reduce((sum, booking) => sum + (booking.price || 0), 0),
    [upcomingBookings],
  );

  const availabilityBookingCounts = useMemo(
    () =>
      availabilities.reduce((acc, availability) => {
        acc[availability.id] = getBlockingBookingsCount(availability, bookings);
        return acc;
      }, {}),
    [availabilities, bookings],
  );

  const sortedAvailabilities = useMemo(
    () =>
      [...availabilities].sort((left, right) =>
        left.startDate.localeCompare(right.startDate),
      ),
    [availabilities],
  );

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleReportFormChange(event) {
    const { name, value } = event.target;
    setReportForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetAvailabilityForm() {
    setEditingAvailabilityId(null);
    setForm(EMPTY_AVAILABILITY_FORM);
  }

  function closeReportDialog() {
    setReportDialogOpen(false);
    setReportBooking(null);
    setReportForm(EMPTY_REPORT_FORM);
  }

  function openReportDialog(booking) {
    setReportBooking(booking);
    setReportForm(EMPTY_REPORT_FORM);
    setReportDialogOpen(true);
  }

  function handleEditAvailability(availability) {
    setEditingAvailabilityId(availability.id);
    setError("");
    setForm({
      startDate: availability.startDate,
      endDate: availability.endDate,
      zone: availability.zone,
      radiusKm: availability.radiusKm,
      capacityMorning: availability.capacityMorning,
      capacityAfternoon: availability.capacityAfternoon,
    });
  }

  async function handlePublishAvailability(event) {
    event.preventDefault();
    if (!user) return;

    setPublishing(true);
    setError("");
    setNotice("");

    try {
      const token = await user.getIdToken();
      const method = editingAvailabilityId ? "PUT" : "POST";
      const res = await fetch("/api/availabilities", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...(editingAvailabilityId
            ? { availabilityId: editingAvailabilityId }
            : {}),
          startDate: form.startDate,
          endDate: form.endDate,
          zone: form.zone,
          radiusKm: Number(form.radiusKm),
          capacityMorning: Number(form.capacityMorning),
          capacityAfternoon: Number(form.capacityAfternoon),
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(
          payload.error ||
            (editingAvailabilityId
              ? "Impossible de modifier la disponibilité."
              : "Impossible de publier la disponibilité."),
        );
      }

      setAvailabilities((prev) =>
        editingAvailabilityId
          ? prev.map((item) =>
              item.id === editingAvailabilityId ? payload.data : item,
            )
          : [payload.data, ...prev],
      );
      resetAvailabilityForm();
    } catch (publishError) {
      setError(publishError.message || "Erreur lors de la publication.");
    } finally {
      setPublishing(false);
    }
  }

  async function handleDeleteAvailability(availabilityId) {
    if (!user) return;

    try {
      setNotice("");
      const token = await user.getIdToken();
      const res = await fetch(`/api/availabilities?id=${availabilityId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(
          payload.error || "Impossible de supprimer la disponibilité.",
        );
      }

      setAvailabilities((prev) =>
        prev.filter((item) => item.id !== availabilityId),
      );
      if (editingAvailabilityId === availabilityId) {
        resetAvailabilityForm();
      }
    } catch (deleteError) {
      setError(deleteError.message || "Erreur lors de la suppression.");
    }
  }

  async function handleStripeOnboarding() {
    if (!user || !proProfile?.proId) return;

    setRedirectingToStripe(true);
    setError("");
    setNotice("");

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/stripe/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ proId: proProfile.proId }),
      });
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(
          payload.error || "Impossible de lancer Stripe Connect.",
        );
      }

      if (typeof window !== "undefined") {
        window.location.assign(payload.data.onboardingUrl);
      }
    } catch (stripeError) {
      setError(
        stripeError.message || "Erreur lors de l'initialisation Stripe.",
      );
      setRedirectingToStripe(false);
    }
  }

  async function handleBookingStatusUpdate(bookingId, nextStatus) {
    if (!user) return;

    setUpdatingBookingId(bookingId);
    setError("");
    setNotice("");

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/bookings/pro", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, status: nextStatus }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(
          payload.error ||
            "Impossible de mettre à jour le statut du rendez-vous.",
        );
      }

      let updatedBooking = null;
      setBookings((prev) =>
        prev.map((item) => {
          if (item.bookingId !== bookingId) return item;
          updatedBooking = { ...item, ...payload.data };
          return updatedBooking;
        }),
      );

      setNotice(
        nextStatus === "in_progress"
          ? "Intervention démarrée. Vous pouvez maintenant suivre le rendez-vous en temps réel."
          : "Intervention terminée. Renseignez maintenant le rapport post-intervention.",
      );

      if (
        updatedBooking?.status === "completed" &&
        !updatedBooking.maintenanceReportExists
      ) {
        openReportDialog(updatedBooking);
      }
    } catch (statusError) {
      setError(
        statusError.message || "Erreur lors de la mise à jour du statut.",
      );
    } finally {
      setUpdatingBookingId(null);
    }
  }

  async function handleSubmitMaintenanceReport(event) {
    event.preventDefault();
    if (!user || !reportBooking) return;

    setSubmittingReport(true);
    setError("");
    setNotice("");

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/maintenance-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: reportBooking.bookingId,
          condition: reportForm.condition,
          recommendations: reportForm.recommendations,
          nextTuningDate: reportForm.nextTuningDate || null,
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(
          payload.error || "Impossible d'enregistrer le rapport.",
        );
      }

      setBookings((prev) =>
        prev.map((item) =>
          item.bookingId === reportBooking.bookingId
            ? {
                ...item,
                maintenanceReportExists: true,
                maintenanceReport: payload.data,
              }
            : item,
        ),
      );
      setNotice("Rapport post-intervention enregistré avec succès.");
      closeReportDialog();
    } catch (reportError) {
      setError(
        reportError.message || "Erreur lors de l'enregistrement du rapport.",
      );
    } finally {
      setSubmittingReport(false);
    }
  }

  function getBookingAction(booking) {
    if (booking.status === "confirmed") {
      return {
        label: "Démarrer l’intervention",
        onClick: () =>
          handleBookingStatusUpdate(booking.bookingId, "in_progress"),
      };
    }

    if (booking.status === "in_progress") {
      return {
        label: "Marquer comme terminée",
        onClick: () =>
          handleBookingStatusUpdate(booking.bookingId, "completed"),
      };
    }

    if (booking.status === "completed" && !booking.maintenanceReportExists) {
      return {
        label: "Rédiger le rapport",
        onClick: () => openReportDialog(booking),
      };
    }

    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Chargement du dashboard pro...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-accent/80">
            Dashboard pro
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">
            Pilotez vos tournées EasyPiano
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Publiez vos disponibilités, suivez vos rendez-vous et révélez les
            adresses clients uniquement quand la fenêtre de sécurité le permet.
          </p>
        </div>
        <Link
          href="/become-pro"
          className="text-sm text-accent hover:text-accent-hover"
        >
          Mettre à jour ma candidature
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {notice && (
        <div className="mt-6 rounded-2xl border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
          {notice}
        </div>
      )}

      {!isValidated && (
        <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-5">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Candidature en cours de validation
          </h2>
          <p className="mt-2 text-sm text-muted">
            Votre profil est actuellement{" "}
            <strong>{proProfile?.status || "en attente"}</strong>. Dès
            validation, vous pourrez publier vos tournées et gérer vos
            rendez-vous ici.
          </p>
        </div>
      )}

      {isValidated && !stripeReady && (
        <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Activez Stripe Connect avant de publier
              </h2>
              <p className="mt-2 text-sm text-muted">
                Votre profil est validé, mais l’onboarding Stripe doit être
                terminé avant la publication de nouvelles disponibilités.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleStripeOnboarding}
              disabled={redirectingToStripe}
            >
              {redirectingToStripe
                ? "Ouverture..."
                : "Configurer Stripe Connect"}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card/70 p-5">
          <p className="text-sm text-muted">Rendez-vous à venir</p>
          <p className="mt-2 font-heading text-3xl font-bold text-foreground">
            {upcomingBookings.length}
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/70 p-5">
          <p className="text-sm text-muted">Tournées publiées</p>
          <p className="mt-2 font-heading text-3xl font-bold text-foreground">
            {availabilities.length}
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/70 p-5">
          <p className="text-sm text-muted">CA planifié</p>
          <p className="mt-2 font-heading text-3xl font-bold text-foreground">
            {formatMoney(estimatedRevenue)}
          </p>
        </div>
      </div>

      {isValidated && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-4">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                Emploi du temps pro
              </h2>
              <p className="mt-1 text-sm text-muted">
                Avant $24\,h$, seule la ville du client est visible. L’adresse
                exacte s’affiche automatiquement à l’approche du rendez-vous.
              </p>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-card/50 p-5 text-sm text-muted">
                Aucun rendez-vous pour le moment. Publiez une tournée pour
                commencer à recevoir des réservations.
              </div>
            ) : (
              upcomingBookings.map((booking) => (
                <article
                  key={booking.bookingId}
                  className="rounded-2xl border border-border/60 bg-card/70 p-5"
                >
                  {(() => {
                    const bookingAction = getBookingAction(booking);
                    const bookingActionDisabled =
                      updatingBookingId === booking.bookingId ||
                      submittingReport;

                    return (
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm text-muted">
                            {formatDateLabel(booking.date, booking.slot)}
                          </p>
                          <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">
                            {booking.addressVisible
                              ? booking.address
                              : `${booking.addressCity} · adresse masquée`}
                          </h3>
                          {!booking.addressVisible && (
                            <p className="mt-2 text-xs text-muted">
                              Adresse exacte visible à partir du{" "}
                              {formatRevealLabel(booking.revealAt)}.
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-start gap-2 sm:items-end">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${STATUS_CLASSES[booking.status] || STATUS_CLASSES.pending}`}
                          >
                            {STATUS_LABELS[booking.status] || booking.status}
                          </span>
                          <span className="text-sm font-medium text-accent">
                            {formatMoney(booking.price)}
                          </span>

                          {bookingAction && (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={bookingAction.onClick}
                              disabled={bookingActionDisabled}
                            >
                              {updatingBookingId === booking.bookingId &&
                              booking.status !== "completed"
                                ? "Mise à jour..."
                                : bookingAction.label}
                            </Button>
                          )}

                          {booking.status === "completed" &&
                            booking.maintenanceReportExists && (
                              <span className="text-xs font-medium text-success">
                                Rapport envoyé
                              </span>
                            )}
                        </div>
                      </div>
                    );
                  })()}
                </article>
              ))
            )}
          </section>

          <section className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                Disponibilités publiées
              </h2>
              <p className="mt-1 text-sm text-muted">
                Déclarez vos zones, rayons et capacités pour ouvrir vos créneaux
                à la réservation.
              </p>
            </div>

            <form
              onSubmit={handlePublishAvailability}
              id="availability-form"
              className="rounded-2xl border border-border/60 bg-card/70 p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {editingAvailabilityId
                      ? "Modifier une tournée existante"
                      : "Publier une nouvelle tournée"}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {editingAvailabilityId
                      ? "Ajustez les dates, la zone et les capacités tant qu’aucune réservation confirmée n’existe sur cette période."
                      : "Publiez jusqu’à 6 mois à l’avance pour alimenter votre tournée EasyPiano."}
                  </p>
                </div>
                {editingAvailabilityId && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={resetAvailabilityForm}
                    disabled={publishing}
                  >
                    Annuler la modification
                  </Button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium text-foreground"
                    htmlFor="startDate"
                  >
                    Date de début
                  </label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleFormChange}
                    required
                    disabled={!stripeReady || publishing}
                  />
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium text-foreground"
                    htmlFor="endDate"
                  >
                    Date de fin
                  </label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleFormChange}
                    required
                    disabled={!stripeReady || publishing}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label
                  className="mb-1.5 block text-sm font-medium text-foreground"
                  htmlFor="zone"
                >
                  Zone de tournée
                </label>
                <Input
                  id="zone"
                  name="zone"
                  value={form.zone}
                  onChange={handleFormChange}
                  placeholder="Genève – Lausanne"
                  required
                  disabled={!stripeReady || publishing}
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium text-foreground"
                    htmlFor="radiusKm"
                  >
                    Rayon (km)
                  </label>
                  <Input
                    id="radiusKm"
                    name="radiusKm"
                    type="number"
                    min="1"
                    value={form.radiusKm}
                    onChange={handleFormChange}
                    disabled={!stripeReady || publishing}
                  />
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium text-foreground"
                    htmlFor="capacityMorning"
                  >
                    Capacité matin
                  </label>
                  <Input
                    id="capacityMorning"
                    name="capacityMorning"
                    type="number"
                    min="1"
                    value={form.capacityMorning}
                    onChange={handleFormChange}
                    disabled={!stripeReady || publishing}
                  />
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium text-foreground"
                    htmlFor="capacityAfternoon"
                  >
                    Capacité après-midi
                  </label>
                  <Input
                    id="capacityAfternoon"
                    name="capacityAfternoon"
                    type="number"
                    min="1"
                    value={form.capacityAfternoon}
                    onChange={handleFormChange}
                    disabled={!stripeReady || publishing}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="mt-5 w-full"
                disabled={!stripeReady || publishing}
              >
                {publishing
                  ? editingAvailabilityId
                    ? "Mise à jour..."
                    : "Publication..."
                  : editingAvailabilityId
                    ? "Mettre à jour cette tournée"
                    : "Publier cette tournée"}
              </Button>
            </form>

            <div className="space-y-3">
              {sortedAvailabilities.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/60 bg-card/50 p-5 text-sm text-muted">
                  Aucune disponibilité publiée pour l’instant.
                </div>
              ) : (
                sortedAvailabilities.map((availability) => (
                  <AvailabilityCard
                    key={availability.id}
                    availability={availability}
                    bookingCount={
                      availabilityBookingCounts[availability.id] || 0
                    }
                    isEditing={editingAvailabilityId === availability.id}
                    onDelete={handleDeleteAvailability}
                    onEdit={handleEditAvailability}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      )}

      <DialogContent
        open={reportDialogOpen}
        onClose={submittingReport ? undefined : closeReportDialog}
        className="max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>Rapport post-intervention</DialogTitle>
          <DialogDescription>
            {reportBooking
              ? `Consignez l’état du piano pour le rendez-vous du ${formatDateLabel(reportBooking.date, reportBooking.slot)}.`
              : "Renseignez le suivi technique de l’intervention."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmitMaintenanceReport}>
          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-foreground"
              htmlFor="condition"
            >
              État du piano
            </label>
            <select
              id="condition"
              name="condition"
              value={reportForm.condition}
              onChange={handleReportFormChange}
              required
              disabled={submittingReport}
              className="flex h-10 w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <option value="">Choisir un diagnostic</option>
              {REPORT_CONDITION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-foreground"
              htmlFor="recommendations"
            >
              Recommandations
            </label>
            <textarea
              id="recommendations"
              name="recommendations"
              value={reportForm.recommendations}
              onChange={handleReportFormChange}
              rows={4}
              disabled={submittingReport}
              placeholder="Ex. harmoniser la mécanique au prochain passage, surveiller le diapason, humidification à ajuster..."
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-foreground"
              htmlFor="nextTuningDate"
            >
              Prochain accordage conseillé
            </label>
            <Input
              id="nextTuningDate"
              name="nextTuningDate"
              type="date"
              value={reportForm.nextTuningDate}
              onChange={handleReportFormChange}
              disabled={submittingReport}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={closeReportDialog}
              disabled={submittingReport}
            >
              Fermer
            </Button>
            <Button type="submit" disabled={submittingReport}>
              {submittingReport
                ? "Enregistrement..."
                : "Enregistrer le rapport"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </div>
  );
}
