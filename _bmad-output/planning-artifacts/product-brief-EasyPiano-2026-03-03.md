---
stepsCompleted: [1, 2, 3, 4, 5, 6]
status: complete
inputDocuments: ['brainstorming-session-2026-03-03-1300.md']
date: 2026-03-03
author: Malik
---

# Product Brief: EasyPiano

## Executive Summary

EasyPiano est une plateforme de réservation en ligne qui connecte les propriétaires de piano en Europe occidentale avec des accordeurs qualifiés d'Europe de l'Est. Face à une pénurie critique d'accordeurs dans des pays comme la Suisse, la France et l'Allemagne — métier en voie de disparition faute de renouvellement — EasyPiano exploite le libre-échange européen pour organiser une main-d'œuvre qualifiée mais sous-exploitée. La plateforme propose un prix disruptif de 125 CHF (contre 230 CHF sur le marché traditionnel), un système de réservation instantanée par demi-journée, et un paiement en ligne via Stripe. Chaque accordeur est personnellement rencontré et validé par l'équipe, garantissant un niveau de confiance premium. EasyPiano opère sur un marché 100% vierge en digital.

---

## Core Vision

### Problem Statement

Le métier d'accordeur de piano est en voie de disparition en Europe occidentale. Le manque de renouvellement dans la formation a créé une pénurie massive de professionnels qualifiés en Suisse, France, Allemagne et Luxembourg. Parallèlement, le secteur reste ultra-traditionnel : pas de présence digitale, paiement en espèces ou facture à 10 jours, aucune organisation structurée. Les propriétaires de piano peinent à trouver un accordeur disponible, et quand ils en trouvent un, le prix est élevé (230 CHF en Suisse).

### Problem Impact

- Les propriétaires de piano n'ont pas accès facilement à des accordeurs qualifiés
- Les pianos non entretenus se dégradent, entraînant des coûts de remise en état plus élevés
- Les accordeurs qualifiés d'Europe de l'Est n'ont aucun canal organisé pour accéder à cette demande
- Un métier artisanal risque de disparaître faute de structuration et de modernisation

### Why Existing Solutions Fall Short

Il n'existe aucune solution digitale sur ce marché. Zéro. Les propriétaires de piano trouvent un accordeur par le bouche-à-oreille, par des annuaires locaux obsolètes, ou par chance. Il n'y a pas de comparaison de disponibilité, pas de système d'avis, pas de booking en ligne, pas de paiement dématérialisé. Le marché est entièrement vierge en digital — c'est un secteur qui n'a jamais connu sa transformation numérique.

### Proposed Solution

EasyPiano est une plateforme web responsive qui :

- **Organise l'offre** : recrute et valide personnellement des accordeurs qualifiés d'Europe de l'Est qui effectuent des tournées en Europe occidentale
- **Simplifie la demande** : permet aux propriétaires de piano de rechercher par lieu + date, voir les pros disponibles, et réserver instantanément en demi-journée
- **Automatise le paiement** : paiement en ligne via Stripe au moment de la réservation (125 CHF), fin du cash et des factures
- **Casse le prix** : 125 CHF au lieu de 230 CHF grâce à une main-d'œuvre dont le coût de vie est plus bas, tout en restant très attractive pour les pros (~112.50 CHF net par accordage, ~1 700-2 000 CHF net par semaine de tournée)

### Key Differentiators

1. **Marché vierge** — Aucun concurrent digital, premier arrivé sur un marché non-digitalisé
2. **Curation humaine** — Chaque accordeur est rencontré physiquement par l'équipe, pas de marketplace ouverte
3. **Disruption de prix** — Presque 50% moins cher que le marché grâce au sourcing en Europe de l'Est
4. **Modèle de tournées** — Les pros publient leurs disponibilités 6 mois à l'avance, les clients réservent instantanément
5. **Win-win structurel** — Le client paie moins cher, le pro gagne bien sa vie, EasyPiano prend 10% de commission

---

## Target Users

### Primary Users

**Persona 1 : Sophie, 42 ans — Propriétaire de piano à Lausanne**

