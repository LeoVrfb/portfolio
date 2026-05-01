"use client";

/* ──────────────────────────────────────────────────────────────────────────
   PROJET FICTIF — DOMAINE DE L'OPALINE
   Page projet construite from scratch comme un magazine d'auteur.

   DIRECTION ARTISTIQUE
   ────────────────────
   Editorial dark · raffiné · luxe sourd. Pas de purple gradient cliché,
   pas de glassmorphism convenu. La page se lit comme un livre : index en
   marge, chiffres en filigrane, citations serif italique, légendes mono,
   placeholders gris travaillés (à remplacer par de vraies photos).

   TYPOGRAPHIE — strictement les fontes du site, aucune nouvelle dépendance
   ───────────────────────────────────────────────────────────────────────
   • Display  : DM Serif Display (--font-serif-display) — italic disponible
   • Body     : Space Grotesk (--font-geist-sans, déjà chargée pour le site)
   • Mono     : DM Mono (--font-geist-mono) — légendes, métadonnées, ticker

   PALETTE — strictement les tokens du site
   ────────────────────────────────────────
   • base   : --background (dark forest)
   • principal : --gold (chaleur de cave, vinification, lumière de bougie)
   • soutiens  : --mauve (robe d'un vin), --lavender (modernité)
   • rare      : --accent mint (réservé pour 1 highlight précis)
   ────────────────────────────────────────────────────────────────────────── */

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Wine,
  CalendarHeart,
  BedDouble,
  Quote,
  MapPin,
} from "lucide-react";

/* ════════════════════════════════════════════════════════════════════════
   DONNÉES — PROJET FICTIF
   ════════════════════════════════════════════════════════════════════════ */

const PROJET = {
  numero: "N°007",
  edition: "Édition Hiver",
  client: "Domaine de l'Opaline",
  signature: "Maison Bardet · Vigneronne en Bourgogne",
  contexte: "Freelance",
  annee: "2026",
  lieu: "Saint-Aubin · Côte de Beaune",
  url: "domaine-opaline.fr",
  tagline: {
    haut: "Quatre générations",
    milieu: "à veiller sur la pierre,",
    bas: "désormais en ligne.",
  },
  citation:
    "Je voulais un site qui donne le silence d'une cave et la lumière d'un matin de vendanges. Léo a écouté, puis il a écrit.",
  citationAuteur: "Camille Bardet — vigneronne, 4ᵉ génération",
} as const;

const PILIERS = [
  {
    n: "I",
    eyebrow: "Cave",
    titre: "Bouteilles numérotées,\nvendues comme des œuvres.",
    texte:
      "Chaque cuvée en édition limitée se réserve avant la mise en bouteille. Compteur de stock en temps réel, certificat numéroté généré au paiement, étiquette personnalisée à la commande.",
    ico: Wine,
    tint: "var(--gold)",
    bg: "hsl(47 72% 73% / 0.05)",
  },
  {
    n: "II",
    eyebrow: "Caveau",
    titre: "Visites guidées\nréservables d'un trait.",
    texte:
      "Trois formats de dégustation, un calendrier qui respecte la lune et les vendanges, paiement à la réservation, invitation Google Calendar avec plan d'accès joint.",
    ico: CalendarHeart,
    tint: "var(--mauve)",
    bg: "hsl(295 38% 68% / 0.05)",
  },
  {
    n: "III",
    eyebrow: "Maison d'hôtes",
    titre: "Cinq suites, cinq\nrécits à habiter.",
    texte:
      "Calendrier multi-ressources qui orchestre les chambres, le restaurant et le caveau ensemble. Une seule réservation peut composer un séjour entier.",
    ico: BedDouble,
    tint: "var(--lavender)",
    bg: "hsl(199 88% 78% / 0.05)",
  },
] as const;

