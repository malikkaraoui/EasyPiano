"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import {
  createProfessional,
  updateProfessional,
  getProfessionalById,
} from "../../services/database";
import { uploadProPhoto } from "../../services/storage";

export default function AddPro() {
  const { proId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const isEdit = Boolean(proId);
  const [submitting, setSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    description: "",
    experience: "",
    specialties: "",
    linkedinUrl: "",
    whatsappNumber: "",
    website: "",
    address: "",
    city: "",
    postalCode: "",
    department: "",
    zone: "30",
    basePrice: "",
    travelFee: "0",
  });

  useEffect(() => {
    if (isEdit) {
      getProfessionalById(proId).then((data) => {
        if (data) {
          setForm({
            ...data,
            specialties: data.specialties?.join(", ") || "",
            experience: String(data.experience || ""),
            basePrice: String(data.basePrice || ""),
            travelFee: String(data.travelFee || "0"),
            zone: String(data.zone || "30"),
          });
          if (data.photoURL) setPhotoPreview(data.photoURL);
        }
      });
    }
  }, [proId, isEdit]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const proData = {
        ...form,
        experience: Number(form.experience),
        basePrice: Number(form.basePrice),
        travelFee: Number(form.travelFee),
        zone: Number(form.zone),
        specialties: form.specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      let id = proId;
      if (isEdit) {
        await updateProfessional(proId, proData);
      } else {
        id = await createProfessional(proData, user.uid);
      }

      if (photoFile && id) {
        const { url, path } = await uploadProPhoto(id, photoFile);
        await updateProfessional(id, { photoURL: url, photoPath: path });
      }

      router.push("/admin/pros");
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="add-pro-page">
      <h1>
        {isEdit ? "Modifier le professionnel" : "Ajouter un professionnel"}
      </h1>

      <form onSubmit={handleSubmit} className="pro-form">
        <fieldset>
          <legend>Photo de profil</legend>
          <div className="photo-upload">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="photo-preview" />
            ) : (
              <div className="photo-placeholder">📷</div>
            )}
            <input type="file" accept="image/*" onChange={handlePhoto} />
            <p className="help-text">Max 2MB, sera compressée à 500KB</p>
          </div>
        </fieldset>

        <fieldset>
          <legend>Identité</legend>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Profil</legend>
          <div className="form-group">
            <label htmlFor="description">Bio / Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="experience">Expérience (années)</label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="specialties">
                Spécialités (séparées par des virgules)
              </label>
              <input
                type="text"
                id="specialties"
                name="specialties"
                value={form.specialties}
                onChange={handleChange}
                placeholder="Piano droit, Piano à queue, Restauration..."
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Contacts</legend>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="linkedinUrl">LinkedIn (URL)</label>
              <input
                type="url"
                id="linkedinUrl"
                name="linkedinUrl"
                value={form.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="whatsappNumber">
                WhatsApp (numéro international)
              </label>
              <input
                type="text"
                id="whatsappNumber"
                name="whatsappNumber"
                value={form.whatsappNumber}
                onChange={handleChange}
                placeholder="+33612345678"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="website">Site web</label>
            <input
              type="url"
              id="website"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Localisation</legend>
          <div className="form-group">
            <label htmlFor="address">Adresse</label>
            <input
              type="text"
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">Ville</label>
              <input
                type="text"
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="postalCode">Code postal</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="department">Département</label>
              <input
                type="text"
                id="department"
                name="department"
                value={form.department}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="zone">Zone d&apos;intervention (km)</label>
            <input
              type="number"
              id="zone"
              name="zone"
              value={form.zone}
              onChange={handleChange}
              min="1"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Tarifs</legend>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="basePrice">Prix de base (€)</label>
              <input
                type="number"
                id="basePrice"
                name="basePrice"
                value={form.basePrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="travelFee">Frais de déplacement (€)</label>
              <input
                type="number"
                id="travelFee"
                name="travelFee"
                value={form.travelFee}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </fieldset>

        <button
          type="submit"
          className="btn-primary btn-lg"
          disabled={submitting}
        >
          {submitting
            ? "Enregistrement..."
            : isEdit
              ? "Mettre à jour"
              : "Ajouter le professionnel"}
        </button>
      </form>
    </div>
  );
}
