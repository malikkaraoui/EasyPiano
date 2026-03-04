# Architecture EasyPiano — Web App

## Objectif

Construire une application web robuste, rapide à livrer et strictement alignée avec le briefing MVP.

## Stack retenue

- React 19 + Vite
- Firebase (Auth, Realtime Database, Storage, Hosting)
- Stripe Connect
- Vitest + React Testing Library

## Décisions produit appliquées (briefing)

- Langue de lancement: **FR uniquement**
- Auth MVP: **Google Auth uniquement**
- Annulation sans frais: **jusqu'à 10 jours avant l'intervention**
- Supplément « piano en mauvais état »: **hors MVP**
- Référencement pro: **validation interne complète** (pièces + rencontre physique)

## Structure technique

- `src/app/`
  - `providers/` : providers globaux (router, auth)
  - `router/` : routes applicatives
- `src/components/` : UI réutilisable et composants de layout
- `src/pages/` : pages métier
- `src/services/` : accès Firebase/Stripe
- `src/hooks/` : hooks de domaine
- `src/shared/` : règles métier et constantes transversales
- `src/utils/` : helpers purs (format, validation, etc.)

## Principes d'architecture

- **Feature-first pragmatique**: séparation claire entre composition app, pages et services.
- **Règles métier centralisées**: éviter la duplication dans les pages.
- **Web-first**: toute décision technique sert la qualité du produit web.
- **Évolutif**: possibilité d'extraire des modules partagés plus tard, sans complexifier le MVP.
