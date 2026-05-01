# Structure des projets

## Ajouter un projet

Tout se passe dans `lib/projets.ts`. Ajouter un objet au tableau `projets`. L'ordre dans le tableau = l'ordre d'affichage sur `/projets`. Mes projets agence (BNP, TotalEnergies, ADP) sont en tête, les projets freelance/perso (Make a Scene, Bald, Russian with Julia) à la fin.

---

## Ton de l'écriture — règle absolue

La page projet est lue par **deux audiences distinctes** : des clients potentiels (qui veulent un site comme ça) et des employeurs / devs (qui veulent voir la rigueur technique). Il faut servir les deux sans tomber dans le jargon.

### Champs grand public (à écrire en langage normal, storytelling)

- `description` — meta SEO + carte du projet : phrase complète qui raconte ce que c'est, pour qui, et pourquoi c'est intéressant
- `intro` — bandeau d'intro en haut de page : un paragraphe qui pose le contexte humain et la spécificité du projet. Pas de stack technique brute (`Next.js, Convex, Stripe...`), c'est ce que `tags` affiche déjà.
- `descriptionPublic` — corps de la section vue d'ensemble : storytelling assumé. Penser "comment je raconterais ce projet à un ami". Possibilité d'ouvrir avec une punch line en `*italique serif accent*` pour donner du rythme.
- `pointsCles` — items grand public ("Donner à une prof indépendante un site qui matche la qualité de ses cours…"), pas une liste de specs

**À éviter dans ces champs** : noms de libs, acronymes (R2, OAuth, JWT, RLS), vocabulaire de framework (Server Action, edge function, hydration), métriques techniques.

### Pas de tirets cadratins (—) dans le corps de texte

Les em-dash (`—`) font trop "écrit par une IA". Les remplacer systématiquement par deux-points (`:`), virgule, parenthèses, ou couper la phrase. **Exception** : les eyebrows numérotés (`01 — Vue d'ensemble`, `02 — Pilier`) gardent l'em-dash, c'est un choix typographique cohérent avec `/services/standard`.

### Pas de chiffres business du client

On parle du projet, pas du business du client. Pas de prix payés par la cliente, pas de chiffres de vente, pas de marges. Reformuler 100% côté technique quand on est sur un challenge "économique" : pourquoi tel choix de stack, quels trade-offs, quelle alternative on a évitée.

### Champs techniques (libres, on peut développer)

- `challenges` — c'est *la* section où on parle vraiment du code. Format `{ titre, solution }` : le titre dit le défi en français normal, la solution explique la décision technique en détail (libs, trade-offs, pourquoi tel choix plutôt qu'un autre).
- `technologies` — section "Stack du projet" en bas : liste motivée des choix techniques majeurs.

Ces deux sections sont visuellement séparées (`Côté technique` / `Stack du projet`) — un client qui ne veut pas lire le tech peut les sauter, un dev les lira en premier.

### Décrire un slider — règle

Quand on ajoute un `sliderSet`, la `description` doit raconter **ce qu'on voit dans les images** (et pas juste un titre générique). On parcourt les écrans et on commente : "L'écran d'accueil met en scène X… Plus bas, la section Y reprend Z… La carte du monde visualise…". Si une image montre quelque chose de notable techniquement (composant trouvé sur une lib externe, animation custom…), on le dit dans la description du slider.

**Ne jamais** mettre la même image que `heroImg` dans le premier slider — elle est déjà affichée juste au-dessus, ça doublonne.

### Markdown léger (intro, descriptionPublic, slider description, tagline)

Le parser supporte un sous-ensemble de markdown adapté à la page projet. **Tout le corps de texte reste blanc** — la couleur d'accent (vert) est réservée aux titres, eyebrows et liens, pas au corps. Cette règle est volontaire : un client doit pouvoir lire la page sans être agressé par des mots colorés un peu partout.

| Syntaxe | Rendu | Quand l'utiliser |
|---|---|---|
| `**mot**` | gras blanc | Mettre en valeur un terme important au sein d'une phrase |
| `__mot__` | gras blanc (idem) | Synonyme de `**mot**`, à éviter (legacy) |
| `~~mot~~` | gras lavande | Très rare — pour une nuance secondaire d'accent |
| `*mot*` | italique serif blanc | Donner un côté éditorial dans une `tagline` ou une punch line |
| `[label](https://url)` | lien souligné en accent vert | Inviter à visiter le site live, citer une ressource externe. Le seul élément accentué qu'on autorise dans le corps de texte. |
| `\n` | retour ligne `<br />` | Saut de ligne simple au sein d'un paragraphe |
| `\n\n` | nouveau paragraphe | Séparateur de blocs |

