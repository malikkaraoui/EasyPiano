# EasyPiano

Plateforme de mise en relation entre particuliers et accordeurs de piano professionnels.

## Stack

- React 19 + Vite
- Firebase (Auth, Realtime Database, Storage, Hosting)
- Stripe Connect (commission 10%)
- Vitest + React Testing Library

## Setup

```bash
npm install
cp .env.example .env
# Remplir les clés Firebase et Stripe dans .env
npm run dev
```

## Scripts

- `npm run dev` — Dev server
- `npm run build` — Build production
- `npm run test` — Tests
- `npm run lint` — ESLint
- `npm run format` — Prettier

## Architecture (web app)

- `src/app` — Composition globale (providers + router)
- `src/components` — Composants UI web
- `src/pages` — Pages web
- `src/services` — Firebase / Stripe
- `src/shared` — Constantes/règles métier côté web

Voir `docs/architecture-web-app.md` pour le détail.
