# Fiches projet — guide de création

Ce document est la référence pour créer et maintenir les fiches projet du portfolio. À consulter à chaque nouveau projet et à chaque intervention sur une fiche existante.

---

## Structure de la fiche

### Desktop

```
[En-tête — max-w-5xl]
  ← Retour "Tous les projets"
  
  Colonne gauche (1fr)          │  Colonne droite (300px)
  ─────────────────────         │  ─────────────────────
  h1 — Nom du client            │  Carte meta :
  Titre de l'app (accent)       │    - Logos client (36px, rounded, bg blanc)
  Intro (texte grand public)    │    - Nom client
                                │    - Contexte (agence/freelance/perso)
                                │    - Année
                                │    - Stack (tags colorés)
                                │    - Lien "Voir le site" (si url présente)

[Contenu principal — max-w-4xl]
  Séparateur
  BLOC 1 — Vidéo gauche / Description droite (grid 2 colonnes)
  Points clés (centré, titre + liste à puces)
  BLOC 2 — Images + texte (texte gauche, images droite)
  BLOC 3 — Images + texte (images gauche, texte droite)
  Séparateur
  Stack du projet
  Défis & solutions techniques
  Équipe (crédits)
  Séparateur
  Projet suivant →
```

### Mobile (< sm / téléphone)

La carte meta disparaît. À la place, juste sous le h1 client :
- Logos (28px) + badge contexte + année → sur une ligne flex-wrap
- Tags stack → ligne flex-wrap en dessous
- Puis le titre de l'app (accent, uppercase)
- Puis l'intro

Le contenu principal passe en colonne unique. Les blocs avec images utilisent `flex-col-reverse` pour que l'image apparaisse toujours avant le texte sur mobile — jamais de texte avant l'image sur petit écran.

L'espacement entre sections est réduit sur mobile (`space-y-10` vs `space-y-16` sur desktop).

---

## Ajouter un projet dans `lib/projets.ts`

### Champs obligatoires

| Champ | Description |
|---|---|
| `slug` | URL du projet — kebab-case, ex: `argedis-totalenergies` |
| `titre` | Nom de l'application ou du livrable |
| `client` | Nom complet du client, ex: `TotalEnergies · Argedis` |
| `clientShort` | Version courte pour les listes, ex: `TotalEnergies` |
| `contexte` | `agence` / `freelance` / `perso` |
| `description` | 1-2 phrases pour le SEO (metadata) |
| `intro` | Texte d'accroche grand public — 3-5 lignes, voir ci-dessous |
| `img` | Image principale (WebP) — utilisée en fallback et dans les listes |
| `tags` | Stack affichée en badges — 4 à 6 éléments max |
| `date` | Format `YYYY-MM` |

### Champs optionnels mais recommandés

| Champ | Description |
|---|---|
| `logo` / `logos` | Logo(s) client en WebP, fond transparent ou blanc. Toujours WebP. |
| `video` | Fichier MP4 dans `/public/assets/[projet]/` |
| `images` | Tableau d'images WebP pour le zigzag |
| `descriptionPublic` | Texte éditorial affiché sous la vidéo — 3 paragraphes avec **gras** |
| `imageCaptions` | Texte pour les blocs images (BLOC 2 et BLOC 3) |
| `pointsCles` | Enjeux / Défis / Intérêt — liste courte et lisible |
| `technologies` | Stack détaillée — voir règles ci-dessous |
| `challenges` | Défis techniques — voir règles ci-dessous |
| `credits` | Membres de l'équipe avec leur rôle |
| `resultats` | 2-3 phrases sur l'impact réel |
| `url` | Lien vers le site en ligne (freelance surtout) |

---

## Formats des assets

Tous les fichiers media doivent être en WebP (images) et MP4 (vidéos) avant d'être ajoutés.

```
# Convertir une image PNG en WebP
cwebp -q 85 image.png -o image.webp

# Convertir une vidéo MOV/AVI en MP4
ffmpeg -i video.mov -vcodec h264 -acodec aac -crf 23 -preset medium -movflags +faststart video.mp4
```

Structure des dossiers dans `/public/assets/` :
```
public/
  assets/
    [slug-du-projet]/
      main-video.mp4
      img-01.webp
      img-02.webp
      ...
  logo-[client].webp
```

---

## Règles de contenu

### Intro (texte d'accroche)

- Ton : grand public, concis, direct
- 3 à 5 lignes max
- Mettre en **gras** les éléments clés : client connu, chiffre marquant, enjeu fort
- Expliquer en une phrase ce que c'est et ce que ça fait — pas comment c'est fait
- Exemple de ton visé : *"Pour Extime, j'ai développé un jeu concours digital qui a touché **des centaines de milliers d'utilisateurs** en quelques semaines. Les voyageurs grattaient un ticket virtuel pour remporter une **récompense**."*

