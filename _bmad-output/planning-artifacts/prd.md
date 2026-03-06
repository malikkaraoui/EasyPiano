---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional']
inputDocuments: ['product-brief-EasyPiano-2026-03-03.md', 'market-piano-tuning-marketplace-research-2026-03-04.md', 'brainstorming-session-2026-03-03-1300.md', 'architecture-web-app.md']
workflowType: 'prd'
documentCounts:
  briefs: 1
  research: 1
  brainstorming: 1
  projectDocs: 1
classification:
  projectType: 'web_app'
  domain: 'marketplace_services'
  complexity: 'medium'
  projectContext: 'brownfield'
techStack:
  frontend: 'Next.js 15 + App Router (React 19)'
  backend: 'Node.js (Next.js API Routes + Firebase Functions)'
  database: 'Firebase Realtime Database'
  auth: 'Firebase Auth (Google, Email, SMS)'
  storage: 'Firebase Storage'
  payment: 'Stripe Connect + Stripe Checkout'
  hosting: 'Firebase Hosting (ou Vercel)'
---

# Product Requirements Document - EasyPiano

**Author:** Malik
**Date:** 2026-03-04

## Executive Summary

EasyPiano est une plateforme de réservation en ligne qui connecte les propriétaires de piano en Europe occidentale (Suisse, France, Allemagne) avec des accordeurs qualifiés d'Europe de l'Est. Face à une pénurie critique d'accordeurs — le nombre de techniciens certifiés a baissé de 15% entre 2021 et 2024 et le métier est en voie de disparition faute de renouvellement — EasyPiano exploite le libre-échange européen pour organiser une main-d'œuvre qualifiée mais sous-exploitée. La plateforme propose un prix disruptif de 125 CHF (contre 180-230 CHF sur le marché traditionnel), un système de réservation instantanée par demi-journée avec paiement en ligne via Stripe Connect (commission 10%), et une curation physique de chaque professionnel (rencontré personnellement par l'équipe avant validation). EasyPiano opère sur un marché 100% vierge en digital — aucune plateforme de booking spécialisée n'existe en Europe continentale.

**Fondateurs :** Jérôme (musicien 30 ans, expertise métier, réseau établi, étude de marché préalable) + Malik (exécution produit/tech). Lancement prévu : bassin lémanique (Genève-Lausanne), expansion progressive Suisse romande/alémanique puis France et Allemagne.

**Marché :** ~540M USD en Europe (30% du marché global de 1.8 milliards USD), croissance projetée 4.2% CAGR. Estimation 200 000-400 000 pianos en Suisse, 800 000+ en France, 800 000 en Allemagne. Besoin récurrent 1-2 accordages/an. Recherche actuelle 100% analogique (bouche-à-oreille, annuaires obsolètes, appels téléphoniques).

### Ce qui rend EasyPiano spécial

**1. Marché vierge avec free-mover advantage radical**
Aucune plateforme de booking spécialisée en accordage piano n'existe en Europe continentale. La recherche web confirme : PianoSphere (UK, directory sans booking), Gazelle (SaaS B2B pour pros), Thumbtack/TaskRabbit (US, généralistes), Check24 (Allemagne, pas de vertical piano). Les accordeurs ont des sites individuels non référencés, zéro agrégation. Le marché est fragmenté, analogique, et attend sa transformation digitale.

**2. Confiance comme moat — le "Booking.com de l'accordage"**
Dans un secteur où le client laisse un inconnu seul chez lui avec un instrument de 5 000-100 000+ CHF, la confiance est le facteur de décision #1. EasyPiano construit ce moat via :

- Curation physique : chaque pro rencontré en personne par Jérôme avant validation
- Profils vérifiés : certificats, langues, avis clients, nombre d'interventions
- Badge "Validé par EasyPiano" = signal de confiance transféré vers la plateforme
- Système d'avis unilatéral (seuls les clients ayant réservé peuvent noter)

La promesse : "Tu as choisi EasyPiano = tu as fait ton choix de confiance."

**3. Disruption de prix structurelle**
125 CHF vs 180-230 CHF (réduction de 30-45%) grâce au sourcing transfrontalier. Le pro gagne ~112.50 CHF net par accordage (~1 700-2 000 CHF net/semaine de tournée), très attractif comparé au coût de vie en Europe de l'Est. Win-win structurel : client paie moins, pro gagne bien, plateforme prend 10%.

**4. Modèle de tournées — solution à la pénurie**
Les pros publient leurs disponibilités 6 mois à l'avance, organisent des tournées d'une semaine, les créneaux se remplissent instantanément. Ce modèle résout la saisonnalité (novembre-juin = haute demande, délais 3-6 semaines actuellement) et couvre les zones rurales/périurbaines délaissées par les accordeurs locaux.

**Core insight :** Le problème s'aggrave structurellement (-15% d'accordeurs en 3 ans, pas de renouvellement), aucune infrastructure digitale n'existe, et la fenêtre européenne (libre circulation) permet une solution unique. C'est un secteur qui n'a jamais connu sa transformation numérique.

## Classification du Projet

**Type de projet :** Web App (SPA React 19 + Vite)
**Domaine :** Marketplace de services
**Complexité :** Moyenne
**Contexte projet :** Brownfield (architecture Firebase + Stripe Connect déjà initiée avec Copilot)

**Stack technique :** React 19 + Vite, Firebase (Auth/Realtime Database/Storage/Hosting), Stripe Connect, Vitest + React Testing Library.

**Décisions produit MVP :** Lancement FR uniquement, Google Auth uniquement, annulation sans frais jusqu'à 10 jours avant, supplément "piano en mauvais état" hors MVP, référencement pro avec validation interne complète (pièces + rencontre physique).

## Critères de Succès

### Succès Utilisateur

**Client (Sophie) — Moment de succès :**
Le client tape son lieu + date, voit des pros disponibles dans les 2 semaines, réserve et paie en moins de 3 minutes. Le jour J, le pro arrive, accorde le piano. Le client laisse un avis et re-réserve l'année suivante en 1 clic.