**Glisser un lien vers le site live de temps en temps** : c'est l'occasion d'inciter le visiteur à aller vraiment expérimenter le rendu. À doser — un par section grand maximum, pas plus.

### Inspirer la structure éditoriale du projet `/services/standard`

La page `/services/[slug]` (composée par `service-configurator.tsx`) sert de référence visuelle pour les pages projet. Ce qu'il faut reprendre :

- **Eyebrows** numérotés (`01 — Vue d'ensemble`, `02 — …`) en uppercase tracking large, couleur accent
- **Grandes punch lines** en `font-serif-display` (champ `tagline`) qui découpent les sections
- **Texte courant blanc**, jamais coloré — la couleur n'apparaît que sur les eyebrows, les titres et les liens
- **Respiration** entre les blocs (`space-y-14`) plutôt que des sections collées

---

### Champs obligatoires

| Champ | Type | Notes |
|---|---|---|
| `slug` | string | URL du projet : `/projets/[slug]` |
| `titre` | string | Sous-titre de l'app/mission |
| `client` | string | Nom complet du client |
| `contexte` | `"agence" \| "freelance" \| "perso"` | |
| `description` | string | Résumé court (meta SEO) |
| `intro` | string | Intro affichée dans le header de la page. Supports markdown léger (cf. section "Markdown léger" ci-dessous). |
| `img` | string | Miniature de la carte grid (`/assets/…`) |
| `tags` | string[] | Stack affichée dans la meta card |
| `date` | string | Format `YYYY-MM` |

### Champs optionnels