- **Contexte** : Sophie a un piano droit Yamaha dans son salon. Ses deux enfants prennent des cours. Le piano n'a pas été accordé depuis 18 mois parce qu'elle ne trouve personne de disponible.
- **Problème vécu** : Elle a cherché sur Google, demandé à l'école de musique, posté sur des forums. Les rares accordeurs locaux sont bookés 3 mois à l'avance et facturent 230 CHF. Elle a fini par abandonner temporairement.
- **Motivation** : Trouver un accordeur qualifié rapidement, à un prix raisonnable, sans galère.
- **Moment "aha!"** : Elle tape "Lausanne" + une date sur EasyPiano, voit 3 pros disponibles dans 2 semaines, réserve en 2 minutes et paie 125 CHF. Terminé.
- **Parcours** : Découvre EasyPiano via Google ou bouche-à-oreille → recherche lieu + date → voit les pros dispos → consulte le profil (avis, certificats) → réserve et paie → reçoit une notification la veille → Jour J, le pro arrive → elle laisse un avis.

**Persona 2 : Tomasz, 35 ans — Accordeur professionnel à Cracovie (Pologne)**

- **Contexte** : Tomasz est accordeur depuis 12 ans, formé au conservatoire. En Pologne, il gagne ~800 PLN (~180 CHF) par semaine. Il parle polonais, anglais et un peu de français.
- **Problème vécu** : Il sait que la demande est énorme en Suisse et en France, mais il n'a aucun moyen de se faire connaître là-bas. Il a essayé des groupes Facebook sans succès.
- **Motivation** : Accéder à un marché lucratif, organiser des tournées régulières, gagner ~1 700-2 000 CHF net par semaine de tournée.
- **Moment "aha!"** : Il s'inscrit sur EasyPiano, son profil est validé, il déclare une tournée d'une semaine à Genève-Lausanne, et en quelques jours ses créneaux se remplissent.
- **Parcours** : Découvre le lien "Devenez accordeur" → s'inscrit (photo, bio, certificats) → rencontre avec l'équipe EasyPiano → profil validé → publie ses disponibilités + rayon d'action → les réservations tombent → il organise son transport/hôtel → tournée → il répond aux avis et messages.

### Secondary Users

**L'équipe Admin EasyPiano (Malik et son équipe)**

- Valide les profils des nouveaux pros
- Gère les situations d'urgence (pro indisponible → trouver un remplaçant)
- Accède au dashboard Stripe pour suivre les transactions
- Interface avec les clients et pros en cas de litige

### User Journey

| Étape | Client (Sophie) | Pro (Tomasz) |
| --- | --- | --- |
| **Découverte** | Google, bouche-à-oreille | Lien "Devenez accordeur" en bas de page |
| **Inscription** | Google Auth ou SMS | Formulaire pro (photo, bio, certificats) |
| **Onboarding** | Recherche immédiate lieu + date | Validation par l'équipe EasyPiano |
| **Usage principal** | Rechercher → Voir profils → Réserver → Payer | Publier dispos → Recevoir réservations → Tournée |
| **Moment de valeur** | Piano accordé à 125 CHF, sans galère | Semaine de tournée à 1 700+ CHF net |
| **Long terme** | Re-réserve chaque année, recommande | Tournées régulières, revenu complémentaire stable |

---

## Success Metrics

### User Success

- **Satisfaction client** : Note moyenne des avis > 4.5/5 — la confiance est le pilier central
- **Taux de re-réservation** : Un client qui revient = la preuve ultime que ça marche
- **Taux de complétion du parcours** : Recherche → Réservation → Paiement sans abandon

### Business Objectives

**Phase de lancement (0-6 mois) : Test de marché**

- Objectif : Valider l'adéquation produit-marché (product-market fit)
- Approche : Lancer aussi vite que possible, observer, sentir le marché
- Pas de cibles chiffrées rigides — c'est un premier essai
- Signal positif : Les réservations arrivent organiquement, les clients reviennent

**Phase de croissance (6+ mois) : Si ça prend, on fonce**

- Définir les cibles chiffrées en fonction des données réelles du test
- Scaler le nombre de pros et les zones géographiques

### Key Performance Indicators

| KPI | Ce qu'on mesure | Pourquoi |
| --- | --- | --- |
| Note moyenne client | Satisfaction et confiance | Pilier central du projet |
| Nombre de réservations/mois | Traction du marché | Indicateur #1 que ça prend |
| Taux de remplissage des créneaux | Attractivité pour les pros | Si les créneaux se remplissent, le modèle tient |
| Taux de re-réservation | Rétention client | Valide la valeur perçue |
| Nombre de pros actifs | Capacité de l'offre | On doit avoir assez de pros pour couvrir la demande |
| Feedback pro (contact direct) | Satisfaction accordeurs | Relation directe et continue avec les pros |

