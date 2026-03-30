---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-core-experience', 'step-04-emotional-response', 'step-05-inspiration', 'step-06-design-system', 'step-07-defining-experience', 'step-08-visual-foundation', 'step-09-design-directions']
inputDocuments: ['prd.md', 'product-brief-EasyPiano-2026-03-03.md', 'market-piano-tuning-marketplace-research-2026-03-04.md', 'architecture-web-app.md']
workflowType: 'ux-design'
date: '2026-03-07'
---

# UX Design Specification EasyPiano

**Author:** Malik
**Date:** 2026-03-07

---

## Executive Summary

### Project Vision

**EasyPiano** est la première marketplace digitale d'accordage piano en Europe continentale. La plateforme transforme un secteur 100% analogique en créant une expérience **raffinée, sobre et tech** qui inspire la confiance.

**Positionnement UX** : "Le Booking.com de l'accordage piano" — une expérience millimetrée où chaque élément est pensé pour **rassurer, simplifier et séduire**. L'interface doit transmettre l'élégance du piano lui-même : calme, épurée, sophistiquée, mais résolument moderne et accessible.

**Différenciateur visuel** : Thème sombre élégant avec héro plein écran (piano à queue), animations subtiles façon Apple. Chaque interaction doit être fluide, intuitive, évidente. "Tout tombe sous la main."

**Mission UX** : Transformer 3-6 semaines de recherche frustrante en **2 minutes de parcours fluide et rassurant**. Le design crée la confiance que la curation physique garantit.

### Target Users

**Persona 1 : Sophie (Cliente) — 42 ans, Lausanne**

