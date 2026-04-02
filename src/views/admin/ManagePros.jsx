"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@hooks/useAuth";
import {
  getProApplications,
  validateProApplication,
  refuseProApplication,
} from "../../services/database";

const STATUS_LABELS = {
  pending: {
    label: "En attente",
    className: "bg-yellow-500/20 text-yellow-400",
  },
  validated: { label: "Validé", className: "bg-success/20 text-success" },
  refused: { label: "Refusé", className: "bg-destructive/20 text-destructive" },
};

const TABS = [
  { key: "pending", label: "En attente" },
  { key: "validated", label: "Validés" },
  { key: "refused", label: "Refusés" },
  { key: "all", label: "Tous" },
];

export default function ManagePros() {
  const { user } = useAuth();
  const [pros, setPros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  const [refusalId, setRefusalId] = useState(null);
  const [refusalReason, setRefusalReason] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadPros();
  }, []);

  async function loadPros() {
    try {
      const data = await getProApplications();
      setPros(data);
    } catch (err) {
      console.error("Erreur chargement candidatures:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleValidate(proId) {
    setActionLoading(proId);
    try {
      await validateProApplication(proId, user.uid);
      await loadPros();
    } catch (err) {
      console.error("Erreur validation:", err);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRefuse(proId) {
    if (!refusalReason.trim()) return;
    setActionLoading(proId);
    try {
      await refuseProApplication(proId, user.uid, refusalReason.trim());
      setRefusalId(null);
      setRefusalReason("");
      await loadPros();
    } catch (err) {
      console.error("Erreur refus:", err);
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = tab === "all" ? pros : pros.filter((p) => p.status === tab);

  if (loading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Chargement...
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">
        Candidatures accordeurs ({pros.length})
      </h1>

      <div className="mt-6 flex gap-2">
        {TABS.map((t) => {
          const count =
            t.key === "all"
              ? pros.length
              : pros.filter((p) => p.status === t.key).length;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-accent text-background"
                  : "bg-card text-muted hover:text-foreground"
              }`}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-muted">
          Aucune candidature{" "}
          {tab !== "all" ? STATUS_LABELS[tab]?.label.toLowerCase() : ""}.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((pro) => {
            const statusInfo =
              STATUS_LABELS[pro.status] || STATUS_LABELS.pending;
            return (
              <div
                key={pro.id}
                className="rounded-xl border border-border/50 bg-card/50 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        {pro.email}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-medium ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {pro.country} · {(pro.languages || []).join(", ")}
                    </p>
                    <p className="mt-2 text-sm text-foreground/80">{pro.bio}</p>
                    {pro.phone && (
                      <p className="mt-1 text-xs text-muted">
                        Tel: {pro.phone}
                      </p>
                    )}
                    {pro.videoURL && (
                      <a
                        href={pro.videoURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-xs text-accent hover:underline"
                      >
                        Voir la vidéo
                      </a>
                    )}
                    <p className="mt-2 text-xs text-muted/60">
                      Inscrit le{" "}
                      {new Date(pro.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {pro.refusalReason && (
                      <p className="mt-2 rounded border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
                        Motif de refus : {pro.refusalReason}
                      </p>
                    )}
                  </div>

                  {pro.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleValidate(pro.id)}
                        disabled={actionLoading === pro.id}
                        className="rounded-lg bg-success/20 px-4 py-2 text-sm font-medium text-success transition-colors hover:bg-success/30 disabled:opacity-50"
                      >
                        {actionLoading === pro.id ? "..." : "Valider"}
                      </button>
                      <button
                        onClick={() =>
                          refusalId === pro.id
                            ? setRefusalId(null)
                            : setRefusalId(pro.id)
                        }
                        className="rounded-lg bg-destructive/20 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/30"
                      >
                        Refuser
                      </button>
                    </div>
                  )}
                </div>

                {refusalId === pro.id && (
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={refusalReason}
                      onChange={(e) => setRefusalReason(e.target.value)}
                      placeholder="Motif du refus..."
                      className="flex-1 rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    />
                    <button
                      onClick={() => handleRefuse(pro.id)}
                      disabled={
                        !refusalReason.trim() || actionLoading === pro.id
                      }
                      className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-destructive/80 disabled:opacity-50"
                    >
                      Confirmer le refus
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