### Philosophie Métriques

> Pas de sur-ingénierie. On lance, on observe, on ajuste. Les vrais KPIs émergeront des données réelles du terrain. Pour l'instant, un seul signal compte : **est-ce que les gens réservent et sont satisfaits ?**

---

## MVP Scope

### Core Features

**1. Site vitrine (Page d'accueil)**

- Héro plein écran piano à queue, thème sombre
- Animations scroll façon Apple
- Contenu : atouts, confiance, équipe, métier d'accordeur, 3 étapes
- Barre de recherche lieu + date
- Footer avec "Devenez accordeur"
- Langue : FR uniquement

**2. Recherche & Résultats**

- Recherche par lieu + date (point d'entrée verrouillé)
- Affichage des pros disponibles pour ce créneau/lieu
- Profil pro : photo, bio, pays, langues, note, commentaires, certificats, nombre d'interventions

**3. Réservation & Paiement**

- Créneaux demi-journée (matin/après-midi)
- Réservation instantanée (pas de confirmation pro)
- Récapitulatif avant paiement
- Paiement via Stripe Checkout (125 CHF)
- Commission 10% via Stripe Connect

**4. Authentification Client**

- Google Auth via Firebase SDK
- Création de compte client (nom, prénom, photo de profil)

**5. Dashboard Client**

- Prochains RDV
- Historique des réservations
- Annulation sans frais jusqu'à X jours avant
- Messagerie vers le pro et la plateforme
- Notifications par email
- Gestion profil (modifier/supprimer compte)

**6. Inscription & Dashboard Pro**

- Page "Devenez accordeur" (inscription : photo, bio, certificats, langues)
- Validation par admin EasyPiano
- Publier ses disponibilités (dates + rayon géographique, 6 mois à l'avance)
- Configurer capacité (accordages par demi-journée)
- Consulter emploi du temps
- Répondre aux commentaires
- Répondre aux messages
- Modifier profil
- Stripe Connect onboarding

**7. Système d'avis**

- Client note le pro après intervention (1-5 étoiles + commentaire)
- Pro répond aux avis
- Note moyenne affichée sur le profil

**8. Admin**

- Validation des profils pro (via Firebase RTDB directement ou interface simple)
- Accès dashboard Stripe

### Out of Scope pour le MVP

- Auth par SMS (code)
- Validation numéro de téléphone
- Notifications SMS
- Langues EN et DE (v2)
- Supplément piano mauvais état (lien Stripe à la demande — v2)
- App native
- Recherche par nom d'accordeur
- Mécanisme automatisé de remplacement si pro indisponible

### MVP Success Criteria

- Les réservations arrivent organiquement
- Les clients laissent des avis positifs (> 4.5/5)
- Les créneaux des pros se remplissent
- Le parcours recherche → réservation → paiement fonctionne sans friction
- Zéro problème de paiement Stripe

### Future Vision

- Multilingue FR/EN/DE
- Auth SMS + notifications SMS
- Supplément piano (lien Stripe à la demande)
- Recherche par nom d'accordeur
- Expansion géographique (toute la Suisse, France, Allemagne)
- App mobile (PWA ou native)
- Système de remplacement automatisé
- Analytics et reporting avancés

---

## Existing Codebase Leverage

### PLANIZZA — Projet de référence

Le projet PLANIZZA (marketplace pizza food trucks) partage la même stack et architecture. Les éléments suivants seront adaptés pour EasyPiano :

| Composant PLANIZZA | Adaptation EasyPiano |
| --- | --- |
| Firebase Auth (Google OAuth) + AuthProvider | Réutilisation directe |
| Stripe Connect + Cloud Functions (checkout, webhooks) | Adapter montant fixe 125 CHF |
| features/ structure avec hooks | Même architecture |
| Composants UI (Button, Card, Input, Badge, StarRating) | Réutilisation + re-theming sombre |
| Système d'avis (useReviews, useReviewReply) | Adapter truck → accordeur |
| Profil pro + dashboard | Adapter pizzaiolo → accordeur |
| Profil client + gestion de compte | Réutilisation quasi-directe |
| Layout (Navbar, Footer, RootLayout) | Re-design thème sombre |
| Protected Routes | Réutilisation directe |
| ImageUploader | Réutilisation directe |
| LocationSearch / geo.js | Adapter villes FR → CH/FR/DE |
