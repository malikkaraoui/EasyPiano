---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: 'Vision complète EasyPiano - UX, UI, fonctionnalités clés, modèle économique'
session_goals: 'Définir la vision fondatrice de la plateforme EasyPiano'
selected_approach: 'ai-recommended'
techniques_used: [elicitation-directe, questions-progressives, assumption-reversal, six-thinking-hats, cross-pollination]
ideas_generated: [prix-150chf, b2b-toggle, rayon-validation, credit-plateforme, assurance-hybride, supplement-declaratif, piquet-honnete, rappel-annuel, carnet-entretien, abonnement-annuel, avis-5-etoiles, profil-video, parcours-obligatoire]
context_file: ''
session_continued: true
continuation_date: '2026-03-20'
session_active: false
workflow_completed: true
---

# Brainstorming Session Results

**Facilitator:** Malik
**Date:** 2026-03-03

---

## 1. Vision Produit

### Le Problème
- Le métier d'accordeur de piano est en voie de disparition en Europe occidentale (Suisse, France, Allemagne, Luxembourg)
- Pénurie massive : pas assez de renouvellement dans l'apprentissage
- Le marché est ultra-traditionnel : paiement en espèces ou facture à 10 jours, pas de digital, aucune organisation
- Aucune plateforme concurrente — marché complètement vierge en digital

### La Solution
- Le libre-échange européen donne accès à des accordeurs qualifiés d'Europe de l'Est (Croatie, Pologne, Ukraine, Italie) — main-d'œuvre sous-exploitée dans ce métier de niche
- EasyPiano organise, digitalise et structure ce marché en connectant cette offre avec la demande
- Plateforme curatée : chaque pro est rencontré physiquement par l'équipe EasyPiano avant d'être validé

### La Disruption
- Prix marché actuel : **230 CHF** l'accordage
- Prix EasyPiano : **150 CHF** — 35% moins cher (révisé le 2026-03-20 15:00)
- Possible grâce au coût de vie plus bas des pros d'Europe de l'Est
- Le pro gère sa propre logistique (transport, hôtel)

---

## 2. Marché Cible

- **Zone de lancement** : Bassin lémanique (Genève → Lausanne, côté France inclus)
- **Scalabilité** : Partout où il y a des pianos = futurs clients
- **Clients** : Particuliers ET B2B (écoles de musique, conservatoires, hôtels, restaurants, églises, salles de concert)
- **Inscription** : Toggle Pro / Particulier dès l'inscription → deux workflows séparés

---

## 3. Modèle Économique

| Élément | Détail |
|---|---|
| Prix accordage | 150 CHF (fixé par EasyPiano, pas par le pro) |
| Commission | 17% (25 CHF) |
| Revenu pro | 125 CHF par accordage |
| Supplément piano mauvais état | Grille fixe basée sur déclaration client à la résa (dernier accordage : 2-5 ans +30 CHF, 5-10 ans +50 CHF, 10+ ans +80 CHF) |
| Surclassement sur place | Le pro peut surclasser si l'état réel est pire que déclaré → notification + paiement complémentaire Stripe |
| Commission sur supplément | Quasi nulle (carotte pour le pro) |
| Paiement client | Au moment de la réservation (bloque le créneau) |
| Capacité pro | ~3 pianos/jour (1 matin, 2 après-midi), configurable |
| Rentabilité pro/semaine | ~1 875-2 500 CHF net pour une tournée d'une semaine (à 125 CHF/accordage) |

---

## 4. Expérience Utilisateur — Client

### Page d'Accueil
1. **Héro plein écran** : Image de piano à queue, thème sombre, design premium et épuré
2. **Barre de recherche en bas** : sobre, lieu + date obligatoires
3. **Scroll avec animations** façon Apple (iPhone sur apple.com) — les éléments apparaissent avec fluidité
4. **Contenu scroll** :
   - Atouts du service + politique de confiance
   - Commentaires clients mis en avant
   - Photo de l'équipe EasyPiano
   - L'histoire du métier d'accordeur — un métier qui a besoin d'un coup de neuf
   - Les 3 étapes : Rechercher → Booker → Jour J
5. **Footer** : Lien discret "Devenez accordeur"

