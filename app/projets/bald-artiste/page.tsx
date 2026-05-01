/* ──────────────────────────────────────────────────────────────────────────
   PAGE PROJET — Bald (artiste peintre)
   ────────────────────────────────────────────────────────────────────────────
   Cette route prend le pas sur la dynamic route /projets/[slug] uniquement
   pour ce projet. Hérite du pattern RWJ (cf. PROJECTS.md), mais Bald n'a
   pas de pillarsCards → on saute la section "Enjeux & défis" et on enchaîne
   directement sur les sliders.

   Structure :
   - Header : titre + intro + meta card (style RWJ)
   - 01 — Vue d'ensemble : tagline + hero accueil + descriptionPublic
   - 02 — L'identité visuelle (slider + commentaire)
   - 03 — La galerie filtrée (slider + commentaire)
   - 04 — Côté technique (3 challenges en mode magazine)
   - 05 — Stack du projet (index typographique)
   - CTA Services + Projet suivant + boutons flottants
   ────────────────────────────────────────────────────────────────────────── */

import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { preload } from "react-dom";
import { ArrowLeft, ArrowRight, ExternalLink, User } from "lucide-react";
import { projets } from "@/lib/projets";
import { ProjetImageSlider } from "@/components/sections/projet-image-slider";
import { Reveal } from "../_components/reveal";

const SLUG = "bald-artiste";

const projet = projets.find((p) => p.slug === SLUG)!;
const idx = projets.findIndex((p) => p.slug === SLUG);
const nextProjet = projets[(idx + 1) % projets.length];
const prevProjet = projets[(idx - 1 + projets.length) % projets.length];
const year = projet.date.split("-")[0];

/* ════════════════════════════════════════════════════════════════════════
   STACK — résumé court de chaque outil pour l'index typo
   ════════════════════════════════════════════════════════════════════════ */

const STACK_DETAIL: { nom: string; role: string }[] = [
  { nom: "Next.js",     role: "App Router · pages galerie statiques · Server Actions" },
  { nom: "Stripe",      role: "Tunnel Checkout · webhook de confirmation de commande" },
  { nom: "GSAP",        role: "Animations au scroll · transitions de page soignées" },
  { nom: "Lenis",       role: "Défilement inertiel doux · sensation premium" },
  { nom: "Motion",      role: "Micro-interactions de l'interface" },
  { nom: "next-intl",   role: "Routing internationalisé FR / EN · SEO localisé" },
  { nom: "nuqs",        role: "Filtres de galerie persistés dans l'URL · partageables" },
  { nom: "TypeScript",  role: "Type safety du SSR au DOM" },
];

const TAG_COLORS = [
  { color: "var(--gold)",     bg: "hsl(47 72% 73% / 0.12)" },
  { color: "var(--lavender)", bg: "hsl(284 24% 70% / 0.12)" },
  { color: "var(--accent)",   bg: "hsl(163 24% 54% / 0.12)" },
];

const CHALLENGE_PALETTE = [
  "var(--gold)",
  "var(--lavender)",
  "var(--accent)",
] as const;

/* ════════════════════════════════════════════════════════════════════════
   IDENTITÉ VISUELLE — assets utilisés pour le slider de la section 02
   (le slider d'origine de Bald avait images: [] + customSlider).
   On affiche ici les visuels de marque déjà présents dans /public/assets/bald.
   ════════════════════════════════════════════════════════════════════════ */

const IDENTITY_IMAGES = [
  "/assets/bald/bald-logo-splash.webp",
  "/assets/bald/bald-hero-logo.webp",
  "/assets/bald/bald-badge-circulaire.webp",
];

/* ════════════════════════════════════════════════════════════════════════
   METADATA
   ════════════════════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  title: projet.client,
  description: projet.description,
};

/* ════════════════════════════════════════════════════════════════════════
   PARSEUR DE TEXTE — copie locale alignée sur RWJ
   ════════════════════════════════════════════════════════════════════════ */

