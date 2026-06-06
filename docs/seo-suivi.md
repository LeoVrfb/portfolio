---
created: 2026-06-06T18:20
modified:
 - 2026-06-06T18:20
tags: [seo, suivi, monitoring, portfolio]
---

# SEO Pro — Document de suivi `leohengebaert.fr`

Document opérationnel de monitoring SEO post-déploiement. À consulter mensuellement (ou après chaque ajout de contenu significatif).

> Le détail de **ce qui a été mis en place** est dans `digital-agency/references/seo/rex-portfolio-leo.md`. Ce fichier-ci est l'**outil de suivi**.

## Récap de l'infrastructure SEO en place

| Élément | Status | Où vérifier |
|---|---|---|
| `sitemap.xml` dynamique | ✅ Live | https://leohengebaert.fr/sitemap.xml |
| `robots.txt` dynamique | ✅ Live | https://leohengebaert.fr/robots.txt |
| `llms.txt` (cartographie pour LLMs) | ✅ Live | https://leohengebaert.fr/llms.txt |
| Canonical + hreflang FR/EN par page | ✅ | `view-source:` sur chaque page |
| Schemas JSON-LD (Person, WebSite, ProfessionalService, FAQPage, Service, BreadcrumbList, CreativeWork) | ✅ | https://search.google.com/test/rich-results |
| Open Graph + Twitter Cards par page | ✅ | https://www.linkedin.com/post-inspector/ |
| IndexNow (clé `09e174eb1cb244ce8e14ae9111e2c96c`) | ✅ servi | https://leohengebaert.fr/09e174eb1cb244ce8e14ae9111e2c96c.txt |
| Vérification GSC + Bing | ⏳ à activer | Variables Vercel `NEXT_PUBLIC_*_SITE_VERIFICATION` |

## Routine mensuelle (15 min)

### 1. Google Search Console

Aller sur https://search.google.com/search-console → propriété `leohengebaert.fr`.

**Onglet « Performances »** :
- [ ] Total impressions : tendance ↑ ?
- [ ] Total clics : tendance ↑ ?
- [ ] CTR moyen : entre 2 et 8 % est sain
- [ ] Position moyenne : tendance ↓ (vers 1) ?

**Onglet « Indexation > Pages »** :
- [ ] Pages indexées : doit être ~14 (toutes sauf Kalypso) — si moins, voir les raisons (« couvrent », « exclusion », etc.)
- [ ] Aucune erreur critique (5xx, 404 inattendus, redirects en boucle)

**Onglet « Expérience > Core Web Vitals »** :
- [ ] Statut « Bon » sur > 75 % des URLs (mobile + desktop)
- [ ] Si « À améliorer » ou « Mauvais » : voir détail par URL et fix le LCP/CLS/INP

**Onglet « Améliorations »** :
- [ ] Schemas détectés : Person, FAQ, Service, Breadcrumbs, etc. — pas d'erreurs
- [ ] Si nouveaux problèmes : valider le rich snippet sur https://search.google.com/test/rich-results

### 2. Bing Webmaster Tools

Aller sur https://www.bing.com/webmasters/ → propriété `leohengebaert.fr`.

**Onglet « Site Explorer »** :
- [ ] Nombre d'URLs explorées : ~14
- [ ] Aucune URL bloquée par robots.txt par erreur

**Onglet « IndexNow Insights »** :
- [ ] Clé challenge : encore valide (✅)
- [ ] URLs soumises au mois dernier : visibles dans l'historique

**Onglet « Search Performance »** :
- [ ] Tendance impressions / clics (équivalent GSC)
- [ ] Note : Bing alimente ChatGPT Search → ces clics représentent souvent du trafic IA

### 3. Test Rich Results manuel sur 5 URLs

Pour chacune, lancer https://search.google.com/test/rich-results et coller l'URL :

