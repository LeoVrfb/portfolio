# Structure des projets

## Ajouter un projet

Tout se passe dans `lib/projets.ts`. Ajouter un objet au tableau `projets`, le plus tôt possible dans l'ordre (le premier élément est la carte héro sur `/projets`).

### Champs obligatoires

| Champ | Type | Notes |
|---|---|---|
| `slug` | string | URL du projet : `/projets/[slug]` |
| `titre` | string | Sous-titre de l'app/mission |
| `client` | string | Nom complet du client |
| `contexte` | `"agence" \| "freelance" \| "perso"` | |
| `description` | string | Résumé court (meta SEO) |
| `intro` | string | Intro affichée dans le header de la page. Supports `**gras vert**` et `__gras blanc__` |
| `img` | string | Miniature de la carte grid (`/assets/…`) |
| `tags` | string[] | Stack affichée dans la meta card |
| `date` | string | Format `YYYY-MM` |

### Champs optionnels

| Champ | Type | Notes |
|---|---|---|
| `clientShort` | string | Nom court pour les boutons flottants |
| `logo` / `logos` | string / string[] | Logo(s) client dans la meta card |
| `descriptionPublic` | string | Texte affiché sous la vidéo/media. Supports `**vert**` et `__blanc__` |
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

La page `app/projets/[slug]/page.tsx` est un Server Component générique.

### Structure d'affichage (dans l'ordre)

1. **Header** — titre client, meta card (contexte, année, stack), lien externe
2. **BLOC 1** — vidéo ou image principale
   - `wideMedia: true` : vidéo 16:9 full width + texte en dessous
   - `wideMedia: false` : vidéo portrait à gauche + texte à droite
3. **Points clés** — enjeux, défis, intérêt
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
