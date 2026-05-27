<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Portfolio — règles agent

## i18n — règle absolue

Le site est **bilingue FR / EN** via `next-intl`. **Toute modification de texte UI doit être appliquée dans les deux langues, sans exception.**

### Architecture

- Config : `i18n/routing.ts` (locales `fr` + `en`, défaut `fr`, `localePrefix: "as-needed"`, `localeDetection: false`)
- **Détection custom** dans `proxy.ts` : règle binaire **« navigateur explicitement FR (Accept-Language commence par `fr*`) → FR, tout le reste → EN »**. Permet de couvrir aussi les langues qu'on ne supporte pas (PL, DE, JA…) en les envoyant sur EN, contrairement au matching standard de next-intl qui retombe sur defaultLocale=fr quand rien ne matche.
- Cookie `NEXT_LOCALE` mémorise le choix utilisateur (LocaleSwitcher) et a priorité sur la détection
- Layout localisé : `app/[locale]/layout.tsx`
- Traductions : `messages/fr.json` + `messages/en.json`

### URLs

- Français (locale par défaut, sans préfixe) : `/`, `/projets`, `/services`, `/a-propos`, `/contact`
- Anglais (préfixée) : `/en`, `/en/projets`, `/en/services`, `/en/a-propos`, `/en/contact`
- Les slugs restent en français dans les deux langues (`/en/a-propos`, pas `/en/about`) — choix volontaire pour la simplicité et le SEO conservé

### Règles de modification

