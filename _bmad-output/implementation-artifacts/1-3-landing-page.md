# Story 1.3: Landing Page

Status: review

## Story

En tant que **visiteur**,
Je veux voir une landing page élégante et professionnelle,
Afin de comprendre immédiatement qu'EasyPiano est la solution pour trouver un accordeur.

## Acceptance Criteria

1. Un hero plein écran s'affiche avec fond sombre, le titre "On accorde votre piano" (Playfair Display) et une barre de recherche (lieu + date) au centre
2. La barre de recherche est visible mais non fonctionnelle (redirige vers `/search` au submit)
3. En scrollant, des sections apparaissent avec animations ScrollReveal : "Comment ça marche" (3 étapes), "Pourquoi nous faire confiance" (curation physique, badge validé), "Devenez accordeur" (CTA)
4. Le Header contient le logo et un lien "Connexion"
5. Le Footer contient "Devenez accordeur", mentions légales, contact
6. La page est SSR (rendu serveur pour SEO)
7. Lighthouse Performance Score > 80
8. FCP < 1.5s
9. La page est responsive mobile-first (boutons 44x44px, typography 16px min)
10. Les contrastes respectent WCAG 2.1 AA (4.5:1)

## Tasks / Subtasks

- [ ] Task 1 — Charger les fonts Google via next/font (AC: #1)
  - [ ] 1.1 — Configurer Playfair Display et Inter via `next/font/google` dans `app/layout.jsx`
  - [ ] 1.2 — Appliquer les classes font sur `<html>` ou `<body>`
  - [ ] 1.3 — Vérifier que les fonts se chargent (build + dev)
  - [ ] 1.4 — Test : vérifier que layout.jsx rend correctement avec les fonts

- [ ] Task 2 — Réécrire le Header avec Tailwind (AC: #4)
  - [ ] 2.1 — Migrer `src/components/Layout/Header.jsx` vers classes Tailwind (fond sombre, sticky, backdrop-blur)
  - [ ] 2.2 — Logo "EasyPiano" avec font-heading (Playfair Display)
  - [ ] 2.3 — Navigation responsive (desktop: inline, mobile: hamburger ou simplifié)
  - [ ] 2.4 — Tests : render du Header, présence logo, lien Connexion, états auth/non-auth

- [ ] Task 3 — Réécrire le Footer avec Tailwind (AC: #5)
  - [ ] 3.1 — Migrer `src/components/Layout/Footer.jsx` vers classes Tailwind
  - [ ] 3.2 — Ajouter : lien "Devenez accordeur" (→ formulaire pro), mentions légales, email contact
  - [ ] 3.3 — Tests : render du Footer, présence liens obligatoires, copyright

- [ ] Task 4 — Réécrire la Landing Page hero (AC: #1, #2)
  - [ ] 4.1 — Réécrire `app/page.jsx` avec Tailwind : hero plein écran fond `bg-background`, titre "On accorde votre piano" en `font-heading text-5xl md:text-7xl`
  - [ ] 4.2 — Ajouter la barre de recherche hero : 2 champs (lieu + date) avec composants Input et Button shadcn/ui, form submit → redirect `/search`
  - [ ] 4.3 — Tests : render de la page, titre exact "On accorde votre piano", présence barre de recherche, submit redirige vers /search

- [ ] Task 5 — Section "Comment ça marche" avec ScrollReveal (AC: #3)
  - [ ] 5.1 — Section 3 étapes avec icônes/numéros, titres, descriptions (Tailwind grid)
  - [ ] 5.2 — Wrapper ScrollReveal sur chaque étape avec delay progressif
  - [ ] 5.3 — Tests : render des 3 étapes, titres corrects ("Recherchez", "Réservez", "Profitez")

- [ ] Task 6 — Section "Pourquoi nous faire confiance" avec ScrollReveal (AC: #3)
  - [ ] 6.1 — Grille de 4 trust items avec icônes Lucide, titres, descriptions (Card shadcn/ui)
  - [ ] 6.2 — Contenu : "Pros vérifiés physiquement", "Prix fixe 150 CHF", "Paiement sécurisé", "Réservation instantanée"
  - [ ] 6.3 — Wrapper ScrollReveal
  - [ ] 6.4 — Tests : render des 4 items, textes corrects

- [ ] Task 7 — Section CTA "Devenez accordeur" (AC: #3)
  - [ ] 7.1 — Section avec fond card, titre, description, bouton CTA variant secondary → `/login` (ou future page inscription pro)
  - [ ] 7.2 — Wrapper ScrollReveal
  - [ ] 7.3 — Tests : render du CTA, lien correct

- [ ] Task 8 — Responsive + accessibilité + performance (AC: #7, #8, #9, #10)
  - [ ] 8.1 — Vérifier responsive mobile-first : hero, grilles, boutons 44x44px min
  - [ ] 8.2 — Vérifier contrastes WCAG AA (texte foreground sur background = #fafafa sur #0a0a0a = ratio 19.3:1 ✅)
  - [ ] 8.3 — Ajouter aria-labels sur la barre de recherche et les sections
  - [ ] 8.4 — Vérifier navigation clavier (Tab entre les éléments interactifs)
  - [ ] 8.5 — `npm run build` passe
  - [ ] 8.6 — `npm run test` — tous les tests passent
  - [ ] 8.7 — `npm run lint` — aucune erreur

## Dev Notes

### Design Direction

**Source :** [ux-design-specification.md — Design Directions + Defining Experience]

Direction retenue : **"Piano Noir + Depth Stage"**
- Minimalisme extrême sur fond sombre (#0a0a0a)
- Titre "On accorde votre piano" en Playfair Display 64px (desktop) / 36px (mobile)
- Barre de recherche glassmorphism au centre du hero
- Scroll storytelling Apple-level avec ScrollReveal

### Hero — Spécification

Le hero est plein écran (`min-h-screen`) avec :
- Fond `bg-background` (#0a0a0a)
- Titre centré : "On accorde votre piano" en `font-heading` champagne
- Sous-titre : description courte en `text-muted`
- Barre de recherche : 2 champs (lieu + date) + bouton "Rechercher"
- La barre redirige vers `/search?lieu={lieu}&date={date}` au submit (non fonctionnelle côté API, juste navigation)

**Note :** Pas d'image de piano pour le MVP (pas d'asset disponible). Design épuré texte + recherche. L'image sera ajoutée plus tard.

### Sections scroll — Spécification

**"Comment ça marche" :**
1. Recherchez — "Entrez votre ville et la date souhaitée"
2. Réservez — "Choisissez un accordeur et payez en ligne"
3. Profitez — "Un pro vient accorder votre piano chez vous"

**"Pourquoi nous faire confiance" :**
- Pros vérifiés physiquement par notre équipe (icône ShieldCheck)
- Prix fixe 150 CHF, zéro surprise (icône Banknote)
- Paiement sécurisé via Stripe (icône Lock)
- Réservation instantanée en 2 minutes (icône Clock)

**CTA "Devenez accordeur" :**
- "Vous êtes accordeur de piano ? Rejoignez EasyPiano"
- Bouton → futur formulaire inscription pro

### Fonts via next/font

```jsx
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
```

Appliquer `${playfair.variable} ${inter.variable}` sur `<html>` et `font-body` comme classe par défaut.

### Composants disponibles

- `ScrollReveal` — `src/components/animations/ScrollReveal.jsx` (props: children, className, delay)
- `Button` — `src/components/UI/button.jsx` (variants: default/secondary/ghost, sizes: sm/default/lg)
- `Input` — `src/components/UI/input.jsx`
- `Card` — `src/components/UI/card.jsx` (Card, CardHeader, CardTitle, CardDescription, CardContent)
- `Badge` — `src/components/UI/badge.jsx`
- Lucide icons — `lucide-react` (ShieldCheck, Banknote, Lock, Clock, Search, Piano, etc.)

### Anti-Patterns

- ❌ NE PAS utiliser d'emojis comme icônes (utiliser Lucide)
- ❌ NE PAS utiliser les anciennes classes CSS (.hero, .steps, etc.) — elles n'existent plus
- ❌ NE PAS ajouter de logic métier dans la landing (c'est une page SSR statique)
- ❌ NE PAS importer de composants "use client" inutilement dans la page SSR (sauf SearchBar qui a un form)

### Learnings stories précédentes

- ESLint : `eslint-disable-next-line no-unused-vars` pour les imports motion.div
- Projet ESM : `export default` pas `module.exports`
- Prettier reformate automatiquement au commit (lint-staged)
- macOS case-insensitive : `UI/` = `ui/` — les composants shadcn sont dans `src/components/UI/`

### References

- [Source: ux-design-specification.md — Executive Summary, Core User Experience, Design Directions, Visual Foundation, Defining Experience]
- [Source: architecture.md — Frontend Architecture (SSR landing), Rendering Strategy]
- [Source: epics.md — Epic 1, Story 1.3]
- [Source: app/page.jsx — landing page actuelle à réécrire]
- [Source: src/components/Layout/Header.jsx — header actuel à migrer]
- [Source: src/components/Layout/Footer.jsx — footer actuel à migrer]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
