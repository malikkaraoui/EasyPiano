---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ['prd.md', 'product-brief-EasyPiano-2026-03-03.md', 'ux-design-specification.md', 'market-piano-tuning-marketplace-research-2026-03-04.md', 'brainstorming-session-2026-03-03-1300.md', 'architecture-web-app.md']
workflowType: 'architecture'
lastStep: 8
status: 'complete'
project_name: 'EasyPiano'
user_name: 'Malik'
date: '2026-03-20'
completedAt: '2026-03-30'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

56 FRs identifiées, organisées en 13 domaines :

1. **Découverte & Recherche** (FR1-FR5) — Landing page SEO, recherche lieu+date, profils pro comparables, profil détaillé, lien inscription pro
2. **Gestion Utilisateurs** (FR6-FR9c) — Auth Google (MVP) puis email+SMS (V1), profils client (toggle B2B), inscription pro avec statut validation, 2FA pro obligatoire, sessions expirantes
3. **Réservation & Paiement** (FR10-FR14) — Booking instantané (in-radius) / validation pro (hors-rayon), récapitulatif, Stripe Checkout 150 CHF, confirmation email, Stripe Connect paiement pro (125 CHF net)
4. **Gestion RDV Client** (FR15-FR19) — Liste RDV, annulation manuelle (V0.1) puis automatisée avec motifs (V1), politique paliers (>48h/24-48h/<24h), historique
5. **Gestion RDV Pro** (FR20-FR23b) — Publication disponibilités (dates+zone+rayon+capacité), emploi du temps avec protection adresses (révélation 24h avant), gestion créneaux, lien Stripe dashboard
6. **Validation & Confiance** (FR24-FR30) — Workflow validation admin, badge "Validé", système avis (V1 : note 1-5 + commentaire, réponse pro, note moyenne auto, avis unilatéral)
7. **Communication** (FR31-FR35) — Messagerie externe (V0.1) puis intégrée temps réel (V1), notifications email automatiques (confirmation, rappel J-2/H-2, invitation avis)
8. **Administration** (FR36-FR41) — Dashboard Stripe, gestion incidents, analytics annulations, monitoring avis, alertes avis négatifs, notifications masse
9. **Growth** (FR42-FR45) — SMS auth, i18n (FR+EN+DE ready), recherche par nom, supplément piano mauvais état
10. **Vision** (FR46-FR50) — Rappel annuel 11 mois, re-booking 1 clic, remplacement auto, analytics avancés, pricing dynamique
11. **Affiliation** (FR51-FR52) — Programme profs piano avec commission Stripe
12. **Carnet entretien** (FR53b) — Rapport post-intervention pro visible client
13. **Sécurité** (FR53-FR56) — Adresses jamais stockées en clair, fenêtre temporelle 24h, 2FA pro, sessions expirantes

**Non-Functional Requirements:**

~30 NFRs réparties en 7 catégories :

- **Architecture (NFR-ARCH1-3)** : API REST uniquement (pas de Firebase SDK client sauf auth), services abstraits pour migration, migration Firebase→PostgreSQL < 2h downtime
- **Performance (NFR-P1-5)** : < 3s chargement 3G, < 2s actions utilisateur, Lighthouse > 80, FCP < 1.5s, 100 utilisateurs concurrents
- **Sécurité (NFR-S1-8)** : HTTPS/TLS 1.3+, adresses chiffrées, sessions pro 30min, 2FA pro, PCI-DSS via Stripe, RGPD, tokens Firebase renouvelés/h, logs anonymisés 30j
- **Scalabilité (NFR-SC1-4)** : 10x croissance (50→500 users), index optimisés, 1K→10K réservations/mois, CDN images
- **Accessibilité (NFR-A1-6)** : WCAG 2.1 AA, navigation clavier, contraste 4.5:1, ARIA, 16px min, 44x44px boutons
- **Intégration (NFR-I1-7)** : Stripe Checkout < 5s, webhooks < 30s, emails < 2min, Firebase Auth < 3s, fallback paiement manuel, weekly payouts, instant payout V1+
- **Fiabilité (NFR-R1-5)** : 99.5% uptime, 0 échec paiement, alertes > 10 erreurs/h, backup quotidien, rollback < 15min

**Scale & Complexity:**

- Primary domain: Full-stack web (Next.js SSR + Firebase BaaS + Stripe Connect)
- Complexity level: Medium-high (marketplace 2 faces + paiement split + sécurité données + temps réel)
- Estimated architectural components: ~15 (auth, search, booking, payment, dashboards x3, reviews, messaging, notifications, admin, file storage, monitoring, i18n)

### Technical Constraints & Dependencies

- **Firebase RTDB** comme stockage MVP — modèle dénormalisé (pas de joins), index manuels, limites sur requêtes complexes
- **Stripe Connect Express** — onboarding simplifié pros EU, split payment automatique, webhooks pour synchronisation état
- **Next.js 15 App Router** — dualité SSR (pages publiques SEO) / CSR (dashboards privés), API Routes comme backend
- **Google Auth** comme auth primaire MVP — extension email+SMS en V1
- **Migration planifiée** — Firebase → Python/FastAPI + PostgreSQL sans refonte frontend (NFR-ARCH2/3)
- **CI/CD existant** — GitHub Actions → Firebase Hosting (main/dev branches)
- **Design system** — shadcn/ui + Tailwind CSS + Framer Motion (déjà spécifié dans UX spec)

### Cross-Cutting Concerns Identified

