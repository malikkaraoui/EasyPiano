# Story 1.2: Setup API Routes & Infrastructure Backend

Status: review

## Story

En tant que **développeur**,
Je veux mettre en place la structure des API Routes Next.js avec format de réponse standardisé, middleware d'authentification et error tracking,
Afin que le backend soit prêt à recevoir les endpoints métier (NFR-ARCH1).

## Acceptance Criteria

1. Le dossier `app/api/` existe avec un endpoint de santé (`app/api/health/route.js`) qui retourne `{ success: true, data: { status: "ok" } }`
2. Le format de réponse standard est défini dans un utilitaire : `{ success: boolean, data: object|null, error: string|null }`
3. Un middleware d'authentification `verifyAuth` est créé dans `src/services/auth.js` (vérifie token Firebase via Authorization header, retourne user + role)
4. L'alias `@/` pointe vers `src/` (déjà fait dans jsconfig.json — vérifier cohérence)
5. Sentry est initialisé pour error tracking (frontend dans `app/layout.jsx`, wrapper pour API Routes)

## Tasks / Subtasks

- [ ] Task 1 — Créer les utilitaires de réponse API (AC: #2)
  - [ ] 1.1 — Créer `src/lib/api-response.js` avec fonctions `successResponse(data)` et `errorResponse(message, status)`
  - [ ] 1.2 — Écrire les tests unitaires pour `successResponse` et `errorResponse` (format correct, edge cases, null/undefined)
  - [ ] 1.3 — Lancer les tests et confirmer qu'ils passent

- [ ] Task 2 — Créer l'endpoint health (AC: #1)
  - [ ] 2.1 — Créer `app/api/health/route.js` avec handler GET retournant `{ success: true, data: { status: "ok" } }`
  - [ ] 2.2 — Écrire un test pour l'endpoint health (vérifie format réponse, status 200)
  - [ ] 2.3 — Lancer les tests et confirmer qu'ils passent
  - [ ] 2.4 — Vérifier `npm run build` passe

- [ ] Task 3 — Créer le middleware d'authentification serveur (AC: #3)
  - [ ] 3.1 — Installer `firebase-admin`
  - [ ] 3.2 — Créer `src/services/firebase-admin.js` pour initialiser Firebase Admin SDK (utilise variable d'environnement `FIREBASE_ADMIN_CREDENTIAL`)
  - [ ] 3.3 — Ajouter `verifyAuth(request)` dans `src/services/auth.js` : extrait token du header Authorization, vérifie via Firebase Admin, retourne `{ uid, email, role }`
  - [ ] 3.4 — Créer `src/lib/api-middleware.js` avec `withAuth(handler)` wrapper qui appelle verifyAuth et retourne 401/403 si échec
  - [ ] 3.5 — Écrire les tests pour `verifyAuth` (token valide, token invalide, token absent, rôles)
  - [ ] 3.6 — Écrire les tests pour `withAuth` middleware (passe la requête si authentifié, bloque si non authentifié, vérifie rôle)
  - [ ] 3.7 — Lancer les tests et confirmer qu'ils passent

- [ ] Task 4 — Setup Sentry error tracking (AC: #5)
  - [ ] 4.1 — Installer `@sentry/nextjs`
  - [ ] 4.2 — Créer `src/lib/sentry.js` avec initialisation conditionnelle (seulement si `SENTRY_DSN` est défini)
  - [ ] 4.3 — Intégrer Sentry dans `app/layout.jsx` (init frontend)
  - [ ] 4.4 — Créer helper `captureApiError(error, context)` dans `src/lib/sentry.js` pour les API Routes
  - [ ] 4.5 — Écrire les tests : Sentry s'initialise si DSN présent, ne crash pas si DSN absent
  - [ ] 4.6 — Lancer les tests et confirmer qu'ils passent

- [ ] Task 5 — Mise à jour .env.example et validation finale (AC: #4, #1-5)
  - [ ] 5.1 — Mettre à jour `.env.example` avec les nouvelles variables : `FIREBASE_ADMIN_CREDENTIAL`, `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`
  - [ ] 5.2 — Lancer `npm run build` et confirmer build réussi
  - [ ] 5.3 — Lancer `npm run test` et confirmer TOUS les tests passent (anciens + nouveaux)
  - [ ] 5.4 — Lancer `npm run lint` et corriger les erreurs
  - [ ] 5.5 — Commit + push

## Dev Notes

### Architecture Requirements

**Source :** [architecture.md — API & Communication Patterns]

- **NFR-ARCH1** : Frontend communique via API REST uniquement (pas de Firebase SDK direct côté client sauf auth)
- Format réponse standard : `{ success: boolean, data: object|null, error: string|null }`
- Validation côté serveur uniquement (dans les API Routes)
- Log technique en anglais (`console.error`), message utilisateur en français
- Préfixe log : `[API]`, `[Auth]`, `[Stripe]`, `[DB]`

### Format réponse API — Spécification exacte

**Source :** [architecture.md — Core Architectural Decisions > API & Communication Patterns]

```javascript
// Succès
{ success: true, data: { ... }, error: null }

// Erreur
{ success: false, data: null, error: "Message lisible en français" }

// Liste
{ success: true, data: { items: [...], total: 42 }, error: null }
```

**Status HTTP :**
- `200` : succès
- `201` : création réussie
- `400` : erreur validation
- `401` : non authentifié
- `403` : non autorisé (mauvais rôle)
- `404` : ressource non trouvée
- `500` : erreur serveur

### Auth Guard Pattern

**Source :** [architecture.md — Implementation Patterns > Auth Guard Pattern]

```javascript
import { verifyAuth } from '@/services/auth';

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) return Response.json({ success: false, data: null, error: "Non autorisé" }, { status: 401 });
  if (user.role !== 'pro') return Response.json({ success: false, data: null, error: "Accès refusé" }, { status: 403 });
  // ... suite
}
```

### Firebase Admin SDK — Notes

Firebase Admin SDK nécessite un service account JSON. Options :
1. Variable d'environnement `FIREBASE_ADMIN_CREDENTIAL` contenant le JSON stringifié
2. Fichier `service-account.json` (JAMAIS commité — déjà dans .gitignore)

Pour les tests, Firebase Admin sera mocké (pas de vrai appel Firebase).

### Sentry — Notes

Sentry est conditionnel : s'initialise uniquement si `SENTRY_DSN` est défini dans les variables d'environnement. En dev sans DSN, Sentry est un no-op (pas de crash, pas d'erreur).

### Learnings de la story 1.1

- ESLint : utiliser `eslint-disable-next-line` pour les cas spéciaux (motion.div namespace)
- Le projet est en ESM : utiliser `export default` pas `module.exports`
- Pre-push hook vérifie lint + test + build — tout doit passer
- macOS filesystem case-insensitive : `UI/` et `ui/` sont le même dossier

### Services existants utilisables

- `src/services/firebase.js` — Initialisation Firebase client SDK (app, auth, database, storage)
- `src/services/auth.js` — Auth client (loginWithGoogle, logout, isAdmin) — à enrichir avec verifyAuth serveur
- `src/services/database.js` — CRUD Firebase RTDB complet

### Endpoints API prévus (pour les stories suivantes)

```text
POST   /api/auth/verify          ← Story 1.2 (ce fichier)
GET    /api/health               ← Story 1.2 (ce fichier)
POST   /api/search               ← Story 5.1
GET    /api/pros/[proId]         ← Story 5.3
POST   /api/booking/create       ← Story 6.2
...
```

### Project Structure Notes

- `app/api/` n'existe pas encore — à créer
- Les API Routes Next.js utilisent le pattern `export async function GET/POST(request)` dans `route.js`
- Chaque route est un fichier `route.js` dans un dossier nommé
- Les services `src/services/` sont importés par les API Routes

### Anti-Patterns

**Source :** [architecture.md — Anti-Patterns]

- ❌ NE PAS accéder à Firebase RTDB directement dans les API Routes — utiliser `src/services/database.js`
- ❌ NE PAS exposer les erreurs techniques aux utilisateurs — message français lisible
- ❌ NE PAS utiliser `console.log` en production — uniquement `console.error` avec préfixe
- ❌ NE PAS faire de default exports pour les services

### References

- [Source: architecture.md — API & Communication Patterns, Auth Guard Pattern, Implementation Patterns]
- [Source: epics.md — Epic 1, Story 1.2]
- [Source: src/services/auth.js — auth client actuel]
- [Source: src/services/firebase.js — init Firebase SDK]
- [Source: 1-1-migration-design-system.md — learnings]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