| Métrique | Cible MVP | Mesure |
| --- | --- | --- |
| Note moyenne des avis | > 4.5/5 | Firebase RTDB - calcul automatique |
| Taux de complétion recherche → paiement | > 60% | Analytics funnel |
| Taux de re-réservation annuelle | Signal positif = clients qui reviennent | Tracking par userId |
| Temps recherche → confirmation | < 3 minutes | Timestamp parcours |

**Pro (Tomasz) — Moment de succès :**
Le pro publie une tournée d'une semaine, ses créneaux se remplissent en quelques jours, il gagne ~1 700-2 000 CHF net sur la semaine.

| Métrique | Cible MVP | Mesure |
| --- | --- | --- |
| Taux de remplissage des créneaux | Signal positif = créneaux qui se remplissent | Ratio réservés/disponibles |
| Satisfaction pro | Feedback direct (contact Jérôme) | Qualitatif — relation directe |
| Revenu net par semaine de tournée | ~1 700-2 000 CHF | Données Stripe Connect |

### Succès Business

**Philosophie :** Pas de sur-ingénierie. On lance, on observe, on ajuste. Les vrais KPIs émergeront des données terrain.

**Phase lancement (0-6 mois) — Test de marché :**

- Signal #1 : Les réservations arrivent (organiquement ou via acquisition ciblée)
- Signal #2 : Les clients laissent des avis positifs
- Signal #3 : Les créneaux des pros se remplissent
- Signal #4 : Les pros veulent revenir pour une nouvelle tournée
- Pas de cibles chiffrées rigides — c'est un premier essai

**Phase croissance (6+ mois) — Si ça prend, on fonce :**

- Définir les cibles chiffrées à partir des données réelles
- Scaler le nombre de pros et les zones géographiques
- Objectif structurel : devenir le réflexe #1 quand un propriétaire de piano cherche un accordeur

**KPIs de référence :**

| KPI | Ce qu'on mesure | Pourquoi |
| --- | --- | --- |
| Nombre de réservations/mois | Traction du marché | Indicateur #1 que ça prend |
| Taux de remplissage des créneaux | Attractivité pour les pros | Si les créneaux se remplissent, le modèle tient |
| Note moyenne client | Confiance et satisfaction | Pilier central du projet |
| Taux de re-réservation | Rétention client | Valide la valeur perçue |
| Nombre de pros actifs | Capacité de l'offre | Assez de pros pour couvrir la demande |
| Revenu commission/mois | Viabilité économique | 12.50 CHF/réservation (10% de 125 CHF) |

### Succès Technique

| Métrique | Cible | Justification |
| --- | --- | --- |
| Temps de chargement initial | < 3s sur 3G | Audience potentiellement senior, connexion variable |
| Disponibilité | > 99.5% | Pas de sur-ingénierie, Firebase Hosting = fiable par défaut |
| Paiement Stripe | 0 échec non-résolu | Confiance = le paiement DOIT fonctionner |
| Responsive mobile | 100% fonctionnel | Web responsive mobile-first |
| Lighthouse Performance | > 80 | Qualité web standard |

### Résultats Mesurables

**Le signal de succès ultime (en 1 phrase) :** Les gens réservent, sont satisfaits, et reviennent.

**Validation du product-market fit :**

- Les réservations arrivent sans forcer
- Les avis sont positifs (> 4.5/5)
- Les pros redemandent des tournées
- Le parcours recherche → réservation → paiement fonctionne sans friction
- Zéro problème de paiement Stripe

## Périmètre Produit

### MVP — Produit Minimum Viable

1. **Site vitrine** — Héro piano, thème sombre, animations scroll, barre de recherche lieu + date, contenu confiance/équipe/métier, footer "Devenez accordeur"
2. **Recherche & Résultats** — Recherche lieu + date, affichage pros disponibles, profil pro complet (photo, bio, pays, langues, note, avis, certificats, interventions)
3. **Réservation & Paiement** — Créneaux demi-journée, réservation instantanée, récapitulatif, Stripe Checkout 125 CHF, commission 10% Stripe Connect
4. **Authentification Client** — Google Auth via Firebase SDK, création profil (nom, prénom, photo)
5. **Dashboard Client** — Prochains RDV, historique, annulation sans frais (10 jours avant), messagerie pro + plateforme, notifications email, gestion profil
6. **Inscription & Dashboard Pro** — Page "Devenez accordeur", validation admin, publication dispos (dates + rayon géo, 6 mois), capacité configurable, emploi du temps, répondre aux avis/messages, Stripe Connect onboarding
7. **Système d'avis** — Note 1-5 + commentaire, réponse pro, note moyenne sur profil
8. **Admin** — Validation profils pro, vérification juridique/opérationnelle, accès Stripe dashboard

### Growth Features (Post-MVP)

- Auth par SMS (code)
- Notifications SMS
- Langues EN et DE
- Supplément piano mauvais état (lien Stripe à la demande)
- Recherche par nom d'accordeur
- Rappel annuel automatisé ("Votre piano a été accordé il y a 11 mois")
- Re-booking du même pro en 1 clic

### Vision (Future)

- App mobile (PWA ou native)
- Expansion géographique : toute la Suisse → France nationale → Allemagne → monde
- Mécanisme de remplacement automatisé si pro indisponible
- Analytics et reporting avancés
- Pricing dynamique par zone (v2+)
- Programme de fidélité

## Parcours Utilisateurs

### Parcours 1 : Sophie — La recherche d'accordeur (Happy Path)

Sophie, 42 ans, Lausanne. Piano droit Yamaha dans le salon, deux enfants en cours de piano. Dernier accordage : il y a 18 mois. La prof de piano de ses enfants lui a dit "il faudrait vraiment faire accorder ce piano". Sophie a déjà essayé — Google, école de musique, forums. Les rares accordeurs locaux sont bookés 3 mois à l'avance et facturent 230 CHF. Elle a abandonné temporairement.

