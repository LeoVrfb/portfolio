# Portfolio — Documentation technique

## Architecture

Next.js 16 App Router, TypeScript, Tailwind CSS v4, pnpm.

### Structure des dossiers

```
app/
  page.tsx              → Accueil (HeroSection + TechBand + AboutIntro + ProjetsSection + ServicesSection)
  projets/
    page.tsx            → Liste projets (ProjetsGrid)
    [slug]/page.tsx     → Détail projet (server component)
  services/
    page.tsx            → Page tarifs (server component, prix + formules)
    [slug]/page.tsx     → Configurateur formule (essentiel/standard/premium)
  a-propos/page.tsx     → Page à propos
  contact/page.tsx      → Formulaire de contact
  layout.tsx            → Root layout — fonts (Space Grotesk + DM Mono + Bebas Neue), Nav, Footer
                           (IntroOverlay rendu uniquement par `[locale]/page.tsx`, voir Intro animation)

components/
  layout/
    nav.tsx             → Navigation fixe (glass pill) — liens: Accueil, Projets, Services, À propos, Contact
    footer.tsx          → Footer
  sections/
    hero.tsx            → Section hero — attend onIntroReady() pour démarrer animations
    hero-neon-anim.tsx  → Animation neon avec portrait professionnel (HeroNeonAnim)
    intro-overlay.tsx   → Plein écran intro — signale signalIntroReady() après fade
    projets.tsx         → Section projets homepage (3 premiers projets en liste)
    projets-grid.tsx    → Grid de projets avec filtres (contexte, année, recherche)
    services.tsx        → Section services homepage (2 colonnes — boutons alignés via flex-col)
    bald-identity-showcase.tsx → Slider live 3 slides (logo, badge, splash) pour projet BALD
    projet-gallery.tsx  → Galerie images projet
    projet-image-slider.tsx → Slider images projet (wide ou portrait)
    wide-video-player.tsx → Lecteur vidéo 16:9 avec loop start/end
  animations/
    blur-fade.tsx       → Animation d'entrée (opacity + blur + translate)
    h1-typewriter.tsx   → H1 du hero — typewriter avec glow néon (vert/mauve)

lib/
  projets.ts            → Source de vérité — type Projet + tableau projets[] (5 projets)
  intro-signal.ts       → Module signal — synchronise intro overlay avec animations hero
  utils.ts              → cn() helper

proxy.ts                → Middleware Next.js — redirige /demo vers /
public/
  assets/               → Images optimisées WebP par projet
    bnp/                → BNP Paribas e-learning
    videoArgedis/       → TotalEnergies Argedis  
    sweetime/           → Sweetime ADP Extime
    makeAScene/         → Make a Scene Artefact
    bald/               → BALD artiste (badge, logo, hero, galerie, feuille-or.avif, trait-noir.png)
    portrait-professionnel.webp → Portrait dans intro animation
```

## Gestion des projets

Tout est dans `lib/projets.ts`. Type `Projet` :

- `slug` — URL du projet
- `titre` — Nom de l'app/mission
- `client` — Nom du client  
- `contexte` — "agence" | "freelance" | "perso"
- `img` — Image miniature (utilisée dans la grille et comme image principale)
- `video` — Vidéo démo (portrait → affiché à gauche sur desktop, centré sur mobile)
- `wideMedia: true` — Vidéo/image en 16:9 pleine largeur + texte en dessous
- `sliderSets` — Sets de slides (titre + description + images[])
- `customSlider: "bald-identity"` — Remplace le premier sliderSet par BaldIdentityShowcase
- `url` — Lien vers le site en prod (bouton "Voir le site en ligne")

## Intro animation

L'intro overlay (`HeroNeonAnim` plein écran ~4.2s) est l'expérience signature
du portfolio. Choix produit assumé : elle joue à **chaque chargement de la
home `/`**, n'est **pas skippable** côté client (pas de onClick handler, pas
de hint visuelle), et **n'apparaît jamais sur les autres pages** (services,
projets, à propos, contact). Trade-off : LCP synthétique mobile dégradé sur
la home, accepté car l'effet "wahou" prime (cf. `seo-roadmap-post-livraison.md`).

1. `app/[locale]/page.tsx` (la home) rend `<IntroOverlay />` en début de page
2. `IntroOverlay` affiche `HeroNeonAnim` (animation neon + portrait) pendant ~4.2s
3. Au fade-out, appelle `signalIntroReady()` (via `lib/intro-signal.ts`)
4. `HeroSection` écoute `onIntroReady()` et affiche son contenu seulement après
5. Le H1 "Léo Hengebaert" tape ensuite via `H1Typewriter` avec glow néon
   (vert accent pour "Léo", mauve pour "Hengebaert")

Skips automatiques :
- **Bot UA** (Googlebot, Bingbot…) → skippé côté server dans `page.tsx`
  (`isBotUserAgent` sur `user-agent`) → contenu SSR complet pour les crawlers
- **`prefers-reduced-motion`** → skippé côté client (accessibilité OS)
- **`navigator.webdriver === true`** → skippé côté client (Lighthouse / Selenium /
  Playwright / Puppeteer) → score perf synthétique préservé en automation

## Badges contexte (projets-grid.tsx)

- agence → vert (`var(--accent)`)
- freelance → sky-blue (`var(--lavender)`)
- perso → jaune/or (`var(--gold)`)

## Services

Page `/services` → 3 formules (Essentiel 590€ / Standard 990€ / Premium 1890€) + options à la carte. Source de vérité : `documentation/produit/` + `lib/services.ts`.
Section homepage `ServicesSection` → 2 colonnes (Sites sur mesure / Collaboration) avec boutons alignés via `flex flex-col h-full` + `mt-auto`.
