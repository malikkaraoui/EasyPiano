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

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="manage-pros">
      <div className="page-header">
        <h1>Professionnels ({pros.length})</h1>
        <Link href="/admin/pros/add" className="btn-primary">
          + Ajouter un pro
        </Link>
      </div>

      <div className="pros-table">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Ville</th>
              <th>Note</th>
              <th>Avis</th>
              <th>Actif</th>
              <th>Vérifié</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pros.map((pro) => (
              <tr key={pro.id}>
                <td>
                  <strong>
                    {pro.firstName} {pro.lastName}
                  </strong>
                  <br />
                  <small>{pro.email}</small>
                </td>
                <td>
                  {pro.city} ({pro.postalCode})
                </td>
                <td>{formatRating(pro.rating || 0)}</td>
                <td>{pro.reviewCount || 0}</td>
                <td>
                  <button
                    className={`toggle-btn ${pro.active ? "active" : ""}`}
                    onClick={() => toggleActive(pro)}
                  >
                    {pro.active ? "Oui" : "Non"}
                  </button>
                </td>
                <td>
                  <button
                    className={`toggle-btn ${pro.verified ? "verified" : ""}`}
                    onClick={() => toggleVerified(pro)}
                  >
                    {pro.verified ? "✓" : "✗"}
                  </button>
                </td>
                <td className="actions">
                  <Link
                    href={`/admin/pros/edit/${pro.id}`}
                    className="btn-edit"
                  >
                    Modifier
                  </Link>
                  <button
                    className="btn-delete"
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
