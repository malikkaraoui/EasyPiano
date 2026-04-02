/**
 * Script pour insérer 10 profils pros de démo autour de Genève et Lausanne.
 * Usage : node scripts/seed-demo-pros.js
 * Requiert FIREBASE_ADMIN_CREDENTIAL et NEXT_PUBLIC_FIREBASE_DATABASE_URL dans .env
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, "firebase-service-account.json"), "utf-8"),
);

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://easypiano-1c50c-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = getDatabase();

const DEMO_PROS = [
  {
    bio: "[DEMO] Accordeur diplômé du Conservatoire de Varsovie. 15 ans d'expérience en Suisse romande.",
    email: "demo-jan@easypiano.ch",
    phone: "+41791001001",
    country: "PL",
    languages: ["fr", "pl", "en"],
    status: "validated",
    city: "Genève",
    postalCode: "1201",
    firstName: "Jan",
    lastName: "Kowalski",
  },
  {
    bio: "[DEMO] Technicien piano certifié Steinway. Spécialiste pianos à queue et droits.",
    email: "demo-maria@easypiano.ch",
    phone: "+41791001002",
    country: "HR",
    languages: ["fr", "hr", "de"],
    status: "validated",
    city: "Lausanne",
    postalCode: "1003",
    firstName: "Maria",
    lastName: "Horvat",
  },
  {
    bio: "[DEMO] 20 ans d'expérience. Formé à l'Académie de musique de Zagreb.",
    email: "demo-ivan@easypiano.ch",
    phone: "+41791001003",
    country: "HR",
    languages: ["fr", "hr", "it"],
    status: "validated",
    city: "Nyon",
    postalCode: "1260",
    firstName: "Ivan",
    lastName: "Petrović",
  },
  {
    bio: "[DEMO] Accordeuse passionnée, spécialisée dans les pianos anciens et la restauration.",
    email: "demo-olena@easypiano.ch",
    phone: "+41791001004",
    country: "UA",
    languages: ["fr", "uk", "en"],
    status: "validated",
    city: "Morges",
    postalCode: "1110",
    firstName: "Olena",
    lastName: "Shevchenko",
  },
  {
    bio: "[DEMO] Maître accordeur, ancien technicien du Victoria Hall à Genève.",
    email: "demo-piotr@easypiano.ch",
    phone: "+41791001005",
    country: "PL",
    languages: ["fr", "pl", "de", "en"],
    status: "validated",
    city: "Genève",
    postalCode: "1205",
    firstName: "Piotr",
    lastName: "Nowak",
  },
  {
    bio: "[DEMO] Jeune accordeur dynamique. Formation en Pologne et stage chez Bösendorfer.",
    email: "demo-tomasz@easypiano.ch",
    phone: "+41791001006",
    country: "PL",
    languages: ["fr", "pl"],
    status: "validated",
    city: "Vevey",
    postalCode: "1800",
    firstName: "Tomasz",
    lastName: "Wiśniewski",
  },
  {
    bio: "[DEMO] Accordeuse et réparatrice. Diplômée de l'École de facture instrumentale de Lviv.",
    email: "demo-anna@easypiano.ch",
    phone: "+41791001007",
    country: "UA",
    languages: ["fr", "uk", "pl"],
    status: "validated",
    city: "Lausanne",
    postalCode: "1005",
    firstName: "Anna",
    lastName: "Kovalenko",
  },
  {
    bio: "[DEMO] Expert en accordage concert. Intervient pour l'Orchestre de la Suisse Romande.",
    email: "demo-luka@easypiano.ch",
    phone: "+41791001008",
    country: "HR",
    languages: ["fr", "hr", "en", "de"],
    status: "validated",
    city: "Genève",
    postalCode: "1202",
    firstName: "Luka",
    lastName: "Jurić",
  },
  {
    bio: "[DEMO] Accordeur itinérant couvrant tout l'arc lémanique. Pianos droits et numériques.",
    email: "demo-marek@easypiano.ch",
    phone: "+41791001009",
    country: "PL",
    languages: ["fr", "pl", "en"],
    status: "validated",
    city: "Montreux",
    postalCode: "1820",
    firstName: "Marek",
    lastName: "Zieliński",
  },
  {
    bio: "[DEMO] Technicienne piano avec 10 ans d'expérience. Spécialiste Yamaha et Kawai.",
    email: "demo-sofia@easypiano.ch",
    phone: "+41791001010",
    country: "UA",
    languages: ["fr", "uk", "en", "de"],
    status: "validated",
    city: "Pully",
    postalCode: "1009",
    firstName: "Sofia",
    lastName: "Bondarenko",
  },
];

async function seed() {
  const now = new Date().toISOString();
  let count = 0;

  for (const pro of DEMO_PROS) {
    const proRef = db.ref("pros").push();
    await proRef.set({
      userId: `demo-${pro.firstName.toLowerCase()}`,
      bio: pro.bio,
      email: pro.email,
      phone: pro.phone,
      country: pro.country,
      languages: pro.languages,
      firstName: pro.firstName,
      lastName: pro.lastName,
      city: pro.city,
      postalCode: pro.postalCode,
      photoURL: null,
      certificates: [],
      videoURL: null,
      status: pro.status,
      validatedAt: now,
      validatedBy: "seed-script",
      refusalReason: null,
      stripeAccountId: null,
      stripeOnboardingComplete: false,
      stats: {
        totalBookings: Math.floor(Math.random() * 50) + 5,
        averageRating: +(3.5 + Math.random() * 1.5).toFixed(1),
        totalReviews: Math.floor(Math.random() * 30) + 2,
      },
      createdAt: now,
    });

    // Ajouter l'index pour les pros validés
    await db.ref(`indexes/pros_by_status/validated/${proRef.key}`).set(true);

    count++;
    console.log(`✓ ${pro.firstName} ${pro.lastName} (${pro.city}) — ${proRef.key}`);
  }

  console.log(`\n${count} profils de démo créés.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Erreur:", err);
  process.exit(1);
});