### Parcours de Réservation
1. Recherche par **lieu + date** (CTA principal, mais le site reste navigable librement)
2. Résultats : uniquement les pros disponibles pour ce créneau/lieu
3. Clic sur un pro → **page profil complète**
4. Bouton "Réserver" → **récapitulatif des détails**
5. **Paiement via Stripe** → réservation confirmée

### Authentification
- Google Auth ou SMS (code reçu) — rapide, sans friction
- Pas de mot de passe classique

### Dashboard Client (style Doctolib)
- Prochains RDV visibles
- Historique des réservations
- Annulation : 100% si >48h, 50% si 24-48h, crédit plateforme si <24h
- Modification de date possible avec validation du pro
- Messagerie vers le pro
- Messagerie vers la plateforme
- Config notifications : email ou SMS au choix
- Validation numéro de téléphone (si auth Google)
- Photo de profil, nom, prénom
- Se déconnecter / supprimer son compte

---

## 5. Expérience Utilisateur — Pro (Accordeur)

### Inscription
- Lien discret en bas de page : "Devenez accordeur"
- Inscription : photo, bio, expérience, nom, prénom
- Profil soumis à **validation par EasyPiano** (pas de publication instantanée)

### Profil Public (vu par le client)
- Photo
- Bio
- **"Mon parcours"** (obligatoire) — où il a appris, depuis combien de temps, sa passion
- **Vidéo 30s** (optionnel) — le pro en train d'accorder
- Pays d'origine
- Langues parlées
- Nombre d'interventions via la plateforme
- Note moyenne + commentaires clients
- Certificats

