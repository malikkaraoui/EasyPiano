---
stepsCompleted: [1]
inputDocuments: []
session_topic: 'Vision complète EasyPiano - UX, UI, fonctionnalités clés, modèle économique'
session_goals: 'Définir la vision fondatrice de la plateforme EasyPiano'
selected_approach: 'Brainstorming guidé par questions'
techniques_used: [elicitation-directe, questions-progressives]
ideas_generated: []
context_file: ''
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
- Prix EasyPiano : **125 CHF** — presque 50% moins cher
- Possible grâce au coût de vie plus bas des pros d'Europe de l'Est
- Le pro gère sa propre logistique (transport, hôtel)

---

## 2. Marché Cible

- **Zone de lancement** : Bassin lémanique (Genève → Lausanne, côté France inclus)
- **Scalabilité** : Partout où il y a des pianos = futurs clients
- **Clients** : Propriétaires de piano (particuliers)

---

## 3. Modèle Économique

| Élément | Détail |
|---|---|
| Prix accordage | 125 CHF (fixé par EasyPiano, pas par le pro) |
| Commission | 10% (~12.50 CHF) |
| Revenu pro | ~112.50 CHF par accordage |
| Supplément piano mauvais état | À la discrétion du pro, montant libre |
| Commission sur supplément | Quasi nulle (carotte pour le pro) |
| Mécanisme supplément | Lien Stripe généré à la demande, envoyé au client |
| Paiement client | Au moment de la réservation (bloque le créneau) |
| Capacité pro | ~3 pianos/jour (1 matin, 2 après-midi), configurable |
| Rentabilité pro/semaine | ~1 700-2 000 CHF net pour une tournée d'une semaine |

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
1. Recherche par **lieu + date** (point d'entrée verrouillé, pas de browsing libre)
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
- Annulation sans frais jusqu'à X jours avant (style Booking.com)
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
- Réservation instantanée — pas de confirmation requise du pro

---

## 6. Confiance & Sécurité

| Pilier | Détail |
|---|---|
| Curation | Chaque pro rencontré physiquement par l'équipe EasyPiano |
| Validation | Profil vérifié avant publication |
| Philosophie | "Tu as choisi EasyPiano = tu as déjà fait ton choix de confiance" |
| Assurance | Chaque pro doit avoir une RC pro valide (à vérifier par EasyPiano — sujet juridique à creuser) |
| Avis | Unilatéral : seul le client note le pro |
| Annulation pro | EasyPiano trouve un remplaçant équivalent |

---

## 7. Spécifications Techniques

| Élément | Choix |
|---|---|
| Type | Web responsive (mobile-first) |
| App native | Pas à l'ordre du jour |
| Langues | FR / EN / DE dès le lancement |
| Auth | Google Auth + SMS (code) |
| Paiement | Stripe Connect |
| Notifications | Email ou SMS (au choix du client, configurable) |
| Admin | Validation pros + accès dashboard Stripe |

---

## 8. Sujets à Creuser

- [ ] Politique d'annulation : définir le X jours précis
- [ ] Assurance RC pro : cadre légal par pays, types d'assurance acceptés
- [ ] Supplément piano mauvais état : UX du lien Stripe à la demande
- [ ] Mécanisme de remplacement si pro indisponible
- [ ] Stratégie de lancement et acquisition des premiers clients
- [ ] Recrutement et sourcing des accordeurs en Europe de l'Est
- [ ] i18n : architecture technique pour FR/EN/DE