| Champ | Type | Notes |
|---|---|---|
| `clientShort` | string | Nom court pour les boutons flottants |
| `logo` / `logos` | string / string[] | Logo(s) client dans la meta card |
| `descriptionPublic` | string | Texte affiché sous la vidéo/media. Supports markdown léger (cf. section "Markdown léger"). Saut de ligne simple `\n` rendu comme `<br />`, double `\n\n` ouvre un nouveau paragraphe. |
| `tagline` | string | Punch line éditoriale affichée en grand serif (style `/services/standard`) juste sous le hero, avant `descriptionPublic`. À garder courte (1-2 phrases max) pour avoir l'effet "claque". Active automatiquement l'eyebrow `01 — Vue d'ensemble`. |
| `pillarsCards` | `{ eyebrow, iconName, titre, description }[]` | 3 cards visuelles affichées juste après le BLOC 1 (descriptionPublic). Chaque card a une icône Lucide, un eyebrow numéroté, un titre fort et 2-3 lignes max. **Remplace** l'affichage de `pointsCles` (les deux sont conceptuellement la même chose : la "raison d'être" du projet). À utiliser quand un projet a 3 vrais piliers qui méritent d'être placardés en grand plutôt qu'une bête liste à puces. `iconName` est une string typée (cf. `PillarIcon` dans `lib/projets.ts`) ; le mapping vers le composant Lucide vit dans `app/projets/[slug]/page.tsx` (étendre `PILLAR_ICONS` quand on ajoute un nouveau nom). |
| `video` | string | Vidéo principale (`/assets/…`) |
| `videoTitle` | string | Label centré affiché au-dessus de la vidéo |
| `videoLoopEnd` | number | Seconde à laquelle le loop repart (pour couper la fin d'une vidéo) |
| `wideMedia` | boolean | Si `true` : vidéo/images en 16:9 full width (BNP). Si `false` : portrait avec zigzag |
| `images` | string[] | Images pour le zigzag. Si `video` existe et `!wideMedia`, `images[0]` est skippé |
| `sliderSets` | voir ci-dessous | Sliders thématiques avec titre + description |
| `technologies` | `{ nom, detail }[]` | Stack technique détaillée (affiché en bas) |
| `challenges` | `{ titre, solution }[]` | Défis techniques. Interleaved avec les sliders automatiquement |
| `pointsCles` | `{ label, items[] }[]` | Points clés groupés (enjeux, défis, résultats) |
| `imageCaptions` | string[] | Textes du zigzag. `[0]` = BLOC 2 (gauche), `[1]` = BLOC 3 (droite) |
| `credits` | `{ nom, role }[]` | Équipe projet |
| `resultats` | string | Résultats affichés en encart |
| `url` | string | Lien externe vers le site live |
| `enCours` | boolean | Badge "en cours" sur la carte |

### sliderSets

```ts
sliderSets: [
  {
    title: "Titre du set",
    description: "Description affichée au-dessus du slider",
    images: ["/assets/projet/image-1.webp", …],
  },
]
```

Les sliders sont rendus après la vidéo principale. Si `challenges` existe aussi, ils sont **interleaved** : challenges[0..1] → sliderSets[0] → challenges[2..] → sliderSets[1].

Pour les projets portrait avec `zigzagImages.length >= 5` + `challenges`, les challenges sont aussi interleaved entre BLOC 2 (zigzag) et BLOC 3.

---

## Ajouter des screenshots à un projet

### Méthode pour analyser et renommer des screenshots

Les screenshots macOS ont des noms avec espaces et caractères spéciaux (`Capture d'écran 2026-…`). Ils ne peuvent pas être lus directement par les outils AI.

**Étapes :**

1. **Convertir en JPEG avec un nom propre** via `sips` dans un script shell :

```bash
cd "/chemin/vers/dossier"
i=1
for f in *.png; do
  sips -s format jpeg "$f" --out "/tmp/sc_${i}.jpg" 2>/dev/null
  i=$((i+1))
done
```

2. **Analyser les images** avec le Read tool sur les fichiers `/tmp/sc_1.jpg`, `/tmp/sc_2.jpg`, etc.

3. **Nommer chaque image** selon ce qu'elle contient réellement (vérifier attentivement, ne pas deviner). Format : `projet-description-ecran.webp`

4. **Convertir en WebP final** avec `cwebp` (meilleure compression) :

```bash
cd "/chemin/vers/dossier/assets"
cwebp -q 88 /tmp/sc_1.jpg -o nom-descriptif.webp
```

5. **Supprimer les PNG originaux** une fois les webp créés (optionnel).

6. **Créer les sliderSets** dans `projets.ts` en regroupant les images par thématique.

> Erreur à éviter : ne jamais nommer une image sans l'avoir vue. Toujours lire l'image avant de la nommer. Un chapitre affiché à l'écran peut ne pas correspondre au nom qu'on lui attribue de mémoire.

---

## Layout de la page projet

### Pattern de référence — Russian with Julia (prototype)

Depuis mai 2026, **`app/projets/russian-with-julia/page.tsx`** est la page de référence pour tous les nouveaux projets. Elle override la route dynamique `[slug]` quand le slug correspond. La structure est pensée comme un magazine éditorial, fine et cadrée, qui sert à la fois le grand public et les recruteurs/devs.

#### Container et largeurs

- Container principal : `max-w-6xl` (≈1152px) — image et grilles prennent toute la largeur
- Texte de paragraphe : borné à `max-w-2xl` (≈672px) pour la lisibilité
- Tagline éditoriale : `max-w-3xl`, sans-serif `font-light`, accents `*serif italique accent*`

#### Pattern grille label/contenu (toutes les sections)

Chaque section utilise le même header en grille `lg:grid-cols-[180px_1fr] gap-12` :

- **Colonne gauche (180px)** : eyebrow uppercase tracking large + gros chiffre éditorial (clamp 2.5rem→4rem) avec une couleur d'accent par section
- **Colonne droite** : titre h2/h3 (font-black + accent serif italique sur un fragment) + courte description (max-w-2xl)
- En dessous : image / grille / slider en pleine largeur du shell

Quand un texte long doit suivre une section avec image (cas section 01), il est aligné sur la colonne contenu via une mini-grille `[180px_1fr]` avec un spacer hidden sur la colonne label. Pas de `pl-[228px]` arbitraire.

#### Couleurs d'accent par section

- 01 — Vue d'ensemble : `--accent` (vert)
- 02 — Enjeux & défis : `--mauve`
- 03/04/05 — Sliders thématiques : `--accent`, `--mauve`, `--gold` (rotation visuelle)
- 06 — Côté technique : `--gold`
- 07 — Stack du projet : `--lavender`

#### Animations au scroll

Composant `<Reveal>` co-located dans `app/projets/russian-with-julia/_components/reveal.tsx`. Wrapper léger autour de `motion` + `useInView` (margin `-80px 0px`, `once: true`). À utiliser sur chaque section et sur les sous-blocs avec un `delay` staggered (`0.04`–`0.16s`).

#### Mise en valeur des chiffres clés

`~~mot~~` rend le mot en lavender bold. À utiliser pour les chiffres business ou la dimension du projet (ex : `~~plus de 500 élèves~~`, `~~25 pays~~`). Doser pour ne pas saturer.

#### Largeurs de paragraphe

- Tagline (section 01) : `max-w-3xl`
- Description longue (section 01, sous le hero) : `max-w-3xl` — un peu plus généreux pour donner de la respiration au bloc d'intro
- Description courte d'un header de section (sliders, côté technique, équipe) : `max-w-2xl` — phrase courte qui contextualise le bloc qui suit
- Solution d'un challenge (côté technique) : `max-w-2xl`
- Rôle d'un outil ou d'un crédit (index typo) : `max-w-[20rem]` ou `max-w-[24rem]`

#### Structure de la page

L'enchaînement standard est le suivant (numéroter selon ce qui est présent — pas tous les projets ont toutes les sections) :

1. **Header** : titre client en `font-black`, sous-titre, intro avec markdown léger, meta card à droite (contexte, année, stack, lien externe ou encart "Diffusion" pour les projets agence sans url public)
2. **Section 01 — Vue d'ensemble** : tagline éditoriale OU titre h2 court + média principal (image / vidéo) full container avec légende mono `Fig.01` + description longue alignée sur la colonne contenu
3. **Section 02 — Enjeux & défis** (optionnel) : 3 piliers en grille (`pillarsCards`) avec icônes Lucide colorées
4. **Sections sliders** : pour chaque `sliderSet`, header label/contenu + `ProjetImageSlider` plein conteneur
5. **Section côté technique** : challenges en mode magazine (gros numéro à gauche, titre + description à droite, séparateur fin)
6. **Section stack** : index typographique des technologies (numéros 01–N, nom à gauche, rôle court à droite). Garder 6 à 10 entrées max — résumer chaque outil en une ligne, pas plus.
7. **Section équipe** (projets agence uniquement) : crédits en index typo, même format que la stack (numéro · nom · rôle)
8. **CTA Services** : encart vers `/services`
9. **Projet suivant** : lien inline en bas de page
10. **Boutons flottants** : prev/next desktop only

Les sections sont numérotées dans l'ordre de la page projet. Pas de "trou" dans la numérotation : si un projet n'a pas de section "Enjeux & défis", la section suivante reprend le numéro 02, et ainsi de suite.

#### Migration des autres projets vers ce pattern

L'idée : reprendre cette structure pour tous les projets, en adaptant le mode média au type de projet. Quatre modes prévus :

| Mode | Projets | Spécificité média | Page de référence |
|---|---|---|---|
| **freelance / site live** | Russian with Julia, Bald, Make a Scene | Hero = capture full container (16:9). Slug consultable en ligne via `url` → bouton "Voir le site en ligne" dans la meta card. | `app/projets/russian-with-julia/page.tsx`, `app/projets/bald-artiste/page.tsx` |
| **agence — vidéo desktop** | BNP Paribas Academy, Make a Scene | Hero = vidéo 16:9 full container via `WideVideoPlayer` (gère `videoLoopStart` / `videoLoopEnd`). Pas de site live → meta card sans encart "Voir le site". Sections "Équipe" et "Aujourd'hui" optionnelles selon présence de `credits` / `resultats`. | `app/projets/bnp-paribas-elearning/page.tsx`, `app/projets/make-a-scene/page.tsx` |
| **agence — vidéo mobile/tablette** | TotalEnergies, Aéroports de Paris | Hero = vidéo portrait dans une grille 5/12-7/12 (vidéo gauche / `descriptionPublic` droite). Sous le `descriptionPublic` : grille de "key facts" (4 chiffres / labels) pour équilibrer la hauteur de la vidéo verticale. Médias suivants : quinconce (image gauche / caption droite + tags ; texte gauche + indicateurs / image droite) **OU** frise séquentielle quand la donnée est un funnel multi-captures. Section "Aujourd'hui / Après l'opération" pour valoriser `resultats`. | `app/projets/argedis-totalenergies/page.tsx`, `app/projets/sweetime-adp-extime/page.tsx` |
| **agence — mixte desktop/mobile** | RG10 / Artefact | Sections alternant 16:9 desktop et portrait mobile selon le contenu réel. | À faire |

Dans tous les modes : header label/contenu, sections numérotées, palette de couleurs accent par section, animations `<Reveal>`, section **équipe** intégrée pour les projets agence (juste avant le CTA).

#### Règles spécifiques au mode portrait (vidéo mobile/tablette)

Quand le média est vertical, la vidéo / l'image fait ~640px de haut alors que le texte associé fait souvent 300-400px → grand vide visuel à équilibrer.

- **Pas de bandes noires** : laisser la vidéo / image dans son ratio naturel (`block w-full h-auto`, sans `bg-black`, sans `max-h`, sans `object-contain`). Limiter la taille via `max-w-[400px]` du conteneur sur mobile, `lg:w-full` côté desktop (la largeur est dictée par le `col-span-5` du parent).
- **Enrichir la colonne texte** sous le paragraphe principal avec un bloc visuel typé "fiche technique" :
  - introduit par un séparateur fin (`pt-8 border-t border-foreground/10`) et un eyebrow mono
  - exemples : grille 2×2 de "key facts" (chiffre + label), pastilles taguées (régions, langues, variantes), indicateurs d'interactions (glyphes mono `◀ ▶`, `FR ⇄ EN`, `↕`)
- **Deux patterns d'affichage des médias suivants** selon la donnée disponible :
  - **Quinconce** (TotalEnergies) — quand le projet a des `imageCaptions` (paragraphes longs) : alterner image gauche / caption droite, puis caption gauche / image droite. Inverser via `order-1 / order-2` sur desktop, ordre naturel sur mobile.
  - **Frise séquentielle** (Sweetime / ADP) — quand le projet a un `sliderSets` qui décrit un funnel (4-6 captures séquentielles) : grille `lg:grid-cols-4` avec numérotation typée `01 / Saisie email`, `02 / Flip de carte`, etc., et un filet de progression coloré sous chaque étape qui matérialise l'avancement.

À migrer un par un (`page.tsx` custom par projet, sous `app/projets/[slug]/page.tsx`). Composants partagés à utiliser :
- `app/projets/_components/reveal.tsx` — animations au scroll
- `app/projets/_components/section-header.tsx` — pattern grille label/contenu (ex. `<SectionHeader>` + `<SectionOffset>`)

Pour l'instant, chaque page custom inline son propre code de header pour rester souple, mais quand on aura migré les 4 projets restants on pourra extraire le squelette commun (meta card, hero média, blocs sections) dans un composant `<ProjectShell>`.

---

### Structure du `[slug]/page.tsx` actuel (legacy, en cours de migration)

La page `app/projets/[slug]/page.tsx` est un Server Component générique encore utilisé pour tous les projets sauf Russian with Julia. Sa structure :

1. **Header** — titre client, meta card (contexte, année, stack), lien externe
2. **BLOC 1** — vidéo ou image principale
   - `wideMedia: true` : vidéo 16:9 full width + texte en dessous
   - `wideMedia: false` : vidéo portrait à gauche + texte à droite
3. **Piliers** (`pillarsCards`) — 3 cards visuelles avec icônes Lucide. Si absent, fallback sur **Points clés** (`pointsCles`) — enjeux, défis, intérêt
4. **BLOC 2** — zigzag (portrait uniquement) : texte gauche + slider images droite
5. **Côté technique ×2** (si `interleaveZigzag`) — challenges[0..1] entre BLOC 2 et BLOC 3
6. **BLOC 3** — zigzag suite : slider gauche + texte droite
7. **Côté technique restant** (si `interleaveZigzag`) — challenges[2..]
8. **Sliders thématiques** — chaque `sliderSet` avec titre + description
   - Si `challenges` existent aussi : interleaved entre les sets
9. **Stack du projet** — technologies détaillées
10. **Résultats** — encart border-left
11. **Crédits** — équipe
12. **Projet suivant** — inline en bas de page
13. **Boutons flottants** — prev (left-14) et next (right-14), desktop only

---

## Assets

- `/public/assets/[projet]/` — images et vidéos
- Format recommandé : **WebP** (qualité 88) pour les images, **MP4** pour les vidéos
- Dimensions recommandées : **1920×1080** (16:9) pour les projets `wideMedia`, **700×1520** environ pour les screenshots portrait
- Miniatures de la grid : format **16:9**, minimum 1200×675

---

## Commits

Ce projet suit le scénario C (projet personnel) : pas d'antidatage, `/usr/bin/git` pour éviter le trailer Cursor, message détaillé avec tirets.