### Dashboard Pro
- Consulter son emploi du temps
- Définir ses jours de disponibilité (6 mois à l'avance) + rayon d'action géographique
- Configurer sa capacité (nombre d'accordages par demi-journée)
- Répondre aux commentaires clients
- Répondre aux messages de contact
- Modifier son profil

### Tournées
- Le pro déclare "disponible du X au Y à [zone géographique]"
- Créneaux en demi-journée (matin / après-midi)
- Réservation instantanée dans le rayon défini par le pro — hors rayon = validation pro requise

---

## 6. Confiance & Sécurité

| Pilier | Détail |
|---|---|
| Curation | Chaque pro rencontré physiquement par l'équipe EasyPiano |
| Validation | Profil vérifié avant publication |
| Philosophie | "Tu as choisi EasyPiano = tu as déjà fait ton choix de confiance" |
| Assurance | Modèle hybride : pro avec RC = ok, sans RC = couverture collective EasyPiano (surcoût aligné sur coût réel) |
| Avis | Unilatéral : seul le client note le pro (5 étoiles, relayés sur la page d'accueil) |
| Annulation pro | V1 : remboursement total + crédit 20 CHF. À terme : réseau de secours |

---

## 7. Spécifications Techniques

| Élément | Choix |
|---|---|
| Type | Web responsive (mobile-first) |
| App native | Pas à l'ordre du jour |
| Langues | FR + EN au lancement, archi i18n prête pour DE |
| Auth | Google Auth + SMS (code) |
| Paiement | Stripe Connect |
| Notifications | Email ou SMS (au choix du client, configurable) |
| Admin | Validation pros + accès dashboard Stripe |

---

## 8. Sujets à Creuser (résolus le 2026-03-20 15:00)

- [x] Politique d'annulation : paliers 48h (100%) / 24h (50%) / <24h (crédit plateforme)
- [x] Assurance RC pro : modèle hybride (RC propre ou couverture collective EasyPiano, surcoût aligné sur coût réel)
- [x] Supplément piano mauvais état : déclaratif client à la résa (grille fixe) + surclassement pro sur place si nécessaire
- [x] Mécanisme de remplacement : V1 = honnêteté + remboursement total + crédit 20 CHF. Scale = réseau de secours
- [x] Stratégie de lancement : réseau associé (pianiste, 20 ans sur le secteur) + Google Ads ciblé + parrainage 20 CHF
- [x] Recrutement accordeurs : associé a déjà des contacts + tour des écoles/centres de formation (petit milieu)
- [x] i18n : FR + EN au lancement, archi i18n prête pour DE

---

## Sélection des Techniques

**Approche :** Recommandation IA
**Contexte :** Vision complète EasyPiano — résoudre les sujets ouverts + challenger les hypothèses

**Techniques recommandées :**

- **Assumption Reversal (Phase 1) :** Retourner chaque hypothèse fondatrice pour identifier les angles morts
- **Six Thinking Hats (Phase 2) :** Analyser systématiquement les 7 sujets ouverts sous tous les angles
- **Cross-Pollination (Phase 3) :** Emprunter des patterns d'autres industries pour innover au-delà du cadre marketplace classique

---

## 9. Résultats Phase 1 — Assumption Reversal (2026-03-20 15:00)

7 hypothèses fondatrices challengées :

| # | Hypothèse challengée | Décision |
|---|---|---|
| 1 | Prix fixe unique 125 CHF | Révisé → **150 CHF**, commission 17% (25 CHF), pro à 125 CHF |
| 2 | Curation physique obligatoire | V1 = physique. Scale = visio + certificats + essai supervisé |
| 3 | Pro gère sa logistique | Non-sujet MVP (pros locaux). Scale = pré-résa + seuil minimum |
| 4 | Réservation 100% instantanée | Dans le rayon = instantané. Hors rayon = validation pro |
| 5 | Particuliers uniquement | **B2B inclus dès V1** — toggle Pro/Particulier à l'inscription |
| 6 | Recherche verrouillée lieu+date | Assoupli — CTA principal mais site navigable librement |
| 7 | Commission 10% (12.50 CHF) | Révisé → **17% (25 CHF)** — pro gagne plus, plateforme respire |

---

## 10. Résultats Phase 2 — Six Thinking Hats (2026-03-20 15:30)

7 sujets ouverts résolus (voir section 8 pour le détail des décisions).

---

## 11. Résultats Phase 3 — Cross-Pollination (2026-03-20 16:00)

Patterns empruntés à d'autres industries :

| Source | Pattern | Application EasyPiano | Priorité |
|---|---|---|---|
| Doctolib | Rappels automatiques | J-2 + H-2 avant le RDV | **V1** |
| Doctolib | Rappel récurrent | Rappel annuel automatique ("11 mois depuis votre dernier accordage") | **V1** |
| Uber | Statut en temps réel | "Confirmé" uniquement en V1. Tracking détaillé post-MVP | **V1 simplifié** |
| Airbnb | Profil humanisé | "Mon parcours" obligatoire + vidéo 30s optionnelle | **V1** |
| Nespresso | Suivi post-intervention | **Carnet d'entretien du piano** — rapport d'accordage, état, recommandations | **V1** |
| Amazon Prime | Abonnement récurrence | Abo annuel (2 accordages/an, petite économie, planification auto) | **Post-MVP** |
| Booking.com | Urgence sociale | "Il reste X créneaux cette semaine" | **Post-MVP** |
| Spotify | Bilan annuel personnalisé | Résumé annuel du piano et des interventions | **Post-MVP** |
| Booking.com | Avis 5 étoiles | Commentaires clients relayés sur la page d'accueil | **V1** |
| Booking.com | Parrainage | Crédit 20 CHF réciproque (parrain + filleul) | **V1** |

---

## 12. Équipe et Rôles

| Rôle | Personne | Responsabilités |
|---|---|---|
| Dev & Tech | Malik | Développement plateforme, architecture technique |
| Commercial & Réseau | Associé (pianiste, 20 ans d'expérience) | Acquisition clients, sourcing accordeurs, démarchage B2B |

---

## 13. Roadmap Post-MVP

Fonctionnalités identifiées pour les versions futures :

- [ ] Optimisation géographique des créneaux (algorithme)
- [ ] Système de pré-réservation pour les tournées longue distance
- [ ] Statut de suivi détaillé (en route, en cours, terminé)
- [ ] Abonnement annuel client (2 accordages/an)
- [ ] Urgence sociale ("Il reste X créneaux")
- [ ] Bilan annuel personnalisé style Spotify
- [ ] Paliers de prix (Standard / Premium / Concert)
- [ ] Réseau de secours (accordeurs locaux en backup)
- [ ] Process de curation hybride (visio + essai supervisé)
- [ ] Ajout langue DE pour la Suisse alémanique

---

## Résumé de Session

**Session continuée le :** 2026-03-20 15:00
**Techniques utilisées :** Assumption Reversal, Six Thinking Hats, Cross-Pollination
**Décisions majeures prises :** 14
**Sujets ouverts résolus :** 7/7
**Nouvelles fonctionnalités identifiées (V1) :** 7
**Fonctionnalités post-MVP identifiées :** 10
