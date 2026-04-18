# Produit

Source de vérité de l'offre commerciale. Tous les fichiers ici servent à :

- Alimenter le configurateur du portfolio (formules, options, prix dynamiques)
- Cadrer les briefs et devis clients
- Aligner le discours commercial (pitch, objections, comparatifs)

## Fichiers

- `formules.md` — Les 3 formules (Essentiel 590€, Standard 990€, Premium 1890€) et leur périmètre exact
- `options.md` — Toute la grille d'options (SEO, Performance, CMS, e-commerce, etc.) avec prix par formule
- `pitch.md` — Arguments de vente, comparatifs face à la concurrence (Wix, WordPress, Shopify), réponses aux objections
- `maintenance.md` — Offre maintenance 50€/mois flat + bonus e-commerce
- `paiement.md` — Conditions, acompte 50/50, red flags (ce qu'on ne vend jamais)
- `cms-sanity.md` — Pourquoi Sanity, grille de prix dynamique selon volume, formation client

## Doublon

L'intégralité de ces fichiers est dupliquée dans `portfolio/documentation/produit/` pour pouvoir bosser directement dans le repo portfolio quand on intègre l'offre au site. La source de vérité reste ici, dans `digital-agency`.

## Versionning

Avril 2026 — version validée après itération avec Léo. Voir `formules/reflexion.txt` pour l'historique des choix.

L'ancien `formules/README.md` est archivé en `formules/README.old.md`.

## À faire ensuite

- Mettre à jour `portfolio/lib/services.ts` avec la nouvelle grille
- Refondre les pages `/services/[slug]` du portfolio
- Construire le configurateur libre (sélection options dynamique + génération devis PDF)
- Détailler les workflows par scénario (e-commerce avec/sans panier, CMS Sanity, multilingue, etc.)
