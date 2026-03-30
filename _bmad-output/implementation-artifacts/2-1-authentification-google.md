# Story 2.1: Authentification Google

Status: ready-for-dev

## Story

En tant que **visiteur**,
Je veux me connecter avec mon compte Google en 1 clic,
Afin de pouvoir accéder aux fonctionnalités réservées (réservation, dashboard).

## Acceptance Criteria

1. Sur `/login`, un bouton "Se connecter avec Google" déclenche le popup Firebase Auth
2. Après connexion, un profil `users/{userId}` est créé dans Firebase RTDB avec : email, displayName, photoURL, role="client", isB2B=false, createdAt
3. L'AuthContext expose : user, loading, signIn, signOut
4. L'utilisateur est redirigé vers la page d'origine ou `/dashboard`
5. Les composants ProtectedRoute et AdminRoute fonctionnent correctement

## Tasks / Subtasks

- [ ] Task 1 — Migrer la page Login vers Tailwind (AC: #1)
  - [ ] 1.1 — Réécrire src/views/Login.jsx avec classes Tailwind + composant Button shadcn/ui
  - [ ] 1.2 — Tests : render login, bouton Google présent, redirect si déjà connecté

- [ ] Task 2 — Mettre à jour le modèle utilisateur (AC: #2)
  - [ ] 2.1 — Ajouter le champ `isB2B: false` dans la création user de loginWithGoogle()
  - [ ] 2.2 — Tests : vérifier la structure du user créé (mock Firebase)

- [ ] Task 3 — Tester AuthProvider et hooks (AC: #3)
  - [ ] 3.1 — Tests AuthProvider : fournit user/loading/isAdmin
  - [ ] 3.2 — Tests useAuth : retourne le contexte, erreur hors Provider

- [ ] Task 4 — Tester ProtectedRoute et AdminRoute (AC: #5)
  - [ ] 4.1 — Tests ProtectedRoute : affiche enfants si connecté, redirige si non connecté
  - [ ] 4.2 — Tests AdminRoute : affiche si admin, redirige si non admin, redirige si non connecté

- [ ] Task 5 — Validation (AC: #1-5)
  - [ ] 5.1 — npm run lint ✅
  - [ ] 5.2 — npm run test ✅
  - [ ] 5.3 — npm run build ✅
  - [ ] 5.4 — Commit + push

## Dev Notes

- L'auth Firebase fonctionne déjà (loginWithGoogle, logout, AuthProvider, ProtectedRoute, AdminRoute)
- Le rôle admin est vérifié via `/admins/{uid}` dans RTDB (pas des custom claims pour le MVP)
- La migration Tailwind est le principal changement de code
- Les tests sont le gros du travail — chaque composant auth doit être testé

## Dev Agent Record

### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