function renderHighlight(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|\*[^*\n]+\*|\[[^\]]+\]\([^)]+\)|\n)/g);
  return parts.map((part, i) => {
    if (part === "\n") return <br key={i} />;
    if (/^\*\*[^*]+\*\*$/.test(part))
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    if (/^__[^_]+__$/.test(part))
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    if (/^~~[^~]+~~$/.test(part))
      return <strong key={i} className="font-semibold" style={{ color: "var(--lavender)" }}>{part.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(part))
      return (
        <em
          key={i}
          className="font-serif-display italic font-normal"
          style={{ color: "var(--gold)" }}
        >
          {part.slice(1, -1)}
        </em>
      );
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const external = /^https?:/.test(href);
      return (
        <a
          key={i}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="font-semibold underline underline-offset-4 decoration-[1.5px] transition-colors cursor-pointer"
          style={{ color: "var(--gold)", textDecorationColor: "color-mix(in oklab, var(--gold) 50%, transparent)" }}
        >
          {label}
        </a>
      );
    }
    return part;
  });
}

function renderParagraphs(text: string) {
  return text.split("\n\n").map((para, i) => (
    <p key={i} className={`text-base text-foreground/88 leading-relaxed${i > 0 ? " mt-4" : ""}`}>
      {renderHighlight(para)}
    </p>
  ));
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════ */

export default function BaldPage() {
  const mainImg = projet.heroImg ?? projet.img;
  if (mainImg) preload(mainImg, { as: "image" });

  const sliderSets = projet.sliderSets ?? [];
  const challenges = projet.challenges ?? [];

  // Premier slider = identité visuelle (images de marque),
  // deuxième slider = galerie filtrée (image existante).
  const identitySet = sliderSets[0];
  const gallerySet = sliderSets[1];

  return (
    <div className="pt-28 pb-28">

      {/* ════════════════════════════════════════════════════════════════
          HEADER — carte projet à droite, identique à RWJ
          ════════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 mb-12">
        <Reveal duration={0.4} y={8}>
          <div className="mb-10">
            <Link
              href="/projets"
              className="inline-flex items-center gap-2 text-sm text-foreground/35 hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              Tous les projets
            </Link>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-start">

          {/* ─── Gauche : titre + intro ─── */}
          <Reveal duration={0.55} y={18}>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/55 border border-white/12 rounded-full px-3 py-1">
                Projet freelance
              </span>
              <span className="text-[11px] text-foreground/40 font-mono">{year}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.02em] text-foreground leading-[1.05] mb-3">
              {projet.client}
            </h1>

            <div className="sm:hidden mb-5 space-y-2.5">
              <div className="flex flex-wrap gap-1.5">
                {projet.tags.map((tag, ti) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                    style={{
                      color: TAG_COLORS[ti % TAG_COLORS.length].color,
                      background: TAG_COLORS[ti % TAG_COLORS.length].bg,
                      borderColor: TAG_COLORS[ti % TAG_COLORS.length].color,
                      opacity: 0.9,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm uppercase tracking-widest mb-5" style={{ color: "var(--gold)" }}>
              {projet.titre}
            </p>

            <p className="text-base text-foreground/88 leading-relaxed max-w-xl">
              {renderHighlight(projet.intro)}
            </p>
          </Reveal>

          {/* ─── Droite : carte projet meta ─── */}
          <Reveal duration={0.55} y={18} delay={0.12} className="space-y-3 lg:pt-2 hidden sm:block">
            <div
              className="p-5 rounded-xl border border-border space-y-4"
              style={{ background: "linear-gradient(135deg, hsl(47 72% 73% / 0.05) 0%, hsl(var(--card)) 60%)" }}
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-2 font-semibold" style={{ color: "var(--gold)" }}>
                  Client
                </p>
                <p className="text-sm font-semibold text-foreground">{projet.client}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-1.5 font-semibold" style={{ color: "var(--gold)" }}>
                  Contexte
                </p>
                <div className="flex items-center gap-1.5 text-sm text-foreground/88">
                  <User size={11} className="text-(--lavender)" />
                  <span>Projet freelance</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-1.5 font-semibold" style={{ color: "var(--gold)" }}>
                  Année
                </p>
                <p className="text-sm font-semibold text-foreground/85">{year}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-2 font-semibold" style={{ color: "var(--gold)" }}>
                  Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {projet.tags.map((tag, ti) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                      style={{
                        color: TAG_COLORS[ti % TAG_COLORS.length].color,
                        background: TAG_COLORS[ti % TAG_COLORS.length].bg,
                        borderColor: TAG_COLORS[ti % TAG_COLORS.length].color,
                        opacity: 0.9,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {projet.url && (
              <a
                href={projet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-(--gold)/30 bg-(--gold)/5 text-sm font-semibold hover:bg-(--gold)/10 transition-colors cursor-pointer group"
                style={{ color: "var(--gold)" }}
              >
                Voir le site en ligne
                <ExternalLink
                  size={13}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </a>
            )}
          </Reveal>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          CONTENU PRINCIPAL
          ════════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 space-y-24 sm:space-y-32">

        {/* Séparateur */}
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(47 72% 73% / 0.3) 40%, hsl(284 24% 70% / 0.2) 60%, transparent)",
          }}
        />

        {/* ──────────────────────────────────────────────────────────────
            01 — VUE D'ENSEMBLE
            ────────────────────────────────────────────────────────────── */}
        <section className="space-y-10 lg:space-y-12">

          <Reveal>
            <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
              <div className="flex items-center gap-3 lg:block lg:pt-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.3em]"
                  style={{ color: "var(--gold)" }}
                >
                  Vue d&apos;ensemble
                </span>
                <span
                  className="font-black leading-none lg:block lg:mt-2"
                  style={{
                    fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                    color: "var(--gold)",
                    opacity: 0.95,
                  }}
                >
                  01
                </span>
              </div>
              <div className="max-w-3xl">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.15] tracking-[-0.01em] text-foreground">
                  {renderHighlight(projet.tagline ?? "")}
                </p>
              </div>
            </header>
          </Reveal>

          {/* Hero image — full container */}
          {mainImg && (
            <Reveal delay={0.08} y={20} duration={0.65}>
              <figure className="space-y-3">
                <div className="relative w-full rounded-xl overflow-hidden border border-border/60 shadow-[0_32px_80px_-8px_rgba(0,0,0,0.6)]">
                  <Image
                    src={mainImg}
                    alt={projet.titre}
                    width={2400}
                    height={1200}
                    className="w-full h-auto block"
                    priority
                    sizes="(min-width: 1280px) 1152px, 100vw"
                  />
                </div>
                <figcaption className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.32em] text-foreground/40">
                  <span>Fig.01 — Page d&apos;accueil</span>
                  <span>{projet.url?.replace(/^https?:\/\//, "")}</span>
                </figcaption>
              </figure>
            </Reveal>
          )}

          {/* Description longue — alignée sur la colonne contenu.
              max-w-3xl pour donner un peu plus d'espace au bloc d'intro. */}
          {projet.descriptionPublic && (
            <Reveal delay={0.04}>
              <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12">
                <div aria-hidden className="hidden lg:block" />
                <div className="max-w-3xl">
                  {renderParagraphs(projet.descriptionPublic)}
                </div>
              </div>
            </Reveal>
          )}
        </section>

        {/* ──────────────────────────────────────────────────────────────
            02 — L'IDENTITÉ VISUELLE
            (slider construit à partir des assets de marque puisque
             le set d'origine avait images: [] + customSlider)
            ────────────────────────────────────────────────────────────── */}
        {identitySet && (
          <section className="space-y-8">
            <Reveal>
              <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
                <div className="flex items-center gap-3 lg:block lg:pt-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.3em]"
                    style={{ color: "var(--lavender)" }}
                  >
                    Section
                  </span>
                  <span
                    className="font-black leading-none lg:block lg:mt-2"
                    style={{
                      fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                      color: "var(--lavender)",
                      opacity: 0.95,
                    }}
                  >
                    02
                  </span>
                </div>
                <div className="max-w-2xl">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.01em] text-foreground leading-[1.1]">
                    {identitySet.title}
                  </h3>
                  <p className="mt-4 text-base text-foreground/85 leading-relaxed">
                    {renderHighlight(identitySet.description)}
                  </p>
                </div>
              </header>
            </Reveal>

            <Reveal delay={0.08} y={20} duration={0.6}>
              <ProjetImageSlider
                images={IDENTITY_IMAGES}
                alt={`${projet.titre} — ${identitySet.title}`}
                wide
                aspectRatio="aspect-[2/1]"
              />
            </Reveal>
          </section>
        )}

        {/* ──────────────────────────────────────────────────────────────
            03 — LA GALERIE FILTRÉE
            ────────────────────────────────────────────────────────────── */}
        {gallerySet && gallerySet.images.length > 0 && (
          <section className="space-y-8">
            <Reveal>
              <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
                <div className="flex items-center gap-3 lg:block lg:pt-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.3em]"
                    style={{ color: "var(--accent)" }}
                  >
                    Section
                  </span>
                  <span
                    className="font-black leading-none lg:block lg:mt-2"
                    style={{
                      fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                      color: "var(--accent)",
                      opacity: 0.95,
                    }}
                  >
                    03
                  </span>
                </div>
                <div className="max-w-2xl">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.01em] text-foreground leading-[1.1]">
                    {gallerySet.title}
                  </h3>
                  <p className="mt-4 text-base text-foreground/85 leading-relaxed">
                    {renderHighlight(gallerySet.description)}
                  </p>
                </div>
              </header>
            </Reveal>

            <Reveal delay={0.08} y={20} duration={0.6}>
              <ProjetImageSlider
                images={gallerySet.images}
                alt={`${projet.titre} — ${gallerySet.title}`}
                wide
                aspectRatio="aspect-[2/1]"
              />
            </Reveal>
          </section>
        )}

        {/* ──────────────────────────────────────────────────────────────
            04 — CÔTÉ TECHNIQUE
            ────────────────────────────────────────────────────────────── */}
        {challenges.length > 0 && (
          <section className="space-y-10 lg:space-y-12">
            <Reveal>
              <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
                <div className="flex items-center gap-3 lg:block lg:pt-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.3em]"
                    style={{ color: "var(--gold)" }}
                  >
                    Côté technique
                  </span>
                  <span
                    className="font-black leading-none lg:block lg:mt-2"
                    style={{
                      fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                      color: "var(--gold)",
                      opacity: 0.95,
                    }}
                  >
                    04
                  </span>
                </div>
                <div className="max-w-2xl">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
                    Trois choix techniques
                    {" "}
                    <em
                      className="font-serif-display italic font-normal"
                      style={{ color: "var(--gold)" }}
                    >
                      qui ont fait le projet
                    </em>
                    .
                  </h2>
                  <p className="mt-5 text-base text-foreground/72 leading-relaxed">
                    Pour les développeurs et les recruteurs : voici les décisions techniques
                    qui ont structuré ce site e-commerce d&apos;art international.
                  </p>
                </div>
              </header>
            </Reveal>

            <div className="space-y-0">
              {challenges.map((ch, i) => {
                const accent = CHALLENGE_PALETTE[i % CHALLENGE_PALETTE.length];
                const num = String(i + 1).padStart(2, "0");
                return (
                  <Reveal key={i} delay={0.04} y={12} duration={0.45}>
                    <article className="group grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-12 py-9 border-t border-foreground/10">
                      <div className="space-y-3">
                        <span
                          className="block font-black leading-none"
                          style={{
                            fontSize: "clamp(2rem, 3vw, 2.75rem)",
                            color: accent,
                            opacity: 0.85,
                          }}
                        >
                          {num}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight leading-snug">
                          {ch.titre}
                        </h3>
                      </div>
                      <div className="md:pt-3">
                        <p className="text-[15px] text-foreground/82 leading-[1.7] max-w-2xl">
                          {renderHighlight(ch.solution)}
                        </p>
                        <div
                          className="mt-5 h-px w-12 transition-all duration-500 group-hover:w-32"
                          style={{ background: accent, opacity: 0.6 }}
                        />
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}

        {/* ──────────────────────────────────────────────────────────────
            05 — STACK
            ────────────────────────────────────────────────────────────── */}
        <section className="space-y-10">
          <Reveal>
            <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
              <div className="flex items-center gap-3 lg:block lg:pt-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.3em]"
                  style={{ color: "var(--lavender)" }}
                >
                  Stack du projet
                </span>
                <span
                  className="font-black leading-none lg:block lg:mt-2"
                  style={{
                    fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                    color: "var(--lavender)",
                    opacity: 0.95,
                  }}
                >
                  05
                </span>
              </div>
              <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
                  Les outils
                  {" "}
                  <em
                    className="font-serif-display italic font-normal"
                    style={{ color: "var(--lavender)" }}
                  >
                    qui font tourner
                  </em>
                  {" "}
                  le site.
                </h2>
              </div>
            </header>
          </Reveal>

          <Reveal delay={0.06}>
            <div>
              {STACK_DETAIL.map((s, i) => (
                <div
                  key={s.nom}
                  className="grid grid-cols-[auto_1fr_auto] items-baseline gap-4 sm:gap-6 py-4 border-t border-foreground/10 last:border-b last:border-foreground/10"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 w-8">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-foreground">
                    {s.nom}
                  </span>
                  <span className="text-xs text-foreground/55 text-right max-w-[20rem] leading-snug">
                    {s.role}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Séparateur final */}
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(47 72% 73% / 0.3) 40%, hsl(284 24% 70% / 0.2) 60%, transparent)",
          }}
        />

        {/* CTA Services */}
        <Reveal>
          <div
            className="relative rounded-2xl overflow-hidden px-7 py-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8"
            style={{ background: "hsl(47 72% 73% / 0.05)", border: "1px solid hsl(47 72% 73% / 0.2)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "var(--gold)" }} />
            <div className="flex-1 min-w-0">
              <p
                className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-2"
                style={{ color: "var(--gold)" }}
              >
                Vous aimez ce type de site&nbsp;?
              </p>
              <p className="text-base font-bold text-foreground leading-snug">
                Je crée des sites sur mesure pour artistes, indépendants et petites entreprises.
              </p>
              <p className="text-sm text-foreground/50 mt-1.5 leading-relaxed">
                Identité visuelle, e-commerce, interface d&apos;administration : chaque projet est pensé et codé de A à Z.
              </p>
            </div>
            <Link
              href="/services"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer"
              style={{ background: "var(--gold)", color: "hsl(158 24% 7%)" }}
            >
              Voir mes formules
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        {/* Projet suivant */}
        <Reveal delay={0.05}>
          <Link
            href={`/projets/${nextProjet.slug}`}
            className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-white/15 transition-colors cursor-pointer group"
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.3em] mb-1.5 font-semibold"
                style={{ color: "var(--gold)" }}
              >
                Projet suivant
              </p>
              <p className="text-base font-bold text-foreground group-hover:text-(--gold) transition-colors">
                {nextProjet.clientShort ?? nextProjet.client}
              </p>
              <p className="text-xs text-foreground/40 mt-0.5">{nextProjet.titre}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-foreground/25 group-hover:text-(--gold) group-hover:translate-x-1 transition-all shrink-0 ml-4" />
          </Link>
        </Reveal>
      </div>

      {/* Boutons flottants */}
      <Link
        href={`/projets/${prevProjet.slug}`}
        className="fixed bottom-7 left-14 z-50 hidden lg:flex items-center gap-3 pr-4 pl-3 py-3 rounded-2xl bg-card/80 backdrop-blur-md border border-white/8 hover:border-white/18 transition-all group cursor-pointer shadow-xl shadow-black/30"
      >
        <ArrowLeft className="w-4 h-4 text-foreground/30 group-hover:text-(--gold) group-hover:-translate-x-0.5 transition-all shrink-0" />
        <div className="text-left">
          <p
            className="text-[9px] uppercase tracking-[0.25em] font-semibold mb-0.5"
            style={{ color: "var(--gold)" }}
          >
            Projet précédent
          </p>
          <p className="text-sm font-bold text-foreground/88 group-hover:text-foreground transition-colors leading-tight">
            {prevProjet.clientShort ?? prevProjet.client}
          </p>
        </div>
      </Link>

      <Link
        href={`/projets/${nextProjet.slug}`}
        className="fixed bottom-7 right-14 z-50 hidden lg:flex items-center gap-3 pl-4 pr-3 py-3 rounded-2xl bg-card/80 backdrop-blur-md border border-white/8 hover:border-white/18 transition-all group cursor-pointer shadow-xl shadow-black/30"
      >
        <div className="text-right">
          <p
            className="text-[9px] uppercase tracking-[0.25em] font-semibold mb-0.5"
            style={{ color: "var(--gold)" }}
          >
            Projet suivant
          </p>
          <p className="text-sm font-bold text-foreground/88 group-hover:text-foreground transition-colors leading-tight">
            {nextProjet.clientShort ?? nextProjet.client}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-(--gold) group-hover:translate-x-0.5 transition-all shrink-0" />
      </Link>
    </div>
  );
}