**Scène d'ouverture :** Sophie tape "accordeur piano Lausanne" sur Google un dimanche soir. Elle tombe sur EasyPiano en premier résultat. Le site l'accueille avec un héro plein écran d'un piano à queue, thème sombre, élégant. Elle scrolle — les atouts, les avis clients, l'histoire du métier. Elle se dit "c'est exactement ce qu'il me faut".

**Action montante :** Elle tape "Lausanne" + "15 mars" dans la barre de recherche. 3 profils de pros apparaissent, disponibles en demi-journée. Elle clique sur Tomasz — photo, bio, 12 ans d'expérience, conservatoire de Cracovie, parle français, 4.8/5 sur 47 avis, certificats visibles, badge "Validé par EasyPiano". Elle lit 2-3 commentaires. Elle se sent rassurée.

**Climax :** Elle clique "Réserver", voit le récapitulatif — Tomasz, mardi 15 mars matin, 125 CHF. Elle se connecte avec Google Auth en 1 clic. Stripe Checkout. Paiement. Confirmation par email immédiate. Total : 2 minutes 30.

**Résolution :** Le lundi soir elle reçoit un email de rappel. Mardi matin, Tomasz arrive, accorde le piano en 1h15. Les enfants jouent le soir — "ça sonne tellement mieux !". Deux jours plus tard, Sophie reçoit un email l'invitant à laisser un avis. Elle met 5 étoiles : "Ponctuel, professionnel, piano parfaitement accordé. Et moitié moins cher que ce que je payais avant. Je re-réserve l'année prochaine !" 11 mois plus tard, elle reçoit un rappel : "Votre piano a été accordé il y a 11 mois". Elle re-réserve en 1 clic.

**Capabilities révélées :** SEO/landing page, recherche lieu + date, affichage profils comparables, Google Auth, Stripe Checkout, email confirmation + rappel, système d'avis, re-booking.

### Parcours 2 : Sophie — Annulation et edge cases

Sophie a réservé Tomasz pour le 15 mars. Le 3 mars (12 jours avant), son fils tombe malade et elle veut annuler.

**Scène :** Elle ouvre son dashboard client. "Prochains RDV" affiche la réservation. Elle clique "Annuler". Le système affiche un menu déroulant obligatoire : "Pourquoi annulez-vous ?"

Options :

1. Imprévu personnel / familial
2. Problème de santé
3. Changement de planning / déménagement
4. J'ai trouvé un autre accordeur
5. Autre (champ texte libre)