1. **Authentification multi-rôle** — 3 types (client, pro, admin) avec permissions et flows distincts, 2FA pro, sessions expirantes
2. **Protection des données sensibles** — Adresses clients chiffrées, révélation temporelle 24h, RGPD (droit oubli, export, consentement)
3. **Notifications** — Email transactionnel (confirmation, rappels, avis) + temps réel (messagerie V1) — cross tous les modules
4. **Monitoring & alertes** — Sentry error tracking, alertes Slack/email, logs structurés JSON, anonymisation 30j
5. **Internationalisation** — Architecture i18n prête dès V0.1 pour FR+EN+DE (V1)
6. **Abstraction services** — Couche d'abstraction obligatoire (database.js, auth.js) pour permettre migration backend sans impact frontend

## Starter Template Evaluation

### Situation : Projet Brownfield (v0.2.2)

EasyPiano est un projet existant avec stack technologique déjà implémenté. Pas de starter template nécessaire — les fondations sont en place.

### Stack Technique Actuel

| Aspect | Choix | Version | Status |
| ------ | ----- | ------- | ------ |
| Language & Runtime | JavaScript ES modules | ES2022+ | Implémenté |
| Frontend Framework | Next.js (App Router) + React | 16.1.6 / 19.2.0 | Implémenté |
| Database | Firebase Realtime Database | 12.10.0 | Implémenté |
| Auth | Firebase Auth (Google MVP) | 12.10.0 | Implémenté |
| Payment | Stripe Connect + Stripe.js | 8.9.0 | Implémenté |
| Styling | CSS custom vanilla (design system 38KB) | — | Implémenté |
| Testing | Vitest + React Testing Library + jsdom | 4.0.18 / 16.3.2 | Implémenté |
| Linting | ESLint 9 + Prettier | 9.39.3 / 3.8.1 | Implémenté |
| Git Hooks | Husky + lint-staged + pre-push | 9.1.7 / 16.3.1 | Implémenté |
| CI/CD | GitHub Actions → Firebase Hosting | — | Implémenté |
| Error Tracking | Sentry (prévu) | — | Non implémenté |

### Structure Projet Existante

```text
app/                  ← Next.js App Router (pages/routes)
├── admin/            ← Dashboard admin (validation pros, analytics)
├── booking/          ← Flow réservation + paiement
├── dashboard/        ← Dashboard client
├── login/            ← Authentification
├── pro/              ← Profil accordeur
├── review/           ← Système d'avis
├── search/           ← Recherche lieu + date
├── layout.jsx        ← Layout racine
└── page.jsx          ← Landing page

src/
├── components/       ← Composants réutilisables (UI, Layout, Auth)
├── context/          ← React Context (AuthProvider)
├── hooks/            ← Custom hooks
├── services/         ← Abstraction services (database.js, auth, stripe)
├── shared/           ← Utilitaires partagés
├── views/            ← Composants pages complexes
├── utils/            ← Fonctions utilitaires
├── test/             ← Tests
├── assets/           ← Ressources statiques
└── index.css         ← Design system CSS (38KB)
```

### Delta UX Spec vs. Codebase Actuel

L'UX specification recommande **shadcn/ui + Tailwind CSS + Framer Motion** pour le design system. Le codebase actuel utilise du **CSS custom vanilla**. Cette divergence est adressée ci-dessous dans les décisions architecturales.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Bloquent l'implémentation) :**

- Schéma de données Firebase RTDB
- Stratégie d'authentification & rôles
- Chiffrement des adresses clients
- Architecture API (Next.js API Routes)
- Migration design system (CSS custom → Tailwind + shadcn/ui)

