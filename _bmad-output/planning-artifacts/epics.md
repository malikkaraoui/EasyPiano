---
stepsCompleted: [1, 2, 3, 4]
status: 'complete'
completedAt: '2026-03-30'
inputDocuments: ['prd.md', 'architecture.md', 'ux-design-specification.md']
workflowType: 'epics'
project_name: 'EasyPiano'
user_name: 'Malik'
date: '2026-03-30'
---

# EasyPiano - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for EasyPiano, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**1. Découverte & Recherche**

- FR1: Les visiteurs peuvent accéder à une landing page présentant la valeur du service (héro piano, confiance, équipe, métier, avis clients 5 étoiles affichés)
- FR2: Les visiteurs peuvent rechercher des accordeurs disponibles par lieu et date
- FR3: Les visiteurs peuvent voir une liste de profils d'accordeurs correspondant à leur recherche
- FR4: Les visiteurs peuvent consulter le profil détaillé d'un accordeur (photo, bio, pays, langues, note estimée, certificats, nombre d'interventions, "Mon parcours" obligatoire, vidéo 30s optionnel)
- FR5: Les visiteurs peuvent accéder au formulaire d'inscription pro via le lien "Devenez accordeur"

**2. Gestion Utilisateurs**

- FR6: Les clients peuvent s'authentifier via Google Auth (V0.1), puis email+mot de passe OU SMS+code (V1)
- FR7: Les clients peuvent créer et gérer leur profil (nom, prénom, photo, téléphone, toggle Particulier/Pro-B2B à l'inscription)
- FR7b: Les clients doivent fournir un email valide au moment de la première réservation (obligatoire pour Stripe Checkout et communications)
- FR8: Les pros doivent fournir un email lors de l'inscription (obligatoire pour validation admin + Stripe Connect)
- FR9: Les pros peuvent consulter le statut de leur inscription (en attente, validé, refusé)
- FR9b: Les pros doivent activer l'authentification à deux facteurs (2FA) dès leur premier client confirmé
- FR9c: Les sessions pros expirent automatiquement après X minutes d'inactivité (sécurité)

**3. Réservation & Paiement**

- FR10: Les clients authentifiés peuvent sélectionner un créneau de demi-journée disponible chez un accordeur. Réservation instantanée si dans le rayon défini par le pro ; validation requise si hors rayon.
- FR11: Les clients peuvent voir un récapitulatif de leur réservation avant paiement (accordeur, date, créneau, prix 150 CHF)
- FR12: Les clients peuvent payer leur réservation via Stripe Checkout
- FR13: Les clients reçoivent une confirmation de réservation par email après paiement
- FR14: Les pros reçoivent le paiement automatiquement via Stripe Connect (125 CHF net après commission 17%)

**4. Gestion des Rendez-vous — Client**

- FR15: Les clients peuvent consulter la liste de leurs prochains rendez-vous
- FR16: Les clients peuvent demander l'annulation d'un rendez-vous (via email/WhatsApp dans V0.1)
- FR17: Les clients peuvent consulter l'historique de leurs rendez-vous passés (V1)
- FR18: Les clients peuvent annuler un rendez-vous avec sélection d'un motif obligatoire parmi 5 options (V1)
- FR19: Politique d'annulation par paliers : > 48h = remboursement 100%, 24-48h = 50%, < 24h = crédit plateforme (V1)

**5. Gestion des Rendez-vous — Pro**

- FR20: Les pros validés peuvent publier leurs disponibilités (dates, zone géographique, rayon km, capacité journalière). Réservations dans le rayon = confirmées instantanément ; hors rayon = validation pro requise.
- FR21: Les pros peuvent consulter leur emploi du temps avec informations partielles protégées (ville/zone avant 24h, adresse exacte révélée 24h avant, adresse non stockée dans historique)
- FR21b: L'adresse exacte du client est protégée et révélée au pro uniquement dans une fenêtre temporelle limitée (24h avant → fin intervention)
- FR22: Les pros peuvent voir leurs réservations confirmées par créneau
- FR23: Les pros peuvent modifier leurs disponibilités publiées
- FR23b: Les pros peuvent accéder à leur dashboard Stripe Connect via un lien direct depuis leur dashboard EasyPiano

**6. Validation & Confiance**

- FR24: L'admin peut consulter les inscriptions pro en attente de validation
- FR25: L'admin peut valider ou refuser une inscription pro avec notification email au pro
- FR26: Les profils pro validés affichent un badge "Validé par EasyPiano"
- FR27: Les clients peuvent laisser un avis (note 1-5 + commentaire) après une intervention (V1)
- FR28: Les pros peuvent répondre publiquement aux avis clients (V1)
- FR29: Le profil pro affiche la note moyenne calculée automatiquement (V1)
- FR30: Seuls les clients ayant réservé et reçu le service peuvent laisser un avis (V1)

**7. Communication**

- FR31: Les clients peuvent envoyer des messages aux pros (via email/WhatsApp externe en V0.1, messagerie intégrée en V1)
- FR32: Les clients peuvent contacter la plateforme (via email/WhatsApp externe en V0.1)
- FR33: Les pros peuvent contacter la plateforme pour alertes urgentes (via email/WhatsApp externe en V0.1)
- FR34: Le système envoie des notifications email automatiques (confirmation réservation, rappel J-2 + H-2, invitation avis) (V1)
- FR35: Les utilisateurs peuvent échanger via messagerie intégrée avec notifications temps réel (V1)

**8. Administration**

- FR36: L'admin peut accéder au dashboard Stripe Connect pour consulter les transactions et commissions
- FR37: L'admin peut gérer manuellement les incidents (pro absent, qualité insatisfaisante)
- FR38: L'admin peut consulter les analytics des motifs d'annulation agrégés (V1)
- FR39: L'admin peut consulter la liste des avis et notes pour monitoring qualité (V1)
- FR40: L'admin reçoit des alertes automatiques sur avis négatifs (< 3/5) (V1)
- FR41: L'admin peut envoyer des notifications email en masse aux clients (V1)

**9. Features Growth (V1)**

- FR42: Les clients peuvent s'authentifier par SMS avec code de vérification (V1)
- FR43: Les utilisateurs peuvent sélectionner la langue d'interface (FR + EN, archi i18n prête pour DE) (V1)
- FR44: Les clients peuvent rechercher un accordeur par son nom (V1)
- FR45: Supplément "piano en mauvais état" : déclaratif client à la réservation (grille fixe par ancienneté : 2-5 ans +30 CHF, 5-10 ans +50 CHF, 10+ ans +80 CHF) (V1)

**10. Features Vision (Phase 3)**

- FR46: Les clients reçoivent un rappel annuel automatique 11 mois après le dernier accordage (déplacé en V1)
- FR47: Les clients peuvent re-réserver le même accordeur en 1 clic
- FR48: Le système propose automatiquement un accordeur remplaçant si le pro est indisponible
- FR49: L'admin peut consulter des analytics avancés (taux remplissage par zone, saisonnalité, revenus)
- FR50: Le système peut appliquer un pricing dynamique par zone géographique

**11. Programme Affiliation**

- FR51: Les professeurs de piano peuvent s'inscrire au programme d'affiliation
- FR52: Les professeurs affiliés reçoivent une commission automatique via Stripe quand un élève réserve via leur lien

**12. Carnet d'entretien (V1)**

- FR53b: Après chaque intervention, le pro remplit un rapport post-intervention (état du piano, recommandations, date suggérée prochain accordage). Visible par le client dans son dashboard.

**13. Parrainage (V1)**

- FR53c: Programme de parrainage : crédit 20 CHF réciproque (parrain + filleul) lors de la première réservation du filleul via lien de parrainage.

**14. Sécurité & Protection Données**

- FR53: Les adresses exactes des clients ne sont JAMAIS stockées en clair dans l'historique des pros
- FR54: Les adresses exactes sont révélées aux pros dans une fenêtre temporelle limitée (24h avant RDV → fin intervention)
- FR55: Les pros doivent activer 2FA obligatoirement dès leur premier client confirmé
- FR56: Les sessions pros expirent automatiquement après 30 minutes d'inactivité

### NonFunctional Requirements

**Architecture & Évolutivité**

- NFR-ARCH1: Le frontend Next.js communique avec le backend via API REST uniquement (pas de couplage direct Firebase SDK côté client sauf auth)
- NFR-ARCH2: Les services backend sont abstraits (database.js, auth.js) pour permettre migration sans refonte frontend
- NFR-ARCH3: Le système doit supporter migration backend Firebase → PostgreSQL + Python sans downtime > 2h

**Performance**

- NFR-P1: Temps de chargement initial < 3s sur connexion 3G
- NFR-P2: Actions utilisateur (recherche, booking, dashboard) complètent en < 2s
- NFR-P3: Lighthouse Performance Score > 80
- NFR-P4: First Contentful Paint < 1.5s
- NFR-P5: 100 utilisateurs concurrents sans dégradation > 10%

**Sécurité**

- NFR-S1: HTTPS/TLS 1.3+
- NFR-S2: Adresses clients chiffrées en base (AES-256-GCM) et révélées temporairement (24h avant RDV)
- NFR-S3: Sessions pros expirent après 30 minutes d'inactivité
- NFR-S4: 2FA obligatoire pour tous les pros dès le premier client confirmé
- NFR-S5: Paiements via Stripe (PCI-DSS Level 1) — aucune donnée carte stockée
- NFR-S6: Conformité RGPD : droit à l'oubli, export données, consentement explicite
- NFR-S7: Tokens Firebase renouvelés automatiquement toutes les heures
- NFR-S8: Logs contenant données sensibles anonymisés après 30 jours

**Scalabilité**

- NFR-SC1: Supporte 10x croissance (50 → 500 users) avec < 10% dégradation
- NFR-SC2: Index optimisés pour requêtes fréquentes (recherche lieu + date)
- NFR-SC3: 1 000 réservations/mois V1, 10 000/mois Phase 3
- NFR-SC4: Images optimisées et servies via CDN

**Accessibilité**

- NFR-A1: WCAG 2.1 Level AA
- NFR-A2: Navigation clavier complète (Tab, Enter, Esc)
- NFR-A3: Contraste minimum 4.5:1 textes normaux, 3:1 textes larges
- NFR-A4: Support lecteurs d'écran (ARIA labels, semantic HTML)
- NFR-A5: Police minimum 16px, boutons tactiles 44x44px
- NFR-A6: Messages d'erreur clairs en français

**Intégration**

- NFR-I1: Stripe Checkout : paiement confirmé en < 5s
- NFR-I2: Webhooks Stripe traités en < 30s
- NFR-I3: Emails envoyés en < 2 minutes après événement
- NFR-I4: Firebase Auth Google complété en < 3s
- NFR-I5: Fallback manuel si Stripe Connect indisponible
- NFR-I6: Pros payés automatiquement chaque vendredi (Weekly Payout)
- NFR-I7: Instant Payout disponible en V1+ (1% frais)

**Fiabilité**

- NFR-R1: Disponibilité > 99.5%
- NFR-R2: 0 échec paiement Stripe non-résolu
- NFR-R3: Alertes admin si > 10 erreurs/heure
- NFR-R4: Backup quotidien automatique
- NFR-R5: Rollback en < 15 minutes

**Monitoring**

- NFR-M1: Sentry error tracking frontend + backend
- NFR-M2: Logs structurés JSON
- NFR-M3: Alertes Slack/Email automatiques (erreur critique, paiement échoué, downtime > 2min, taux erreur > 5%)

### Additional Requirements

**From Architecture Document:**

- Migration design system : CSS custom vanilla → Tailwind CSS + shadcn/ui + Framer Motion (décision architecture étape 4)
- API Routes Next.js (`app/api/`) comme couche backend unique (NFR-ARCH1)
- Schéma Firebase RTDB dénormalisé avec prix en centimes
- Chiffrement adresses AES-256-GCM côté serveur uniquement
- Firebase Auth avec custom claims pour rôles (client/pro/admin)
- Stripe Connect Express pour onboarding pro
- Service d'emails transactionnels (Firebase Extensions ou Resend)
- Sentry pour error tracking
- Pages SSR (landing, search, profil pro) vs CSR (dashboards)
- Séquence d'implémentation : 1) Tailwind migration, 2) API Routes, 3) Auth, 4) Schema RTDB, 5) Stripe, 6) Encryption, 7) Sentry, 8) Emails

**From UX Design Document:**

- Thème sombre élégant (palette : noir profond, champagne, gris anthracite)
- Typography duale : Playfair Display (titres) + Inter (corps)
- Animations Framer Motion : ScrollReveal, FadeIn, SlideUp, Checkmark, Parallax
- Composants shadcn/ui MVP : Button, Input, Calendar, Card, Dialog, Badge, Avatar, Skeleton, Toast
- Skeleton screens pour loading (pas de spinners)
- Hover effects subtils (scale 1.05, shadow, transition 200ms)
- Bouton "Me localiser" (géolocalisation)
- Autocomplétion villes/codes postaux
- Désactivation autocomplete Safari sur champs lieu
- Stripe Checkout embedded (pas redirect externe)
- Google Auth modal (pas redirect page entière)
- Bouton "Ajouter à mon agenda" (.ics) sur confirmation
- Gestion 0 résultat : suggestions dates alternatives, élargissement rayon
- Mobile-first : boutons 44x44px, thumb-friendly, scroll vertical naturel

### FR Coverage Map

| FR | Epic | Description |
| --- | --- | --- |
| FR1 | Epic 1 | Landing page (hero, confiance, équipe, métier) |
| FR2 | Epic 5 | Recherche accordeurs par lieu et date |
| FR3 | Epic 5 | Liste profils accordeurs |
| FR4 | Epic 5 | Profil détaillé accordeur |
| FR5 | Epic 3 | Formulaire inscription pro |
| FR6 | Epic 2 | Auth Google (V0.1), email+SMS (V1) |
| FR7 | Epic 2 | Profil client (nom, photo, B2B toggle) |
| FR7b | Epic 2 | Email obligatoire première réservation |
| FR8 | Epic 3 | Email pro obligatoire inscription |
| FR9 | Epic 3 | Statut inscription pro |
| FR9b | Epic 3 | 2FA pro obligatoire |
| FR9c | Epic 2 | Sessions pro expirantes |
| FR10 | Epic 6 | Sélection créneau demi-journée |
| FR11 | Epic 6 | Récapitulatif réservation |
| FR12 | Epic 6 | Paiement Stripe Checkout |
| FR13 | Epic 6 + Epic 9 | Confirmation email |
| FR14 | Epic 6 | Paiement pro Stripe Connect |
| FR15 | Epic 7 | Liste prochains RDV |
| FR16 | Epic 7 | Annulation manuelle (V0.1) |
| FR17 | Epic 10 | Historique RDV passés (V1) |
| FR18 | Epic 10 | Annulation avec motif (V1) |
| FR19 | Epic 10 | Politique annulation paliers (V1) |
| FR20 | Epic 4 | Publication disponibilités pro |
| FR21 | Epic 4 | Emploi du temps avec adresses protégées |
| FR21b | Epic 4 | Adresse révélée fenêtre 24h |
| FR22 | Epic 4 | Réservations confirmées par créneau |
| FR23 | Epic 4 | Modifier disponibilités |
| FR23b | Epic 4 | Lien Stripe dashboard |
| FR24 | Epic 3 | Admin consulte inscriptions en attente |
| FR25 | Epic 3 | Admin valide/refuse pro |
| FR26 | Epic 3 | Badge "Validé par EasyPiano" |
| FR27 | Epic 8 | Avis client (1-5 + commentaire) |
| FR28 | Epic 8 | Réponse pro aux avis |
| FR29 | Epic 8 | Note moyenne automatique |
| FR30 | Epic 8 | Avis unilatéral (clients ayant réservé) |
| FR31 | Epic 9 | Messages client → pro (externe V0.1) |
| FR32 | Epic 9 | Contact plateforme (externe V0.1) |
| FR33 | Epic 9 | Alertes urgentes pro (externe V0.1) |
| FR34 | Epic 9 | Notifications email automatiques |
| FR35 | Epic 9 | Messagerie intégrée temps réel (V1) |
| FR36 | Epic 11 | Dashboard Stripe admin |
| FR37 | Epic 11 | Gestion incidents |
| FR38 | Epic 11 | Analytics motifs annulation |
| FR39 | Epic 11 | Monitoring avis |
| FR40 | Epic 11 | Alertes avis négatifs |
| FR41 | Epic 11 | Notifications email masse |
| FR42 | Epic 12 | SMS auth (V1) |
| FR43 | Epic 12 | i18n FR+EN+DE (V1) |
| FR44 | Epic 12 | Recherche par nom (V1) |
| FR45 | Epic 12 | Supplément piano mauvais état (V1) |
| FR46 | Epic 9 | Rappel annuel 11 mois |
| FR47 | Epic 13 | Re-booking 1 clic |
| FR48 | Epic 13 | Remplacement auto pro |
| FR49 | Epic 13 | Analytics avancés |
| FR50 | Epic 13 | Pricing dynamique |
| FR51 | Epic 13 | Programme affiliation |
| FR52 | Epic 13 | Commission affiliation Stripe |
| FR53 | Epic 4 | Adresses jamais en clair historique |
| FR53b | Epic 12 | Carnet entretien piano (V1) |
| FR53c | Epic 12 | Parrainage 20 CHF (V1) |
| FR54 | Epic 4 | Révélation adresse fenêtre 24h |
| FR55 | Epic 3 | 2FA pro obligatoire |
| FR56 | Epic 2 | Sessions pro 30min timeout |

## Epic List

### V0.1 — MVP Lean

- **Epic 1 : Foundation & Landing Page** — FRs: FR1 | NFRs: ARCH1-3, P1-5, A1-6, M1-3, R1-5
- **Epic 2 : Authentification & Profils Utilisateurs** — FRs: FR6, FR7, FR7b, FR9c, FR56
- **Epic 3 : Onboarding Pro & Validation Admin** — FRs: FR5, FR8, FR9, FR9b, FR24, FR25, FR26, FR55
- **Epic 4 : Disponibilités Pro & Dashboard Pro** — FRs: FR20, FR21, FR21b, FR22, FR23, FR23b, FR53, FR54
- **Epic 5 : Recherche & Découverte** — FRs: FR2, FR3, FR4
- **Epic 6 : Réservation & Paiement** — FRs: FR10, FR11, FR12, FR13, FR14
- **Epic 7 : Dashboard Client** — FRs: FR15, FR16

### V1 — Post-MVP

- **Epic 8 : Système d'Avis & Confiance** — FRs: FR27, FR28, FR29, FR30
- **Epic 9 : Notifications & Emails Automatiques** — FRs: FR13 (enrichi), FR31-35, FR46
- **Epic 10 : Annulation & Remboursement Automatisé** — FRs: FR17, FR18, FR19
- **Epic 11 : Admin Dashboard & Analytics** — FRs: FR36, FR37, FR38, FR39, FR40, FR41
- **Epic 12 : Features Growth** — FRs: FR42, FR43, FR44, FR45, FR53b, FR53c

### Phase 3 — Expansion

- **Epic 13 : Features Avancées & Expansion** — FRs: FR47, FR48, FR49, FR50, FR51, FR52

## Epic 1 : Foundation & Landing Page

Les visiteurs découvrent un site élégant et professionnel qui inspire confiance.

### Story 1.1 : Migration Design System (Tailwind + shadcn/ui)

As a **développeur**,
I want migrer le design system vers Tailwind CSS + shadcn/ui,
So that le codebase utilise un système de composants accessible, maintenable et conforme à l'UX spec.

**Acceptance Criteria:**

**Given** le projet utilise actuellement du CSS custom vanilla (index.css 38KB)
**When** la migration est effectuée
**Then** Tailwind CSS est installé et configuré avec les tokens EasyPiano (couleurs sombres : `#0a0a0a`, champagne `#d4c5a0`, typography Playfair Display + Inter)
**And** shadcn/ui est initialisé avec les composants de base copiés dans `src/components/ui/` (Button, Card, Input, Dialog, Badge, Avatar, Skeleton, Toast)
**And** le helper `cn()` est disponible dans `src/lib/utils.js`
**And** Framer Motion est installé avec les wrappers `ScrollReveal`, `FadeIn`, `SlideUp` dans `src/components/animations/`
**And** `app/globals.css` contient les imports Tailwind et les CSS variables
**And** l'ancien `src/index.css` est supprimé
**And** le build (`npm run build`) passe sans erreur
**And** les tests existants passent

### Story 1.2 : Setup API Routes & Infrastructure Backend

As a **développeur**,
I want mettre en place la structure des API Routes Next.js,
So that le backend est prêt à recevoir les endpoints métier (NFR-ARCH1).

**Acceptance Criteria:**

**Given** le projet utilise Next.js App Router
**When** la structure API est créée
**Then** le dossier `app/api/` existe avec un endpoint de santé (`app/api/health/route.js`) qui retourne `{ success: true, data: { status: "ok" } }`
**And** le format de réponse standard est défini : `{ success: boolean, data: object|null, error: string|null }`
**And** un middleware d'authentification `verifyAuth` est créé dans `src/services/auth.js` (vérifie token Firebase, retourne user + role)
**And** l'alias `@/` pointe vers `src/` dans `next.config.js`
**And** Sentry est initialisé pour error tracking (frontend dans `app/layout.jsx`, backend dans les API Routes)

### Story 1.3 : Landing Page

As a **visiteur**,
I want voir une landing page élégante et professionnelle,
So that je comprends immédiatement qu'EasyPiano est la solution pour trouver un accordeur.

**Acceptance Criteria:**

**Given** un visiteur arrive sur easypiano.ch
**When** la page se charge
**Then** un hero plein écran s'affiche avec un piano à queue sur fond sombre, le titre "On accorde votre piano" et une barre de recherche (lieu + date) au centre
**And** la barre de recherche est visible mais non fonctionnelle (placeholder, redirige vers `/search` au submit)
**And** en scrollant, des sections apparaissent avec animations ScrollReveal : "Comment ça marche" (3 étapes), "Pourquoi nous faire confiance" (curation physique, badge validé), "Devenez accordeur" (CTA)
**And** le Header contient le logo et un lien "Connexion"
**And** le Footer contient "Devenez accordeur", mentions légales, contact
**And** la page est SSR (rendu serveur pour SEO)
**And** Lighthouse Performance Score > 80
**And** FCP < 1.5s
**And** la page est responsive mobile-first (boutons 44x44px, typography 16px min)
**And** les contrastes respectent WCAG 2.1 AA (4.5:1)

### Story 1.4 : CI/CD & Monitoring

As a **développeur**,
I want que le pipeline CI/CD et le monitoring soient opérationnels,
So that chaque déploiement est validé automatiquement et les erreurs sont trackées.

**Acceptance Criteria:**

**Given** le CI/CD GitHub Actions est déjà en place
**When** un push est fait sur `main`
**Then** le pipeline exécute lint + test + build + deploy sur Firebase Hosting
**And** Sentry capture les erreurs frontend et backend avec source maps
**And** les backups Firebase RTDB sont configurés en export quotidien automatique
**And** un `.env.example` documente toutes les variables d'environnement requises

## Epic 2 : Authentification & Profils Utilisateurs

Les clients et pros peuvent s'inscrire, se connecter, et gérer leur profil.

### Story 2.1 : Authentification Google

As a **visiteur**,
I want me connecter avec mon compte Google en 1 clic,
So that je peux accéder aux fonctionnalités réservées (réservation, dashboard).

**Acceptance Criteria:**

**Given** un visiteur est sur la page `/login`
**When** il clique sur "Se connecter avec Google"
**Then** une modal Google Auth s'affiche (pas de redirect page entière)
**And** après connexion, un profil `users/{userId}` est créé dans Firebase RTDB avec les champs : email, displayName, photoURL, role="client", isB2B=false, createdAt
**And** un custom claim Firebase `role: "client"` est attribué
**And** le token Firebase est stocké et renouvelé automatiquement
**And** l'utilisateur est redirigé vers la page d'où il venait (ou `/dashboard`)
**And** l'AuthContext (`useAuth`) expose : user, loading, signIn, signOut

### Story 2.2 : Profil Client

As a **client authentifié**,
I want créer et gérer mon profil,
So that mes informations sont à jour pour mes réservations.

**Acceptance Criteria:**

**Given** un client est connecté
**When** il accède à son profil
**Then** il peut modifier : nom, prénom, photo, téléphone
**And** un toggle "Particulier / Professionnel (B2B)" est disponible (FR7)
**And** l'email est affiché en lecture seule (provient de Google Auth)
**And** les modifications sont sauvegardées via `POST /api/user/profile` (API Route, pas Firebase direct)
**And** un message de confirmation s'affiche après sauvegarde

### Story 2.3 : Gestion Sessions & Sécurité

As a **pro connecté**,
I want que ma session expire après 30 minutes d'inactivité,
So that mon compte est protégé si j'oublie de me déconnecter.

**Acceptance Criteria:**

**Given** un pro est connecté avec `role: "pro"`
**When** aucune activité n'est détectée pendant 30 minutes
**Then** le token est invalidé et l'utilisateur est redirigé vers `/login` avec message "Session expirée"
**And** un middleware côté API Routes vérifie le `lastActivity` du pro
**And** le ProtectedRoute component vérifie la validité de la session côté client
**Et** les clients (non-pro) n'ont pas de timeout de session

## Epic 3 : Onboarding Pro & Validation Admin

Les accordeurs peuvent s'inscrire, être validés par l'admin, et configurer Stripe Connect.

### Story 3.1 : Formulaire d'inscription Pro

En tant que **accordeur**,
Je veux m'inscrire sur EasyPiano via un formulaire dédié,
Afin de soumettre ma candidature pour être validé.

**Critères d'acceptation :**

**Étant donné** un visiteur clique sur "Devenez accordeur" (footer ou landing)
**Quand** il remplit le formulaire d'inscription pro
**Alors** les champs suivants sont obligatoires : photo professionnelle, bio ("Mon parcours"), email, pays, langues parlées, certificats (upload fichiers)
**Et** les champs optionnels : vidéo 30s (URL), téléphone
**Et** les fichiers sont uploadés sur Firebase Storage
**Et** un noeud `pros/{proId}` est créé via `POST /api/pros/register` avec `status: "pending"`
**Et** un email de confirmation est envoyé au pro : "Votre candidature est en cours de traitement"
**Et** le pro peut consulter son statut sur `/pro-dashboard` : "En attente de validation"

### Story 3.2 : Dashboard Admin — Validation des Pros

En tant qu'**admin**,
Je veux consulter et valider/refuser les inscriptions des accordeurs,
Afin que seuls les pros qualifiés apparaissent sur la plateforme.

**Critères d'acceptation :**

**Étant donné** l'admin est connecté avec `role: "admin"` et accède à `/admin/pros`
**Quand** il consulte la liste des inscriptions
**Alors** les pros en attente (`status: "pending"`) sont affichés avec : photo, bio, certificats, langues, pays
**Et** l'admin peut cliquer "Valider" → `POST /api/admin/validate-pro` met `status: "validated"`, `validatedAt`, `validatedBy`
**Et** l'admin peut cliquer "Refuser" avec motif → `status: "refused"`, `refusalReason` enregistré
**Et** un email est envoyé au pro : "Profil validé ! Configurez Stripe Connect." ou "Inscription refusée : {motif}"
**Et** les pros validés sont ajoutés à l'index `indexes/pros_by_status/validated`

### Story 3.3 : Badge "Validé par EasyPiano"

En tant que **visiteur**,
Je veux voir un badge de confiance sur les profils des accordeurs validés,
Afin de savoir qu'ils ont été vérifiés physiquement par l'équipe.

**Critères d'acceptation :**

**Étant donné** un profil pro a `status: "validated"`
**Quand** son profil est affiché (carte résultat ou page détail)
**Alors** un badge "Validé par EasyPiano" est visible (composant shadcn/ui Badge, couleur champagne)
**Et** au survol (desktop) ou tap (mobile), un tooltip explique : "Cet accordeur a été rencontré et vérifié par notre équipe"

### Story 3.4 : Onboarding Stripe Connect

En tant que **pro validé**,
Je veux configurer mon compte Stripe Connect,
Afin de recevoir mes paiements automatiquement.

**Critères d'acceptation :**

**Étant donné** un pro a `status: "validated"` et `stripeOnboardingComplete: false`
**Quand** il accède à son dashboard pro
**Alors** un bandeau CTA s'affiche : "Configurez votre compte bancaire pour recevoir vos paiements"
**Et** le clic génère un lien Stripe Connect Express onboarding via `POST /api/stripe/onboarding`
**Et** après onboarding Stripe réussi, le webhook `account.updated` met à jour `stripeAccountId` et `stripeOnboardingComplete: true`
**Et** le statut affiché sur le dashboard passe à : "Actif — Prêt à recevoir des paiements"
**Et** tant que Stripe n'est pas configuré, le pro ne peut pas publier de disponibilités

### Story 3.5 : 2FA Pro Obligatoire

En tant que **pro avec un premier client confirmé**,
Je veux activer l'authentification à deux facteurs,
Afin que mon compte soit protégé contre les accès non autorisés.

**Critères d'acceptation :**

**Étant donné** un pro a au moins 1 réservation confirmée et n'a pas encore activé 2FA
**Quand** il accède à son dashboard
**Alors** un bandeau obligatoire s'affiche : "Activez la vérification en 2 étapes pour sécuriser votre compte"
**Et** le pro est guidé vers l'activation Firebase Auth multi-factor (SMS)
**Et** tant que 2FA n'est pas activé, le pro ne peut pas accéder aux détails de ses réservations (adresses)
**Et** après activation, le flag est enregistré et le bandeau disparaît

## Epic 4 : Disponibilités Pro & Dashboard Pro

Les pros peuvent publier leurs tournées et gérer leur emploi du temps.

### Story 4.1 : Publication des disponibilités

En tant que **pro validé avec Stripe configuré**,
Je veux publier mes disponibilités de tournée,
Afin que les clients puissent me réserver.

**Critères d'acceptation :**

**Étant donné** un pro a `status: "validated"` et `stripeOnboardingComplete: true`
**Quand** il accède à `/pro-dashboard/availabilities` et remplit le formulaire
**Alors** il peut saisir : dates de début/fin, zone géographique (ville), rayon en km (défaut 50), capacité matin (défaut 1), capacité après-midi (défaut 2)
**Et** les coordonnées GPS de la zone sont calculées automatiquement
**Et** les disponibilités sont créées via `POST /api/availabilities` dans `availabilities/{proId}/{availabilityId}`
**Et** les créneaux apparaissent sur la plateforme pour les clients
**Et** le pro peut publier des disponibilités jusqu'à 6 mois à l'avance

### Story 4.2 : Gestion et modification des disponibilités

En tant que **pro**,
Je veux modifier ou supprimer mes disponibilités publiées,
Afin d'ajuster ma tournée si nécessaire.

**Critères d'acceptation :**

**Étant donné** un pro a des disponibilités publiées
**Quand** il accède à `/pro-dashboard/availabilities`
**Alors** il voit la liste de ses disponibilités avec dates, zone, rayon, capacité
**Et** il peut modifier les champs (dates, zone, capacité) tant qu'aucune réservation n'est confirmée pour ces créneaux
**Et** s'il y a des réservations existantes, un message d'avertissement s'affiche
**Et** les modifications sont sauvegardées via API Route

### Story 4.3 : Emploi du temps Pro avec adresses protégées

En tant que **pro**,
Je veux consulter mon emploi du temps avec les détails de mes RDV,
Afin d'organiser ma tournée efficacement.

**Critères d'acceptation :**

**Étant donné** un pro a des réservations confirmées
**Quand** il accède à `/pro-dashboard/bookings`
**Alors** il voit ses réservations par créneau (matin/après-midi) avec : nom client, date, créneau
**Et** pour un RDV à plus de 24h : seule la ville/zone est affichée (pas l'adresse exacte)
**Et** pour un RDV à moins de 24h : l'adresse exacte est révélée automatiquement (déchiffrement AES-256-GCM via API Route)
**Et** dans l'historique : l'adresse exacte n'est plus affichée (seulement ville/zone)
**Et** un lien "Accéder à mon dashboard Stripe" est visible en permanence

### Story 4.4 : Chiffrement des adresses clients

En tant qu'**administrateur technique**,
Je veux que les adresses clients soient chiffrées en base,
Afin de protéger les données sensibles conformément à la RGPD.

**Critères d'acceptation :**

**Étant donné** un client fournit son adresse lors de la réservation
**Quand** l'adresse est enregistrée
**Alors** l'adresse exacte est chiffrée via AES-256-GCM dans `src/services/encryption.js` avant stockage dans `bookings/{id}/addressEncrypted`
**Et** seule la ville est stockée en clair dans `addressCity` (pour affichage pro avant 24h)
**Et** la clé de chiffrement est en variable d'environnement (jamais dans le code)
**Et** le déchiffrement ne se fait que dans les API Routes (jamais côté client)
**Et** l'API Route `GET /api/bookings/pro` déchiffre l'adresse uniquement si le RDV est dans la fenêtre 24h avant → fin intervention

## Epic 5 : Recherche & Découverte

Les clients trouvent un accordeur disponible par lieu et date en quelques secondes.

### Story 5.1 : Recherche par lieu et date

En tant que **visiteur**,
Je veux rechercher des accordeurs disponibles par lieu et date,
Afin de trouver un pro pour accorder mon piano.

**Critères d'acceptation :**

**Étant donné** un visiteur est sur `/search` (ou soumet la barre de recherche du hero landing)
**Quand** il entre un lieu et une date
**Alors** le champ lieu propose une autocomplétion de villes/codes postaux (Suisse, France, Allemagne)
**Et** un bouton "Me localiser" détecte la ville automatiquement via géolocalisation navigateur
**Et** le champ date affiche un calendrier (composant shadcn/ui Calendar) permettant de choisir jusqu'à 6 mois à l'avance
**Et** `autocomplete="off"` est appliqué sur le champ lieu (désactivation suggestions Safari)
**Et** au submit, `POST /api/search` retourne les pros disponibles dans le rayon de la zone correspondante à la date choisie
**Et** la page est SSR pour le SEO

### Story 5.2 : Affichage des résultats de recherche

En tant que **visiteur**,
Je veux voir une liste de profils d'accordeurs disponibles,
Afin de comparer et choisir celui qui me convient.

**Critères d'acceptation :**

**Étant donné** une recherche retourne des résultats
**Quand** les résultats s'affichent
**Alors** les profils apparaissent en grille (3 colonnes desktop, 1 colonne mobile) avec animation FadeIn
**Et** chaque carte affiche : photo HD, nom, badge "Validé", langues (drapeaux), note estimée (MVP) ou note réelle (V1), créneaux dispo (matin/après-midi)
**Et** au survol : effet hover subtil (scale 1.05, shadow accentuée, transition 200ms)
**Et** le prix "150 CHF" est affiché sur chaque carte
**Et** pendant le chargement, des skeleton screens s'affichent (pas de spinner)

**Étant donné** une recherche retourne 0 résultat
**Quand** l'écran s'affiche
**Alors** un message s'affiche : "Aucun accordeur disponible le {date}. Voici d'autres dates proches :" avec 3 dates alternatives ayant des pros disponibles
**Et** une option "Élargir la recherche à 100 km ?" est proposée subtilement

### Story 5.3 : Profil détaillé de l'accordeur

En tant que **visiteur**,
Je veux consulter le profil complet d'un accordeur,
Afin de vérifier ses qualifications avant de réserver.

**Critères d'acceptation :**

**Étant donné** un visiteur clique sur une carte profil depuis les résultats
**Quand** la page `/pro/{proId}` s'affiche
**Alors** le profil complet est affiché en 1 scroll : photo grande, bio "Mon parcours", pays, langues, certificats (icônes cliquables), nombre d'interventions, badge "Validé par EasyPiano"
**Et** les créneaux disponibles sont affichés (matin/après-midi) pour les prochaines dates
**Et** un bouton CTA "Réserver" est visible et fixe (sticky bottom sur mobile)
**Et** la page est SSR pour le SEO (profil public indexable)
**Et** les contrastes respectent WCAG 2.1 AA

## Epic 6 : Réservation & Paiement

Les clients réservent et paient un accordeur en moins de 3 minutes.

### Story 6.1 : Sélection de créneau et récapitulatif

En tant que **visiteur**,
Je veux sélectionner un créneau et voir le récapitulatif avant de payer,
Afin de confirmer ma réservation sans surprise.

**Critères d'acceptation :**

**Étant donné** un visiteur est sur le profil d'un pro et clique "Réserver"
**Quand** il accède à `/booking/{proId}`
**Alors** il peut sélectionner un créneau : matin (9h-12h) ou après-midi (14h-17h) via boutons radio
**Et** il doit fournir son adresse (champ texte, sera chiffrée au stockage)
**Et** un récapitulatif clair s'affiche : nom accordeur, date, créneau, prix 150 CHF
**Et** si le client est dans le rayon du pro : réservation instantanée
**Et** si hors rayon : message "Le pro doit confirmer votre réservation"

### Story 6.2 : Paiement Stripe Checkout

En tant que **client authentifié**,
Je veux payer ma réservation en ligne,
Afin de confirmer mon rendez-vous immédiatement.

**Critères d'acceptation :**

**Étant donné** un client a sélectionné un créneau et vu le récapitulatif
**Quand** il n'est pas connecté, une modal Google Auth s'affiche (pas de redirect)
**Et** après connexion, Stripe Checkout embedded s'affiche (pas de nouvelle fenêtre)
**Alors** `POST /api/booking/create` crée un PaymentIntent Stripe de 15000 centimes (150 CHF) avec Stripe Connect : 12500 pour le pro, 2500 commission
**Et** le paiement est confirmé en < 5s
**Et** un noeud `bookings/{bookingId}` est créé avec tous les champs du schéma (status: "confirmed", adresse chiffrée, timestamps)
**Et** les index `bookings_by_client` et `bookings_by_pro` sont mis à jour

### Story 6.3 : Confirmation et webhooks

En tant que **client ayant payé**,
Je veux recevoir une confirmation immédiate,
Afin d'être sûr que ma réservation est bien enregistrée.

**Critères d'acceptation :**

**Étant donné** le paiement Stripe est réussi
**Quand** la page `/confirmation` s'affiche
**Alors** une animation checkmark élégante s'affiche avec le message "Bravo, votre piano va enfin chanter comme à ses premiers jours"
**Et** le récapitulatif complet est affiché (accordeur, date, créneau, prix)
**Et** un bouton "Ajouter à mon agenda" génère un fichier .ics compatible Google Calendar, Apple Calendar, Outlook
**Et** un email de confirmation est envoyé au client en < 2 minutes
**Et** le webhook Stripe `payment_intent.succeeded` dans `app/api/webhooks/stripe/route.js` confirme le paiement côté serveur en < 30s
**Et** les stats du pro sont mises à jour (`totalBookings` +1)

## Epic 7 : Dashboard Client

Les clients consultent et gèrent leurs réservations.

### Story 7.1 : Vue des prochains rendez-vous

En tant que **client authentifié**,
Je veux voir la liste de mes prochains rendez-vous,
Afin de savoir quand mon piano sera accordé.

**Critères d'acceptation :**

**Étant donné** un client est connecté et accède à `/dashboard`
**Quand** la page se charge
**Alors** la section "Prochains RDV" affiche les réservations futures avec : nom accordeur, photo, date, créneau, statut
**Et** les réservations sont triées par date (la plus proche en premier)
**Et** si aucun RDV : message "Pas de rendez-vous prévu. Rechercher un accordeur ?" avec lien vers `/search`
**Et** la page est CSR (ProtectedRoute, pas de SEO nécessaire)

### Story 7.2 : Annulation manuelle (V0.1)

En tant que **client**,
Je veux pouvoir annuler une réservation,
Afin de reporter ou annuler si j'ai un imprévu.

**Critères d'acceptation :**

**Étant donné** un client a un RDV à venir
**Quand** il clique "Annuler" sur un RDV
**Alors** un message s'affiche : "Pour annuler votre réservation, contactez-nous par email à {email} ou WhatsApp au {numéro}"
**Et** l'annulation V0.1 est gérée manuellement par Jérôme (pas de système automatisé)
**Et** le dashboard affiche le statut "Annulation en cours" après que le client a signalé son intention

## Epic 8 : Système d'Avis & Confiance (V1)

Les clients notent les pros, la confiance se construit à l'échelle.

### Story 8.1 : Laisser un avis

En tant que **client ayant reçu un accordage**,
Je veux noter et commenter le service,
Afin de partager mon expérience et aider les futurs clients.

**Critères d'acceptation :**

**Étant donné** un booking a `status: "completed"` et aucun avis n'existe pour ce booking
**Quand** le client accède à `/review/{bookingId}`
**Alors** un formulaire s'affiche avec : note 1-5 étoiles (composant StarRating) + commentaire texte
**Et** seul le client ayant réservé peut laisser l'avis (vérification `bookings/{id}/clientId`)
**Et** l'avis est créé via `POST /api/reviews/create` dans `reviews/{bookingId}`
**Et** un seul avis par booking est autorisé

### Story 8.2 : Réponse du pro aux avis

En tant que **pro**,
Je veux répondre publiquement aux avis de mes clients,
Afin de montrer mon professionnalisme.

**Critères d'acceptation :**

**Étant donné** un avis existe pour un booking du pro
**Quand** le pro accède à ses avis depuis son dashboard
**Alors** il peut écrire une réponse via `POST /api/reviews/respond`
**Et** la réponse est stockée dans `reviews/{bookingId}/proResponse`
**Et** une seule réponse par avis est autorisée
**Et** la réponse est visible publiquement sur le profil du pro

### Story 8.3 : Note moyenne et affichage sur profil

En tant que **visiteur**,
Je veux voir la note moyenne d'un accordeur,
Afin d'évaluer sa fiabilité rapidement.

**Critères d'acceptation :**

**Étant donné** un pro a au moins 1 avis
**Quand** son profil est affiché (carte ou page détail)
**Alors** la note moyenne est calculée et affichée (ex: "4.8/5 sur 47 avis")
**Et** les stats `pros/{proId}/stats/averageRating` et `totalReviews` sont mises à jour à chaque nouvel avis
**Et** les avis récents sont affichés sur la page profil détaillé avec note, commentaire, réponse pro

## Epic 9 : Notifications & Emails Automatiques (V1)

Le système communique proactivement à chaque étape du parcours.

### Story 9.1 : Emails transactionnels automatiques

En tant qu'**utilisateur**,
Je veux recevoir des emails automatiques aux moments clés,
Afin de ne rien manquer concernant ma réservation.

**Critères d'acceptation :**

**Étant donné** le service email est configuré (`src/services/email.js`)
**Quand** un événement se produit
**Alors** les emails suivants sont envoyés automatiquement en < 2 minutes :

- Confirmation réservation (au client + au pro)
- Rappel J-2 avant le RDV (au client)
- Rappel H-2 avant le RDV (au client)
- Invitation à laisser un avis (au client, 48h après l'intervention)

**Et** chaque email est en français, avec le branding EasyPiano (thème sombre élégant)
**Et** les emails contiennent les infos pertinentes (accordeur, date, créneau)

### Story 9.2 : Rappel annuel 11 mois

En tant que **client ayant fait accorder son piano**,
Je veux recevoir un rappel 11 mois après mon dernier accordage,
Afin de ne pas oublier l'entretien annuel.

**Critères d'acceptation :**

**Étant donné** un booking a `status: "completed"` et 11 mois se sont écoulés
**Quand** le cron/trigger se déclenche
**Alors** un email est envoyé : "Votre piano a été accordé il y a 11 mois. Réservez à nouveau ?"
**Et** le CTA renvoie vers `/search` pré-rempli avec le lieu du client

### Story 9.3 : Communication externe (V0.1 → V1)

En tant qu'**utilisateur**,
Je veux pouvoir contacter le pro ou la plateforme,
Afin de poser des questions ou signaler un problème.

**Critères d'acceptation :**

**Étant donné** la V0.1 utilise email/WhatsApp externe
**Quand** un client ou pro veut communiquer
**Alors** les coordonnées de contact sont affichées clairement (email plateforme, WhatsApp Jérôme)
**Et** en V1, une messagerie intégrée est ajoutée (Firebase RTDB listeners temps réel)

## Epic 10 : Annulation & Remboursement Automatisé (V1)

Les clients peuvent annuler avec motif et remboursement automatique par paliers.

### Story 10.1 : Historique des rendez-vous

En tant que **client**,
Je veux voir l'historique de mes rendez-vous passés,
Afin de suivre l'entretien de mon piano.

**Critères d'acceptation :**

**Étant donné** un client est connecté et accède à `/dashboard`
**Quand** il consulte la section "Historique"
**Alors** les RDV passés sont affichés avec : accordeur, date, statut, lien "Laisser un avis" (si pas encore fait)
**Et** les RDV sont triés du plus récent au plus ancien

### Story 10.2 : Annulation automatisée avec motif

En tant que **client**,
Je veux annuler un RDV directement depuis mon dashboard,
Afin de gérer mes imprévus sans contacter le support.

**Critères d'acceptation :**

**Étant donné** un client a un RDV à venir
**Quand** il clique "Annuler"
**Alors** un menu déroulant obligatoire s'affiche avec 5 motifs :

1. Imprévu personnel / familial
2. Problème de santé
3. Changement de planning / déménagement
4. J'ai trouvé un autre accordeur
5. Autre (champ texte libre)

**Et** après sélection du motif, la politique d'annulation s'affiche selon le délai :

- Plus de 48h avant : remboursement 100%
- Entre 24h et 48h : remboursement 50%
- Moins de 24h : crédit plateforme (pas de remboursement)

**Et** le client confirme l'annulation
**Et** `POST /api/booking/cancel` met à jour le booking (`status: "cancelled"`, motif, `refundPercent`)
**Et** le remboursement Stripe est déclenché automatiquement
**Et** le motif est enregistré pour les analytics admin

## Epic 11 : Admin Dashboard & Analytics (V1)

Les admins ont une vue complète sur les opérations et la qualité.

### Story 11.1 : Dashboard admin principal

En tant qu'**admin**,
Je veux un tableau de bord centralisé,
Afin de piloter les opérations EasyPiano.

**Critères d'acceptation :**

**Étant donné** l'admin est connecté avec `role: "admin"`
**Quand** il accède à `/admin`
**Alors** il voit un résumé : nombre de réservations (mois en cours), nombre de pros actifs, revenu commissions, note moyenne globale
**Et** un lien direct vers le dashboard Stripe Connect pour les transactions détaillées
**Et** des alertes sont visibles si : avis négatif < 3/5, paiement échoué, incident signalé

### Story 11.2 : Gestion des incidents

En tant qu'**admin**,
Je veux gérer les incidents (pro absent, qualité insatisfaisante),
Afin de maintenir la qualité du service.

**Critères d'acceptation :**

**Étant donné** un incident est signalé (avis < 3/5 ou message client)
**Quand** l'admin consulte `/admin/bookings`
**Alors** il peut voir le détail de la réservation et contacter le client/pro
**Et** il peut déclencher un remboursement manuel via Stripe
**Et** il peut ajouter une note interne sur l'incident

### Story 11.3 : Analytics motifs d'annulation

En tant qu'**admin**,
Je veux voir les statistiques des motifs d'annulation,
Afin de comprendre pourquoi les clients annulent.

**Critères d'acceptation :**

**Étant donné** des annulations ont eu lieu
**Quand** l'admin accède à `/admin/analytics`
**Alors** un graphique affiche la répartition des 5 motifs d'annulation
**Et** les données sont filtrables par période (semaine, mois, trimestre)

### Story 11.4 : Monitoring avis et alertes

En tant qu'**admin**,
Je veux surveiller les avis et être alerté des avis négatifs,
Afin de réagir rapidement en cas de problème qualité.

**Critères d'acceptation :**

**Étant donné** des avis existent
**Quand** l'admin accède à `/admin/reviews`
**Alors** la liste des avis récents est affichée avec : client, pro, note, commentaire, réponse pro
**Et** les avis < 3/5 sont surlignés en rouge
**Et** une alerte email automatique est envoyée à l'admin quand un avis < 3/5 est publié
**Et** l'admin peut envoyer des notifications email en masse aux clients

## Epic 12 : Features Growth (V1)

Nouvelles fonctionnalités pour élargir l'audience et enrichir l'expérience.

### Story 12.1 : Authentification SMS

En tant que **client**,
Je veux me connecter par SMS avec code de vérification,
Afin d'avoir une alternative à Google Auth.

**Critères d'acceptation :**

**Étant donné** un visiteur est sur `/login`
**Quand** il choisit "Connexion par SMS"
**Alors** il entre son numéro de téléphone et reçoit un code de vérification par SMS
**Et** après saisie du code correct, il est connecté avec `role: "client"`
**Et** le profil `users/{userId}` est créé ou mis à jour

### Story 12.2 : Internationalisation (FR + EN)

En tant qu'**utilisateur**,
Je veux choisir la langue de l'interface,
Afin de naviguer dans ma langue préférée.

**Critères d'acceptation :**

**Étant donné** l'architecture i18n est en place
**Quand** l'utilisateur sélectionne une langue (FR ou EN)
**Alors** toute l'interface est traduite dans la langue choisie
**Et** le choix est persisté (cookie ou localStorage)
**Et** l'architecture est prête pour l'ajout futur de l'allemand (DE)

### Story 12.3 : Recherche par nom d'accordeur

En tant que **client**,
Je veux rechercher un accordeur par son nom,
Afin de re-réserver facilement un pro que je connais.

**Critères d'acceptation :**

**Étant donné** un client est sur `/search`
**Quand** il tape un nom dans un champ de recherche dédié
**Alors** les profils correspondants s'affichent en temps réel
**Et** le résultat montre le profil complet avec disponibilités

### Story 12.4 : Supplément piano en mauvais état

En tant que **client**,
Je veux déclarer l'état de mon piano à la réservation,
Afin que le pro sache à quoi s'attendre et que le prix soit ajusté.

**Critères d'acceptation :**

**Étant donné** un client est dans le flow de réservation
**Quand** il déclare l'état de son piano
**Alors** une grille fixe s'affiche : 2-5 ans sans accordage +30 CHF, 5-10 ans +50 CHF, 10+ ans +80 CHF
**Et** le prix total est recalculé et affiché dans le récapitulatif
**Et** le pro peut surclasser sur place si l'état réel est pire que déclaré

### Story 12.5 : Programme de parrainage

En tant que **client satisfait**,
Je veux parrainer un ami et recevoir un crédit,
Afin de bénéficier d'une réduction sur mon prochain accordage.

**Critères d'acceptation :**

**Étant donné** un client a un compte actif
**Quand** il accède à "Parrainer un ami" depuis son dashboard
**Alors** un lien de parrainage unique est généré
**Et** quand le filleul s'inscrit et effectue sa première réservation via ce lien, parrain et filleul reçoivent 20 CHF de crédit
**Et** le crédit est appliqué automatiquement sur la prochaine réservation

### Story 12.6 : Carnet d'entretien du piano

En tant que **pro ayant réalisé un accordage**,
Je veux remplir un rapport post-intervention,
Afin que le client ait un suivi de l'entretien de son piano.

**Critères d'acceptation :**

**Étant donné** un booking a `status: "completed"`
**Quand** le pro accède au détail du RDV depuis son dashboard
**Alors** il peut remplir un formulaire : état du piano, recommandations, date suggérée du prochain accordage
**Et** le rapport est visible par le client dans son dashboard sous "Historique"

## Epic 13 : Features Avancées & Expansion (Phase 3)

Fonctionnalités avancées pour scaler et devenir la référence du marché.

### Story 13.1 : Re-booking en 1 clic

En tant que **client ayant déjà réservé**,
Je veux re-réserver le même accordeur en 1 clic,
Afin de gagner du temps pour l'entretien annuel.

**Critères d'acceptation :**

**Étant donné** un client a un booking passé avec `status: "completed"`
**Quand** il clique "Réserver à nouveau avec {nom}" depuis son dashboard ou l'email rappel
**Alors** le flow de réservation est pré-rempli (même pro, même adresse) et le client n'a qu'à choisir la date/créneau et payer

### Story 13.2 : Remplacement automatique de pro

En tant que **client dont le pro est indisponible**,
Je veux qu'un remplaçant me soit proposé automatiquement,
Afin de ne pas rester sans accordeur.

**Critères d'acceptation :**

**Étant donné** un pro annule une tournée avec des réservations
**Quand** le système détecte l'annulation
**Alors** les pros validés disponibles dans la même zone/période sont identifiés
**Et** le client reçoit un email : "Votre accordeur a changé. Voici le nouveau profil : {lien}"
**Et** si aucun remplaçant : remboursement total + crédit 20 CHF

### Story 13.3 : Analytics avancés

En tant qu'**admin**,
Je veux des analytics détaillés,
Afin de prendre des décisions data-driven.

**Critères d'acceptation :**

**Étant donné** la plateforme a plusieurs mois de données
**Quand** l'admin accède aux analytics avancés
**Alors** il peut consulter : taux de remplissage par zone, saisonnalité de la demande, revenus par période, zones les plus demandées

### Story 13.4 : Pricing dynamique par zone

En tant qu'**admin**,
Je veux ajuster les prix par zone géographique,
Afin d'optimiser les revenus selon l'offre et la demande.

**Critères d'acceptation :**

**Étant donné** des données de demande existent par zone
**Quand** l'admin configure un pricing par zone
**Alors** le prix est ajusté automatiquement selon la zone du client
**Et** le pro reçoit toujours son net après commission

### Story 13.5 : Programme d'affiliation profs de piano

En tant que **professeur de piano**,
Je veux recommander EasyPiano à mes élèves et recevoir une commission,
Afin de proposer un service utile tout en gagnant un revenu complémentaire.

**Critères d'acceptation :**

**Étant donné** un prof s'inscrit au programme d'affiliation
**Quand** un élève réserve via son lien d'affiliation
**Alors** le prof reçoit une commission automatique via Stripe
**Et** le suivi des conversions est visible dans un dashboard affilié
