# Story 1.4: CI/CD & Monitoring

Status: ready-for-dev

## Story

En tant que **développeur**,
Je veux que le pipeline CI/CD et le monitoring soient opérationnels et documentés,
Afin que chaque déploiement soit validé automatiquement et les erreurs trackées.

## Acceptance Criteria

1. Le pipeline GitHub Actions exécute lint + test + build + deploy sur push à `main`
2. Sentry capture les erreurs frontend et backend avec source maps
3. Les backups Firebase RTDB sont documentés (script export quotidien)
4. `.env.example` documente toutes les variables d'environnement requises

## Tasks / Subtasks

- [ ] Task 1 — Vérifier et documenter le pipeline CI/CD (AC: #1)
  - [ ] 1.1 — Vérifier que le workflow GitHub Actions inclut : lint, test, build, deploy
  - [ ] 1.2 — Ajouter les nouvelles variables d'environnement au workflow (SENTRY_DSN, FIREBASE_ADMIN_CREDENTIAL)
  - [ ] 1.3 — Écrire un test qui vérifie que le .env.example contient toutes les variables attendues

- [ ] Task 2 — Documenter et scripter les backups Firebase (AC: #3)
  - [ ] 2.1 — Créer un script `scripts/backup-firebase.sh` pour export RTDB
  - [ ] 2.2 — Documenter la procédure dans le .env.example ou un commentaire

- [ ] Task 3 — Validation finale Epic 1 (AC: #1-4)
  - [ ] 3.1 — `npm run build` passe
  - [ ] 3.2 — `npm run test` — tous les tests passent
  - [ ] 3.3 — `npm run lint` — aucune erreur
  - [ ] 3.4 — Commit + push

## Dev Notes

### État actuel CI/CD
- GitHub Actions : `.github/workflows/firebase-deploy.yml` — lint + test + build + deploy Firebase Hosting ✅
- Husky pre-commit : lint-staged (eslint --fix + prettier) ✅
- Husky pre-push : lint + test + build ✅
- Sentry : initialisé conditionnellement (story 1.2) ✅
- .env.example : mis à jour avec toutes les variables (story 1.2) ✅

### Ce qui manque
- Variables CI pour Sentry et Firebase Admin dans le workflow GitHub Actions
- Script de backup Firebase RTDB
- Test de validation .env.example

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