const CHALLENGES = [
  {
    n: "01",
    titre: "Calendrier multi-ressources",
    extrait:
      "Une chambre, le caveau et la table peuvent être réservés ensemble ou séparément. La logique métier interdit certains combinats (dégustation seule le samedi, suite + table couplées en haute saison) et les conflits sont vérifiés au niveau de la transaction Convex.",
    accent: "var(--gold)",
  },
  {
    n: "02",
    titre: "Stock vivant pour les éditions limitées",
    extrait:
      "Chaque cuvée a un compteur réservé / vendu / restant qui se met à jour en temps réel via les subscriptions Convex. Aucun risque de double vente sur les dernières bouteilles d'une cuvée à 200 exemplaires.",
    accent: "var(--mauve)",
  },
  {
    n: "03",
    titre: "Sanity + ISR pour le journal",
    extrait:
      "La vigneronne écrit dans Sanity Studio. Le front Next.js régénère ses pages éditoriales par revalidation à la demande : un nouveau billet est en ligne en moins de dix secondes, sans rebuild complet.",
    accent: "var(--lavender)",
  },
  {
    n: "04",
    titre: "Cartographie du domaine en SVG animé",
    extrait:
      "Plutôt qu'une intégration Mapbox lourde, j'ai dessiné le domaine et ses parcelles à la main en SVG. Le tracé se révèle au scroll, les climats s'éclairent au survol. 12 ko gzip, zéro JS bloquant.",
    accent: "var(--accent)",
  },
  {
    n: "05",
    titre: "Trois langues, une seule source",
    extrait:
      "FR, EN et japonais via next-intl. Le contenu Sanity est localisé champ par champ ; les pages statiques sont générées par locale au build pour que chaque version ait son URL propre et son SEO.",
    accent: "var(--gold)",
  },
] as const;

const STACK = [
  { nom: "Next.js 16",        role: "App Router · ISR par tag" },
  { nom: "Sanity",            role: "CMS structuré · Studio embarqué" },
  { nom: "Convex",            role: "Réservations realtime · stock vivant" },
  { nom: "Stripe",            role: "Vins, séjours, dégustations · 1 compte, 3 catalogues" },
  { nom: "Resend",            role: "Confirmation client · alerte vigneronne" },
  { nom: "Cloudflare R2",     role: "Photos haute définition · zéro frais sortie" },
  { nom: "Motion",            role: "Reveals, scroll-trigger, micro-interactions" },
  { nom: "next-intl",         role: "Routing FR / EN / JA" },
] as const;

const CREDITS = [
  { role: "Direction artistique",    nom: "Léo Hengebaert" },
  { role: "Développement",           nom: "Léo Hengebaert" },
  { role: "Photographie",            nom: "Atelier Brisac" },
  { role: "Conseil œnologique",      nom: "Camille Bardet" },
] as const;

/* Petits "indicateurs" éditoriaux qui scrollent dans le ticker du haut.
   Donne immédiatement les infos clés du projet sans alourdir le hero. */
const TICKER = [
  "Domaine de l'Opaline",
  "Saint-Aubin · Bourgogne",
  "Refonte complète",
  "Vins · Caveau · Maison d'hôtes",
  "FR / EN / JA",
  "Hiver 2026",
] as const;

/* ════════════════════════════════════════════════════════════════════════
   PETITS COMPOSANTS
   ════════════════════════════════════════════════════════════════════════ */

/** Frame magazine pour un placeholder image. Pas une "card" : un rectangle
 *  raffiné avec un grain, un cadre fin, une légende type Fig.XX en bas droite. */
function PlateImage({
  ratio = "aspect-[4/5]",
  label,
  className = "",
}: {
  ratio?: string;
  label: string;
  className?: string;
}) {
  return (
    <figure className={`relative ${ratio} ${className} overflow-hidden`}>
      {/* Fond — gradient subtil pour que le placeholder respire */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(158 18% 14%) 0%, hsl(158 22% 11%) 60%, hsl(158 26% 8%) 100%)",
        }}
      />
      {/* Grain SVG — donne une matière, casse l'aspect "vide" */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
        }}
      />
      {/* Cadre fin */}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/8" />
      {/* Diagonale décorative très discrète */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, transparent 49.6%, white 49.8%, white 50.2%, transparent 50.4%)",
        }}
      />
      <figcaption className="absolute bottom-3 right-3 text-[9px] uppercase tracking-[0.32em] font-mono text-foreground/45">
        {label}
      </figcaption>
    </figure>
  );
}

/** Eyebrow magazine numéroté avec barre fine devant. */
function Eyebrow({
  children,
  color = "var(--gold)",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="block w-8 h-px"
        style={{ background: color, opacity: 0.6 }}
      />
      <span
        className="text-[10px] font-bold uppercase tracking-[0.4em] font-mono"
        style={{ color }}
      >
        {children}
      </span>
    </div>
  );
}

/** Reveal au scroll — léger fade + montée de 12px. */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════ */

