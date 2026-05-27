# Glossaire i18n FR ↔ EN — portfolio Léo Hengebaert

Référence partagée pour garder la cohérence des traductions entre composants.

## Termes métier

| Français | English | Notes |
|----------|---------|-------|
| Réalisations | Selected work / Featured work | Pour les eyebrows des sections projets |
| Projets sélectionnés | Featured projects | |
| Voir tous les projets | View all projects | |
| Mes projets | My projects | |
| Mes services | My services | |
| Me contacter / Contact | Get in touch / Contact | |
| À propos | About | |
| Accueil | Home | |
| Mon parcours | My journey | |
| Mes réalisations | My work | |
| Travailler ensemble | Let's work together | |
| Voir le site en ligne | View live site | |
| Voir mes formules | See my plans | |
| Projet suivant / précédent | Next / Previous project | |
| Tous les projets | All projects | |
| En cours | In progress | |
| Année | Year | |
| Type | Type | |

## Stack & contexte projet

| Français | English |
|----------|---------|
| Développeur front-end | Front-end developer |
| Créateur de sites web | Website builder |
| Cabinet de conseil | Consulting firm |
| Studio créatif | Creative studio |
| Mission studio · Artefact 3000 | Studio mission · Artefact 3000 |
| Projet freelance | Freelance project |
| Projet personnel | Personal project |
| Côté technique | Behind the scenes / Under the hood |
| Stack du projet | Project stack |
| Stack technique | Tech stack |
| Équipe | Team |
| Résultats | Results |
| Vue d'ensemble | Overview |
| Aujourd'hui en station | Live in stations today |
| Client | Client |
| Contexte | Context |
| Année | Year |
| Stack | Stack |

## Formules / Services

| Français | English | Notes |
|----------|---------|-------|
| Essentiel / Standard / Premium | Essential / Standard / Premium | Noms des formules |
| 5 jours ouvrés | 5 business days | |
| Sites web sur mesure | Custom websites | |
| Sur mesure | Bespoke / Custom | "sur mesure" = bespoke quand on parle qualité, custom quand on parle technique |
| Sans engagement | No commitment / No strings attached | |
| Pas d'abonnement à vie | No lifetime subscription | |
| Pas de WordPress | No WordPress | (laissé tel quel) |
| Configurer cette formule | Configure this plan | |
| Voir les formules & tarifs | See plans & pricing | |
| La plus choisie | Most chosen / Most popular | |
| Réserver un appel | Book a call | |
| Appel découverte | Discovery call | |
| 15 min offert | Free 15 min | |
| Devis | Quote | |
| Sur devis | On quote | Pour les addons custom |
| Inclus | Included | |
| Pack animations / performance | Animations / Performance pack | |
| Multilingue FR + EN | Bilingual FR + EN | |

## Prix

| Français | English |
|----------|---------|
| 590 € | €590 |
| 990 € | €990 |
| 1 890 € | €1,890 |
| 60 €/h | €60/h |
| 50 €/mois | €50/month |

## Marques / noms propres (NE PAS traduire)

- TotalEnergies, Argedis
- BNP Paribas
- Aéroports de Paris (Paris Airports)
- Artefact, Artefact 3000
- Qare
- Robertet
- Bald
- Make a Scene
- Kalypso
- Russian with Julia
- Sweetime
- Extime

## Sur le ton

- **Français** : ton chaleureux mais pro, parfois familier ("Salut", "On commence par…"). Adresses au "vous" pour les clients potentiels.
- **English** : naturel, conversational, professionnel. Évite les calques du français. Préférer "I build" à "I create" pour le développement.
- Garder l'usage des **emphases markdown** dans les rich texts (`**mot**`, `*mot*`) ou les mapper aux balises XML i18n (`<accent>`, `<lavender>`, etc.).

## Conventions techniques

- **Liens internes** : toujours `@/i18n/navigation` (jamais `next/link`).
- **Slugs URL** : restent en français (`/projets`, `/a-propos`) même en EN (`/en/a-propos`).
- **Rich text** : utiliser `t.rich()` avec des balises XML personnalisées comme `<accent>`, `<lavender>`, `<mauve>`, `<bold>`, `<italic>`, `<br>`, ou des balises sémantiques par projet `<argedis>`, `<bnp>` pour des liens internes.
- **Listes** : utiliser `t.raw()` pour les arrays.
- **Pluriels** : utiliser ICU `{count, plural, =0 {…} one {…} other {…}}`.