- [ ] `https://leohengebaert.fr/` → Person + WebSite + ProfessionalService détectés, 0 erreur
- [ ] `https://leohengebaert.fr/services` → FAQPage (8 questions) + 3× Service éligibles
- [ ] `https://leohengebaert.fr/services/standard` → Service + Offer + BreadcrumbList
- [ ] `https://leohengebaert.fr/projets/bnp-paribas-elearning` → CreativeWork + BreadcrumbList
- [ ] `https://leohengebaert.fr/a-propos` → Person, BreadcrumbList si ajouté

### 4. Audit Lighthouse (mobile)

**Méthode A — PageSpeed Insights web (gratuit, illimité)** :

1. Aller sur https://pagespeed.web.dev/
2. Entrer `https://leohengebaert.fr/` → cliquer « Analyser »
3. Vérifier les 4 scores :
   - [ ] **Performance** : ≥ 90 (mobile) / ≥ 95 (desktop)
   - [ ] **Accessibility** : 100
   - [ ] **Best Practices** : ≥ 95
   - [ ] **SEO** : 100

4. Répéter sur `/services`, `/projets`, `/a-propos`, `/contact`.

**Méthode B — Lighthouse CLI (local)** :

```bash
pnpm dlx lighthouse https://leohengebaert.fr --view --preset=desktop
pnpm dlx lighthouse https://leohengebaert.fr --view --form-factor=mobile
```

### 5. Re-ping IndexNow après modifications

Après tout changement de contenu majeur (nouvelle page projet, refonte de /services, etc.) :

```bash
cd ~/app/portfolio
pnpm indexnow                                # ping toutes les URLs du sitemap
pnpm indexnow /services /projets/nouveau    # ping seulement les URLs précisées
```

## Triggers d'alerte (à investiguer immédiatement)

| Symptôme | Cause possible | Action |
|---|---|---|
| Chute brutale d'impressions GSC | Penalty Google, déploiement cassé, robots.txt buggé | Vérifier `https://leohengebaert.fr/robots.txt`, le sitemap, et l'inspection URL d'une page clé dans GSC |
| Core Web Vitals « Mauvais » | Régression LCP/CLS après déploiement | Lighthouse local sur la page incriminée, voir les éléments de blocage |
| URL `noindex` détectée par GSC sur une page non-Kalypso | Bug dans `generateMetadata` | `view-source:` la page → chercher `noindex` |
| Pages exclues « Page avec redirection » | Confusion canonical / proxy | Vérifier que `/demo` redirige bien vers `/`, et que `proxy.ts` n'a pas de boucle |
| Schemas JSON-LD avec erreurs sur Rich Results Test | Régression dans `lib/seo/json-ld.ts` | Voir le diff git récent, restaurer si besoin |

## Ressources externes

- **Google Search Console** : https://search.google.com/search-console
- **Bing Webmaster Tools** : https://www.bing.com/webmasters/
- **Rich Results Test** : https://search.google.com/test/rich-results
- **Schema.org Validator** : https://validator.schema.org/
- **PageSpeed Insights** : https://pagespeed.web.dev/
- **Facebook Sharing Debugger** : https://developers.facebook.com/tools/debug/
- **LinkedIn Post Inspector** : https://www.linkedin.com/post-inspector/
- **Twitter Card Validator** : https://cards-dev.twitter.com/validator (deprecated mais tjrs partiellement fonctionnel)
- **REX complet** : `digital-agency/references/seo/rex-portfolio-leo.md`

## Améliorations futures (Phase 7+)

À évaluer dans 3 mois en fonction des résultats GSC :

- **Blog éditorial** : 4-6 articles longue traîne (« Comparatif WordPress vs Next.js », « Comment choisir un développeur freelance », « Tarif site vitrine 2026 »). Boost SEO + AI search. ~2-3 jours d'écriture.
- **OG images dynamiques par page** (avec satori) : visuel custom pour chaque page projet/service partagé.
- **Hook Vercel post-deploy** qui ping IndexNow auto à chaque release.
- **Page /comparatif-formules** : tableau détaillé Essentiel/Standard/Premium pour les requêtes informationnelles.
- **FAQ extended sur /a-propos** : 5-7 Q/R sur le profil, dispo, mode de travail.
- **Glossaire technique** (`/glossaire`) : définitions de Next.js, React, SEO, etc. — capture le trafic informationnel.
