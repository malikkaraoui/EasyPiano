"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getProfessionals,
  updateProfessional,
  deleteProfessional,
} from "../../services/database";
import { formatRating } from "../../utils/format";

export default function ManagePros() {
  const [pros, setPros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPros();
  }, []);

  async function loadPros() {
    try {
      const data = await getProfessionals();
      setPros(data);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(pro) {
    await updateProfessional(pro.id, { active: !pro.active });
    loadPros();
  }

  async function toggleVerified(pro) {
    await updateProfessional(pro.id, { verified: !pro.verified });
    loadPros();
  }

  async function handleDelete(pro) {
    if (!window.confirm(`Supprimer ${pro.firstName} ${pro.lastName} ?`)) return;
    await deleteProfessional(pro.id);
    loadPros();
  }

  if (loading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Chargement...
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Professionnels ({pros.length})
        </h1>
        <Link
          href="/admin/pros/add"
          className="inline-flex h-10 items-center rounded bg-accent px-4 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
        >
          + Ajouter un pro
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-card">
            <tr>
              <th className="p-3 text-left text-xs font-medium uppercase text-muted">
                Nom
              </th>
              <th className="p-3 text-left text-xs font-medium uppercase text-muted">
                Ville
              </th>
              <th className="p-3 text-left text-xs font-medium uppercase text-muted">
                Note
              </th>
              <th className="p-3 text-left text-xs font-medium uppercase text-muted">
                Avis
              </th>
              <th className="p-3 text-left text-xs font-medium uppercase text-muted">
                Actif
              </th>
              <th className="p-3 text-left text-xs font-medium uppercase text-muted">
                Vérifié
              </th>
              <th className="p-3 text-left text-xs font-medium uppercase text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pros.map((pro) => (
              <tr
                key={pro.id}
                className="border-b border-border/30 transition-colors hover:bg-card/50"
              >
                <td className="p-3">
                  <strong className="text-foreground">
                    {pro.firstName} {pro.lastName}
                  </strong>
                  <br />
                  <span className="text-xs text-muted">{pro.email}</span>
                </td>
                <td className="p-3 text-muted">
                  {pro.city} ({pro.postalCode})
                </td>
                <td className="p-3 text-foreground">
                  {formatRating(pro.rating || 0)}
                </td>
                <td className="p-3 text-muted">{pro.reviewCount || 0}</td>
                <td className="p-3">
                  <button
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      pro.active
                        ? "bg-success/20 text-success"
                        : "bg-destructive/20 text-destructive"
                    }`}
                    onClick={() => toggleActive(pro)}
                  >
                    {pro.active ? "Oui" : "Non"}
                  </button>
                </td>
                <td className="p-3">
                  <button
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      pro.verified
                        ? "bg-accent/20 text-accent"
                        : "bg-card text-muted"
                    }`}
                    onClick={() => toggleVerified(pro)}
                  >
                    {pro.verified ? "✓" : "✗"}
                  </button>
                </td>
                <td className="flex gap-2 p-3">
                  <Link
                    href={`/admin/pros/edit/${pro.id}`}
                    className="rounded border border-border px-2 py-1 text-xs text-foreground transition-colors hover:bg-card"
                  >
                    Modifier
                  </Link>
                  <button
                    className="rounded border border-destructive/30 px-2 py-1 text-xs text-destructive transition-colors hover:bg-destructive/10"
                    onClick={() => handleDelete(pro)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
