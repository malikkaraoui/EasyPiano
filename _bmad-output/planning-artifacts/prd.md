---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
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
  mvp_v01:
    frontend: 'Next.js 15 + App Router (React 19)'
    backend: 'Node.js (Next.js API Routes + Firebase Functions)'
    database: 'Firebase Realtime Database'
    auth: 'Firebase Auth (Google, Email, SMS)'
    storage: 'Firebase Storage'
    payment: 'Stripe Connect + Stripe Checkout'
    hosting: 'Firebase Hosting (ou Vercel)'
    monitoring: 'Sentry (error tracking)'
  v1_plus_migration:
    frontend: 'Next.js 15 (inchangé)'
    backend: 'Python (FastAPI/Django) + Docker'
    database: 'PostgreSQL (Render 7€/mois)'
    auth: 'JWT + Custom auth service'
    storage: 'S3-compatible (Render/Cloudflare R2)'
    payment: 'Stripe Connect (inchangé)'
    hosting: 'Render VPS + Docker'
    monitoring: 'Sentry + Render Metrics'
---

# Product Requirements Document - EasyPiano

**Author:** Malik
**Date:** 2026-03-04

## Executive Summary

EasyPiano connecte les propriétaires de piano (particuliers et B2B) en Europe occidentale (Suisse, France, Allemagne) avec des accordeurs qualifiés d'Europe de l'Est. Face à une pénurie critique (-15% de techniciens certifiés entre 2021-2024), EasyPiano exploite le libre-échange européen pour organiser une main-d'œuvre qualifiée mais sous-exploitée. Prix disruptif : 150 CHF vs 180-230 CHF (réduction 35%), réservation instantanée par demi-journée, paiement en ligne via Stripe Connect (commission 17%), curation physique de chaque professionnel. Marché 100% vierge : aucune plateforme de booking spécialisée en Europe continentale. Clients B2B (écoles de musique, conservatoires, hôtels, restaurants, églises, salles de concert) inclus dès la V1 avec un workflow d'inscription dédié.

**Fondateurs :** Jérôme (musicien 30 ans, expertise métier, réseau établi, étude de marché préalable) + Malik (exécution produit/tech). Lancement prévu : bassin lémanique (Genève-Lausanne), expansion progressive Suisse romande/alémanique puis France et Allemagne.

**Marché :** ~540M USD Europe (30% du marché global 1.8B USD), croissance 4.2% CAGR. 200K-400K pianos Suisse, 800K+ France, 800K Allemagne. Besoin récurrent 1-2x/an. Recherche actuelle 100% analogique.

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
150 CHF vs 180-230 CHF (réduction 35%) grâce au sourcing transfrontalier. Le pro gagne ~125 CHF net par accordage (~1 875-2 500 CHF net/semaine de tournée), très attractif comparé au coût de vie en Europe de l'Est. Win-win structurel : client paie moins, pro gagne bien, plateforme prend 17%.

**4. Modèle de tournées — solution à la pénurie**
Les pros publient leurs disponibilités 6 mois à l'avance, organisent des tournées d'une semaine, les créneaux se remplissent instantanément. Ce modèle résout la saisonnalité (novembre-juin = haute demande, délais 3-6 semaines actuellement) et couvre les zones rurales/périurbaines délaissées par les accordeurs locaux.

**Core insight :** Le problème s'aggrave structurellement (-15% d'accordeurs en 3 ans), aucune infrastructure digitale n'existe, et la fenêtre européenne (libre circulation) permet une solution unique.

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
Le pro publie une tournée d'une semaine, ses créneaux se remplissent en quelques jours, il gagne ~1 875-2 500 CHF net sur la semaine.

| Métrique | Cible MVP | Mesure |
| --- | --- | --- |
| Taux de remplissage des créneaux | Signal positif = créneaux qui se remplissent | Ratio réservés/disponibles |
| Satisfaction pro | Feedback direct (contact Jérôme) | Qualitatif — relation directe |
| Revenu net par semaine de tournée | ~1 875-2 500 CHF | Données Stripe Connect |

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
| Revenu commission/mois | Viabilité économique | 25 CHF/réservation (17% de 150 CHF) |