Elle sélectionne "Imprévu personnel / familial". Le système vérifie : 12 jours avant > 10 jours → annulation sans frais. Confirmation : "Votre réservation est annulée. Vous serez remboursé sous 5-10 jours ouvrés." Email de confirmation envoyé. Le motif est enregistré dans Firebase RTDB pour analytics (dashboard admin peut voir les motifs d'annulation agrégés).

**Variante — Annulation tardive :** Sophie veut annuler le 8 mars (7 jours avant). Après avoir sélectionné le motif, le système affiche : "L'annulation sans frais est possible jusqu'à 10 jours avant l'intervention. Contactez-nous via la messagerie pour discuter de votre situation." Elle envoie un message à la plateforme. L'admin gère au cas par cas.

**Variante — Problème de qualité :** Après l'intervention, Sophie n'est pas satisfaite — le piano se désaccorde en 3 jours. Elle laisse un avis 2/5 avec commentaire explicatif. Tomasz peut répondre publiquement. L'admin EasyPiano est alerté et contacte Sophie pour trouver une solution (re-intervention ou remboursement partiel).

**Capabilities révélées :** Dashboard client avec gestion RDV, annulation avec motif obligatoire (menu déroulant 5 options), logique d'annulation automatisée (10 jours), enregistrement motifs pour analytics, remboursement Stripe, messagerie client → plateforme, alertes admin sur avis négatifs, réponse pro aux avis.

### Parcours 3 : Tomasz — L'accordeur en tournée (Happy Path)

Tomasz, 35 ans, Cracovie. Accordeur depuis 12 ans, formé au conservatoire. En Pologne il gagne ~800 PLN/semaine (~180 CHF). Il parle polonais, anglais et un peu de français. Il rêve d'accéder au marché suisse mais n'a aucun canal.

**Scène d'ouverture :** Tomasz découvre le lien "Devenez accordeur" en bas de la page EasyPiano. Il clique. Formulaire d'inscription : photo professionnelle, bio, certificats (diplôme conservatoire, attestation d'expérience), langues parlées. Il soumet. Status : "En attente de validation".

**Action montante :** Jérôme le contacte. Rendez-vous en visio d'abord, puis rencontre physique lors d'un déplacement en Pologne. Jérôme vérifie ses compétences, ses documents, son matériel. Validation. Le profil de Tomasz est publié sur EasyPiano. Il configure son Stripe Connect (onboarding guidé par Stripe).

**Climax :** Tomasz déclare une tournée : "Disponible du 10 au 17 mars, zone Genève-Lausanne, rayon 50 km". Il configure sa capacité : 1 piano le matin, 2 l'après-midi. Ses créneaux apparaissent sur la plateforme. En 5 jours, 12 créneaux sur 15 sont réservés. Il organise son transport (avion low-cost Cracovie → Genève) et réserve un Airbnb.

**Résolution :** Semaine de tournée. Chaque matin il consulte son emploi du temps sur son dashboard pro — adresses, contacts, détails. Il enchaîne 3 pianos/jour. Fin de semaine : ~1 875 CHF net (15 × 112.50 CHF après commission). De retour à Cracovie, il consulte ses avis — 4.9/5 en moyenne. Il planifie sa prochaine tournée pour mai. En 3 mois, il a fait 4 tournées et gagné ~7 500 CHF net — soit 10 mois de salaire polonais.

**Capabilities révélées :** Page "Devenez accordeur", formulaire inscription pro, workflow validation admin, Stripe Connect onboarding, publication disponibilités (dates + zone + capacité), dashboard pro (emploi du temps, avis, messages), paiements automatiques via Stripe Connect.

### Parcours 4 : Tomasz — Pro indisponible (Edge Case)

Tomasz a une tournée prévue du 10 au 17 mars avec 12 réservations. Le 5 mars, il a un problème médical et ne peut plus venir.

**Scène :** Tomasz contacte EasyPiano via la messagerie pro. L'admin est alerté immédiatement. Jérôme cherche un remplaçant dans le réseau de pros validés — un autre accordeur couvrant la zone Genève-Lausanne cette période. Si un remplaçant est trouvé : les 12 clients sont notifiés par email ("Votre accordeur a changé, voici le nouveau profil"). Si aucun remplaçant : les clients sont contactés pour proposer un report ou un remboursement complet.

**Note MVP :** Le mécanisme de remplacement est manuel (admin gère au cas par cas). L'automatisation est post-MVP.

**Capabilities révélées :** Messagerie pro → plateforme, alertes admin urgentes, notification clients en masse, mécanisme de remplacement manuel, remboursement Stripe.

### Parcours 5 : Admin EasyPiano — Gestion quotidienne

Malik et Jérôme, fondateurs. Jérôme gère la relation pros et la validation. Malik gère la plateforme et les opérations.

**Scène d'ouverture :** Lundi matin. Jérôme ouvre le dashboard admin. 2 nouvelles inscriptions pro en attente de validation. Il consulte les profils — photos, bios, certificats uploadés. Il planifie une visio avec chacun cette semaine.

**Action — Validation pro :** Après la visio et la vérification des documents (diplôme, RC pro, pièce d'identité), Jérôme valide le profil dans le dashboard admin. Le pro reçoit un email : "Votre profil est validé ! Vous pouvez maintenant publier vos disponibilités." Si refus : email explicatif avec motif.

**Action — Suivi opérationnel :** Malik consulte le dashboard Stripe Connect — transactions de la semaine, commissions perçues, virements aux pros. Il vérifie qu'aucun paiement n'est bloqué. Il consulte les avis récents — aucun en dessous de 3/5, tout va bien. Il consulte aussi les analytics des motifs d'annulation — 60% "Imprévu personnel/familial", 20% "Problème de santé", 15% "Changement de planning", 5% "Autre". Signal sain.

**Action — Gestion de crise :** Un client a envoyé un message via la messagerie plateforme : "L'accordeur n'est pas venu". Malik contacte le pro, comprend la situation, propose au client un nouvel RDV ou un remboursement. Il documente l'incident.

**Capabilities révélées :** Dashboard admin (inscriptions en attente, validation/refus, analytics motifs d'annulation), accès Stripe dashboard, vue sur les avis, messagerie plateforme (client → admin, pro → admin), gestion manuelle des incidents.

### Synthèse des Capabilities par Parcours

| Capability | Sophie | Tomasz | Admin |
| --- | --- | --- | --- |
| Landing page + SEO | Découverte | Lien "Devenez accordeur" | — |
| Recherche lieu + date | Core | — | — |
| Profils pro comparables | Évaluation | Création profil | Validation |
| Google Auth | Connexion | — | — |
| Stripe Checkout | Paiement 125 CHF | — | Suivi |
| Stripe Connect | — | Onboarding + réception paiements | Dashboard |
| Dashboard client | Gestion RDV, annulation, messagerie | — | — |
| Annulation avec motif (5 options) | Sélection motif obligatoire | — | Analytics motifs agrégés |
| Dashboard pro | — | Emploi du temps, dispos, avis, messages | — |
| Dashboard admin | — | — | Validation pros, suivi, analytics, gestion crise |
| Système d'avis | Laisser un avis | Répondre | Monitoring |
| Messagerie | → Pro, → Plateforme | → Plateforme | Réception + réponse |
| Notifications email | Confirmation, rappel, avis | Nouvelles réservations, validation | Alertes |
| Annulation + remboursement | Demande avec motif | — | Gestion + analytics |
| Publication disponibilités | — | Dates + zone + capacité | — |

## Innovation & Patterns Novateurs

### Zones d'Innovation Détectées

**1. Création de marché digital dans un secteur vierge**

EasyPiano ne disrupts pas un concurrent existant — il *crée* le marché digital de l'accordage piano en Europe continentale. Aucune plateforme de booking spécialisée n'existe. La recherche web confirme : PianoSphere (UK, directory sans booking), Gazelle (B2B SaaS pour pros), Thumbtack/TaskRabbit (US, généralistes). Le secteur est resté 100% analogique : bouche-à-oreille, annuaires obsolètes, appels téléphoniques, paiement espèces. C'est un marché qui n'a jamais connu sa transformation numérique.

**Innovation produit :** Premier arrivé avec booking instantané + paiement en ligne + profils comparables + système d'avis structuré. Free-mover advantage radical — capture de l'intégralité du marché digital dès J1.

**2. Modèle de tournées transfrontalier comme solution structurelle à la pénurie**

Le problème s'aggrave structurellement : -15% d'accordeurs certifiés en Europe 2021-2024, métier en voie de disparition, délais 3-6 semaines en haute saison. Les accordeurs locaux survivants priorisent les zones urbaines denses et facturent 180-230 CHF.

**Innovation structurelle :** Organiser une main-d'œuvre qualifiée d'Europe de l'Est (Pologne, Croatie, Ukraine) en tournées planifiées 6 mois à l'avance pour servir un marché en pénurie en Europe de l'Ouest. Le libre-échange européen + le différentiel de coût de vie permettent une solution unique : les pros gagnent ~1 700-2 000 CHF net/semaine (10 mois de salaire polonais en 1 semaine), les clients paient 125 CHF au lieu de 230 CHF.

**Validation du modèle :** Les pros publient leurs disponibilités 6 mois à l'avance → les créneaux se remplissent en quelques jours → tournée rentable pour le pro + disruption de prix pour le client + commission 10% pour la plateforme. Win-win-win structurel.

**3. Curation physique intensive comme moat dans un monde de marketplaces ouvertes**

Airbnb, Uber, TaskRabbit = marketplaces ouvertes avec validation algorithmique ou automatique. EasyPiano fait l'inverse : *chaque pro est rencontré physiquement par Jérôme avant validation*. C'est lent, non-scalable au début, mais ça construit le moat.

**Innovation de positionnement :** Dans un secteur où le client laisse un inconnu seul chez lui avec un instrument de 5 000-100 000+ CHF, la confiance est le facteur #1. La curation physique devient le différenciateur clé. "Tu as choisi EasyPiano = tu as fait ton choix de confiance." Le badge "Validé par EasyPiano" = signal de confiance transféré de l'individu vers la plateforme.

**Scalabilité :** Au démarrage, c'est manuel (Jérôme rencontre chaque pro). À partir de 50-100 pros validés, le réseau devient auto-référent (les pros recommandent d'autres pros qualifiés). La curation reste manuelle mais le sourcing devient scalable via le réseau.

**4. Arbitrage géographique comme disruption de prix structurelle**

125 CHF vs 180-230 CHF = réduction de 30-45%. Ce n'est pas une promo ou une optimisation opérationnelle temporaire — c'est une asymétrie structurelle basée sur le différentiel de coût de vie EU.

**Innovation business model :** Le pro d'Europe de l'Est gagne ~112.50 CHF net par accordage (après commission 10%). En une semaine de tournée (15 accordages), il gagne ~1 875 CHF net. Le coût de vie en Pologne/Croatie permet de rendre ce revenu extrêmement attractif (~10 mois de salaire local en 1 semaine), tout en proposant un prix disruptif au client suisse.

**Pérennité :** Tant que le différentiel de coût de vie EU existe ET que la pénurie d'accordeurs en Europe de l'Ouest persiste, le modèle tient. Les deux facteurs sont structurels (pas de renouvellement du métier, convergence économique EU lente).

**5. La technologie comme résolution simultanée de multiples problématiques**

Un seul produit digital résout 5 problèmes en parallèle :

1. **Client** : Impossible de trouver un accordeur disponible → Recherche lieu + date, booking instantané
2. **Client** : Prix opaque et élevé (230 CHF) → Prix fixe transparent 125 CHF
3. **Client** : Aucune garantie de qualité → Profils vérifiés + avis + badge "Validé par EasyPiano"
4. **Pro** : Aucun canal pour accéder au marché suisse → Plateforme dédiée avec curation humaine
5. **Secteur** : Métier en voie de disparition → Nouvelle génération de revenus pour les pros EU, revitalisation du métier

**Innovation systémique :** La technologie (web app + Firebase + Stripe Connect) ne résout pas UN problème — elle réorganise un marché entier en créant une infrastructure digitale qui n'existait pas.

### Contexte Marché & Paysage Concurrentiel

**Validation marché vierge (2026) :**

- **Europe continentale** : 0 plateforme de booking spécialisée accordage piano
- **UK** : PianoSphere (2024) = directory sans booking instantané ni paiement intégré
- **US** : Thumbtack/TaskRabbit = généralistes sans spécialisation piano
- **B2B** : Gazelle = SaaS pour gestion d'activité des pros, pas une marketplace client

**Taille du marché :**

- Marché global accordage : ~1.8B USD (2024) → ~2.7B USD (2033), CAGR 4.2%
- Europe : ~540M USD (~30% du marché global)
- Suisse : ~200 000-400 000 pianos, besoin récurrent 1-2x/an
- France : ~800 000+ pianos
- Allemagne : ~800 000 pianos

**Pénurie confirmée :**

- -15% d'accordeurs certifiés en Europe 2021-2024
- Délais 3-6 semaines en haute saison (nov-juin)
- Cas rapportés de 5 mois d'attente
- Zones rurales/périurbaines délaissées

### Approche de Validation

**Phase 1 — Test de marché (0-6 mois) :**

Valider 3 hypothèses critiques :

1. **Les clients réservent-ils via la plateforme ?** (vs continuer à chercher en analogique)
2. **Les pros d'Europe de l'Est viennent-ils en tournée ?** (vs garder leur activité locale)
3. **Le prix 125 CHF est-il perçu comme "bon deal" ET "crédible" ?** (vs "trop cheap = suspect")

**Métriques de validation MVP :**

- Nombre de réservations/mois (signal brut : ça prend ou pas)
- Taux de remplissage des créneaux pros (signal : le modèle de tournées tient)
- Note moyenne > 4.5/5 (signal : la qualité est là, la confiance se construit)
- Taux de re-réservation (signal ultime : les clients reviennent)

**Phase 2 — Scaling (6+ mois si validation positive) :**

- Expansion géographique : bassin lémanique → Suisse romande/alémanique → France → Allemagne
- Scaling du réseau pros : 5-10 pros au lancement → 50-100 pros en 12 mois
- Automatisation progressive : rappel annuel, re-booking 1 clic, mécanisme remplacement

### Gestion des Risques

| Risque Innovation | Probabilité | Impact | Mitigation |
| --- | --- | --- | --- |
| **Les clients ne font pas confiance à des pros d'Europe de l'Est** | Moyenne | Critique | Curation physique + badge "Validé par EasyPiano" + système d'avis dès J1 + Jérôme (30 ans musicien) comme caution |
| **Les pros ne viennent pas en tournée** (logistique trop complexe) | Faible | Haute | Jérôme a le réseau + étude marché il y a 2 ans confirme l'intérêt + revenu 1 semaine = 10 mois salaire local |
| **Un concurrent réplique le modèle** | Haute (si succès) | Moyenne | Network effects + data moat + brand trust = avantages défendables. Premier arrivé capture la demande latente. |
| **Cadre juridique transfrontalier bloque le modèle** | Faible | Critique | Validation manuelle par Jérôme au MVP (RC pro + pièces justificatives). Cadre juridique détaillé post-MVP avec avocat spécialisé. |
| **Prix 125 CHF perçu comme "trop cheap"** | Faible | Moyenne | Transparence totale sur le modèle : pros EU qualifiés, curation physique, avis vérifiés. Positionnement "bon rapport qualité-prix" pas "discount". |

**Fallback si innovation ne prend pas :**

Si le marché rejette le modèle de tournées transfrontalier :


1. Pivot vers marketplace locale (accordeurs suisses/français/allemands)
2. Commission ajustée (15-20% au lieu de 10%)
3. Prix client ajusté (150-180 CHF au lieu de 125 CHF)
4. Garde la curation physique + booking instantané + avis (innovation #1 et #3 restent valables)

## Scoping Stratégique & Développement Progressif

### Stratégie MVP & Philosophie

**Approche MVP :** Lancement progressif en 3 vagues pour valider le marché rapidement tout en construisant la confiance.

**Phase V0.1 (MVP Lean) :**
Validation des 3 hypothèses critiques avec un produit minimal fonctionnel :

1. Les clients réservent via la plateforme ✓
2. Les pros viennent en tournée ✓
3. Le prix 125 CHF est crédible ✓

**Acquisition initiale :** Bouche-à-oreille via réseau Jérôme (salles de concert, professeurs de piano) + programme d'affiliation pour profs particuliers (commission si envoi d'élèves, modèle CarVertical).

**Philosophie :** "Launch fast, learn fast" — on lance en 4-6 semaines, on valide le marché avec 10-20 réservations, puis on itère avec les feedbacks terrain.

**Ressources :** Malik (dev full-stack avec Copilot) + Jérôme (relation pros, validation manuelle, acquisition).

### MVP V0.1 — Feature Set (Phase 1 Immédiate)

**Parcours Utilisateurs Supportés :**

- **Sophie (Client)** : Recherche → Réservation → Paiement → Confirmation (Parcours 1 simplifié)
- **Tomasz (Pro)** : Publication disponibilités → Emploi du temps → Réception réservations (Parcours 3 simplifié)
- **Admin** : Validation pro manuelle via email/WhatsApp (Parcours 5 ultra-simplifié)

**Must-Have Capabilities :**

| Feature | Justification | Détail |
| --- | --- | --- |
| **Landing page** | Acquisition organique + crédibilité | Héro piano, barre recherche lieu + date, contenu confiance/équipe/métier, footer "Devenez accordeur" |
| **Recherche & Résultats** | Core value prop | Recherche lieu + date → affichage profils pros disponibles (photo, bio, note estimée, langues, certificats) |
| **Booking & Paiement** | Validation hypothèse #1 (clients réservent) | Sélection créneau demi-journée → récapitulatif → Stripe Checkout 125 CHF → commission 10% Stripe Connect |
| **Google Auth** | Identification client pour Stripe + dashboard | Connexion 1 clic, création profil (nom, prénom, photo) |
| **Dashboard Client** | Visibilité RDV + gestion basique | Vue "Prochains RDV" uniquement. Annulation via email/messagerie externe (WhatsApp/email Jérôme) |
| **Dashboard Pro** | Validation hypothèse #2 (pros publient tournées) | Publication disponibilités (dates + zone + capacité) + emploi du temps (adresses, contacts, détails RDV) |
| **Validation Pro Manuelle** | Curation physique = moat | Formulaire inscription pro → email à Jérôme → validation manuelle (visio + rencontre physique) → activation profil |

**Features ABSENTES de V0.1 :**

- ❌ Système d'avis (ajouté en V1 après 10-20 réservations)
- ❌ Messagerie intégrée client ↔ pro (gérée via email/WhatsApp externe)
- ❌ Dashboard admin complet (Google Sheets + email pour gestion pros)
- ❌ Annulation automatisée avec remboursement (gérée manuellement par Jérôme)

### MVP V1 — Post-MVP Features (Phase 2)

**Déclencheur :** Après 10-20 réservations réussies, feedbacks clients/pros recueillis.

**Features ajoutées :**

| Feature | Objectif | Détail |
| --- | --- | --- |
| **Système d'avis** | Construire la confiance à l'échelle | Note 1-5 + commentaire, réponse pro, note moyenne sur profil, avis unilatéral (seuls clients ayant réservé) |
| **Dashboard Client complet** | Autonomie client | Annulation avec motif (menu déroulant 5 options), remboursement automatique Stripe, messagerie client → pro intégrée, notifications email |
| **Dashboard Admin** | Scalabilité opérationnelle | Validation profils pro (interface dédiée), analytics motifs d'annulation, vue avis/notes, gestion incidents, accès Stripe dashboard |
| **Messagerie intégrée** | Communication centralisée | Client ↔ Pro, Client ↔ Plateforme, Pro ↔ Plateforme (Firebase Realtime Database pour notifications temps réel) |
| **Notifications email** | Engagement & rétention | Confirmation, rappel 24h avant RDV, invitation avis post-intervention |

**Features Growth (toujours en V1) :**

- Auth par SMS (code)
- Langues EN et DE
- Recherche par nom d'accordeur
- Supplément piano mauvais état (lien Stripe à la demande)

### Phase 3 — Produit Léché (Expansion)

**Déclencheur :** Product-market fit validé (> 50 réservations/mois, note moyenne > 4.5/5, taux re-réservation positif).

**Objectif :** Devenir le standard du marché, ultra-fonctionnel, design irréprochable.

**Features Expansion :**

| Feature | Objectif | Détail |
| --- | --- | --- |
| **Rappel annuel automatisé** | Rétention automatique | "Votre piano a été accordé il y a 11 mois" + CTA re-réservation |
| **Re-booking 1 clic** | Expérience seamless | "Réserver à nouveau avec Tomasz" → 1 clic → confirmation |
| **Mécanisme remplacement automatisé** | Résilience opérationnelle | Si pro indisponible → proposition automatique d'un remplaçant validé dans la zone |
| **App mobile (PWA/Native)** | Expérience mobile premium | Notifications push, expérience native iOS/Android |
| **Analytics & Reporting avancés** | Data-driven decisions | Dashboard analytics pour admin, insights sur remplissage créneaux, zones géographiques, saisonnalité |
| **Pricing dynamique par zone** | Optimisation revenus | Ajustement prix selon demande/offre par région (post-validation marché) |
| **Programme fidélité** | Rétention long-terme | Réductions après X accordages, parrainage clients |
| **Expansion géographique** | Scaling | Suisse romande/alémanique → France nationale → Allemagne → Europe |

### Roadmap de Développement Progressif

**Timeline :**

```
MVP V0.1 (4-6 semaines dev)
→ Landing + Recherche + Booking + Stripe + Google Auth
→ Dashboard Pro (dispos + emploi du temps)
→ Dashboard Client (vue RDV uniquement)
→ Validation pro manuelle (Jérôme)
✅ Valide : Clients réservent + Pros viennent + Prix crédible

     ↓

MVP V1 (2-4 semaines dev post-validation)
→ Système d'avis
→ Dashboard Admin complet
→ Messagerie intégrée
→ Annulation automatisée
→ Growth features (SMS Auth, EN/DE, Recherche par nom)
✅ Product-market fit validé, scalabilité opérationnelle

     ↓

Produit Léché (6+ mois post-V1)
→ Rappel annuel + Re-booking 1 clic
→ App mobile (PWA/Native)
→ Analytics avancés + Pricing dynamique
→ Expansion géographique (Suisse → France → Allemagne)
✅ Référence du marché, ultra-fonctionnel, design parfait
```

### Stratégie de Gestion des Risques

#### Risques Techniques

| Risque | Impact | Mitigation |
| --- | --- | --- |
| **Migration Next.js prend plus de temps que prévu** | Retarde le lancement | **Fallback :** Lancer MVP V0.1 en React + Vite pur, migrer Next.js après validation marché. SEO manuel via pre-rendering ou acquisition directe (réseau Jérôme). |
| **Stripe Connect complexité d'intégration** | Bloque les paiements pros | Stripe Connect Express (onboarding simplifié), documentation officielle Stripe, tests sandbox avant prod. |
| **Firebase Realtime Database scalabilité** | Ralentissements si > 100 pros actifs | Architecture optimisée (index Firebase), monitoring Firebase Console, migration Firestore si nécessaire (post-V1). |

#### Risques Marché

| Risque | Impact | Mitigation |
| --- | --- | --- |
| **Zéro réservation après 2 semaines de lancement** | Validation marché négative | Acquisition payante (Google Ads "accordeur piano Lausanne"), communication Jérôme via réseau (salles concert, profs piano), programme affiliation profs. |
| **Clients ne font pas confiance pros EU Est** | Adoption faible | Curation physique (Jérôme rencontre chaque pro), badge "Validé par EasyPiano", transparence totale (diplômes, certificats visibles), avis clients dès V1. |
| **Pros ne viennent pas en tournée** | Offre inexistante | Jérôme a le réseau établi (étude marché 2 ans), revenu 1 semaine = 10 mois salaire local, accompagnement logistique (transport, Airbnb). |

#### Risques Ressources

| Risque | Impact | Mitigation |
| --- | --- | --- |
| **Dev solo prend plus de temps que prévu** | Retard lancement | Scoping lean (MVP V0.1 = 4-6 semaines max), Copilot pour accélération, priorisation stricte des features must-have. |
| **Jérôme débordé par validation manuelle pros** | Goulot d'étranglement scaling | Lancement avec 5-10 pros max (gestion manuelle viable), automatisation progressive dashboard admin en V1, scaling via réseau auto-référent (pros recommandent pros). |
| **Budget Stripe/Firebase limité au début** | Coûts opérationnels | Firebase gratuit jusqu'à certains seuils (Spark plan), Stripe Connect frais uniquement sur transactions (pas de coût fixe), scaling progressif. |

## Exigences Fonctionnelles

### 1. Découverte & Recherche

- **FR1:** Les visiteurs peuvent accéder à une landing page présentant la valeur du service (héro piano, confiance, équipe, métier)
- **FR2:** Les visiteurs peuvent rechercher des accordeurs disponibles par lieu et date
- **FR3:** Les visiteurs peuvent voir une liste de profils d'accordeurs correspondant à leur recherche
- **FR4:** Les visiteurs peuvent consulter le profil détaillé d'un accordeur (photo, bio, pays, langues, note estimée, certificats, nombre d'interventions)
- **FR5:** Les visiteurs peuvent accéder au formulaire d'inscription pro via le lien "Devenez accordeur"

### 2. Gestion Utilisateurs

- **FR6:** Les clients peuvent s'authentifier via Google Auth (V0.1), puis email+mot de passe OU SMS+code (V1)
- **FR7:** Les clients peuvent créer et gérer leur profil (nom, prénom, photo, téléphone)
- **FR7b:** Les clients doivent fournir un email valide au moment de la première réservation (obligatoire pour Stripe Checkout et communications)
- **FR8:** Les pros doivent fournir un email lors de l'inscription (obligatoire pour validation admin + Stripe Connect)
- **FR9:** Les pros peuvent consulter le statut de leur inscription (en attente, validé, refusé)
- **FR9b:** Les pros doivent activer l'authentification à deux facteurs (2FA) dès leur premier client confirmé
- **FR9c:** Les sessions pros expirent automatiquement après X minutes d'inactivité (sécurité)

### 3. Réservation & Paiement

- **FR10:** Les clients authentifiés peuvent sélectionner un créneau de demi-journée disponible chez un accordeur
- **FR11:** Les clients peuvent voir un récapitulatif de leur réservation avant paiement (accordeur, date, créneau, prix 125 CHF)
- **FR12:** Les clients peuvent payer leur réservation via Stripe Checkout
- **FR13:** Les clients reçoivent une confirmation de réservation par email après paiement
- **FR14:** Les pros reçoivent le paiement automatiquement via Stripe Connect (112.50 CHF net après commission 10%)

### 4. Gestion des Rendez-vous

**Client :**

- **FR15:** Les clients peuvent consulter la liste de leurs prochains rendez-vous
- **FR16:** Les clients peuvent demander l'annulation d'un rendez-vous (via email/WhatsApp dans V0.1)
- **FR17:** Les clients peuvent consulter l'historique de leurs rendez-vous passés (V1)
- **FR18:** Les clients peuvent annuler un rendez-vous avec sélection d'un motif obligatoire parmi 5 options (V1)
- **FR19:** Les clients reçoivent un remboursement automatique si annulation > 10 jours avant (V1)

**Pro :**

- **FR20:** Les pros validés peuvent publier leurs disponibilités (dates, zone géographique, rayon km, capacité journalière)
- **FR21:** Les pros peuvent consulter leur emploi du temps avec informations partielles protégées :
  - **Avant le RDV (> 24h)** : Ville/zone uniquement, nom client, créneau
  - **24h avant le RDV** : Adresse exacte révélée automatiquement
  - **Historique** : Adresse exacte non stockée (seulement ville/zone)
- **FR21b:** L'adresse exacte du client est protégée et révélée au pro uniquement dans une fenêtre temporelle limitée (24h avant → fin intervention)
- **FR22:** Les pros peuvent voir leurs réservations confirmées par créneau
- **FR23:** Les pros peuvent modifier leurs disponibilités publiées
- **FR23b:** Les pros peuvent accéder à leur dashboard Stripe Connect via un lien direct depuis leur dashboard EasyPiano

### 5. Validation & Confiance

- **FR24:** L'admin peut consulter les inscriptions pro en attente de validation
- **FR25:** L'admin peut valider ou refuser une inscription pro avec notification email au pro
- **FR26:** Les profils pro validés affichent un badge "Validé par EasyPiano"
- **FR27:** Les clients peuvent laisser un avis (note 1-5 + commentaire) après une intervention (V1)
- **FR28:** Les pros peuvent répondre publiquement aux avis clients (V1)
- **FR29:** Le profil pro affiche la note moyenne calculée automatiquement (V1)
- **FR30:** Seuls les clients ayant réservé et reçu le service peuvent laisser un avis (V1)

### 6. Communication

- **FR31:** Les clients peuvent envoyer des messages aux pros (via email/WhatsApp externe en V0.1, messagerie intégrée en V1)
- **FR32:** Les clients peuvent contacter la plateforme (via email/WhatsApp externe en V0.1)
- **FR33:** Les pros peuvent contacter la plateforme pour alertes urgentes (via email/WhatsApp externe en V0.1)
- **FR34:** Le système envoie des notifications email automatiques (confirmation réservation, rappel 24h avant, invitation avis) (V1)
- **FR35:** Les utilisateurs peuvent échanger via messagerie intégrée avec notifications temps réel (Client ↔ Pro, Client ↔ Plateforme, Pro ↔ Plateforme) (V1)

### 7. Administration

- **FR36:** L'admin peut accéder au dashboard Stripe Connect pour consulter les transactions et commissions
- **FR37:** L'admin peut gérer manuellement les incidents (pro absent, qualité insatisfaisante)
- **FR38:** L'admin peut consulter les analytics des motifs d'annulation agrégés (V1)
- **FR39:** L'admin peut consulter la liste des avis et notes pour monitoring qualité (V1)
- **FR40:** L'admin reçoit des alertes automatiques sur avis négatifs (< 3/5) (V1)
- **FR41:** L'admin peut envoyer des notifications email en masse aux clients (remplacement pro, alertes) (V1)

### 8. Features Growth (V1)

- **FR42:** Les clients peuvent s'authentifier par SMS avec code de vérification (V1)
- **FR43:** Les utilisateurs peuvent sélectionner la langue d'interface (FR, EN, DE) (V1)
- **FR44:** Les clients peuvent rechercher un accordeur par son nom (V1)
- **FR45:** Les clients peuvent demander un supplément "piano en mauvais état" avec lien Stripe à la demande (V1)

### 9. Features Vision (Phase 3)

- **FR46:** Les clients reçoivent un rappel automatique 5-6 mois après le dernier accordage (accordage 2x/an)
- **FR47:** Les clients peuvent re-réserver le même accordeur en 1 clic
- **FR48:** Le système propose automatiquement un accordeur remplaçant si le pro initialement réservé est indisponible
- **FR49:** L'admin peut consulter des analytics avancés (taux de remplissage par zone, saisonnalité, revenus)
- **FR50:** Le système peut appliquer un pricing dynamique par zone géographique

### 10. Programme Affiliation (Innovation)

- **FR51:** Les professeurs de piano peuvent s'inscrire au programme d'affiliation
- **FR52:** Les professeurs affiliés reçoivent une commission automatique via Stripe quand un élève réserve via leur lien

### 11. Sécurité & Protection Données

- **FR53:** Les adresses exactes des clients ne sont JAMAIS stockées en clair dans l'historique des pros
- **FR54:** Les adresses exactes sont révélées aux pros dans une fenêtre temporelle limitée (24h avant RDV → fin intervention)
- **FR55:** Les pros doivent activer 2FA (authentification à deux facteurs) obligatoirement dès leur premier client confirmé
- **FR56:** Les sessions pros expirent automatiquement après X minutes d'inactivité (à définir en NFR : 15-30 min recommandé)