### Description publique (`descriptionPublic`)

- 3 paragraphes avec un titre en **gras** pour chacun
- Angle : expérience utilisateur, ce que ça apporte, ce qui le rend singulier
- Pas de jargon technique
- Exemple de structure : **Ce que l'utilisateur fait** → **Ce qui rend ça unique** → **Ce que ça résout**

### Stack du projet (`technologies`)

Règle absolue : **justifier le choix, pas expliquer comment ça marche**. 2 phrases max par techno. Répondre à : *Pourquoi cette techno plutôt qu'une autre dans ce contexte ?*

Ce qu'il ne faut pas faire :
- Mettre le nom d'une fonction ou méthode (`findOneAndUpdate`, `generateStaticParams`...)
- Expliquer ce qu'est la techno (tout le monde sait ce qu'est Storybook)
- Faire une liste de ce que ça fait dans le projet
- Écrire plus de 3 phrases

Ce qu'il faut faire :
- Dire pourquoi ce choix était pertinent pour CE projet
- Comparer avec une alternative si c'est utile (ex : MongoDB vs PostgreSQL pour des milliers d'appels simultanés)
- Rester dans le registre de la justification de décision technique

Exemple — avant :
> "La base devait absorber des milliers d'appels simultanés en pic sur une opération courte. MongoDB est parfaitement adapté à cette charge en écriture, avec des requêtes atomiques (findOneAndUpdate) pour éviter les doublons sous forte concurrence. La structure de document flexible correspond bien aux configs de probabilité variables par boutique."

Exemple — après :
> "Opération courte, charge d'écriture intense, structure de données flexible. MongoDB absorbe des milliers d'appels simultanés sans dégradation, là où une base relationnelle aurait nécessité un schéma plus rigide et une gestion de concurrence plus complexe."

### Défis & solutions techniques (`challenges`)

Règle : **décrire le problème et comment on l'a résolu, sans entrer dans les détails d'implémentation**. Quelqu'un qui lit ne doit pas avoir besoin de connaître React pour comprendre.

Ce qu'il ne faut pas faire :
- Nommer des variables, composants ou hooks (`useRef`, `ReactCardFlip`, `globalCompositeOperation`...)
- Mettre des valeurs précises inutiles (25px, 4096×4096, 1 pixel sur 32...)
- Expliquer un algorithme étape par étape
- Faire un pavé de 5 phrases pour un seul défi

Ce qu'il faut faire :
- Expliquer le problème en une phrase ("Le cadre décoratif devait rester proportionnel sur tous les formats d'écran")
- Expliquer la solution en 2-3 phrases max, en termes de stratégie ("On mesure dynamiquement les dimensions disponibles et on redessine le cadre en conséquence")
- Garder un registre de décision technique, pas de tutoriel

Exemple — avant :
> "Le long du trajet, des cercles de rayon 25px sont dessinés à chaque pixel de distance via Math.sin/cos(angle), ce qui crée un tracé lisse même à vitesse élevée. Le pourcentage gratté est calculé en échantillonnant 1 pixel sur 32 et en comptant ceux dont l'alpha vaut 0."

Exemple — après :
> "Le tracé doit rester fluide même à grande vitesse. On dessine en continu sur le trajet du doigt pour éviter les trous, et on échantillonne la surface pour déclencher automatiquement la révélation dès qu'un seuil est atteint."

---

## Checklist avant de publier une fiche

- [ ] Tous les assets en WebP (images) et MP4 (vidéos)
- [ ] `logo` / `logos` présents et en WebP
- [ ] `intro` lisible par quelqu'un qui ne connaît pas le dev
- [ ] Stack : 2 phrases max par techno, pas de noms de fonctions
- [ ] Défis : stratégie décrite, pas d'implémentation détaillée
- [ ] `pointsCles` remplis (enjeux, défis, intérêt) si projet suffisamment important
- [ ] `credits` remplis si projet en agence
- [ ] `date` au format `YYYY-MM`
- [ ] `clientShort` rempli si le nom complet est long

---

## Aller chercher le contexte technique

Pour les projets existants dans les repos GitHub, avant d'écrire les défis et la stack :

1. Cloner ou ouvrir le repo du projet
2. Regarder les principales dépendances (`package.json`)
3. Identifier les patterns architecturaux (routing, state management, data fetching)
4. Chercher les parties "difficiles" : animations complexes, logique serveur, gestion d'état particulière
5. Regarder les commits ou le historique git pour comprendre les étapes du projet

Ne pas deviner. Si quelque chose n'est pas clair dans le code, demander — mieux vaut une fiche plus courte et juste qu'une fiche longue et inexacte.