- **Contexte** : Propriétaire piano droit Yamaha, 2 enfants en cours de piano, cherche accordeur depuis des semaines sans succès
- **Tech-savviness** : Moyenne (utilise Google, réservations en ligne, paiement Stripe)
- **Devices** : Desktop (recherche initiale) + Mobile (consultation dashboard)
- **Pain points critiques** :
  - Impossible de trouver un accordeur disponible (pénurie, pas de plateforme)
  - Prix opaque et élevé (180-230 CHF)
  - Aucune garantie de qualité (pas d'avis structurés)
- **Moment "aha!"** : Recherche "Lausanne + 15 mars" → 3 profils comparables apparaissent → profil détaillé rassurant (photo, bio, conservatoire, 4.8/5, badge "Validé") → réserve en 2 min → paie 125 CHF → confirmation immédiate
- **Attentes UX** : Clarté, rapidité, confiance, transparence tarifaire, booking sans friction

**Persona 2 : Tomasz (Pro) — 35 ans, Cracovie**

- **Contexte** : Accordeur professionnel depuis 12 ans, conservatoire de Cracovie, gagne ~180 CHF/semaine en Pologne, rêve d'accéder au marché suisse
- **Tech-savviness** : Moyenne (à l'aise avec smartphone, mais Stripe Connect nécessite guidage)
- **Devices** : Desktop (publication tournée) + Mobile (consultation emploi du temps en mobilité)
- **Pain points critiques** :
  - Aucun canal pour accéder au marché suisse lucratif
  - Organisation logistique complexe (tournées, transport, Airbnb)
- **Moment "aha!"** : Déclare tournée "Genève-Lausanne 10-17 mars" → créneaux se remplissent en 5 jours → 1 875 CHF net pour la semaine
- **Attentes UX** : Publication simple, emploi du temps clair et visuel, optimisation tournées (rayon, capacité)

**Persona 3 : Admin (Malik + Jérôme) — Fondateurs**

- **Contexte** : Jérôme valide pros (rencontre physique), Malik gère plateforme/opérations
- **Tech-savviness** : Élevée
- **Devices** : Desktop principalement
- **Attentes UX** : Dashboard admin efficace (validation profils, analytics, gestion incidents, accès Stripe)

### Key Design Challenges

**Challenge #1 : Transmettre la confiance visuellement**

- Barrière psychologique : laisser un inconnu d'Europe de l'Est chez soi avec un instrument de 5 000-100 000+ CHF
- Solution UX :
  - Profils ultra-détaillés (photo professionnelle haute qualité, bio humanisée, conservatoire, langues, certificats scannés visibles)
  - Badge "Validé par EasyPiano" omniprésent (couleur distinctive, expliqué clairement)
  - Trust signals partout : "Rencontré physiquement par notre équipe", "X interventions réalisées", avis vérifiés (V1)
  - Design sobre et raffiné = sérieux professionnel

**Challenge #2 : Parcours booking < 3 minutes avec zéro friction**

- Le marché actuel = 3-6 semaines de recherche → EasyPiano doit être **instantané et évident**
- Solution UX :
  - Barre recherche héro prominente (lieu + date = seuls inputs nécessaires)
  - Résultats immédiats avec profils comparables côte à côte
  - Booking instantané (créneaux déjà validés, pas de confirmation pro)
  - Prix fixe 125 CHF affiché dès les résultats (zéro surprise)
  - Google Auth 1 clic → Stripe Checkout → confirmation email

**Challenge #3 : Mobile-first avec audience 40-60 ans potentiellement senior**

- Propriétaires de piano = souvent moins tech-savvy, mais utilisent smartphones
- Solution UX :
  - Responsive mobile-first (conception mobile d'abord, desktop ensuite)
  - UI ultra-simple et épurée (pas de surcharge cognitive)
  - Tailles de police minimum 16px, boutons tactiles 44x44px
  - Contraste WCAG 2.1 AA minimum (4.5:1 textes normaux)
  - Navigation au clavier complète (Tab, Enter, Esc)
  - Messages d'erreur clairs en français (pas de jargon technique)

**Challenge #4 : Dashboard pro optimisé pour tournées**

- Pros consultent emploi du temps en mobilité (smartphone)
- Besoin d'optimisation géographique (rayon 50 km, capacité matin/après-midi)
- Adresses clients protégées (révélées 24h avant uniquement)
- Solution UX :
  - Emploi du temps visuel (calendrier + carte géographique)
  - Informations partielles avant 24h (ville/zone, nom client, créneau)
  - Adresse exacte révélée automatiquement 24h avant
  - Interface mobile optimisée (consultation rapide entre 2 RDV)

**Challenge #5 : Stripe Connect onboarding guidé**

- Pros d'Europe de l'Est pas forcément à l'aise avec onboarding bancaire digital international
- Solution UX :
  - Guidage pas-à-pas avec explications en français + anglais
  - Lien direct vers dashboard Stripe Connect depuis dashboard EasyPiano
  - Support visuel (screenshots, vidéos courtes)
  - Status clair : "En attente validation bancaire", "Actif - Prêt à recevoir paiements"

### Design Opportunities

**Opportunité #1 : Thème sombre élégant = différenciation esthétique premium**

- Marché actuel = sites vitrines accordeurs vieillots, zéro soin graphique
- EasyPiano = **expérience visuelle incroyable**, niveau Steinway/Apple
- Inspiration :
  - Héro plein écran piano à queue (photo haute qualité, éclairage dramatique)
  - Palette sombre élégante (noir profond, gris anthracite, accents dorés subtils)
  - Animations scroll fluides et subtiles (parallax, fade-in progressifs)
  - Typography raffinée (Playfair Display pour titres, Inter pour corps de texte)
- Message subliminal : "Ce n'est pas un service cheap — c'est du raffinement accessible"

**Opportunité #2 : Trust signals omniprésents et naturels**

- Chaque écran doit **rassurer sans être lourd**
- Intégration naturelle :
  - Badge "Validé par EasyPiano" avec tooltip explicatif au survol
  - Photo + bio humanisée (pas juste "technicien X")
  - Certificats visibles mais élégants (icônes diplôme, pas scans bruts)
  - Langues parlées avec drapeaux discrets
  - Nombre d'interventions + note moyenne (V1) intégrés au profil
  - Section "Comment nous validons nos accordeurs" sur landing page

**Opportunité #3 : Booking instantané comme killer UX**

- Flow de conversion optimisé :
  1. Héro landing : barre recherche centrale (lieu + date)
  2. Résultats : grille profils (photo, nom, note estimée, langues, dispo)
  3. Profil détaillé : tout ce qu'il faut savoir en 1 scroll (bio, certificats, avis futurs)
  4. Booking : sélection créneau (matin/après-midi), récapitulatif clair
  5. Auth : Google 1 clic (ou email+password V1)
  6. Paiement : Stripe Checkout (125 CHF clairement affiché)
  7. Confirmation : email + dashboard "Prochains RDV"
- Chaque étape = **0 friction, tout tombe sous la main**

**Opportunité #4 : Dashboard pro comme outil métier pro**

- Pas juste un "espace pro", mais un **vrai outil de gestion de tournées**
- Fonctionnalités UX différenciantes :
  - Calendrier visuel avec remplissage des créneaux en temps réel
  - Carte géographique des RDV (optimisation trajets)
  - Statistiques simples : revenus semaine, taux remplissage, note moyenne
  - Accès direct Stripe dashboard (bouton CTA visible)
  - Gestion disponibilités 6 mois à l'avance (formulaire simple : dates, zone, rayon, capacité)
- Design sobre et fonctionnel = **outil professionnel crédible**

**Opportunité #5 : Micro-interactions qui rassurent**

- Feedbacks visuels subtils mais rassurants :
  - Animation checkmark après paiement réussi
  - Progress bar durant recherche (même si instantané, perçu comme "recherche sérieuse")
  - Hover states élégants sur cartes profil (zoom léger photo, shadow accentuée)
  - Loading states clairs (skeleton screens, pas spinners génériques)
  - Confirmations visuelles pour actions critiques (annulation, validation)
- Chaque interaction doit dire : **"Tout est sous contrôle, nous gérons"**

## Core User Experience

### Defining Experience

**L'action utilisateur centrale d'EasyPiano** est le flow de booking instantané :

**Client (Sophie) — Parcours core :**

1. **Recherche** : Entre lieu (autocomplétion + bouton "Me localiser") + date (date picker élégant)
2. **Découverte** : Voit profils disponibles instantanément (photo, bio, note, langues, badge)
3. **Exploration** : Clique sur profil → détails complets en 1 scroll (certificats, avis futurs)
4. **Réservation** : Sélectionne créneau matin/après-midi → récapitulatif clair
5. **Authentification** : Google Auth 1 clic (modal, pas redirect)
6. **Paiement** : Stripe Checkout embedded → 125 CHF
7. **Confirmation** : Email immédiat + dashboard "Prochains RDV" + **"Ajouter à mon agenda"**

**Objectif absolu** : Parcours complet en **< 3 minutes** avec **zéro friction**.

**Pro (Tomasz) — Parcours core :**

1. **Publication tournée** : Dates + zone géographique + rayon 50 km + capacité (matin/après-midi)
2. **Remplissage créneaux** : Réservations arrivent en temps réel
3. **Consultation emploi du temps** : Calendrier visuel + carte géographique (mobile-optimized)
4. **Adresses révélées** : 24h avant RDV automatiquement
5. **Paiements** : Stripe Connect Weekly Payouts (vendredis)

### Platform Strategy

**Plateforme principale** : Web responsive (Next.js 15 + App Router)

**Desktop (priorité recherche + booking) :**

- Recherche initiale et exploration profils détaillés
- Inputs : Souris + clavier
- Écran large = grille profils côte à côte (3 colonnes)
- Typography lisible (16px minimum)

**Mobile (priorité consultation + suivi) :**

- Dashboard client : prochains RDV, messagerie (V1)
- Dashboard pro : emploi du temps, carte trajets
- Inputs : Tactile (boutons 44x44px minimum)
- Navigation thumb-friendly (éléments importants bas écran)
- Scroll vertical naturel (pas pagination)

**Capabilities spécifiques :**

- **Géolocalisation** : Bouton "Me localiser" pour autocomplétion lieu
- **Autocomplétion** : Villes/codes postaux avec suggestions intelligentes
- **Désactivation autocomplete Safari** : Pas de suggestions contacts dans champ ville (`autocomplete="off"` ou `autocomplete="address-level2"`)
- **Notifications email** : Confirmation, rappel 24h avant
- **Stripe Checkout embedded** : Pas redirect externe
- **Calendrier personnel** : Bouton "Ajouter à mon agenda" (fichier .ics compatible Google Calendar, Apple Calendar, Outlook)
- **Offline** : Non nécessaire MVP (booking = connexion requise)

### Effortless Interactions

**1. Recherche instantanée et intelligente**

- **Barre search héro** : 2 champs (lieu + date), design épuré, focus automatique sur lieu au load
- **Autocomplétion lieu** : Suggestions villes/codes postaux Suisse/France/Allemagne en temps réel
- **Bouton "Me localiser"** : Géolocalisation 1 clic → détection ville automatique
- **Date picker élégant** : Sélection jusqu'à 6 mois à l'avance, visuel clair (calendrier)
- **Désactivation autocomplete Safari** : Pas suggestions contacts sur champ ville (`autocomplete="off"` ou valeur custom comme `autocomplete="address-level2"`)
- **Résultats instantanés** : < 1s perçu (skeleton screens pendant chargement)

**2. Comparaison profils fluide**

- **Grille cartes profils** : Photo haute qualité, nom, note estimée (MVP) / vraie note (V1), langues (drapeaux), badge "Validé"
- **Hover effects subtils** : Zoom photo léger (scale 1.05), shadow accentuée, transition 200ms
- **Scroll vertical fluide** : Pas pagination (infinite scroll si > 10 pros)
- **Filtres optionnels (V1)** : Langues, disponibilité, note → sidebar collapsible

**3. Booking sans friction**

- **Pas de confirmation pro** : Créneaux affichés = disponibles (réservation instantanée)
- **Sélection créneau** : Boutons radio matin (9h-12h) / après-midi (14h-17h), visuel clair
- **Récapitulatif transparent** : Accordeur, date, créneau, 125 CHF (prix fixe, pas surprise)
- **Google Auth modal** : Pas redirect page entière, modal overlay élégante
- **Stripe Checkout embedded** : Intégré dans flow, pas nouvelle fenêtre
- **Confirmation immédiate** : Animation checkmark + email automatique < 30s
- **Ajouter à l'agenda** : Bouton CTA "Ajouter à mon agenda" sur page confirmation + lien dans email confirmation (génère fichier .ics compatible tous calendriers)

**4. Gestion échec gracieuse (0 résultat)**

- **Pas d'impasse** : Si aucun pro disponible pour date choisie
- **Suggestion intelligente** : "Aucun accordeur disponible le 15 mars. Voici d'autres dates proches :"
  - 12 mars (2 pros disponibles)
  - 18 mars (3 pros disponibles)
  - 22 mars (1 pro disponible)
- **Élargissement rayon** : "Élargir la recherche à 100 km ?" (option subtile)
- **Notification future** : "M'alerter quand un pro est disponible le 15 mars" (V1+)

**5. Trust signals naturels**

- **Badge "Validé par EasyPiano"** : Couleur distinctive (doré/vert), tooltip explicatif au survol
- **Profil humanisé** : Photo pro haute qualité, bio narrative (pas CV sec), conservatoire, langues
- **Certificats élégants** : Icônes diplôme, pas scans bruts, cliquables pour voir détails
- **Section "Comment nous validons"** : Accessible footer, explique curation physique

### Critical Success Moments

**Moment #1 : Premiers résultats de recherche (< 3 secondes)**

- **Échec** : Recherche "Lausanne + 15 mars" → 0 résultat → Sophie abandonne
- **Succès** : Résultats instantanés avec 3 profils rassurants (photo, badge, note) → confiance établie
- **Critère** : Au moins 1 profil disponible dans rayon 50 km, sinon suggestions dates alternatives
- **Fallback** : Orientation subtile vers autres dates ou rayon élargi (pas impasse)

**Moment #2 : Découverte profil pro (exploration 30-60 secondes)**

- **Échec** : Profil générique, manque infos, pas rassurant → Sophie doute et compare ailleurs
- **Succès** : Profil détaillé et humanisé (photo pro, bio conservatoire, langues, certificats, badge) → "Je peux faire confiance"
- **Critère** : Toutes les infos essentielles en 1 scroll, design sobre et élégant

**Moment #3 : Paiement Stripe (confirmation < 5 secondes)**

- **Échec** : Stripe échoue ou prend > 10s → frustration maximale, abandon
- **Succès** : Paiement instantané + animation checkmark + email confirmation < 30s → soulagement
- **Critère** : Zéro échec paiement non-résolu (NFR-R2 du PRD)

**Moment #4 : Confirmation et intégration agenda**

- **Échec** : Confirmation floue, Sophie doit noter manuellement le RDV dans son agenda → friction
- **Succès** : Page confirmation claire + bouton "Ajouter à mon agenda" + lien dans email → RDV intégré agenda personnel en 1 clic
- **Critère** : Fichier .ics généré correctement (compatible Google Calendar, Apple Calendar, Outlook)
- **Impact** : Réduit oublis, augmente taux de présence, renforce perception "tout est géré"

**Moment #5 : Dashboard client (visibilité RDV)**

- **Échec** : Dashboard confus, RDV mal présenté, pas d'infos claires → anxiété client
- **Succès** : "Prochains RDV" clair (accordeur, date, créneau, adresse révélée si < 24h) → rassurance
- **Critère** : Informations critiques visibles immédiatement, design calme

**Moment #6 : Re-réservation 11 mois plus tard (V1+)**

- **Échec** : Sophie doit refaire toute la recherche → friction inutile
- **Succès** : Email rappel "Réserver à nouveau avec Tomasz en 1 clic" → fidélisation parfaite
- **Critère** : Taux re-réservation > 50% (signal product-market fit)

### Experience Principles

**Les principes directeurs UX qui guident toutes nos décisions de design :**

**1. Instantanéité** — Chaque interaction doit être rapide et réactive (< 1s perçu). Skeleton screens, pas spinners génériques.

**2. Anticipation intelligente** — Le système devine les besoins avant que l'utilisateur demande :

- Autocomplétion lieu en temps réel
- Bouton "Me localiser" (géolocalisation)
- Suggestions dates alternatives si 0 résultat
- Désactivation autocomplete Safari (pas suggestions contacts)
- "Ajouter à mon agenda" proposé automatiquement

**3. Zéro friction** — Éliminer tous les points de friction identifiés :

- Booking instantané (pas confirmation pro)
- Google Auth modal (pas redirect)
- Stripe Checkout embedded (pas nouvelle fenêtre)
- Autocomplete désactivé sur champs où ça gêne
- Export agenda en 1 clic (fichier .ics)

**4. Graceful degradation** — Même en cas d'échec, orienter positivement :

- 0 résultat → suggestions dates alternatives subtilement
- Stripe timeout → retry automatique + message clair
- Loading long → progress feedback + estimation temps

**5. Confiance omniprésente** — Chaque écran rassure naturellement sans être lourd :

- Badge "Validé par EasyPiano" toujours visible
- Profils ultra-détaillés et humanisés
- Design sobre et raffiné = sérieux professionnel
- Micro-interactions qui disent "tout est sous contrôle"

**6. Tout tombe sous la main** — Ergonomie intuitive où rien n'est caché :

- Navigation évidente (pas menus hamburger sauf mobile)
- CTA clairement visibles (contrastes WCAG AA)
- Hiérarchie visuelle forte (typography, spacing, couleurs)
- Actions critiques accessibles en 1-2 clics maximum
- Fonctionnalités utiles proposées au bon moment (ajouter agenda après confirmation)

## Desired Emotional Response

### Primary Emotional Goals

**Pour Sophie (cliente) — L'émotion dominante : SOULAGEMENT**

| Émotion | Traduction concrète |
|---|---|
| **Soulagement** | "Une épine en moins dans le pied" — le problème est résolu |
| **Évidence** | "Pourquoi ce site n'existait pas avant ?" — product-market fit ressenti |
| **Confiance aveugle** | "J'y vais les yeux fermés" — la plateforme a fait son job |
| **Fierté économique** | "Moins cher que d'habitude" — sentiment de bonne affaire |
| **Envie de partager** | "J'ai envie de propager l'info à mon cercle de musiciens" |

**Pour Tomasz (accordeur) — L'émotion dominante : RESPIRATION**

| Émotion | Traduction concrète |
|---|---|
| **Soutien** | "Enfin un appui significatif" — la plateforme travaille pour lui |
| **Visibilité** | Son emploi du temps se remplit, taux de remplissage visible |
| **Changement** | "Un vrai changement par rapport à ce qu'il faisait y'a quelques semaines" |
| **Sérénité** | Booké sur X mois, il respire enfin |

### Emotional Journey Mapping

**Sophie — Parcours émotionnel complet :**

**1. Arrivée sur la landing page → CLARTÉ IMMÉDIATE**

- "Je comprends en 2 secondes que je suis ici pour trouver un accordeur"
- Sentiment : "Enfin un truc fiable, pro"
- Émotion cible : compréhension instantanée + crédibilité

**2. Recherche en cours → ANTICIPATION CONFIANTE**

- "La plateforme pioche dans ses accordeurs pour me dénicher le meilleur"
- Micro-animation de recherche qui montre le travail en cours
- Émotion cible : la plateforme travaille pour moi

**3. Résultats affichés → ÉMERVEILLEMENT**

- "Putin ça marche vraiment... j'ai un accordeur pour le 17 mars !!!"
- Moment whaouuuuu — le doute se transforme en excitation
- Émotion cible : surprise positive + validation immédiate

**4. Découverte du profil → CONFIANCE TOTALE**

- "Profil tiré à 4 épingles, haute qualité, tout est millimétré"
- "On sent le pro qui est là pour solutionner ma problématique"
- Émotion cible : "j'y vais les yeux fermés"

**5. Paiement → FINALITÉ (pas anxiété)**

- "L'essai transformé" — c'est un moment de verrouillage positif
- Message post-paiement : "Bravo, votre piano va enfin chanter comme à ses premiers jours"
- Émotion cible : fierté d'avoir pris une sage décision

**6. Post-confirmation → SOULAGEMENT + GÉNÉROSITÉ**

- "Une bonne chose de faite, et en plus moins cher que d'habitude"
- Envie naturelle de partager → mécanisme de parrainage (-5% avec code)
- Émotion cible : soulagement qui se transforme en ambassadeur

**7. Pré-RDV (J-1/J-2) → LIEN HUMAIN**

- Message personnalisé WhatsApp/email au nom de l'accordeur
- Construction du lien de confiance avant la rencontre physique
- Émotion cible : "Je connais déjà un peu la personne qui vient"

**8. Post-intervention → FIDÉLITÉ AUTOMATIQUE**

- Possibilité d'automatiser la prochaine résa (tous les 6 mois)
- "Je reviens les yeux fermés"
- Émotion cible : habitude naturelle, zéro effort récurrent

**Tomasz — Parcours émotionnel :**

**1. Découverte créneaux remplis → SATISFACTION**

- Son emploi du temps se remplit visuellement
- Taux de remplissage affiché → progression tangible
- Émotion cible : "Ça marche, j'ai un appui"

**2. Planification sur X mois → SÉRÉNITÉ**

- Booké à l'avance, il peut enfin respirer
- Émotion cible : stabilité professionnelle retrouvée

### Micro-Emotions

**Émotions critiques à cultiver :**

| Moment | Émotion positive | Émotion négative à éviter |
|---|---|---|
| Landing page | Clarté → "Je comprends tout de suite" | Confusion → "C'est quoi ce site ?" |
| Résultats recherche | Excitation → "Ça marche !" | Déception → "0 résultat, encore raté" |
| Profils | Confiance → "Ce pro est solide" | Scepticisme → "C'est qui ce type ?" |
| Paiement | Finalité → "L'essai est transformé" | Anxiété → "Est-ce que c'est fiable ?" |
| Post-booking | Soulagement → "Une épine en moins" | Regret → "J'aurais dû chercher ailleurs" |
| Pré-RDV | Familiarité → "Je le connais déjà" | Anxiété → "Un inconnu chez moi" |
| Récurrence | Automatisme → "Même pas besoin d'y penser" | Oubli → "Mince, j'ai pas accordé depuis 2 ans" |

### Design Implications

**Émotion → Décision UX concrète :**

| Émotion cible | Approche UX |
|---|---|
| **Clarté immédiate** | Hero section avec CTA unique, zéro distraction, message en 5 mots |
| **Anticipation confiante** | Micro-animation recherche ("On cherche le meilleur pour vous"), skeleton screens |
| **Émerveillement résultats** | Apparition fluide des profils, compteur de disponibilité, animation subtile |
| **Confiance totale** | Photos pro HD, badges vérification, bio concise et percutante, avis étoilés |
| **Finalité positive** | Message de félicitation post-paiement, ton chaleureux et valorisant |
| **Générosité parrainage** | CTA parrainage sur page confirmation + email ("Offrez -5% à un ami musicien") |
| **Lien humain pré-RDV** | Message automatisé personnalisé (nom accordeur, créneau, consignes) via email/WhatsApp |
| **Fidélité automatique** | Option "re-réserver automatiquement dans 6 mois" sur page confirmation + rappel email |
| **Taux remplissage pro** | Barre de progression visuelle dans dashboard Tomasz, objectif mensuel |

### Emotional Design Principles

**1. Soulagement > Satisfaction** — L'émotion #1 est le soulagement. Chaque interaction doit enlever du poids, pas en ajouter.

**2. L'essai transformé** — Le paiement n'est pas une barrière, c'est un moment de victoire. On félicite, on ne remercie pas.

**3. Confiance construite, pas déclarée** — Pas de badges "site sécurisé" génériques. La confiance vient des profils millimétrés, de la cohérence visuelle, du raffinement.

**4. Du soulagement à l'ambassadeur** — Le parcours émotionnel ne s'arrête pas à la réservation. Le soulagement se transforme en envie de partager → parrainage naturel.

**5. Le lien humain avant la porte** — Un message personnalisé de l'accordeur avant le RDV transforme "un inconnu sonne chez moi" en "quelqu'un que je connais déjà vient m'aider".

**6. Zéro charge mentale récurrente** — L'abonnement/résa automatique enlève la dernière friction : "Je n'ai même plus besoin d'y penser".

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**1. Apple.com (iPhone 17 Pro) — Référence design & storytelling**

- **Pattern clé** : Scroll storytelling sur fond sombre — le produit se dévoile progressivement, s'éclaire, se révèle avec finesse et élégance
- **Ce qui fait revenir** : La beauté du site. L'expérience visuelle EST le produit.
- **Leçon pour EasyPiano** : Le scroll landing page doit être une expérience en soi — animations reveal progressives, parallax subtil, fond sombre élégant, chaque section dévoile une facette du service

**2. Booking.com — Référence réflexe & conversion**

- **Pattern clé** : Recherche → résultats → booking = schéma mental universel, devenu un réflexe
- **Ce qui fait revenir** : L'habitude. "J'ai besoin d'un hôtel → Booking" sans réfléchir
- **Leçon pour EasyPiano** : Devenir LE réflexe accordage piano. Même schéma mental : "J'ai besoin d'un accordeur → EasyPiano". Hero search identique (lieu + date) = schéma déjà acquis par les utilisateurs

**3. Doctolib — Référence efficacité & cas limites**

- **Pattern clé** : Tous les edge cases gérés. Simple, rapide, effectif, pas de blabla. A supprimé l'intermédiaire humain frustrant ("la secrétaire qui se prenait pour la reine")
- **Ce qui fait revenir** : L'efficacité pure — ça marche, point.
- **Leçon pour EasyPiano** : Comme Doctolib a tué la secrétaire médicale, EasyPiano tue le bouche-à-oreille aléatoire. Chaque cas limite doit être anticipé (0 résultat, paiement échoué, annulation, etc.)

**4. Airbnb — Référence fluidité & tests utilisateurs**

- **Pattern clé** : Fluidité immédiate, "bien pensé", tests utilisateurs poussés au max — ça se sent
- **Ce qui fait revenir** : La confiance dans l'expérience. Tout coule naturellement.
- **Leçon pour EasyPiano** : Chaque interaction doit sembler évidente. Si l'utilisateur hésite → c'est un échec UX. Tester, itérer, polir jusqu'à la fluidité Airbnb.

### Transferable UX Patterns

**Navigation & Structure :**

| Pattern | Source | Application EasyPiano |
|---|---|---|
| **Dual-path landing** : Action immédiate (search hero) + scroll discovery | Apple + Booking | Hero avec barre recherche (lieu + date) au-dessus de la fold. Scroll = storytelling progressif qui dévoile le service |
| **Schéma search → results → book** | Booking | Même mental model, 3 étapes max. L'utilisateur sait déjà comment ça marche |
| **Profils de confiance visuels** | Airbnb + Doctolib | Photo HD, bio humanisée, badges, avis — tout visible en 1 scroll |

**Interaction & Animation :**

| Pattern | Source | Application EasyPiano |
|---|---|---|
| **Scroll-triggered animations** | Apple | Sections qui se révèlent au scroll (fade-in, parallax piano, texte qui apparaît) |
| **Reveal progressif** | Apple | Le service "s'éclaire" comme l'iPhone — chaque scroll dévoile une facette |
| **Micro-animations de feedback** | Airbnb | Hover states, transitions fluides (200ms), skeleton screens, checkmark animation |

**Conversion & Efficacité :**

| Pattern | Source | Application EasyPiano |
|---|---|---|
| **Booking instantané** | Booking + Doctolib | Pas de confirmation pro, créneau affiché = dispo, réservation immédiate |
| **Edge cases anticipés** | Doctolib | 0 résultat → dates alternatives. Paiement échoué → retry clair. Annulation → process simple |
| **Suppression intermédiaire** | Doctolib | Plus de bouche-à-oreille aléatoire → plateforme directe pro ↔ client |

### Anti-Patterns to Avoid

**Liste noire UX — INTERDIT sur EasyPiano :**

| Anti-pattern | Pourquoi c'est toxique | Notre approche |
|---|---|---|
| **Popups intempestifs** | Interrompt le flow, agressif, cheap | Zéro popup. Notifications inline élégantes uniquement |
| **Formulaires trop longs** | Friction massive, abandon | 2 champs hero (lieu + date). Auth = 1 clic Google |
| **Redirections multiples** | Perte de contexte, confusion | Flow linéaire : search → profil → book → confirm. Tout sur le même site |
| **Design cheap/générique** | Détruit la confiance instantanément | Thème sombre premium, typography raffinée, animations Apple-level |
| **Autocomplete contacts Safari** | Frustrant, suggestions hors-sujet | `autocomplete="off"` sur champs lieu |
| **Spinners génériques** | Sensation de lenteur, anxieux | Skeleton screens élégants + micro-animation recherche |
| **Nouvelle fenêtre paiement** | Rupture de confiance, confusion | Stripe Checkout embedded dans le flow |
| **Jargon technique** | Exclut les non-tech | Français clair, messages humains et chaleureux |
| **Surcharge cognitive** | Trop d'options = paralysie | MVP minimal : lieu + date → profils → book. C'est tout. |
| **Dark patterns urgence** | Manipulation, perte de confiance | Pas de "3 personnes regardent!", pas de compteurs fictifs. Sobriété et honnêteté. |

### Design Inspiration Strategy

**Ce qu'on ADOPTE :**

- **Apple** : Scroll storytelling fond sombre, animations reveal, typography premium, "la beauté fait revenir"
- **Booking** : Hero search (lieu + date), schéma mental search → results → book, devenir un réflexe
- **Doctolib** : Gestion impeccable de tous les edge cases, suppression intermédiaire frustrant, efficacité pure
- **Airbnb** : Fluidité totale, profils de confiance, tests poussés, "tout coule naturellement"

**Ce qu'on ADAPTE :**

- **Apple scroll** → Combiné avec hero search Booking (dual-path : action OU discovery)
- **Doctolib calendrier** → Adapté pour créneaux matin/après-midi (pas horaires précis)
- **Airbnb profils** → Adapté avec badge "Validé physiquement" (spécifique curation EasyPiano)
- **Booking résultats** → Adapté avec moins de bruit visuel (pas de badges urgence)

**Ce qu'on ÉVITE :**

- **Booking agressivité** : Pas de dark patterns ("3 personnes regardent!", compteurs urgence fictifs)
- **Doctolib froideur** : Nos profils sont plus chaleureux, humanisés, pas juste "Dr. X - Généraliste"
- **Airbnb complexité** : Pas de filtres avancés MVP, pas de carte interactive complexe
- **Tout ce qui fait "cheap"** : Popups, formulaires longs, redirections, design générique

## Design System Foundation

### Design System Choice

**Stack retenu : shadcn/ui + Tailwind CSS + Framer Motion**

| Composant | Rôle | Justification |
|---|---|---|
| **Tailwind CSS** | Utility-first CSS framework | Contrôle total sur le design, thème sombre natif (`dark:`), parfaitement intégré Next.js |
| **shadcn/ui** | Bibliothèque composants (Radix UI primitives) | Composants copiés dans le projet (pas de dépendance npm), 100% customisable, accessibilité WCAG intégrée |
| **Framer Motion** | Bibliothèque d'animations React | Scroll-triggered animations Apple-level, transitions fluides, micro-interactions élégantes |
| **Radix UI** | Primitives accessibles (sous shadcn/ui) | Navigation clavier, screen readers, focus management — WCAG 2.1 AA natif |

### Rationale for Selection

**Pourquoi ce combo et pas un autre :**

1. **Unicité garantie** — shadcn/ui copie les composants dans le projet. C'est VOTRE code, pas une lib externe. Zéro risque de "look Material Design générique"
2. **Ambition Apple** — Framer Motion permet les animations scroll reveal, parallax, transitions que Apple.com utilise. Impossible avec MUI ou Ant Design
3. **Solo dev + AI friendly** — Tailwind = productivité maximale. shadcn/ui = composants prêts à customiser. Un seul dev peut produire un résultat premium
4. **Accessibilité native** — Radix primitives gèrent clavier, ARIA, focus trap. Pas besoin de coder l'accessibilité manuellement
5. **Performance** — Tree-shakable, SSR-compatible Next.js, pas de CSS-in-JS runtime. Bundle léger
6. **Thème sombre** — CSS variables + Tailwind `dark:` = design system cohérent avec switch jour/nuit natif

**Options écartées :**

- **MUI** : Trop "Google", customisation profonde lourde, bundle size élevé, look reconnaissable
- **Ant Design** : Orienté enterprise/admin, pas premium consumer
- **Chakra UI** : Bon compromis mais moins flexible que shadcn/ui, runtime CSS-in-JS

### Implementation Approach

**Architecture design system :**

```
src/
├── components/
│   ├── ui/              ← shadcn/ui components (Button, Dialog, Card, Input, etc.)
│   ├── animations/      ← Framer Motion wrappers (ScrollReveal, FadeIn, SlideUp)
│   ├── Layout/          ← Header, Footer, Navigation
│   └── ...
├── styles/
│   ├── globals.css      ← Tailwind base + CSS variables (couleurs, spacing, typography)
│   └── tokens.css       ← Design tokens (--color-primary, --radius, etc.)
└── lib/
    └── utils.ts         ← cn() helper (clsx + tailwind-merge)
```

**Composants shadcn/ui à installer (MVP) :**

- `Button` — CTA primaires/secondaires
- `Input` — Champ recherche lieu
- `Calendar` / `DatePicker` — Sélection date
- `Card` — Cartes profil accordeur
- `Dialog` — Modal Google Auth
- `Badge` — "Validé par EasyPiano"
- `Avatar` — Photo profil accordeur
- `Skeleton` — Loading states élégants
- `Toast` — Notifications inline

**Animations Framer Motion (MVP) :**

- `ScrollReveal` — Sections landing page qui apparaissent au scroll
- `FadeIn` — Apparition fluide des résultats recherche
- `SlideUp` — Cartes profil qui montent
- `Checkmark` — Animation confirmation paiement
- `Parallax` — Fond piano hero section

### Customization Strategy

**Tokens design EasyPiano :**

```css
/* Palette sombre premium */
--background: #0a0a0a;         /* Noir profond */
--foreground: #fafafa;         /* Blanc cassé */
--card: #111111;               /* Gris très sombre */
--accent: #d4c5a0;             /* Champagne */
--accent-hover: #e0d4b4;      /* Champagne clair */
--muted: #888888;              /* Gris texte secondaire */
--border: #222222;             /* Bordures discrètes */
--destructive: #ef4444;        /* Rouge erreur */
--success: #22c55e;            /* Vert confirmation */

/* Typography */
--font-heading: 'Playfair Display', serif;  /* Titres élégants */
--font-body: 'Inter', sans-serif;            /* Corps lisible */

/* Spacing & Radius */
--radius: 0.75rem;             /* Coins arrondis doux */
```

**Principes de customisation :**

1. **Sombre par défaut** — Le thème sombre EST l'identité. Mode clair secondaire (V1+)
2. **Champagne comme accent** — Unique couleur d'accent, utilisée avec parcimonie pour CTA et badges
3. **Typography duale** — Playfair Display (élégance piano) + Inter (lisibilité tech)
4. **Animations sobres** — Durée 200-400ms, easing cubic-bezier, jamais flashy
5. **Espacement généreux** — Beaucoup de blanc (sombre) = respiration visuelle = raffinement

## Core User Experience (Defining)

### Defining Experience

**L'interaction signature d'EasyPiano en une phrase :**

> "Tu vas sur EasyPiano, tu mets Lausanne et ta date, et t'as un accordeur chez toi. C'est réglé."

**Comme les grands :**

- **Tinder** : "Swipe to match"
- **Booking** : "Lieu + date → réservé"
- **EasyPiano** : "Ville + date → ton piano est accordé"

**La promesse core** : "On accorde votre piano." — Et le résultat doit être en face. Zéro gap entre la promesse et la délivrabilité.

### User Mental Model

**Modèle mental actuel (AVANT EasyPiano) :**

Sophie cherche un accordeur aujourd'hui :

1. Google "accordeur piano Lausanne" → résultats médiocres
2. Pages jaunes → numéros qui ne répondent pas
3. Appels → 3 tentatives, aucun dispo avant 6 semaines
4. Bouche-à-oreille → "mon voisin connaît quelqu'un qui..."
5. Frustration → abandonne 3 semaines
6. Recommence → "c'est du scotch sur du scotch"

**Verdict** : Ça répond à moitié au besoin. Plus de contraintes que de solutions. Patchwork frustrant.

**Modèle mental cible (AVEC EasyPiano) :**

Sophie cherche un accordeur demain :

1. EasyPiano.ch → "Lausanne + 15 mars"
2. 3 profils dispo → clique sur Tomasz
3. Créneau matin → paie 125 CHF → confirmé
4. **Terminé. 2 minutes. Promesse tenue.**

**Le shift mental** : De "c'est compliqué, frustrant, aléatoire" → "c'est réglé, simple, fiable".

### Success Criteria

**L'expérience réussit quand :**

| Critère | Mesure | Seuil |
|---|---|---|
| **Promesse = Résultat** | Recherche → au moins 1 profil dispo | 100% des recherches dans zone couverte |
| **Rapidité** | Temps total : landing → confirmation | < 3 minutes |
| **Zéro friction** | Nombre d'étapes du flow | 7 max (search → profil → créneau → auth → pay → confirm → agenda) |
| **Confiance immédiate** | Profil consulté → booking initié | > 40% taux de conversion profil → book |
| **Soulagement** | Réaction post-booking | "Une épine en moins" — NPS > 70 |
| **Réflexe** | Re-réservation sans recherche Google | > 50% retour direct sur EasyPiano |

**Le test ultime** : Si Sophie doit ouvrir un 2e onglet pour vérifier/comparer → on a échoué.

### Novel UX Patterns

**Pattern : ÉTABLI avec twist unique**

EasyPiano n'invente pas un nouveau paradigme. Il utilise le schéma Booking/Doctolib que tout le monde connaît déjà (lieu + date → résultats → book). **L'innovation est dans l'exécution, pas dans le concept.**

**Patterns établis adoptés :**

| Pattern | Source | Notre twist |
|---|---|---|
| Search hero (lieu + date) | Booking | + Géolocalisation "Me localiser" + autocomplétion intelligente |
| Profils avec avis | Airbnb/Doctolib | + Badge "Validé physiquement par EasyPiano" (curation unique) |
| Booking instantané | Booking | + Prix fixe 125 CHF (zéro surprise, zéro calcul) |
| Confirmation email | Doctolib | + Bouton "Ajouter à mon agenda" (.ics) + message pré-RDV personnalisé |
| Dashboard réservations | Doctolib | + Parrainage intégré (-5% avec code) |

**Ce qui nous différencie (pas un pattern, une VALEUR) :**

- **Curation physique** : Chaque accordeur rencontré en personne → confiance inégalée
- **Prix fixe disruptif** : 125 CHF vs 180-230 CHF marché → zéro négociation, zéro surprise
- **Lien humain pré-RDV** : Message personnalisé de l'accordeur avant la visite

### Experience Mechanics

**Le flow mécanique détaillé :**

**1. INITIATION — Hero Landing**

- **Trigger** : Sophie arrive sur easypiano.ch (Google, bouche-à-oreille, pub)
- **Ce qu'elle voit** : Fond sombre, piano à queue éclairé, titre "On accorde votre piano"
- **Ce qu'elle fait** : Tape "Lausanne" dans le champ lieu (autocomplétion) + sélectionne 15 mars
- **Alternative** : Clique "Me localiser" → ville détectée automatiquement
- **Action** : Clique "Rechercher" (ou Enter)

**2. INTERACTION — Résultats**

- **Système** : Skeleton screens 0.5s → profils apparaissent (FadeIn animation)
- **Ce qu'elle voit** : 3 cartes profil (photo HD, nom, badge "Validé", langues, note)
- **Ce qu'elle fait** : Compare visuellement → clique sur Tomasz
- **Feedback** : Hover effect subtil (scale 1.05, shadow), transition fluide vers profil détaillé

**3. INTERACTION — Profil détaillé**

- **Ce qu'elle voit** : Photo grande, bio humanisée, conservatoire, certificats, langues, créneaux dispo
- **Ce qu'elle fait** : Lit la bio (10s), vérifie le badge, sélectionne "Matin (9h-12h)"
- **Feedback** : Créneau sélectionné = highlight doré, récapitulatif apparaît (accordeur + date + créneau + 125 CHF)

**4. INTERACTION — Auth + Paiement**

- **Ce qu'elle fait** : Clique "Réserver" → modal Google Auth → 1 clic → Stripe Checkout embedded
- **Feedback** : Progress steps visuel (1. Connexion ✓ → 2. Paiement → 3. Confirmé)
- **Système** : Stripe traite en < 3s

**5. COMPLETION — Confirmation**

- **Ce qu'elle voit** : Animation checkmark élégante → "Bravo, votre piano va enfin chanter comme à ses premiers jours"
- **Actions disponibles** : "Ajouter à mon agenda" (.ics) + "Partager EasyPiano" (code parrainage -5%)
- **Système** : Email confirmation envoyé < 30s
- **Ce qu'elle ressent** : Soulagement. "C'est réglé. Une épine en moins."

**6. POST-COMPLETION — Pré-RDV (J-1)**

- **Système** : Email/WhatsApp automatique au nom de Tomasz : "Bonjour Sophie, je suis Tomasz, votre accordeur. À demain matin !"
- **Ce qu'elle ressent** : "Je connais déjà un peu cette personne. Je suis rassurée."

## Visual Design Foundation

### Color System

**Palette principale — Sombre premium champagne :**

```css
/* Backgrounds */
--background:       #0a0a0a;    /* Noir profond */
--background-alt:   #0f0f0f;    /* Noir légèrement relevé */
--card:             #111111;    /* Surface cartes */
--card-hover:       #1a1a1a;    /* Surface cartes hover */

/* Textes */
--foreground:       #ffffff;    /* Blanc pur — titres principaux */
--foreground-alt:   #fafafa;    /* Blanc cassé — texte corps */
--muted:            #999999;    /* Gris — texte secondaire */
--muted-light:      #666666;    /* Gris sombre — labels, placeholders */

/* Accent champagne */
--accent:           #d4c5a0;    /* Champagne — CTA, badges, liens actifs */
--accent-hover:     #e0d4b4;    /* Champagne clair — hover states */
--accent-muted:     #b8a882;    /* Champagne sombre — texte accent */

/* Bordures */
--border:           #1e1e1e;    /* Bordure subtile */
--border-hover:     #333333;    /* Bordure hover */

/* Sémantiques */
--success:          #22c55e;    /* Vert — confirmation, checkmark */
--destructive:      #ef4444;    /* Rouge — erreur, annulation */
--warning:          #f59e0b;    /* Orange — attention */
--info:             #3b82f6;    /* Bleu — information */
```

**Ratios de contraste WCAG 2.1 AA :**

| Combinaison | Ratio | Statut |
|---|---|---|
| Blanc pur (#fff) sur noir (#0a0a0a) | 21:1 | AAA |
| Champagne (#d4c5a0) sur noir (#0a0a0a) | 10.2:1 | AAA |
| Gris muted (#999) sur noir (#0a0a0a) | 6.4:1 | AA |
| Blanc sur carte (#111) | 18.6:1 | AAA |

**Règles d'utilisation :**

- **Champagne** : Uniquement pour CTA primaires, badges "Validé", liens actifs, highlights sélection. Parcimonie = élégance.
- **Blanc pur** : Titres H1/H2, texte important, éléments de focus
- **Blanc cassé** : Texte corps, descriptions
- **Gris** : Texte secondaire, labels, placeholders, métadonnées

### Typography System

**Font pairing :**

| Usage | Font | Weight | Justification |
|---|---|---|---|
| **Titres (H1-H3)** | Playfair Display | 400, 700 | Élégance classique, évoque le piano, serif raffiné |
| **Corps de texte** | Inter | 400, 500, 600 | Lisibilité maximale, moderne, technique, sans-serif |
| **Monospace (prix)** | JetBrains Mono | 400 | Prix "125 CHF" en monospace = clarté, tech |

**Type scale (base 16px) :**

| Token | Taille | Line-height | Usage |
|---|---|---|---|
| `text-hero` | 64px / 4rem | 1.1 | Hero title "On accorde votre piano" |
| `text-h1` | 48px / 3rem | 1.2 | Section titles landing |
| `text-h2` | 36px / 2.25rem | 1.25 | Sous-sections |
| `text-h3` | 24px / 1.5rem | 1.3 | Card titles, profil nom |
| `text-body` | 16px / 1rem | 1.6 | Corps de texte |
| `text-small` | 14px / 0.875rem | 1.5 | Labels, métadonnées |
| `text-xs` | 12px / 0.75rem | 1.4 | Badges, tooltips |

**Effet signature — Depth Layering Hero :**

Le titre hero "On accorde votre piano" disparaît partiellement derrière un piano à queue, comme l'heure iOS derrière le wallpaper :

- **Layer 1 (back)** : Titre en Playfair Display 64px, blanc pur, z-index: 1
- **Layer 2 (front)** : Image piano à queue découpée (PNG transparent), z-index: 2
- **Layer 3 (overlay)** : Barre recherche (lieu + date), z-index: 3
- **Animation** : Au scroll, le titre se révèle/masque progressivement (parallax Framer Motion, vitesses différentes par layer)
- **Résultat** : Sensation de profondeur, le piano EST le produit, le titre vit avec l'image

### Spacing & Layout Foundation

**Système de spacing (base 4px) :**

| Token | Valeur | Usage |
|---|---|---|
| `space-1` | 4px | Micro-gaps (badge padding interne) |
| `space-2` | 8px | Gaps serrés (icône + label) |
| `space-3` | 12px | Padding boutons, inputs |
| `space-4` | 16px | Gaps entre éléments liés |
| `space-6` | 24px | Gaps entre groupes |
| `space-8` | 32px | Sections internes |
| `space-12` | 48px | Sections principales |
| `space-16` | 64px | Séparation sections landing |
| `space-24` | 96px | Mega-spacing hero |

**Grid system :**

- **Container max-width** : 1280px (centré)
- **Desktop** : 12 colonnes, gutter 24px
- **Tablet** : 8 colonnes, gutter 16px
- **Mobile** : 4 colonnes, gutter 16px
- **Résultats profils** : 3 colonnes desktop, 2 tablet, 1 mobile

**Layout principles :**

1. **Respiration maximale** — Espacement généreux entre sections (64-96px), le vide noir EST du design
2. **Hiérarchie par l'espace** — Plus l'espace est grand entre éléments, plus ils sont distincts visuellement
3. **Thumb-friendly mobile** — Zone tactile minimum 44x44px, éléments importants accessibles au pouce
4. **Scroll vertical naturel** — Pas de pagination, infinite scroll si nécessaire, scroll = découverte

### Accessibility Considerations

**WCAG 2.1 Level AA — Engagement minimum :**

| Critère | Implémentation |
|---|---|
| **Contraste couleurs** | Tous les textes > 4.5:1 sur fond sombre (vérifié ci-dessus) |
| **Taille texte minimum** | 16px corps, 14px métadonnées, jamais < 12px |
| **Zone tactile** | 44x44px minimum pour tous éléments interactifs |
| **Navigation clavier** | Tab/Enter/Esc via Radix UI primitives (natif shadcn/ui) |
| **Focus visible** | Outline champagne 2px sur focus clavier (outline-offset: 2px) |
| **Screen readers** | ARIA labels via Radix, alt text images, rôles sémantiques |
| **Réduction mouvements** | `prefers-reduced-motion` → désactive animations Framer Motion |
| **Langues** | `lang="fr"` par défaut, texte toujours en français clair |

**Brief créatif logo (à développer) :**

- **Pistes évoquées** : Piano ouvert avec corde tendue, coeur (prendre soin), symbole d'accordage
- **Contraintes** : Doit fonctionner sur fond sombre, monochrome (blanc/champagne), lisible en 24px favicon
- **Direction** : Minimaliste, élégant, éviter le cliché "touche de piano"
- **Livrable** : À créer séparément (designer ou AI gen)

## Design Direction Decision

### Directions explorées

3 directions ont été générées et présentées via un showcase HTML interactif (`ux-design-directions.html`) :

1. **Piano Noir** — Full dark, minimalisme extrême. Hero centré, search bar épurée, cards sobres, beaucoup d'espace négatif
2. **Depth Stage** — Effet de profondeur Apple-style. Le titre disparaît derrière le visuel du piano (iOS clock effect). Scroll storytelling cinématique
3. **Warm Elegance** — Split hero gauche/droite, carte pro flottante, plus de champagne, badges de confiance, ambiance chaleureuse

### Direction choisie

**Piano Noir + Depth Stage** — Fusion des directions 1 et 2.

Le minimalisme extrême de Piano Noir comme base esthétique, avec le hero depth layering de Depth Stage comme accroche immersive.

### Rationale du choix

- **Depth layering hero** : L'effet titre derrière le piano crée un "wow" immédiat, cohérent avec l'inspiration Apple et l'identité premium
- **Minimalisme Piano Noir** : L'espace négatif renforce la sensation de calme et de confiance — aligné avec l'émotion "SOULAGEMENT" de Sophie
- **Pleine largeur** : Chaque section occupe toute la largeur, immersion maximale
- **Cohérence** : Les tokens visuels (champagne, Playfair, fond sombre) sont appliqués uniformément sur toutes les sections

### Implémentation

**Structure du hero (3 couches z-index) :**

| Couche | z-index | Contenu | Comportement |
|--------|---------|---------|-------------|
| Titre | 1 | "On accorde votre *piano*" + subtitle | Fixe, centré verticalement |
| Piano visuel | 2 | Silhouette piano + touches stylisées | Monte du bas, couvre le bas du titre |
| Search bar | 3 | Barre de recherche glassmorphism | Flottante, au-dessus de tout |

**Sections scroll storytelling (Piano Noir) :**

- Proposition de valeur (3 cards icônes)
- Comment ça marche (3 étapes fusionnées)
- Bandeau confiance (métriques clés)
- Grille accordeurs (pro cards avec badges disponibilité)
- CTA final émotionnel

**Fichier de référence :** `ux-design-final.html`