export default function KalypsoPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: rootRef });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.5,
  });
  const progressWidth = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <div ref={rootRef} className="relative pt-16 pb-32 overflow-x-hidden">
      {/* ─────────── Reading progress bar ─────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
        style={{
          width: progressWidth,
          background:
            "linear-gradient(90deg, var(--gold) 0%, var(--mauve) 60%, var(--lavender) 100%)",
        }}
      />

      {/* ─────────── Grain global subtil ─────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* ─────────── Halo coloré derrière le hero ─────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[700px] -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, hsl(47 72% 73% / 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(295 38% 68% / 0.08) 0%, transparent 60%)",
        }}
      />

      {/* ─────────── Index romain en marge (xl+) ─────────── */}
      <aside className="hidden xl:flex flex-col gap-1.5 fixed left-8 top-1/2 -translate-y-1/2 z-40 select-none">
        {[
          { n: "I",   label: "Vue d'ensemble" },
          { n: "II",  label: "Trois piliers"  },
          { n: "III", label: "Le caveau"      },
          { n: "IV",  label: "Côté technique" },
          { n: "V",   label: "Stack"          },
          { n: "VI",  label: "Crédits"        },
        ].map((item, i) => (
          <a
            key={i}
            href={`#section-${item.n.toLowerCase()}`}
            className="group flex items-center gap-3 py-1.5 text-foreground/35 hover:text-foreground transition-colors cursor-pointer"
          >
            <span
              className="font-mono text-[10px] uppercase tracking-[0.3em] w-6"
              style={{ color: "var(--gold)" }}
            >
              {item.n}
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">
              {item.label}
            </span>
          </a>
        ))}
      </aside>

      {/* ──────────────────────────────────────────────────────────────────
          TICKER ÉDITORIAL — bandeau discret tout en haut, défilant.
          Annonce le projet sans que le hero ait à le faire.
          ────────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 mb-10 border-y border-foreground/10 overflow-hidden">
        <div className="flex gap-12 py-3 animate-[marquee_40s_linear_infinite] whitespace-nowrap">
          {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-12 text-[10px] font-mono uppercase tracking-[0.4em] text-foreground/40 shrink-0"
            >
              <span>{t}</span>
              <span
                aria-hidden
                className="w-1 h-1 rounded-full"
                style={{ background: "var(--gold)", opacity: 0.6 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────
          HEADER — back / marqueur d'édition / lien live
          ──────────────────────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 mb-14 relative z-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/projets"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-foreground/45 hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} />
            Retour
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/40">
            <span>{PROJET.numero}</span>
            <span aria-hidden className="w-3 h-px bg-foreground/20" />
            <span>{PROJET.edition}</span>
            <span aria-hidden className="w-3 h-px bg-foreground/20" />
            <span>{PROJET.annee}</span>
          </div>

          <a
            href={`https://${PROJET.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-foreground/45 hover:text-foreground transition-colors cursor-pointer"
          >
            {PROJET.url}
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION I — HERO ÉDITORIAL
          ════════════════════════════════════════════════════════════════════ */}
      <section
        id="section-i"
        className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10 mb-32 sm:mb-40"
      >
        {/* Eyebrow + meta */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
            <div className="space-y-3">
              <Eyebrow color="var(--gold)">I — Le projet</Eyebrow>
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-foreground/45">
                {PROJET.contexte} · {PROJET.lieu}
              </p>
            </div>
            <div className="flex items-center gap-2 text-foreground/55">
              <MapPin size={13} style={{ color: "var(--gold)" }} />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em]">
                {PROJET.signature}
              </span>
            </div>
          </div>
        </Reveal>

        {/* Titre projet — DM Serif Display italic, taille raisonnable. Trois
            lignes brisées asymétriquement. */}
        <Reveal delay={0.1}>
          <h1
            className="font-serif-display italic font-normal leading-[0.98] tracking-[-0.01em] text-foreground"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
          >
            <span className="block">{PROJET.tagline.haut}</span>
            <span className="block pl-[10vw]" style={{ color: "var(--gold)" }}>
              {PROJET.tagline.milieu}
            </span>
            <span className="block pl-[4vw]">{PROJET.tagline.bas}</span>
          </h1>
        </Reveal>

        {/* Bloc client + numérotation septième projet */}
        <Reveal delay={0.2}>
          <div className="mt-14 grid sm:grid-cols-[1fr_auto] gap-6 items-end">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-foreground/40 mb-2">
                Client
              </p>
              <p className="text-xl sm:text-2xl font-serif-display font-normal text-foreground tracking-tight">
                {PROJET.client}
              </p>
            </div>
            <div className="flex items-baseline gap-3">
              <span
                className="font-serif-display italic font-normal"
                style={{
                  fontSize: "clamp(2.25rem, 5vw, 4rem)",
                  color: "var(--gold)",
                  lineHeight: 1,
                }}
              >
                7
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 pb-2">
                Septième projet
                <br />
                freelance
              </span>
            </div>
          </div>
        </Reveal>

        {/* Image hero — placeholder magazine */}
        <Reveal delay={0.35}>
          <div className="mt-16 sm:mt-20 relative">
            <PlateImage ratio="aspect-[16/8]" label="Fig.01 — Cliché du domaine" />
            {/* Pull quote en surimpression — magazine */}
            <div className="absolute -bottom-8 left-4 sm:left-12 max-w-md hidden md:block">
              <p className="font-serif-display italic font-normal text-base text-foreground/85 leading-snug pl-6 border-l border-foreground/15 bg-background/85 backdrop-blur-sm py-3 pr-4">
                « Une page d'accueil qui sente la pierre humide, pas le template. »
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          GRANDE CITATION DU CLIENT
          ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 lg:px-12 mb-32 sm:mb-40 relative z-10">
        <Reveal>
          <div className="relative">
            <Quote
              size={56}
              className="absolute -top-4 -left-2 sm:-left-8 opacity-30"
              style={{ color: "var(--gold)" }}
              strokeWidth={1}
            />
            <blockquote
              className="font-serif-display italic font-normal text-foreground/92 pl-10 sm:pl-16"
              style={{
                fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)",
                lineHeight: 1.3,
              }}
            >
              {PROJET.citation}
            </blockquote>
            <p className="mt-6 pl-10 sm:pl-16 text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/45">
              {PROJET.citationAuteur}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION II — TROIS PILIERS
          ════════════════════════════════════════════════════════════════════ */}
      <section
        id="section-ii"
        className="max-w-[1280px] mx-auto px-6 lg:px-12 mb-32 sm:mb-40 relative z-10"
      >
        {/* Header section — gros chiffre filigrane */}
        <div className="relative mb-20">
          <span
            aria-hidden
            className="absolute -top-6 -left-2 font-serif-display italic font-normal pointer-events-none select-none"
            style={{
              fontSize: "clamp(7rem, 16vw, 14rem)",
              lineHeight: 0.85,
              color: "var(--foreground)",
              opacity: 0.04,
            }}
          >
            II
          </span>
          <Reveal>
            <Eyebrow color="var(--mauve)">II — Trois piliers</Eyebrow>
            <h2
              className="font-serif-display italic font-normal mt-5 max-w-3xl tracking-tight text-foreground leading-[1.05]"
              style={{ fontSize: "clamp(1.85rem, 4vw, 3.25rem)" }}
            >
              Trois enjeux,
              <span style={{ color: "var(--mauve)" }}> trois interfaces </span>
              à inventer.
            </h2>
            <p className="mt-6 max-w-xl text-base text-foreground/72 leading-relaxed">
              Le domaine n'est pas un seul commerce mais une trilogie : la cave,
              le caveau de dégustation, la maison d'hôtes. Chaque univers a
              demandé un parti pris à part entière, sans jamais s'éparpiller.
            </p>
          </Reveal>
        </div>

        {/* Trois piliers — grille volontairement asymétrique : la première remonte,
            la troisième descend. Casse le rythme card/card/card classique. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12 lg:gap-x-10">
          {PILIERS.map((p, i) => {
            const Ico = p.ico;
            return (
              <Reveal key={p.n} delay={0.1 + i * 0.08}>
                <article
                  className={`relative pt-10 px-6 pb-8 border-t border-foreground/12 ${
                    i === 0 ? "md:-mt-8" : i === 2 ? "md:mt-12" : ""
                  }`}
                  style={{ background: p.bg }}
                >
                  {/* Numéro romain — gros, filigrane */}
                  <span
                    aria-hidden
                    className="absolute top-3 right-4 font-serif-display italic font-normal select-none pointer-events-none"
                    style={{
                      fontSize: "4.5rem",
                      lineHeight: 1,
                      color: p.tint,
                      opacity: 0.18,
                    }}
                  >
                    {p.n}
                  </span>

                  <Ico
                    size={20}
                    strokeWidth={1.5}
                    style={{ color: p.tint }}
                    className="mb-6"
                  />

                  <p
                    className="text-[10px] font-mono uppercase tracking-[0.4em] mb-3"
                    style={{ color: p.tint }}
                  >
                    {p.eyebrow}
                  </p>

                  <h3
                    className="font-serif-display italic font-normal text-foreground leading-[1.12] tracking-tight whitespace-pre-line mb-5"
                    style={{ fontSize: "clamp(1.25rem, 1.7vw, 1.6rem)" }}
                  >
                    {p.titre}
                  </h3>

                  <p className="text-sm text-foreground/72 leading-relaxed">
                    {p.texte}
                  </p>

                  <PlateImage
                    ratio="aspect-[5/3]"
                    label={`Fig.0${i + 2}`}
                    className="mt-8"
                  />
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          IMAGE PLEINE LARGEUR — coupure magazine
          ════════════════════════════════════════════════════════════════════ */}
      <section id="section-iii" className="mb-32 sm:mb-40 relative z-10">
        <Reveal>
          <div className="relative">
            <PlateImage ratio="aspect-[21/9]" label="Fig.05 — Le caveau, intérieur" />
            <div className="max-w-[1280px] mx-auto px-6 lg:px-12 mt-6">
              <p
                className="font-serif-display italic font-normal text-foreground/55 max-w-2xl"
                style={{ fontSize: "clamp(1rem, 1.4vw, 1.25rem)" }}
              >
                Pour la galerie photo, le client a fourni un fonds de
                <span className="text-foreground/85"> mille deux cents clichés </span>
                — il a fallu inventer un parcours.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION IV — CÔTÉ TECHNIQUE
          ════════════════════════════════════════════════════════════════════ */}
      <section
        id="section-iv"
        className="max-w-[1280px] mx-auto px-6 lg:px-12 mb-32 sm:mb-40 relative z-10"
      >
        {/* Header section avec gros IV en filigrane */}
        <div className="relative mb-20">
          <span
            aria-hidden
            className="absolute -top-6 -left-2 font-serif-display italic font-normal pointer-events-none select-none"
            style={{
              fontSize: "clamp(7rem, 16vw, 14rem)",
              lineHeight: 0.85,
              color: "var(--foreground)",
              opacity: 0.04,
            }}
          >
            IV
          </span>

          <Reveal>
            <Eyebrow color="var(--lavender)">IV — Côté technique</Eyebrow>
            <h2
              className="font-serif-display italic font-normal mt-5 max-w-3xl tracking-tight text-foreground leading-[1.05]"
              style={{ fontSize: "clamp(1.85rem, 4vw, 3.25rem)" }}
            >
              Cinq décisions qui
              <span style={{ color: "var(--lavender)" }}> ont fait la différence</span>.
            </h2>
            <p className="mt-6 max-w-2xl text-base text-foreground/72 leading-relaxed">
              Pour les développeurs et les recruteurs qui ouvrent cette page :
              voici les choix techniques que ce projet m'a obligé à formuler,
              pas ceux que j'aurais pris par défaut.
            </p>
          </Reveal>
        </div>

        {/* Liste de challenges — magazine deux colonnes, lignes-fil entre items. */}
        <div className="space-y-0">
          {CHALLENGES.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.05}>
              <article className="group grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-12 py-10 border-t border-foreground/10">
                <div className="space-y-3">
                  <span
                    className="font-serif-display italic font-normal block"
                    style={{
                      fontSize: "clamp(2.25rem, 3.5vw, 3rem)",
                      lineHeight: 0.9,
                      color: c.accent,
                    }}
                  >
                    {c.n}
                  </span>
                  <h3
                    className="font-serif-display font-normal text-foreground tracking-tight leading-[1.15]"
                    style={{ fontSize: "clamp(1.2rem, 1.6vw, 1.5rem)" }}
                  >
                    {c.titre}
                  </h3>
                </div>

                <div className="md:pt-6">
                  <p className="text-[15px] text-foreground/82 leading-[1.65]">
                    {c.extrait}
                  </p>
                  <div
                    className="mt-5 h-px w-12 transition-all duration-500 group-hover:w-32"
                    style={{ background: c.accent, opacity: 0.6 }}
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION V — STACK : index typographique
          ════════════════════════════════════════════════════════════════════ */}
      <section
        id="section-v"
        className="max-w-[1280px] mx-auto px-6 lg:px-12 mb-32 sm:mb-40 relative z-10"
      >
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">
          {/* Colonne 1 — titre sticky */}
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <Eyebrow color="var(--gold)">V — Stack</Eyebrow>
              <h2
                className="font-serif-display italic font-normal mt-5 tracking-tight text-foreground leading-[1.05]"
                style={{ fontSize: "clamp(1.85rem, 3.5vw, 2.85rem)" }}
              >
                Les outils
                <br />
                qui ont permis
                <br />
                <span style={{ color: "var(--gold)" }}>l'écriture</span>.
              </h2>
              <p className="mt-6 text-sm text-foreground/65 leading-relaxed max-w-sm">
                Choix dictés par l'usage de la cliente, pas par mes goûts du
                moment. Chaque outil reste à son nom à elle, je ne suis qu'un
                assemblage.
              </p>
            </div>
          </Reveal>

          {/* Colonne 2 — entrées d'index */}
          <div>
            {STACK.map((s, i) => (
              <Reveal key={s.nom} delay={i * 0.04}>
                <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-6 py-5 border-t border-foreground/10">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 w-8">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-serif-display font-normal text-foreground"
                    style={{ fontSize: "clamp(1.15rem, 1.5vw, 1.4rem)" }}
                  >
                    {s.nom}
                  </span>
                  <span className="text-xs text-foreground/55 text-right max-w-[18rem] leading-snug">
                    {s.role}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION VI — COLOPHON / CRÉDITS
          ════════════════════════════════════════════════════════════════════ */}
      <section
        id="section-vi"
        className="max-w-[1280px] mx-auto px-6 lg:px-12 mb-24 relative z-10"
      >
        <Reveal>
          <div className="grid md:grid-cols-2 gap-16 pt-20 border-t border-foreground/15">
            <div>
              <Eyebrow color="var(--mauve)">VI — Colophon</Eyebrow>
              <p
                className="font-serif-display italic font-normal mt-6 text-foreground/85 leading-snug"
                style={{ fontSize: "clamp(1.15rem, 1.5vw, 1.4rem)" }}
              >
                Composé en
                <span style={{ color: "var(--gold)" }}> DM Serif Display </span>
                et en Space Grotesk. Imprimé pour l'écran, en
                <span style={{ color: "var(--mauve)" }}> Bourgogne </span>
                et à
                <span style={{ color: "var(--lavender)" }}> Paris</span>,
                hiver 2026.
              </p>

              <a
                href={`https://${PROJET.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex items-baseline gap-3 cursor-pointer"
              >
                <span
                  className="font-serif-display italic font-normal underline underline-offset-[6px] decoration-1"
                  style={{
                    fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                    color: "var(--gold)",
                    textDecorationColor: "color-mix(in oklab, var(--gold) 50%, transparent)",
                  }}
                >
                  {PROJET.url}
                </span>
                <ExternalLink
                  size={18}
                  className="text-foreground/55 group-hover:text-foreground transition-colors"
                />
              </a>
            </div>

            {/* Crédits — mise en page d'ours magazine */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-foreground/40 mb-6">
                Ont contribué
              </p>
              <ul className="space-y-4">
                {CREDITS.map((c) => (
                  <li
                    key={c.role + c.nom}
                    className="grid grid-cols-[1fr_1.5fr] gap-4 items-baseline pb-4 border-b border-foreground/8"
                  >
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-foreground/45">
                      {c.role}
                    </span>
                    <span className="font-serif-display font-normal text-foreground tracking-tight">
                      {c.nom}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          PROJET SUIVANT — inline simple
          ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">
        <Reveal>
          <Link
            href="/projets"
            className="group flex items-center justify-between pt-8 border-t border-foreground/15 cursor-pointer"
          >
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-foreground/40 mb-2">
                Lecture suivante
              </p>
              <p
                className="font-serif-display italic font-normal text-foreground group-hover:translate-x-1 transition-transform"
                style={{ fontSize: "clamp(1.35rem, 2vw, 1.85rem)" }}
              >
                Tous les projets
              </p>
            </div>
            <ArrowRight
              className="w-7 h-7 text-foreground/40 group-hover:text-foreground group-hover:translate-x-2 transition-all"
              strokeWidth={1.25}
            />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