1. **Ajouter un texte** : créer la clé dans `messages/fr.json` ET `messages/en.json` simultanément, jamais juste l'une des deux
2. **Modifier un texte existant** : mettre à jour la clé dans `messages/fr.json` ET `messages/en.json` simultanément
3. **Supprimer un texte** : retirer la clé des deux fichiers
4. **Jamais de texte hardcodé** dans les composants — toujours passer par `useTranslations()` (client) ou `getTranslations()` (server)
5. **Liens internes** : utiliser `Link`, `useRouter`, `usePathname`, `redirect` depuis `@/i18n/navigation`, JAMAIS depuis `next/link` ou `next/navigation` (sinon la locale n'est pas préservée)
6. **Slugs dynamiques** : si on ajoute/renomme une page (`app/[locale]/nouvelle-page/`), penser au `next.config.ts` redirects + aux références aux URLs dans les composants

### Outils next-intl utilisés

| Besoin | API |
|--------|-----|
| Texte dans un Server Component | `getTranslations(namespace)` |
| Texte dans un Client Component | `useTranslations(namespace)` |
| Texte avec balisage HTML | `t.rich("key", { tag: (chunks) => <span>{chunks}</span> })` |
| Pluriels | `t("key", { count })` avec `{count, plural, =0 {…} one {…} other {…}}` |
| Lien interne | `<Link href="/projets">…</Link>` depuis `@/i18n/navigation` |
| Changer de langue | `useRouter().replace(pathname, { locale: "en" })` |
| Locale courante (client) | `useLocale()` |
| Locale courante (server) | `await getLocale()` |
| Locale dans metadata | `params.locale` puis `getTranslations({ locale, namespace })` |

### Ajout d'une nouvelle page

1. Créer le dossier dans `app/[locale]/ma-page/page.tsx`
2. Récupérer `locale` via `params: Promise<{ locale: string }>` + appeler `setRequestLocale(locale)`
3. Ajouter un namespace `maPage` dans les deux fichiers messages
4. Exporter `generateMetadata` avec `getTranslations({ locale, namespace: "maPage.meta" })`
5. Ajouter la page à la nav (`messages.nav.*` + tableau de liens dans `components/layout/nav.tsx`) si nécessaire

### Switch de langue

`components/layout/locale-switcher.tsx` — bouton segmented `FR | EN` intégré à droite de la nav (desktop et mobile). Conserve le pathname et les query params au switch via `router.replace(pathname, { locale })`.

### Composants déjà i18n-ready

**Layout & sections homepage** :
- `components/layout/nav.tsx` (client)
- `components/layout/footer.tsx` (server, async)
- `components/layout/locale-switcher.tsx` (client)
- `components/sections/hero.tsx` — utilise `t.rich` pour la description avec balises `<artefact>`, `<data>`, `<clients>`
- `components/sections/about-intro.tsx`
- `components/sections/projets.tsx` (section homepage — liste de 3 projets)
- `components/sections/services.tsx` (section homepage — 2 pitchs)
- `components/sections/tech-band.tsx` — items typés `internal` (i18n via `nav.*`) / `project` (slug, nom propre non traduit) / `external` (LinkedIn, GitHub, Instagram)
- `components/sections/intro-overlay.tsx`

**Pages complètes** :
- `app/[locale]/page.tsx` (homepage)
- `app/[locale]/contact/page.tsx` + `components/sections/contact-form.tsx`
- `app/[locale]/a-propos/page.tsx` (header, stats, 2 cartes, histoire en 6 paragraphes rich, timeline expérience, stack technique, formation)
- `app/[locale]/projets/page.tsx` + `components/sections/projets-grid.tsx` (filtres Type/Année, recherche, contexte, count i18n avec pluriels)
- `app/[locale]/projets/[slug]/page.tsx` (fallback dynamique) — utilise `getTranslations("projetContent")` pour les UI labels et `getTranslations("projetsData")` pour les textes par projet (avec `.has(slug.field)` qui fallback sur la valeur FR de `lib/projets.ts`)
- 6/7 fiches projets dédiées : `argedis-totalenergies`, `bald-artiste`, `bnp-paribas-elearning`, `make-a-scene`, `russian-with-julia`, `sweetime-adp-extime` — toutes refactorées en server async + `setRequestLocale` + `projetsData.<slug>.<field>`
- `app/[locale]/services/page.tsx` (header, 3 formules avec inclus/non inclus, FAQ 8 questions en rich text, booking CTA, configurer card)
- `app/[locale]/services/[slug]/page.tsx` + `components/sections/service-configurator.tsx` (~1000 lignes, fully bilingual) + `lib/services-content.ts` helper qui injecte `servicesData.<slug>` dans la data structurelle de `lib/services.ts`
- `components/sections/booking-discovery-cta.tsx` (Card + Button + modale Google Meet)
- `components/sections/booking-calendar.tsx` (calendar + form + confirmation dialog, localisé date-fns `fr`/`enUS`, `Intl.DateTimeFormat("fr-FR" | "en-US")`)
- `components/sections/booking-floating-cta.tsx`
- `components/sections/service-workflow.tsx` (4 steps par formule)
- `components/sections/service-projects.tsx` (éventail desktop + cards mobile)
- `components/sections/service-testimonials.tsx` (5 testimonials traduits)
- `components/sections/service-ctas.tsx`
- `components/sections/quote-email-dialog.tsx` (devis par email + bloc confirmation)
- `components/sections/addon-info-dialog.tsx`
- `components/sections/projet-image-slider.tsx`, `projet-gallery.tsx`, `demo-showcase-slider.tsx` (aria-labels)
- **Emails Resend** : `lib/emails/booking-confirmation-email.ts` (HTML + text bilingues via param `locale`) — l'email contact est unilingue FR car envoyé à Léo, l'email confirmation est dans la langue du client. L'API `/api/booking` propage la `locale` du client depuis `BookingCalendar`.

### Architecture data structurelle vs contenu traduit

Pour les fichiers de data lourds (`lib/projets.ts`, `lib/services.ts`), on garde la **structure technique** (slugs, prix, images, dates, IDs, tags techniques) côté `lib/*.ts` ; le **contenu textuel** vit dans `messages/{fr,en}.json` :

- `lib/projets.ts` : conserve toutes les valeurs FR comme fallback. La page consomme `getTranslations("projetsData")` et utilise `tProjet.has("slug.field")` pour basculer entre traduction et fallback FR. Permet à `lib/projets.ts` d'être lu directement par des composants non encore i18n-isés sans casser.
- `lib/projets-i18n.ts` : helper `localizeProjetCard(projet, tProjetsData)` qui renvoie `{ titre, description }` localisés pour les listes/cartes de projets (consommé par `projets.tsx`, `projets-grid.tsx`, `service-projects.tsx`). À utiliser dès qu'on affiche un projet hors de sa fiche dédiée — **ne jamais lire `projet.titre` / `projet.description` directement** dans un composant UI, sinon les sous-titres restent en FR sur la version EN.
- `lib/services.ts` : intact (utilisé par `contact-form.tsx`). Le wrapper `lib/services-content.ts` exporte `getServiceContent(slug, t)` qui fusionne structure + traductions `servicesData.<slug>`.

### Namespaces top-level (messages/*.json)

| Namespace | Owner / périmètre |
|-----------|-------------------|
| `common`, `nav`, `localeSwitcher`, `footer`, `metadata`, `intro` | layout global |
| `home`, `aPropos`, `contact`, `projets`, `services` | pages principales |
| `booking` | `modal`, `calendar`, `floatingCta`, `imageSlider`, `card`, `button`, `dialog` (composants booking-* + sliders d'image) |
| `servicesData` | data des 3 formules (audiences, hooks, inclus, addons, suboptions, descriptions) consommée par `lib/services-content.ts` |
| `serviceConfigurator` | UI labels du `<ServiceConfigurator />` |
| `serviceQuoteDialog` | UI labels du `<QuoteEmailDialog />` |
| `serviceWorkflow`, `serviceCtas`, `serviceTestimonials`, `serviceProjects` | sections affichées sur `/services/[slug]` |
| `addonInfo` | UI du `<AddonInfoDialog />` du configurator |
| `projetContent` | UI commune des pages projet (eyebrows, labels, contexte, CTAs) |
| `projetsData` | contenu par projet (titre, intro, tagline, sliderSets, technologies, challenges, pillarsCards, credits…) consommé par les 6 fiches + la page dynamique |

### Composants encore à i18n-iser

- `app/[locale]/projets/kalypso/_kalypso-client.tsx` (~860 lignes) — fiche projet entièrement français, fortement éditorial (univers vin/terroir, citations serif italique). À traduire dans une session dédiée avec attention au registre éditorial. Le wrapper `page.tsx` est OK (server + `setRequestLocale`), seul le contenu narratif reste FR.

### Stack technique

Voir `~/.cursor/rules/stack-reference.mdc` côté machine. Pour le portfolio en particulier :
- Next.js 16 App Router + TypeScript + Tailwind 4 + shadcn/ui + Motion + Sonner
- `next-intl` pour l'i18n
- Pas de DB, pas d'auth (site statique)
- Resend pour les emails (contact unilingue FR vers Léo, confirmation booking bilingue côté client)

### Outils de référence

- `.cursor/i18n-glossary.md` : glossaire FR ↔ EN pour la cohérence des traductions (termes métier, marques à ne pas traduire, style EN, conventions techniques)