**Important Decisions (Façonnent l'architecture) :**

- Stratégie rendering SSR/CSR par page
- Service d'emails transactionnels
- Monitoring & error tracking
- Format standardisé des réponses API

**Deferred Decisions (Post-MVP) :**

- Migration PostgreSQL + FastAPI
- Rate limiting
- Service de logs dédié
- Pricing dynamique
- PWA / notifications push

### Data Architecture

#### Schéma Firebase Realtime Database

Modèle dénormalisé (JSON, pas de joins). Prix stockés en **centimes** (15000 = 150.00 CHF) pour éviter les erreurs de float.

```json
{
  "users": {
    "{userId}": {
      "email": "string",
      "displayName": "string",
      "photoURL": "string",
      "phone": "string",
      "role": "client | pro | admin",
      "isB2B": "boolean (false par défaut)",
      "createdAt": "ISO 8601",
      "lastLogin": "ISO 8601"
    }
  },
  "pros": {
    "{proId}": {
      "userId": "string (ref users)",
      "bio": "string",
      "photoURL": "string (Firebase Storage URL)",
      "country": "string (code ISO)",
      "languages": ["fr", "en", "pl"],
      "certificates": [
        {"name": "string", "fileURL": "string", "verified": "boolean"}
      ],
      "status": "pending | validated | refused",
      "validatedAt": "ISO 8601 | null",
      "validatedBy": "string (adminId) | null",
      "refusalReason": "string | null",
      "stripeAccountId": "string | null",
      "stripeOnboardingComplete": "boolean",
      "stats": {
        "totalBookings": "number",
        "averageRating": "number (1-5, 1 decimal)",
        "totalReviews": "number"
      }
    }
  },
  "availabilities": {
    "{proId}": {
      "{availabilityId}": {
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD",
        "zone": "string (nom ville/région)",
        "zoneCoords": {"lat": "number", "lng": "number"},
        "radiusKm": "number (défaut: 50)",
        "capacityMorning": "number (défaut: 1)",
        "capacityAfternoon": "number (défaut: 2)"
      }
    }
  },
  "bookings": {
    "{bookingId}": {
      "clientId": "string (ref users)",
      "proId": "string (ref pros)",
      "date": "YYYY-MM-DD",
      "slot": "morning | afternoon",
      "status": "confirmed | completed | cancelled | refunded",
      "addressEncrypted": "string (AES-256-GCM)",
      "addressCity": "string (en clair pour affichage pro)",
      "addressRevealedAt": "ISO 8601 | null",
      "price": "number (centimes, ex: 15000 = 150 CHF)",
      "commission": "number (centimes, ex: 2500 = 25 CHF)",
      "proNet": "number (centimes, ex: 12500 = 125 CHF)",
      "stripePaymentIntentId": "string",
      "cancellation": {
        "reason": "string | null",
        "refundPercent": "number (0, 50, 100)",
        "cancelledAt": "ISO 8601 | null"
      },
      "createdAt": "ISO 8601"
    }
  },
  "reviews": {
    "{bookingId}": {
      "clientId": "string (ref users)",
      "proId": "string (ref pros)",
      "rating": "number (1-5)",
      "comment": "string",
      "proResponse": "string | null",
      "createdAt": "ISO 8601"
    }
  },
  "indexes": {
    "bookings_by_client": {"{clientId}": {"{bookingId}": true}},
    "bookings_by_pro": {"{proId}": {"{bookingId}": true}},
    "pros_by_status": {"validated": {"{proId}": true}}
  }
}
```

**Rationale :**

- Reviews indexées par `bookingId` : 1 review max par booking (FR30 — seuls les clients ayant réservé peuvent noter)
- Index inversés séparés (`indexes/`) pour les requêtes fréquentes sans scanner toute la collection
- `addressEncrypted` : chiffrement AES-256-GCM côté serveur, seulement `addressCity` en clair pour l'affichage pro pré-24h
- Stats pro dénormalisées dans le noeud `pros` pour affichage profil sans calcul temps réel

#### Stratégie de migration (V1+)

Migration vers PostgreSQL planifiée. L'abstraction `src/services/database.js` garantit que le frontend ne connaît pas la couche de persistance. La migration consiste à réécrire `database.js` pour pointer vers des API REST (FastAPI/Django) au lieu de Firebase SDK.

### Authentication & Security

| Décision | Choix | Rationale |
| --- | --- | --- |
| Auth provider | Firebase Auth (Google MVP, email+SMS V1) | Déjà implémenté, intégration native RTDB, tokens vérifiables côté serveur |
| Gestion des rôles | Custom claims Firebase (`role: client / pro / admin`) | Vérifiable dans les API Routes via `auth().verifyIdToken()`, propagé automatiquement |
| 2FA pro | Firebase Auth multi-factor (SMS) | FR9b — obligatoire dès le 1er client confirmé, natif Firebase |
| Sessions pro timeout | Middleware Next.js vérifie `lastActivity` — 30min inactivité | NFR-S3 — le middleware reject les requêtes avec token périmé |
| Chiffrement adresses | AES-256-GCM côté serveur (API Route) | NFR-S2 — clé de chiffrement en variable d'environnement, déchiffrement uniquement via API Route dédiée dans la fenêtre 24h avant RDV |
| RGPD | Endpoints API dédiés : `GET /api/user/export`, `DELETE /api/user/delete`, consentement stocké dans `users/{id}/consents` | NFR-S6 — droit à l'oubli, export données personnelles, consentement marketing explicite |
| Tokens Firebase | Renouvellement automatique toutes les heures (natif Firebase) | NFR-S7 |
| Anonymisation logs | Cron job quotidien — anonymiser les données sensibles dans les logs > 30 jours | NFR-S8 |

### API & Communication Patterns

| Décision | Choix | Rationale |
| --- | --- | --- |
| Architecture API | Next.js API Routes (`app/api/`) | NFR-ARCH1 — pas de serveur séparé MVP, toute la logique métier dans les API Routes |
| Format réponse standard | `{ success: boolean, data: object \| null, error: string \| null }` | Cohérence totale, le frontend sait toujours quoi attendre |
| Validation | Côté serveur uniquement (dans les API Routes) | Source de vérité unique — pas de Zod/Yup côté client en MVP |
| Webhooks Stripe | `app/api/webhooks/stripe/route.js` | NFR-I2 — traitement < 30s, events : `payment_intent.succeeded`, `account.updated`, `charge.refunded` |
| Emails transactionnels | Firebase Extensions (Trigger Email) ou Resend | NFR-I3 — < 2min après événement déclencheur, templates : confirmation, rappel J-2/H-2, invitation avis |
| Rate limiting | Non implémenté en MVP | Ajouté en V1 via middleware Next.js (token bucket) quand le trafic le justifie |

**Endpoints API prévus :**

```text
POST   /api/auth/verify          ← Vérifie token Firebase, retourne user + role
POST   /api/search               ← Recherche pros par lieu + date
GET    /api/pros/[proId]         ← Profil public pro
POST   /api/booking/create       ← Créer réservation + Stripe PaymentIntent
POST   /api/booking/cancel       ← Annuler avec motif + remboursement Stripe
GET    /api/bookings/client      ← Réservations du client connecté
GET    /api/bookings/pro         ← Réservations du pro connecté
POST   /api/availabilities       ← Publier/modifier disponibilités pro
POST   /api/reviews/create       ← Laisser un avis (1 par booking)
POST   /api/reviews/respond      ← Réponse pro à un avis
GET    /api/admin/pros           ← Liste pros (pending/validated/refused)
POST   /api/admin/validate-pro   ← Valider/refuser un pro
GET    /api/admin/analytics      ← Stats agrégées (motifs annulation, etc.)
POST   /api/webhooks/stripe      ← Webhooks Stripe
GET    /api/user/export          ← Export données RGPD
DELETE /api/user/delete          ← Suppression compte RGPD
```

### Frontend Architecture

| Décision | Choix | Rationale |
| --- | --- | --- |
| Design system | **Migration vers Tailwind CSS + shadcn/ui + Framer Motion** | UX spec le requiert, accessibilité native (Radix), productivité solo dev, thème sombre natif |
| Rendering strategy | **SSR** : landing (`/`), search (`/search`), profil pro (`/pro/[id]`) — **CSR** : dashboards (`/dashboard`, `/admin`), booking, login | SEO pour pages publiques (acquisition organique), CSR pour pages privées (performance, pas de SEO nécessaire) |
| State management | React Context pour auth uniquement, props pour le reste | Pas de Redux/Zustand — trop peu de state global au MVP |
| Formulaires | Composants contrôlés React natifs | Pas de React Hook Form MVP — formulaires simples (2 champs search, booking select) |
| Images | Next.js `<Image>` component + Firebase Storage URLs | Optimisation automatique (WebP, lazy loading, responsive), CDN via hosting |
| Animations | Framer Motion (scroll reveal, fade-in, checkmark confirmation) | UX spec : Apple-level animations, parallax hero, micro-interactions |
| Accessibilité | Radix UI primitives (via shadcn/ui) + Tailwind classes | WCAG 2.1 AA natif : focus management, ARIA, navigation clavier, contrastes |

**Migration CSS custom → Tailwind + shadcn/ui :**

La migration se fait composant par composant. Le CSS custom existant (38KB `index.css`) est remplacé progressivement :

1. Installer Tailwind CSS + configurer `tailwind.config.js` avec les tokens EasyPiano (couleurs sombres, champagne, typography)
2. Installer shadcn/ui (composants copiés dans `src/components/ui/`)
3. Migrer les composants un par un en remplaçant les classes CSS custom par les classes Tailwind + composants shadcn
4. Supprimer `index.css` une fois la migration complète

### Infrastructure & Deployment

| Décision | Choix | Rationale |
| --- | --- | --- |
| Hosting | Firebase Hosting (déjà configuré) — évaluer Vercel si besoin SSR avancé | CI/CD GitHub Actions déjà en place, deployment automatique main/dev |
| Error tracking | Sentry (gratuit jusqu'à 5K erreurs/mois) | NFR-M1 — frontend + API Routes, source maps pour stack traces lisibles |
| Monitoring | Firebase Console (RTDB usage, auth metrics) + Sentry (erreurs) | NFR-M3 — alertes Slack/email si erreur critique ou taux > 5% |
| Logs | `console.error` structuré capturé par Sentry | NFR-M2 simplifié — service dédié ajouté en V1 |
| Backup | Firebase RTDB export automatique quotidien (Firebase CLI scheduled) | NFR-R4 |
| Env config | `.env.local` (dev) + variables d'environnement Firebase/Vercel (prod) | Standard Next.js, secrets jamais commités |
| Rollback | Rollback via GitHub Actions (redeploy commit précédent) < 15min | NFR-R5 |

### Decisions Deferred (Post-MVP) — Détail

#### 1. Migration PostgreSQL + FastAPI (V1+)

Firebase RTDB est parfait pour le MVP : setup rapide, gratuit au départ, temps réel natif. Mais il a des limites structurelles :

- Pas de requêtes SQL complexes (agrégations, joins, recherches géographiques avancées)
- Modèle de pricing Firebase qui explose avec le volume (lecture/écriture facturées)
- Pas de transactions ACID robustes pour les opérations financières critiques

**Quand migrer :** Quand on dépasse ~1 000 réservations/mois ou que les requêtes analytiques deviennent un goulot. Le PRD prévoit : PostgreSQL (Render 7€/mois) + FastAPI/Django en Python + Docker. Le frontend Next.js reste inchangé grâce à l'abstraction `database.js` (NFR-ARCH2/3). Objectif : < 2h de downtime pendant la migration.

#### 2. Rate limiting middleware

Au MVP avec 5-10 pros et quelques dizaines de clients, pas de risque. Quand le trafic augmente (Google Ads, SEO), il faut protéger les API Routes contre :

- Abus (scraping profils, spam réservations)
- Bots testant des cartes bancaires via Stripe Checkout

**Quand ajouter :** Dès qu'il y a du trafic organique significatif. Middleware Next.js simple (token bucket avec Redis ou en mémoire).

#### 3. Service de logs dédié

Au MVP, Sentry capture les erreurs et `console.error` suffit. En V1 avec messagerie temps réel, webhooks Stripe, notifications email — il faut tracer les événements de bout en bout :

- Debugging webhooks Stripe qui échouent silencieusement
- Audit trail RGPD (qui a accédé à quelle adresse, quand)
- Analytics opérationnelles (taux d'erreur par endpoint)

**Quand ajouter :** En V1, en même temps que la messagerie et les analytics admin. Options : Axiom, Logflare, ou self-hosted.

#### 4. Pricing dynamique par zone

Aujourd'hui : prix fixe 150 CHF partout. Mais Suisse ≠ France ≠ Allemagne en pouvoir d'achat. Le pricing dynamique ajuste selon :

- Zone géographique (Suisse vs France vs Allemagne)
- Offre/demande (peu de pros = prix légèrement plus élevé)

**Quand ajouter :** Phase 3, après validation product-market fit et expansion géographique. Nécessite des données terrain (plusieurs mois d'opération).

#### 5. PWA / notifications push

Aujourd'hui : web responsive mobile-first. Une PWA ajoute :

- Notifications push natives (rappel RDV, nouvelles réservations pros)
- Installation écran d'accueil (comme une app)
- Mode offline partiel (consultation dashboard)

**Quand ajouter :** Phase 3, quand la rétention est prouvée et les pros consultent activement en mobilité. Service Worker + manifest.json sur la base Next.js existante.

### Decision Impact Analysis

**Séquence d'implémentation recommandée :**

1. Migration design system (Tailwind + shadcn/ui) — fondation pour tout le reste
2. API Routes (`app/api/`) — couche backend
3. Auth + rôles (Firebase custom claims + middleware)
4. Schéma données Firebase RTDB
5. Intégration Stripe Connect (paiement + webhooks)
6. Chiffrement adresses (AES-256-GCM)
7. Sentry error tracking
8. Emails transactionnels

**Dépendances croisées :**

- Le chiffrement des adresses dépend des API Routes (déchiffrement côté serveur uniquement)
- Les webhooks Stripe dépendent du schéma de données (mise à jour status booking)
- Le système d'avis (V1) dépend du schéma `reviews` + API Routes
- La messagerie (V1) nécessitera Firebase RTDB listeners temps réel côté client

## Implementation Patterns & Consistency Rules

### Naming Patterns

#### Database (Firebase RTDB)

| Élément | Convention | Exemple |
| --- | --- | --- |
| Collections | camelCase, pluriel | `users`, `pros`, `bookings`, `reviews` |
| Champs | camelCase | `displayName`, `stripeAccountId`, `createdAt` |
| IDs | Firebase push keys ou UUID | `-NxYz123abc`, `booking_abc123` |
| Booléens | préfixe `is`/`has` | `isB2B`, `stripeOnboardingComplete` (exception si évident) |
| Timestamps | suffixe `At` | `createdAt`, `validatedAt`, `cancelledAt` |

#### API Routes

| Élément | Convention | Exemple |
| --- | --- | --- |
| Endpoints | `/api/` + kebab-case, pluriel pour collections | `/api/bookings/client`, `/api/admin/validate-pro` |
| Paramètres route | `[paramName]` camelCase | `/api/pros/[proId]` |
| Query params | camelCase | `?startDate=2026-03-15&zone=lausanne` |
| Méthodes HTTP | GET (lecture), POST (création/action), DELETE (suppression) | `POST /api/booking/create` |

#### Code JavaScript

| Élément | Convention | Exemple |
| --- | --- | --- |
| Fichiers composants | PascalCase.jsx | `StarRating.jsx`, `ProCard.jsx` |
| Fichiers utilitaires | camelCase.js | `database.js`, `validation.js` |
| Dossiers | kebab-case ou camelCase (existant) | `components/`, `services/` |
| Composants React | PascalCase | `function ProProfile()` |
| Fonctions | camelCase, verbe + nom | `getProById()`, `createBooking()` |
| Variables | camelCase | `proData`, `bookingId` |
| Constantes | UPPER_SNAKE_CASE | `MAX_RADIUS_KM`, `COMMISSION_RATE` |
| CSS classes (Tailwind) | utility classes, pas de custom classes sauf exception | `className="bg-background text-foreground"` |

### Structure Patterns

#### Tests

- Co-localisés avec le fichier testé : `StarRating.test.jsx` à côté de `StarRating.jsx`
- Tests utilitaires dans `src/test/`
- Naming : `{NomFichier}.test.js(x)`

#### Composants

- Organisés par type (pas par feature) : `components/ui/`, `components/Layout/`, `components/Auth/`
- 1 composant = 1 fichier (pas d'index barrel exports)
- Props destructurées en paramètre de fonction

#### Services

- 1 fichier par domaine : `database.js`, `auth.js`, `stripe.js`
- Fonctions exportées nommées (pas de default export)
- Chaque fonction retourne une Promise ou une valeur

#### Views

- Composants page complexes dans `src/views/`
- Naming : `{NomPage}.jsx` (ex: `ClientDashboard.jsx`)

### Format Patterns

#### Réponses API

```javascript
// Succès
{ success: true, data: { ... } }

// Erreur
{ success: false, error: "Message lisible en français" }

// Liste
{ success: true, data: { items: [...], total: 42 } }
```

#### Dates

- Stockage Firebase : ISO 8601 (`"2026-03-15T09:00:00Z"`)
- Affichage UI : format français (`"15 mars 2026 à 09:00"`)
- Champs date seuls (dispo, booking) : `"YYYY-MM-DD"`

#### Prix

- Stockage et API : centimes entiers (`15000` = 150.00 CHF)
- Affichage UI : formaté (`"150 CHF"` ou `"150.00 CHF"`)
- Jamais de float pour les montants

#### Status HTTP

- `200` : succès
- `201` : création réussie
- `400` : erreur validation (input invalide)
- `401` : non authentifié
- `403` : non autorisé (mauvais rôle)
- `404` : ressource non trouvée
- `500` : erreur serveur

### Process Patterns

#### Error Handling

```javascript
// API Route pattern
export async function POST(request) {
  try {
    // ... logique métier
    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error('[API] booking/create:', error);
    return Response.json(
      { success: false, error: "Erreur lors de la réservation" },
      { status: 500 }
    );
  }
}
```

- Log technique en anglais (`console.error`)
- Message utilisateur en français
- Préfixe log : `[API]`, `[Auth]`, `[Stripe]`, `[DB]`

#### Loading States

- Skeleton screens (pas de spinners génériques) — conforme UX spec
- Variable state locale : `const [loading, setLoading] = useState(false)`
- Nommage : `loading`, `submitting`, `searching` (pas `isLoading`)

#### Auth Guard Pattern

```javascript
// Middleware pour API Routes protégées
import { verifyAuth } from '@/services/auth';

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return Response.json({ success: false, error: "Non autorisé" }, { status: 401 });
  if (user.role !== 'pro') return Response.json({ success: false, error: "Accès refusé" }, { status: 403 });
  // ... suite
}
```

#### Import Pattern

- Imports Next.js / React en premier
- Puis libs externes (Firebase, Stripe)
- Puis imports internes (`@/services/`, `@/components/`)
- Alias `@/` pour `src/`

### Anti-Patterns (INTERDIT)

| Anti-Pattern | Pourquoi | Alternative |
| --- | --- | --- |
| `any` ou types lâches | Bugs silencieux | JSDoc pour documenter les shapes attendues |
| `console.log` en production | Bruit, pas structuré | `console.error` avec préfixe pour les erreurs uniquement |
| Firebase SDK direct côté client (sauf auth) | NFR-ARCH1, migration impossible | Passer par les API Routes |
| Default exports pour les services | Rend les imports ambigus | Named exports uniquement |
| Floats pour les prix | Erreurs d'arrondi | Centimes entiers |
| Inline styles | Incohérent, non maintenable | Tailwind classes |
| `fetch` sans error handling | Erreurs silencieuses | try/catch + format réponse standard |

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
easypiano/
├── .env.local                          ← Variables dev (Firebase, Stripe keys)
├── .env.example                        ← Template des variables requises
├── .github/
│   └── workflows/
│       └── firebase-hosting.yml        ← CI/CD (lint + test + build + deploy)
├── .husky/
│   ├── pre-commit                      ← lint-staged
│   └── pre-push                        ← lint + test + build
├── next.config.js
├── tailwind.config.js                  ← Tokens EasyPiano (couleurs, fonts)
├── package.json
├── vitest.config.js
├── firebase.json                       ← Config Firebase Hosting
├── .firebaserc                         ← Projet Firebase
│
├── public/
│   ├── favicon.ico
│   └── images/                         ← Assets statiques (hero piano, etc.)
│
├── app/                                ← Next.js App Router
│   ├── layout.jsx                      ← Layout racine (fonts, metadata, providers)
│   ├── globals.css                     ← Tailwind base + tokens CSS custom
│   ├── page.jsx                        ← Landing page (SSR)
│   │
│   ├── search/
│   │   └── page.jsx                    ← Recherche lieu+date (SSR)
│   ├── pro/
│   │   └── [proId]/
│   │       └── page.jsx                ← Profil public accordeur (SSR)
│   │
│   ├── login/
│   │   └── page.jsx                    ← Auth Google (CSR)
│   ├── booking/
│   │   └── [proId]/
│   │       └── page.jsx                ← Flow réservation + Stripe (CSR)
│   ├── confirmation/
│   │   └── page.jsx                    ← Page confirmation post-paiement (CSR)
│   │
│   ├── dashboard/
│   │   ├── page.jsx                    ← Dashboard client (CSR, ProtectedRoute)
│   │   └── bookings/
│   │       └── page.jsx                ← Historique réservations client
│   ├── pro-dashboard/
│   │   ├── page.jsx                    ← Dashboard pro (CSR, ProtectedRoute role=pro)
│   │   ├── availabilities/
│   │   │   └── page.jsx                ← Gestion disponibilités
│   │   └── bookings/
│   │       └── page.jsx                ← Réservations pro
│   ├── admin/
│   │   ├── page.jsx                    ← Dashboard admin (CSR, AdminRoute)
│   │   ├── pros/
│   │   │   └── page.jsx                ← Gestion pros (validation/refus)
│   │   ├── bookings/
│   │   │   └── page.jsx                ← Gestion réservations
│   │   ├── reviews/
│   │   │   └── page.jsx                ← Monitoring avis
│   │   └── analytics/
│   │       └── page.jsx                ← Analytics (motifs annulation, stats)
│   │
│   ├── review/
│   │   └── [bookingId]/
│   │       └── page.jsx                ← Laisser un avis (CSR, V1)
│   │
│   └── api/                            ← API Routes (backend)
│       ├── auth/
│       │   └── verify/route.js         ← Vérification token Firebase
│       ├── search/
│       │   └── route.js                ← Recherche pros par lieu+date
│       ├── pros/
│       │   └── [proId]/route.js        ← Profil public pro
│       ├── booking/
│       │   ├── create/route.js         ← Créer réservation + PaymentIntent
│       │   └── cancel/route.js         ← Annuler + remboursement Stripe
│       ├── bookings/
│       │   ├── client/route.js         ← Réservations du client
│       │   └── pro/route.js            ← Réservations du pro
│       ├── availabilities/
│       │   └── route.js                ← CRUD disponibilités pro
│       ├── reviews/
│       │   ├── create/route.js         ← Laisser un avis
│       │   └── respond/route.js        ← Réponse pro
│       ├── admin/
│       │   ├── pros/route.js           ← Liste pros (pending/validated)
│       │   ├── validate-pro/route.js   ← Valider/refuser pro
│       │   └── analytics/route.js      ← Stats agrégées
│       ├── user/
│       │   ├── export/route.js         ← Export données RGPD
│       │   └── delete/route.js         ← Suppression compte RGPD
│       └── webhooks/
│           └── stripe/route.js         ← Webhooks Stripe
│
├── src/
│   ├── components/
│   │   ├── ui/                         ← shadcn/ui (Button, Card, Input, etc.)
│   │   ├── animations/                 ← Framer Motion wrappers
│   │   │   ├── ScrollReveal.jsx
│   │   │   ├── FadeIn.jsx
│   │   │   └── SlideUp.jsx
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── Auth/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── StarRating.jsx
│   │   ├── StarRating.test.jsx
│   │   ├── ProCard.jsx
│   │   ├── CityPostalAutocomplete.jsx
│   │   ├── BookingSummary.jsx
│   │   └── ConfigBanner.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx             ← AuthProvider + useAuth hook
│   │
│   ├── hooks/
│   │   └── useBookings.js
│   │
│   ├── services/                       ← Abstraction services (frontière migration)
│   │   ├── database.js                 ← Firebase RTDB (CRUD)
│   │   ├── auth.js                     ← Firebase Auth + vérification tokens
│   │   ├── stripe.js                   ← Stripe client-side
│   │   ├── stripe-server.js            ← Stripe server-side (API Routes)
│   │   ├── encryption.js               ← AES-256-GCM (adresses)
│   │   └── email.js                    ← Emails transactionnels
│   │
│   ├── lib/
│   │   └── utils.js                    ← cn() helper (clsx + tailwind-merge)
│   │
│   ├── utils/
│   │   ├── validation.js
│   │   ├── validation.test.js
│   │   ├── formatters.js               ← Format dates, prix (centimes → CHF)
│   │   └── constants.js                ← COMMISSION_RATE, MAX_RADIUS_KM, etc.
│   │
│   ├── views/
│   │   ├── ClientDashboard.jsx
│   │   ├── ProDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── SearchResults.jsx
│   │   ├── ProProfile.jsx
│   │   ├── BookingFlow.jsx
│   │   └── LeaveReview.jsx
│   │
│   ├── shared/
│   ├── assets/
│   └── test/
│       └── utils.test.js
│
└── _bmad-output/                       ← Artefacts planning (non déployé)
```

### Architectural Boundaries

#### Frontière API (NFR-ARCH1)

- Le frontend (`app/` pages) communique avec le backend **uniquement via `/api/` routes**
- Exception unique : Firebase Auth SDK côté client pour login Google
- Les `src/services/database.js` ne sont utilisés que dans les API Routes, jamais dans les composants

#### Frontière Composants

- `app/` pages = assemblage (import views + layout)
- `src/views/` = logique page complexe (state, fetch, UI)
- `src/components/` = composants réutilisables (pas de fetch, props uniquement)
- `src/components/ui/` = primitives shadcn/ui (aucune logique métier)

#### Frontière Data

- Firebase RTDB accessible uniquement via `src/services/database.js`
- Stripe accessible via `src/services/stripe.js` (client) et `src/services/stripe-server.js` (API Routes)
- Adresses clients : chiffrées via `src/services/encryption.js`, déchiffrement uniquement dans les API Routes

### Requirements to Structure Mapping

| Domaine FR | Pages (app/) | Views (src/views/) | API Routes (app/api/) | Services |
| --- | --- | --- | --- | --- |
| FR1-5 Découverte | `/`, `/search`, `/pro/[proId]` | SearchResults, ProProfile | `/api/search`, `/api/pros/[proId]` | database.js |
| FR6-9 Auth | `/login` | — | `/api/auth/verify` | auth.js |
| FR10-14 Booking | `/booking/[proId]`, `/confirmation` | BookingFlow | `/api/booking/create` | stripe.js, stripe-server.js |
| FR15-19 RDV Client | `/dashboard` | ClientDashboard | `/api/bookings/client`, `/api/booking/cancel` | database.js |
| FR20-23 RDV Pro | `/pro-dashboard` | ProDashboard | `/api/bookings/pro`, `/api/availabilities` | database.js |
| FR24-30 Validation & Avis | `/admin/pros`, `/review/[bookingId]` | AdminDashboard, LeaveReview | `/api/admin/validate-pro`, `/api/reviews/*` | database.js |
| FR36-41 Admin | `/admin/*` | AdminDashboard | `/api/admin/*` | database.js |
| FR53-56 Sécurité | — | — | `/api/user/export`, `/api/user/delete` | encryption.js, auth.js |

### External Integration Points

| Service externe | Point d'intégration | Fichier |
| --- | --- | --- |
| Firebase Auth | Login Google, vérification tokens | `src/services/auth.js` |
| Firebase RTDB | CRUD données | `src/services/database.js` |
| Firebase Storage | Upload photos/certificats pros | `src/services/database.js` |
| Stripe Checkout | Paiement client 150 CHF | `src/services/stripe.js` |
| Stripe Connect | Onboarding pro, payouts | `src/services/stripe-server.js` |
| Stripe Webhooks | Events paiement/remboursement | `app/api/webhooks/stripe/route.js` |
| Sentry | Error tracking frontend + backend | Initialisé dans `app/layout.jsx` |
| Service Email | Transactional emails | `src/services/email.js` |

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility :** Toutes les technologies sont compatibles (Next.js 16 + React 19 + Firebase 12 + Stripe.js 8 + Tailwind + shadcn/ui + Framer Motion + Vitest).

**Pattern Consistency :** Naming camelCase uniforme (DB, API, code). Format réponse API standardisé. Frontière API respectée (NFR-ARCH1). Prix en centimes partout.

**Structure Alignment :** SSR/CSR bien séparés. API Routes dans `app/api/` avec services dans `src/services/`. Composants purs vs Views avec logique.

### Requirements Coverage ✅

#### Couverture Fonctionnelle

| Domaine | FRs | Couvert | Notes |
| --- | --- | --- | --- |
| Découverte & Recherche | FR1-5 | ✅ | SSR pages + API search |
| Auth | FR6-9c | ✅ | Firebase Auth + custom claims + 2FA + session timeout |
| Booking & Paiement | FR10-14 | ✅ | API Route + Stripe Connect |
| Gestion RDV Client | FR15-19 | ✅ | Dashboard + annulation + paliers |
| Gestion RDV Pro | FR20-23b | ✅ | Dashboard pro + protection adresses |
| Validation & Confiance | FR24-30 | ✅ | Admin workflow + reviews (V1) |
| Communication | FR31-35 | ✅ | Email service + messagerie RTDB (V1) |
| Administration | FR36-41 | ✅ | Admin pages + API Routes |
| Growth | FR42-45 | ✅ | Architecture i18n ready, SMS auth (V1) |
| Vision | FR46-50 | ⏳ | Deferred — architecture supportera via API Routes |
| Affiliation | FR51-52 | ⏳ | Deferred — extension Stripe Connect |
| Carnet entretien | FR53b | ✅ | Schéma extensible |
| Sécurité | FR53-56 | ✅ | AES-256-GCM + fenêtre 24h + 2FA + session expiry |

#### Couverture Non-Fonctionnelle

| Catégorie | NFRs | Couvert | Comment |
| --- | --- | --- | --- |
| Architecture | ARCH1-3 | ✅ | API REST only + services abstraits + migration planifiée |
| Performance | P1-5 | ✅ | SSR + Next.js Image + Tailwind (petit bundle) |
| Sécurité | S1-8 | ✅ | HTTPS, chiffrement, 2FA, sessions, RGPD, tokens, logs |
| Scalabilité | SC1-4 | ✅ | Index Firebase + CDN images + migration path |
| Accessibilité | A1-6 | ✅ | Radix/shadcn + Tailwind contraste + 44px boutons |
| Intégration | I1-7 | ✅ | Stripe < 5s + webhooks + emails + payouts |
| Fiabilité | R1-5 | ✅ | Firebase hosting 99.5% + Sentry + backup + rollback |
| Monitoring | M1-3 | ✅ | Sentry + Firebase Console + alertes |

### Gap Analysis

#### Gaps critiques : aucun ✅

#### Gaps importants

1. **Service email non tranché** — Firebase Extensions (Trigger Email) vs Resend vs autre. À décider au moment de l'implémentation.
2. **Hosting Firebase vs Vercel** — Firebase Hosting ne supporte pas nativement le SSR Next.js avancé (ISR, streaming). Si SSR pose problème, migration vers Vercel.

#### Gaps mineurs

1. **Tests e2e non définis** — Framework (Playwright?) et stratégie à ajouter en V1.
2. **Schéma `messages` non défini** — Messagerie intégrée (V1) nécessitera un noeud Firebase supplémentaire.

### Architecture Completeness Checklist

- [x] Contexte projet analysé (56 FRs, ~30 NFRs)
- [x] Complexité et échelle évalués (medium-high, marketplace 2 faces)
- [x] Stack technique documenté (brownfield v0.2.2)
- [x] Schéma de données Firebase RTDB complet
- [x] Stratégie auth et sécurité définie
- [x] Architecture API définie (18 endpoints)
- [x] Architecture frontend définie (SSR/CSR + Tailwind + shadcn/ui)
- [x] Infrastructure et déploiement définis
- [x] Décisions différées expliquées (5 items post-MVP)
- [x] Naming conventions établies
- [x] Patterns d'implémentation définis
- [x] Anti-patterns documentés (7 interdits)
- [x] Structure projet complète avec mapping FR → fichiers
- [x] Frontières architecturales définies
- [x] Points d'intégration externes mappés (8 services)
- [x] Validation cohérence, couverture et readiness complète

### Architecture Readiness Assessment

**Status : PRÊT POUR L'IMPLÉMENTATION** ✅

#### Niveau de confiance : HIGH

#### Forces clés

- Stack éprouvé (Next.js + Firebase + Stripe) avec codebase existant v0.2.2
- Abstraction services (`database.js`, `auth.js`) qui prépare la migration V1+
- Sécurité données sensibles bien définie (adresses chiffrées AES-256-GCM, fenêtre temporelle 24h)
- Patterns de consistance clairs pour développement solo + AI agents

**Améliorations futures :**

- Trancher le service email au moment de l'implémentation
- Ajouter tests e2e (Playwright) en V1
- Définir schéma messagerie quand FR31-35 V1 sera implémenté
- Évaluer Firebase Hosting vs Vercel pour SSR avancé

### Implementation Handoff

**Séquence d'implémentation recommandée :**

1. Migration design system (Tailwind CSS + shadcn/ui + Framer Motion)
2. Mise en place des API Routes (`app/api/`)
3. Auth + rôles (Firebase custom claims + middleware)
4. Initialisation schéma Firebase RTDB
5. Intégration Stripe Connect (paiement + webhooks)
6. Chiffrement adresses (AES-256-GCM)
7. Setup Sentry error tracking
8. Service emails transactionnels

**Guidelines pour tout AI agent implémentant ce projet :**

- Suivre les décisions architecturales exactement comme documentées
- Utiliser les patterns d'implémentation de manière consistante
- Respecter les frontières projet (API, composants, data)
- Se référer à ce document pour toute question architecturale
- Ne JAMAIS accéder à Firebase directement depuis les composants (sauf Auth)