### Succès Technique

| Métrique | Cible | Justification |
| --- | --- | --- |
| Temps de chargement initial | < 3s sur 3G | Audience potentiellement senior, connexion variable |
| Disponibilité | > 99.5% | Pas de sur-ingénierie, Firebase Hosting = fiable par défaut |
| Paiement Stripe | 0 échec non-résolu | Confiance = le paiement DOIT fonctionner |
| Responsive mobile | 100% fonctionnel | Web responsive mobile-first |
| Lighthouse Performance | > 80 | Qualité web standard |

### Résultats Mesurables

**Signal de succès ultime :** Les gens réservent, sont satisfaits, et reviennent.

**Validation product-market fit :**
- Réservations arrivent sans forcer
- Avis positifs (> 4.5/5)
- Pros redemandent des tournées
- Parcours recherche → paiement sans friction
- Zéro échec paiement Stripe

## Parcours Utilisateurs

### Parcours 1 : Sophie — La recherche d'accordeur (Happy Path)

Sophie, 42 ans, Lausanne. Piano droit Yamaha dans le salon, deux enfants en cours de piano. Dernier accordage : il y a 18 mois. La prof de piano de ses enfants lui a dit "il faudrait vraiment faire accorder ce piano". Sophie a déjà essayé — Google, école de musique, forums. Les rares accordeurs locaux sont bookés 3 mois à l'avance et facturent 230 CHF. Elle a abandonné temporairement.

**Scène d'ouverture :** Sophie tape "accordeur piano Lausanne" sur Google un dimanche soir. Elle tombe sur EasyPiano en premier résultat. Le site l'accueille avec un héro plein écran d'un piano à queue, thème sombre, élégant. Elle scrolle — les atouts, les avis clients, l'histoire du métier. Elle se dit "c'est exactement ce qu'il me faut".

**Action montante :** Elle tape "Lausanne" + "15 mars" dans la barre de recherche. 3 profils de pros apparaissent, disponibles en demi-journée. Elle clique sur Tomasz — photo, bio, 12 ans d'expérience, conservatoire de Cracovie, parle français, 4.8/5 sur 47 avis, certificats visibles, badge "Validé par EasyPiano". Elle lit 2-3 commentaires. Elle se sent rassurée.

**Climax :** Elle clique "Réserver", voit le récapitulatif — Tomasz, mardi 15 mars matin, 150 CHF. Elle se connecte avec Google Auth en 1 clic. Stripe Checkout. Paiement. Confirmation par email immédiate. Total : 2 minutes 30.

**Résolution :** Deux jours avant (J-2) puis 2 heures avant (H-2), elle reçoit un email de rappel. Mardi matin, Tomasz arrive, accorde le piano en 1h15. Les enfants jouent le soir — "ça sonne tellement mieux !". Deux jours plus tard, Sophie reçoit un email l'invitant à laisser un avis. Elle met 5 étoiles : "Ponctuel, professionnel, piano parfaitement accordé. Et moitié moins cher que ce que je payais avant. Je re-réserve l'année prochaine !" 11 mois plus tard, elle reçoit un rappel : "Votre piano a été accordé il y a 11 mois". Elle re-réserve en 1 clic.

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

Elle sélectionne "Imprévu personnel / familial". Le système vérifie : 12 jours avant > 48h → remboursement 100%. Confirmation : "Votre réservation est annulée. Vous serez remboursé sous 5-10 jours ouvrés." Email de confirmation envoyé. Le motif est enregistré dans Firebase RTDB pour analytics (dashboard admin peut voir les motifs d'annulation agrégés).

**Variante — Annulation tardive :** Sophie veut annuler le 13 mars (2 jours avant, dans la fenêtre 24-48h). Après avoir sélectionné le motif, le système affiche : "Annulation entre 24h et 48h avant l'intervention : remboursement de 50%." Sophie confirme. Si elle annule à moins de 24h, le système propose un crédit plateforme (pas de remboursement).

**Variante — Problème de qualité :** Après l'intervention, Sophie n'est pas satisfaite — le piano se désaccorde en 3 jours. Elle laisse un avis 2/5 avec commentaire explicatif. Tomasz peut répondre publiquement. L'admin EasyPiano est alerté et contacte Sophie pour trouver une solution (re-intervention ou remboursement partiel).

**Capabilities révélées :** Dashboard client avec gestion RDV, annulation avec motif obligatoire (menu déroulant 5 options), logique d'annulation automatisée par paliers (48h/24h), enregistrement motifs pour analytics, remboursement Stripe, messagerie client → plateforme, alertes admin sur avis négatifs, réponse pro aux avis.

### Parcours 3 : Tomasz — L'accordeur en tournée (Happy Path)

Tomasz, 35 ans, Cracovie. Accordeur depuis 12 ans, formé au conservatoire. En Pologne il gagne ~800 PLN/semaine (~180 CHF). Il parle polonais, anglais et un peu de français. Il rêve d'accéder au marché suisse mais n'a aucun canal.

**Scène d'ouverture :** Tomasz découvre le lien "Devenez accordeur" en bas de la page EasyPiano. Il clique. Formulaire d'inscription : photo professionnelle, bio, certificats (diplôme conservatoire, attestation d'expérience), langues parlées. Il soumet. Status : "En attente de validation".

**Action montante :** Jérôme le contacte. Rendez-vous en visio d'abord, puis rencontre physique lors d'un déplacement en Pologne. Jérôme vérifie ses compétences, ses documents, son matériel. Validation. Le profil de Tomasz est publié sur EasyPiano. Il configure son Stripe Connect (onboarding guidé par Stripe).

**Climax :** Tomasz déclare une tournée : "Disponible du 10 au 17 mars, zone Genève-Lausanne, rayon 50 km". Il configure sa capacité : 1 piano le matin, 2 l'après-midi. Ses créneaux apparaissent sur la plateforme. En 5 jours, 12 créneaux sur 15 sont réservés. Il organise son transport (avion low-cost Cracovie → Genève) et réserve un Airbnb.

**Résolution :** Semaine de tournée. Chaque matin il consulte son emploi du temps sur son dashboard pro — adresses, contacts, détails. Il enchaîne 3 pianos/jour. Fin de semaine : ~1 875 CHF net (15 × 125 CHF après commission). De retour à Cracovie, il consulte ses avis — 4.9/5 en moyenne. Il planifie sa prochaine tournée pour mai. En 3 mois, il a fait 4 tournées et gagné ~7 500 CHF net — soit 10 mois de salaire polonais.

**Capabilities révélées :** Page "Devenez accordeur", formulaire inscription pro, workflow validation admin, Stripe Connect onboarding, publication disponibilités (dates + zone + capacité), dashboard pro (emploi du temps, avis, messages), paiements automatiques via Stripe Connect.

### Parcours 4 : Tomasz — Pro indisponible (Edge Case)

Tomasz a une tournée prévue du 10 au 17 mars avec 12 réservations. Le 5 mars, il a un problème médical et ne peut plus venir.

**Scène :** Tomasz contacte EasyPiano via la messagerie pro. L'admin est alerté immédiatement. Jérôme cherche un remplaçant dans le réseau de pros validés — un autre accordeur couvrant la zone Genève-Lausanne cette période. Si un remplaçant est trouvé : les 12 clients sont notifiés par email ("Votre accordeur a changé, voici le nouveau profil"). Si aucun remplaçant : les clients sont contactés pour proposer un report ou un remboursement complet.

**Note MVP :** Le mécanisme de remplacement est manuel (admin gère au cas par cas). V1 : remboursement total + crédit 20 CHF pour le client (honnêteté, pas de fausse promesse). À terme : réseau de secours (pros remplaçants dans la zone). L'automatisation est post-MVP.

**Capabilities révélées :** Messagerie pro → plateforme, alertes admin urgentes, notification clients en masse, mécanisme de remplacement manuel, remboursement Stripe.

### Parcours 5 : Admin EasyPiano — Gestion quotidienne

Malik et Jérôme, fondateurs. Jérôme gère la relation pros et la validation. Malik gère la plateforme et les opérations.

**Scène d'ouverture :** Lundi matin. Jérôme ouvre le dashboard admin. 2 nouvelles inscriptions pro en attente de validation. Il consulte les profils — photos, bios, certificats uploadés. Il planifie une visio avec chacun cette semaine.

**Action — Validation pro :** Après la visio et la vérification des documents (diplôme, assurance RC (modèle hybride : pro avec RC propre = ok, sans RC = couverture collective EasyPiano avec surcoût aligné sur coût réel), pièce d'identité), Jérôme valide le profil dans le dashboard admin. Le pro reçoit un email : "Votre profil est validé ! Vous pouvez maintenant publier vos disponibilités." Si refus : email explicatif avec motif.

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
| Stripe Checkout | Paiement 150 CHF | — | Suivi |
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

**Innovation structurelle :** Organiser une main-d'œuvre qualifiée d'Europe de l'Est (Pologne, Croatie, Ukraine) en tournées planifiées 6 mois à l'avance pour servir un marché en pénurie en Europe de l'Ouest. Le libre-échange européen + le différentiel de coût de vie permettent une solution unique : les pros gagnent ~1 875-2 500 CHF net/semaine (10 mois de salaire polonais en 1 semaine), les clients paient 150 CHF au lieu de 230 CHF.

**Validation du modèle :** Les pros publient leurs disponibilités 6 mois à l'avance → les créneaux se remplissent en quelques jours → tournée rentable pour le pro + disruption de prix pour le client + commission 17% pour la plateforme. Win-win-win structurel.

**3. Curation physique intensive comme moat dans un monde de marketplaces ouvertes**

Airbnb, Uber, TaskRabbit = marketplaces ouvertes avec validation algorithmique ou automatique. EasyPiano fait l'inverse : *chaque pro est rencontré physiquement par Jérôme avant validation*. C'est lent, non-scalable au début, mais ça construit le moat.

**Innovation de positionnement :** Dans un secteur où le client laisse un inconnu seul chez lui avec un instrument de 5 000-100 000+ CHF, la confiance est le facteur #1. La curation physique devient le différenciateur clé. "Tu as choisi EasyPiano = tu as fait ton choix de confiance." Le badge "Validé par EasyPiano" = signal de confiance transféré de l'individu vers la plateforme.

**Scalabilité :** Au démarrage, c'est manuel (Jérôme rencontre chaque pro). À partir de 50-100 pros validés, le réseau devient auto-référent (les pros recommandent d'autres pros qualifiés). La curation reste manuelle mais le sourcing devient scalable via le réseau.

**4. Arbitrage géographique comme disruption de prix structurelle**

150 CHF vs 180-230 CHF = réduction 35%. Ce n'est pas une promo ou une optimisation opérationnelle temporaire — c'est une asymétrie structurelle basée sur le différentiel de coût de vie EU.

**Innovation business model :** Le pro d'Europe de l'Est gagne ~125 CHF net par accordage (après commission 17%). En une semaine de tournée (15 accordages), il gagne ~1 875 CHF net. Le coût de vie en Pologne/Croatie permet de rendre ce revenu extrêmement attractif (~10 mois de salaire local en 1 semaine), tout en proposant un prix disruptif au client suisse.

**Pérennité :** Tant que le différentiel de coût de vie EU existe ET que la pénurie d'accordeurs en Europe de l'Ouest persiste, le modèle tient. Les deux facteurs sont structurels (pas de renouvellement du métier, convergence économique EU lente).

**5. La technologie comme résolution simultanée de multiples problématiques**

Un seul produit digital résout 5 problèmes en parallèle :

1. **Client** : Impossible de trouver un accordeur disponible → Recherche lieu + date, booking instantané
2. **Client** : Prix opaque et élevé (230 CHF) → Prix fixe transparent 150 CHF
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
- Clients B2B : écoles de musique, conservatoires, hôtels, restaurants, églises, salles de concert

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
3. **Le prix 150 CHF est-il perçu comme "bon deal" ET "crédible" ?** (vs "trop cheap = suspect")

**Métriques de validation MVP :**

- Nombre de réservations/mois (signal brut : ça prend ou pas)
- Taux de remplissage des créneaux pros (signal : le modèle de tournées tient)
- Note moyenne > 4.5/5 (signal : la qualité est là, la confiance se construit)
- Taux de re-réservation (signal ultime : les clients reviennent)

**Phase 2 — Scaling (6+ mois si validation positive) :**

- Expansion géographique : bassin lémanique → Suisse romande/alémanique → France → Allemagne
- Scaling du réseau pros : 5-10 pros au lancement → 50-100 pros en 12 mois
- Automatisation progressive : re-booking 1 clic, mécanisme remplacement (rappel annuel 11 mois déjà en V1)

### Gestion des Risques

| Risque Innovation | Probabilité | Impact | Mitigation |
| --- | --- | --- | --- |
| **Les clients ne font pas confiance à des pros d'Europe de l'Est** | Moyenne | Critique | Curation physique + badge "Validé par EasyPiano" + système d'avis dès J1 + Jérôme (30 ans musicien) comme caution |
| **Les pros ne viennent pas en tournée** (logistique trop complexe) | Faible | Haute | Jérôme a le réseau + étude marché il y a 2 ans confirme l'intérêt + revenu 1 semaine = 10 mois salaire local |
| **Un concurrent réplique le modèle** | Haute (si succès) | Moyenne | Network effects + data moat + brand trust = avantages défendables. Premier arrivé capture la demande latente. |
| **Cadre juridique transfrontalier bloque le modèle** | Faible | Critique | Validation manuelle par Jérôme au MVP (assurance RC (modèle hybride) + pièces justificatives). Cadre juridique détaillé post-MVP avec avocat spécialisé. |
| **Prix 150 CHF perçu comme "trop cheap"** | Faible | Moyenne | Transparence totale sur le modèle : pros EU qualifiés, curation physique, avis vérifiés. Positionnement "bon rapport qualité-prix" pas "discount". |

**Fallback si innovation ne prend pas :**

Si le marché rejette le modèle de tournées transfrontalier :


1. Pivot vers marketplace locale (accordeurs suisses/français/allemands)
2. Commission ajustée (20-25% au lieu de 17%)
3. Prix client ajusté (180-200 CHF au lieu de 150 CHF)
4. Garde la curation physique + booking instantané + avis (innovation #1 et #3 restent valables)

## Scoping Stratégique & Développement Progressif

### Stratégie MVP & Philosophie

**Approche MVP :** Lancement progressif en 3 vagues pour valider le marché rapidement tout en construisant la confiance.

**Phase V0.1 (MVP Lean) :**
Validation des 3 hypothèses critiques avec un produit minimal fonctionnel :

1. Les clients réservent via la plateforme ✓
2. Les pros viennent en tournée ✓
3. Le prix 150 CHF est crédible ✓

**Acquisition initiale :** Réseau Jérôme (20 ans dans le milieu pianistique : salles de concert, professeurs de piano, conservatoires) + Google Ads ciblé ("accordeur piano Lausanne/Genève") + parrainage 20 CHF (crédit réciproque parrain/filleul) + programme d'affiliation pour profs particuliers (commission si envoi d'élèves, modèle CarVertical).

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
| **Landing page** | Acquisition organique + crédibilité | Héro piano, barre recherche lieu + date (CTA principal, mais le site reste navigable librement), contenu confiance/équipe/métier, avis clients affichés, footer "Devenez accordeur" |
| **Recherche & Résultats** | Core value prop | Recherche lieu + date → affichage profils pros disponibles (photo, bio, note estimée, langues, certificats) |
| **Booking & Paiement** | Validation hypothèse #1 (clients réservent) | Sélection créneau demi-journée → récapitulatif → Stripe Checkout 150 CHF → commission 17% Stripe Connect |
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
| **Notifications email** | Engagement & rétention | Confirmation, rappel J-2 + H-2 avant RDV, invitation avis post-intervention, rappel annuel automatique (11 mois après dernier accordage) |

**Features Growth (toujours en V1) :**

- Auth par SMS (code)
- Langues FR + EN au lancement, archi i18n prête pour DE
- Recherche par nom d'accordeur
- Rappel annuel automatique (11 mois après dernier accordage)
- Supplément piano mauvais état (déclaratif client à la réservation, grille fixe par ancienneté, surclassement pro sur place)
- Carnet d'entretien du piano (rapport post-intervention par le pro)
- Parrainage : crédit 20 CHF réciproque (parrain + filleul)

### Phase 3 — Produit Léché (Expansion)

**Déclencheur :** Product-market fit validé (> 50 réservations/mois, note moyenne > 4.5/5, taux re-réservation positif).

**Objectif :** Devenir le standard du marché, ultra-fonctionnel, design irréprochable.

**Features Expansion :**

| Feature | Objectif | Détail |
| --- | --- | --- |
| **Rappel annuel automatique 11 mois** *(déplacé en V1)* | Rétention automatique | "Votre piano a été accordé il y a 11 mois" + CTA re-réservation |
| **Re-booking 1 clic** | Expérience seamless | "Réserver à nouveau avec Tomasz" → 1 clic → confirmation |
| **Mécanisme remplacement automatisé** | Résilience opérationnelle | Si pro indisponible → proposition automatique d'un remplaçant validé dans la zone |
| **App mobile (PWA/Native)** | Expérience mobile premium | Notifications push, expérience native iOS/Android |
| **Analytics & Reporting avancés** | Data-driven decisions | Dashboard analytics pour admin, insights sur remplissage créneaux, zones géographiques, saisonnalité |
| **Pricing dynamique par zone** | Optimisation revenus | Ajustement prix selon demande/offre par région (post-validation marché) |
| **Programme fidélité** | Rétention long-terme | Réductions après X accordages (parrainage déjà en V1) |
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
→ Growth features (SMS Auth, FR+EN (archi prête DE), Recherche par nom)
✅ Product-market fit validé, scalabilité opérationnelle

     ↓

Produit Léché (6+ mois post-V1)
→ Re-booking 1 clic (rappel annuel déjà en V1)
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

- **FR1:** Les visiteurs peuvent accéder à une landing page présentant la valeur du service (héro piano, confiance, équipe, métier, avis clients 5 étoiles affichés)
- **FR2:** Les visiteurs peuvent rechercher des accordeurs disponibles par lieu et date
- **FR3:** Les visiteurs peuvent voir une liste de profils d'accordeurs correspondant à leur recherche
- **FR4:** Les visiteurs peuvent consulter le profil détaillé d'un accordeur (photo, bio, pays, langues, note estimée, certificats, nombre d'interventions, "Mon parcours" (obligatoire), vidéo 30s (optionnel))
- **FR5:** Les visiteurs peuvent accéder au formulaire d'inscription pro via le lien "Devenez accordeur"

### 2. Gestion Utilisateurs

- **FR6:** Les clients peuvent s'authentifier via Google Auth (V0.1), puis email+mot de passe OU SMS+code (V1)
- **FR7:** Les clients peuvent créer et gérer leur profil (nom, prénom, photo, téléphone, toggle Particulier/Pro-B2B à l'inscription)
- **FR7b:** Les clients doivent fournir un email valide au moment de la première réservation (obligatoire pour Stripe Checkout et communications)
- **FR8:** Les pros doivent fournir un email lors de l'inscription (obligatoire pour validation admin + Stripe Connect)
- **FR9:** Les pros peuvent consulter le statut de leur inscription (en attente, validé, refusé)
- **FR9b:** Les pros doivent activer l'authentification à deux facteurs (2FA) dès leur premier client confirmé
- **FR9c:** Les sessions pros expirent automatiquement après X minutes d'inactivité (sécurité)

### 3. Réservation & Paiement

- **FR10:** Les clients authentifiés peuvent sélectionner un créneau de demi-journée disponible chez un accordeur. Réservation instantanée si le client est dans le rayon défini par le pro ; validation requise par le pro si hors rayon.
- **FR11:** Les clients peuvent voir un récapitulatif de leur réservation avant paiement (accordeur, date, créneau, prix 150 CHF)
- **FR12:** Les clients peuvent payer leur réservation via Stripe Checkout
- **FR13:** Les clients reçoivent une confirmation de réservation par email après paiement
- **FR14:** Les pros reçoivent le paiement automatiquement via Stripe Connect (125 CHF net après commission 17%)

### 4. Gestion des Rendez-vous

**Client :**

- **FR15:** Les clients peuvent consulter la liste de leurs prochains rendez-vous
- **FR16:** Les clients peuvent demander l'annulation d'un rendez-vous (via email/WhatsApp dans V0.1)
- **FR17:** Les clients peuvent consulter l'historique de leurs rendez-vous passés (V1)
- **FR18:** Les clients peuvent annuler un rendez-vous avec sélection d'un motif obligatoire parmi 5 options (V1)
- **FR19:** Politique d'annulation par paliers : > 48h avant = remboursement 100%, 24-48h avant = remboursement 50%, < 24h = crédit plateforme (V1)

**Pro :**

- **FR20:** Les pros validés peuvent publier leurs disponibilités (dates, zone géographique, rayon km, capacité journalière). Les réservations dans le rayon défini sont confirmées instantanément ; les réservations hors rayon nécessitent la validation du pro.
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
- **FR34:** Le système envoie des notifications email automatiques (confirmation réservation, rappel J-2 + H-2 avant RDV, invitation avis) (V1)
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
- **FR43:** Les utilisateurs peuvent sélectionner la langue d'interface (FR + EN au lancement, architecture i18n prête pour DE) (V1)
- **FR44:** Les clients peuvent rechercher un accordeur par son nom (V1)
- **FR45:** Supplément "piano en mauvais état" : déclaratif client à la réservation (grille fixe : 2-5 ans sans accordage +30 CHF, 5-10 ans +50 CHF, 10+ ans +80 CHF). Le pro peut surclasser sur place si l'état réel est pire que déclaré. (V1)

### 9. Features Vision (Phase 3)

- **FR46:** *(Déplacé en V1)* Les clients reçoivent un rappel annuel automatique 11 mois après le dernier accordage
- **FR47:** Les clients peuvent re-réserver le même accordeur en 1 clic
- **FR48:** Le système propose automatiquement un accordeur remplaçant si le pro initialement réservé est indisponible
- **FR49:** L'admin peut consulter des analytics avancés (taux de remplissage par zone, saisonnalité, revenus)
- **FR50:** Le système peut appliquer un pricing dynamique par zone géographique

### 10. Programme Affiliation (Innovation)

- **FR51:** Les professeurs de piano peuvent s'inscrire au programme d'affiliation
- **FR52:** Les professeurs affiliés reçoivent une commission automatique via Stripe quand un élève réserve via leur lien

### 11. Carnet d'entretien du piano (V1)

- **FR53b:** Après chaque intervention, le pro remplit un rapport post-intervention ("Carnet d'entretien du piano") : état du piano, recommandations, date suggérée du prochain accordage. Ce rapport est visible par le client dans son dashboard.

### 12. Parrainage (V1)

- **FR53c:** Programme de parrainage : crédit 20 CHF réciproque (parrain + filleul) lors de la première réservation du filleul via lien de parrainage.

### 13. Sécurité & Protection Données

- **FR53:** Les adresses exactes des clients ne sont JAMAIS stockées en clair dans l'historique des pros
- **FR54:** Les adresses exactes sont révélées aux pros dans une fenêtre temporelle limitée (24h avant RDV → fin intervention)
- **FR55:** Les pros doivent activer 2FA (authentification à deux facteurs) obligatoirement dès leur premier client confirmé
- **FR56:** Les sessions pros expirent automatiquement après X minutes d'inactivité (à définir en NFR : 15-30 min recommandé)

## Exigences Non-Fonctionnelles

### Architecture & Évolutivité

- **NFR-ARCH1:** Le frontend Next.js communique avec le backend via API REST uniquement (pas de couplage direct Firebase SDK côté client sauf auth)
- **NFR-ARCH2:** Les services backend sont abstraits (database.js, auth.js) pour permettre migration sans refonte frontend
- **NFR-ARCH3:** Le système doit supporter migration backend Firebase → PostgreSQL + Python sans downtime > 2h

### Performance

- **NFR-P1:** Temps de chargement initial < 3s sur connexion 3G
- **NFR-P2:** Actions utilisateur (recherche, booking, consultation dashboard) complètent en < 2s sur connexion standard
- **NFR-P3:** Lighthouse Performance Score > 80
- **NFR-P4:** Première page interactive (FCP - First Contentful Paint) < 1.5s
- **NFR-P5:** Le système supporte 100 utilisateurs concurrents sans dégradation > 10% des temps de réponse

### Security

- **NFR-S1:** Toutes les communications client-serveur utilisent HTTPS/TLS 1.3+
- **NFR-S2:** Les adresses exactes des clients sont chiffrées en base de données et révélées temporairement (24h avant RDV)
- **NFR-S3:** Les sessions pros expirent après 30 minutes d'inactivité
- **NFR-S4:** 2FA obligatoire pour tous les pros dès le premier client confirmé
- **NFR-S5:** Paiements traités via Stripe (PCI-DSS Level 1 compliant) — aucune donnée de carte bancaire stockée sur EasyPiano
- **NFR-S6:** Conformité RGPD (GDPR) : droit à l'oubli, export données, consentement explicite pour communications marketing
- **NFR-S7:** Les tokens d'authentification Firebase sont renouvelés automatiquement toutes les heures
- **NFR-S8:** Les logs contenant des données sensibles (adresses, emails, téléphones) sont anonymisés après 30 jours

### Scalability

- **NFR-SC1:** Le système supporte 10x croissance du nombre d'utilisateurs (50 → 500) avec < 10% dégradation performance
- **NFR-SC2:** Base de données optimisée avec index appropriés pour requêtes fréquentes (recherche lieu + date)
- **NFR-SC3:** Le système gère 1 000 réservations/mois en V1, 10 000 réservations/mois en Phase 3
- **NFR-SC4:** Les images pros sont optimisées et servies via CDN

### Accessibility

- **NFR-A1:** Conformité WCAG 2.1 Level AA
- **NFR-A2:** Navigation complète au clavier (Tab, Enter, Esc) pour toutes les fonctionnalités critiques (recherche, booking, dashboards)
- **NFR-A3:** Contraste couleurs minimum 4.5:1 pour textes normaux, 3:1 pour textes larges
- **NFR-A4:** Support lecteurs d'écran (ARIA labels, semantic HTML)
- **NFR-A5:** Taille de police minimum 16px, boutons tactiles minimum 44x44px (mobile-friendly)
- **NFR-A6:** Messages d'erreur clairs et explicites (pas de codes techniques pour l'utilisateur final)

### Integration

- **NFR-I1:** Intégration Stripe Checkout : succès de paiement confirmé en < 5s
- **NFR-I2:** Webhooks Stripe (payment_intent.succeeded, etc.) traités en < 30s
- **NFR-I3:** Notifications email envoyées en < 2 minutes après événement déclencheur
- **NFR-I4:** Firebase Auth : authentification Google complétée en < 3s
- **NFR-I5:** Fallback manuel si Stripe Connect indisponible (admin peut traiter paiement manuellement)
- **NFR-I6:** Les pros reçoivent leurs paiements automatiquement chaque vendredi (Stripe Connect Weekly Payout)
- **NFR-I7:** Option Instant Payout disponible en V1+ (pro paye frais 1% pour paiement immédiat)

### Reliability

- **NFR-R1:** Disponibilité > 99.5% (max 3.6h downtime/mois)
- **NFR-R2:** Paiements Stripe : 0 échec non-résolu
- **NFR-R3:** Monitoring + alertes admin si erreurs critiques (> 10 erreurs/heure)
- **NFR-R4:** Backup base de données automatique quotidien (Firebase export V0.1, PostgreSQL auto-backup V1+)
- **NFR-R5:** Procédure de rollback en < 15 minutes si déploiement critique défaillant

### Monitoring & Observability

- **NFR-M1:** Sentry activé pour error tracking frontend + backend (gratuit jusqu'à 5K erreurs/mois)
- **NFR-M2:** Logs structurés (JSON) pour faciliter debugging et analytics
- **NFR-M3:** Alertes Slack/Email automatiques si :
  - Erreur critique (crash backend)
  - Paiement Stripe échoué
  - Downtime > 2 min
  - Taux d'erreur > 5%
