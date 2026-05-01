/* ──────────────────────────────────────────────────────────────────────────
   PAGE PROJET — TotalEnergies / Argedis (carte tactile producteurs locaux)
   ────────────────────────────────────────────────────────────────────────────
   Override de la dynamic route /projets/[slug] pour ce projet uniquement.

   Mode : agence — vidéo mobile/tablette (portrait)
   Spécificités vs RWJ / Bald / BNP :
   - Hero = vidéo portrait (max-h calibré) en grille gauche / droite
   - Sliders captions = quinconce (image portrait gauche / texte droite,
     puis inversé pour la suivante) — adapté au format vertical
   - Pas d'url client (déployé en APK sur tablettes en stations)
   - Section "Aujourd'hui en station" qui valorise le champ resultats
   ────────────────────────────────────────────────────────────────────────── */

import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { preload } from "react-dom";
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react";
import { projets } from "@/lib/projets";
import { Reveal } from "../_components/reveal";

const SLUG = "argedis-totalenergies";

const projet = projets.find((p) => p.slug === SLUG)!;
const idx = projets.findIndex((p) => p.slug === SLUG);
const nextProjet = projets[(idx + 1) % projets.length];
const prevProjet = projets[(idx - 1 + projets.length) % projets.length];
const year = projet.date.split("-")[0];

/* ════════════════════════════════════════════════════════════════════════
   STACK — résumé court
   ════════════════════════════════════════════════════════════════════════ */

const STACK_DETAIL: { nom: string; role: string }[] = [
  { nom: "Next.js 14 (App Router)", role: "Génération statique · 1 route par région · embarqué dans l'APK" },
  { nom: "Contentful (Headless CMS)", role: "Producteurs, photos, Lottie · gestion sans dev" },
  { nom: "GraphQL",                  role: "Requêtes Contentful · FR et EN chargés à l'init" },
  { nom: "Framer Motion",            role: "Transitions carte → producteur · crossfades photo" },
  { nom: "Lottie",                   role: "Fonds animés régionaux · une identité par territoire" },
  { nom: "PWA → APK Android",        role: "Installation native · 100% hors ligne sur tablette" },
];

const TAG_COLORS = [
  { color: "var(--accent)",   bg: "hsl(163 24% 54% / 0.12)" },
  { color: "var(--gold)",     bg: "hsl(47 72% 73% / 0.12)" },
  { color: "var(--lavender)", bg: "hsl(284 24% 70% / 0.12)" },
];

const CHALLENGE_PALETTE = [
  "var(--accent)",
  "var(--gold)",
  "var(--lavender)",
  "var(--mauve)",
  "var(--accent)",
  "var(--gold)",
  "var(--lavender)",
] as const;

/* ════════════════════════════════════════════════════════════════════════
   METADATA
   ════════════════════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  title: projet.client,
  description: projet.description,
};

/* ════════════════════════════════════════════════════════════════════════
   PARSEUR DE TEXTE — copie locale alignée sur RWJ / Bald / BNP
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
      return <strong key={i} className="font-semibold" style={{ color: "var(--accent)" }}>{part.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(part))
      return (
        <em
          key={i}
          className="font-serif-display italic font-normal"
          style={{ color: "var(--accent)" }}
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
          style={{ color: "var(--accent)", textDecorationColor: "color-mix(in oklab, var(--accent) 50%, transparent)" }}
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

export default function ArgedisTotalEnergiesPage() {
  if (projet.video) preload(projet.video, { as: "video" });

  const challenges = projet.challenges ?? [];
  const credits = projet.credits ?? [];
  const captions = projet.imageCaptions ?? [];

  // Sélection des images pour le quinconce
  // images[1..3] = variantes régionales (carte principale)
  // images[4] = fiche producteur FR, images[5] = fiche producteur EN
  const cardImage = projet.images[1] ?? projet.img!;
  const producerImage = projet.images[4] ?? projet.images[3] ?? projet.img!;
  const producerImageEn = projet.images[5] ?? projet.images[4] ?? projet.img!;

  return (
    <div className="pt-28 pb-28">

      {/* ════════════════════════════════════════════════════════════════
          HEADER — meta card à droite, titre + intro à gauche
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
                Projet agence · Artefact 3000
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

            <p className="text-sm uppercase tracking-widest mb-5" style={{ color: "var(--accent)" }}>
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
              style={{ background: "linear-gradient(135deg, hsl(163 24% 54% / 0.05) 0%, hsl(var(--card)) 60%)" }}
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-2 font-semibold" style={{ color: "var(--accent)" }}>
                  Client
                </p>
                <p className="text-sm font-semibold text-foreground">{projet.client}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-1.5 font-semibold" style={{ color: "var(--accent)" }}>
                  Contexte
                </p>
                <div className="flex items-center gap-1.5 text-sm text-foreground/88">
                  <Briefcase size={11} className="text-(--mauve)" />
                  <span>Projet d&apos;agence</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-1.5 font-semibold" style={{ color: "var(--accent)" }}>
                  Année
                </p>
                <p className="text-sm font-semibold text-foreground/85">{year}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-2 font-semibold" style={{ color: "var(--accent)" }}>
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
              "linear-gradient(90deg, transparent, hsl(163 24% 54% / 0.3) 40%, hsl(47 72% 73% / 0.2) 60%, transparent)",
          }}
        />

        {/* ──────────────────────────────────────────────────────────────
            01 — VUE D'ENSEMBLE
            Layout adapté au format portrait : grille gauche (vidéo) /
            droite (descriptionPublic). La vidéo respecte son ratio
            naturel via max-h, pas de stretch.
            ────────────────────────────────────────────────────────────── */}
        <section className="space-y-10 lg:space-y-12">

          <Reveal>
            <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
              <div className="flex items-center gap-3 lg:block lg:pt-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.3em]"
                  style={{ color: "var(--accent)" }}
                >
                  Vue d&apos;ensemble
                </span>
                <span
                  className="font-black leading-none lg:block lg:mt-2"
                  style={{
                    fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                    color: "var(--accent)",
                    opacity: 0.95,
                  }}
                >
                  01
                </span>
              </div>
              <div className="max-w-3xl">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
                  Une appli tactile
                  {" "}
                  <em
                    className="font-serif-display italic font-normal"
                    style={{ color: "var(--accent)" }}
                  >
                    qui change avec le territoire
                  </em>
                  .
                </h2>
                <p className="mt-5 text-base text-foreground/72 leading-relaxed">
                  Déployée sur des centaines de tablettes en stations, en France,
                  pour mettre en avant les producteurs locaux partenaires.
                  Chaque région a sa carte, son univers visuel, ses producteurs.
                </p>
              </div>
            </header>
          </Reveal>

          {/* Grille hero portrait — vidéo gauche / descriptionPublic + key facts droite */}
          {projet.video && (
            <Reveal delay={0.08} y={20} duration={0.65}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

                {/* Vidéo portrait — laissée dans son ratio naturel pour éviter les bandes */}
                <figure className="lg:col-span-5 mx-auto lg:mx-0 w-full max-w-[400px] lg:max-w-none lg:w-full">
                  <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-[0_32px_80px_-8px_rgba(0,0,0,0.6)]">
                    <video
                      src={projet.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="block w-full h-auto"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.32em] text-foreground/40">
                    <span>Fig.01 — Tablette en station</span>
                    <span>FR · EN</span>
                  </figcaption>
                </figure>

                {/* Colonne texte — descriptionPublic + key facts pour remplir la hauteur */}
                <div className="lg:col-span-7 lg:pt-2 space-y-10">
                  {projet.descriptionPublic && (
                    <div>{renderParagraphs(projet.descriptionPublic)}</div>
                  )}

                  {/* Key facts — 4 chiffres / labels stylisés en grille 2x2 */}
                  <div className="pt-8 border-t border-foreground/10">
                    <p className="text-[10px] font-mono uppercase tracking-[0.32em] text-foreground/40 mb-6">
                      En quelques chiffres
                    </p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-7">
                      {[
                        { value: "× 100s",    label: "Tablettes en station",     color: "var(--accent)" },
                        { value: "FR · EN",   label: "Bilingue à la volée",      color: "var(--gold)" },
                        { value: "0 réseau",  label: "Application 100% hors ligne", color: "var(--lavender)" },
                        { value: "2024 +",    label: "Maintenu en continu",      color: "var(--mauve)" },
                      ].map((stat) => (
                        <div key={stat.label} className="border-l-2 pl-4" style={{ borderColor: stat.color }}>
                          <p
                            className="font-black leading-none mb-2"
                            style={{
                              fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)",
                              color: stat.color,
                            }}
                          >
                            {stat.value}
                          </p>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/55 leading-snug">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </section>

        {/* ──────────────────────────────────────────────────────────────
            02 — UNE CARTE PAR RÉGION
            Quinconce : image carte régionale gauche, caption droite.
            ────────────────────────────────────────────────────────────── */}
        {captions[0] && (
          <section className="space-y-10 lg:space-y-12">
            <Reveal>
              <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
                <div className="flex items-center gap-3 lg:block lg:pt-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.3em]"
                    style={{ color: "var(--gold)" }}
                  >
                    Section
                  </span>
                  <span
                    className="font-black leading-none lg:block lg:mt-2"
                    style={{
                      fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                      color: "var(--gold)",
                      opacity: 0.95,
                    }}
                  >
                    02
                  </span>
                </div>
                <div className="max-w-2xl">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.01em] text-foreground leading-[1.1]">
                    Chaque région
                    {" "}
                    <em
                      className="font-serif-display italic font-normal"
                      style={{ color: "var(--gold)" }}
                    >
                      a son univers
                    </em>
                    .
                  </h3>
                  <p className="mt-4 text-base text-foreground/72 leading-relaxed">
                    Lottie animé, palette régionale, géolocalisation des producteurs sur la carte.
                  </p>
                </div>
              </header>
            </Reveal>

            <Reveal delay={0.08} y={20} duration={0.65}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                <figure className="lg:col-span-5 mx-auto lg:mx-0 w-full max-w-[400px] lg:max-w-none lg:w-full">
                  <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-[0_32px_80px_-8px_rgba(0,0,0,0.6)]">
                    <Image
                      src={cardImage}
                      alt={`${projet.titre} — carte régionale`}
                      width={1080}
                      height={1920}
                      className="block w-full h-auto"
                      sizes="(max-width: 1024px) 90vw, 480px"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.32em] text-foreground/40">
                    <span>Fig.02 — Carte régionale</span>
                    <span>Lottie</span>
                  </figcaption>
                </figure>

                <div className="lg:col-span-7 lg:pt-2 space-y-10">
                  <div>
                    {captions[0].split("\n\n").map((para, i) => (
                      <p
                        key={i}
                        className={`text-base text-foreground/88 leading-relaxed${i > 0 ? " mt-4" : ""}`}
                      >
                        {renderHighlight(para)}
                      </p>
                    ))}
                  </div>

                  {/* Palette régionale — illustre la pluralité des univers visuels */}
                  <div className="pt-8 border-t border-foreground/10">
                    <p className="text-[10px] font-mono uppercase tracking-[0.32em] text-foreground/40 mb-5">
                      Une identité par région
                    </p>
                    <div className="flex flex-wrap gap-x-2.5 gap-y-2.5">
                      {[
                        { name: "Provence-Alpes-Côte d'Azur", color: "hsl(47 72% 73%)" },
                        { name: "Bourgogne-Franche-Comté",    color: "hsl(284 24% 70%)" },
                        { name: "Bretagne",                   color: "hsl(210 60% 70%)" },
                        { name: "Île-de-France",              color: "hsl(163 24% 64%)" },
                        { name: "Occitanie",                  color: "hsl(15 70% 70%)" },
                        { name: "Auvergne-Rhône-Alpes",       color: "hsl(120 28% 65%)" },
                        { name: "+ 7 autres",                 color: "hsl(0 0% 60%)" },
                      ].map((r) => (
                        <span
                          key={r.name}
                          className="text-[11px] px-3 py-1 rounded-full border"
                          style={{
                            color: r.color,
                            borderColor: `color-mix(in oklab, ${r.color} 60%, transparent)`,
                            background: `color-mix(in oklab, ${r.color} 8%, transparent)`,
                          }}
                        >
                          {r.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* ──────────────────────────────────────────────────────────────
            03 — DE PRODUCTEUR EN PRODUCTEUR (quinconce inversé)
            Texte gauche, image fiche droite. On ajoute un mini-aperçu
            FR/EN en dessous pour montrer le bilinguisme.
            ────────────────────────────────────────────────────────────── */}
        {captions[1] && (
          <section className="space-y-10 lg:space-y-12">
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
                    03
                  </span>
                </div>
                <div className="max-w-2xl">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.01em] text-foreground leading-[1.1]">
                    De producteur
                    {" "}
                    <em
                      className="font-serif-display italic font-normal"
                      style={{ color: "var(--lavender)" }}
                    >
                      en producteur
                    </em>
                    .
                  </h3>
                  <p className="mt-4 text-base text-foreground/72 leading-relaxed">
                    Fiche complète, navigation tactile, basculement FR/EN sans recharger.
                  </p>
                </div>
              </header>
            </Reveal>

            <Reveal delay={0.08} y={20} duration={0.65}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                {/* Texte à gauche (inversé vs section 02) */}
                <div className="lg:col-span-7 lg:pt-2 space-y-10 order-2 lg:order-1">
                  <div>
                    {captions[1].split("\n\n").map((para, i) => (
                      <p
                        key={i}
                        className={`text-base text-foreground/88 leading-relaxed${i > 0 ? " mt-4" : ""}`}
                      >
                        {renderHighlight(para)}
                      </p>
                    ))}
                  </div>

                  {/* Indicateurs d'interactions — typo qui ressemble à une légende technique */}
                  <div className="pt-8 border-t border-foreground/10">
                    <p className="text-[10px] font-mono uppercase tracking-[0.32em] text-foreground/40 mb-5">
                      Interactions tactiles
                    </p>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-5">
                      {[
                        { glyph: "◀ ▶", label: "Précédent / suivant", color: "var(--lavender)" },
                        { glyph: "FR ⇄ EN", label: "Sans rechargement", color: "var(--accent)" },
                        { glyph: "↕", label: "Hauteur animée", color: "var(--gold)" },
                      ].map((it) => (
                        <div key={it.label}>
                          <p
                            className="font-mono font-bold leading-none mb-2"
                            style={{
                              fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)",
                              color: it.color,
                            }}
                          >
                            {it.glyph}
                          </p>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/55 leading-snug">
                            {it.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Image fiche producteur à droite */}
                <figure className="lg:col-span-5 mx-auto lg:mx-0 w-full max-w-[400px] lg:max-w-none lg:w-full order-1 lg:order-2">
                  <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-[0_32px_80px_-8px_rgba(0,0,0,0.6)]">
                    <Image
                      src={producerImage}
                      alt={`${projet.titre} — fiche producteur FR`}
                      width={1080}
                      height={1920}
                      className="block w-full h-auto"
                      sizes="(max-width: 1024px) 90vw, 480px"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.32em] text-foreground/40">
                    <span>Fig.03 — Fiche producteur</span>
                    <span>FR</span>
                  </figcaption>
                </figure>
              </div>
            </Reveal>

            {/* Mini galerie FR / EN en dessous : illustre le bilinguisme */}
            {producerImageEn && producerImageEn !== producerImage && (
              <Reveal delay={0.06} y={16} duration={0.55}>
                <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12">
                  <div aria-hidden className="hidden lg:block" />
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.32em] text-foreground/40 mb-4">
                      Fig.04 — Le même contenu en anglais, sans rechargement
                    </p>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-2xl">
                      <div className="relative rounded-xl overflow-hidden border border-border/60">
                        <Image
                          src={producerImage}
                          alt={`${projet.titre} — fiche producteur FR`}
                          width={1080}
                          height={1920}
                          className="block w-full h-auto"
                          sizes="(max-width: 768px) 45vw, 280px"
                        />
                        <span className="absolute top-2 left-2 text-[9px] font-mono uppercase tracking-[0.3em] px-1.5 py-0.5 rounded bg-black/70 text-foreground/80">
                          FR
                        </span>
                      </div>
                      <div className="relative rounded-xl overflow-hidden border border-border/60">
                        <Image
                          src={producerImageEn}
                          alt={`${projet.titre} — fiche producteur EN`}
                          width={1080}
                          height={1920}
                          className="block w-full h-auto"
                          sizes="(max-width: 768px) 45vw, 280px"
                        />
                        <span className="absolute top-2 left-2 text-[9px] font-mono uppercase tracking-[0.3em] px-1.5 py-0.5 rounded bg-black/70 text-foreground/80">
                          EN
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}
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
                    Sept décisions
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
                    Pour les développeurs et les recruteurs : pourquoi une PWA convertie
                    en APK, pourquoi du SSG complet, comment animer une carte qui devient
                    une fiche, et comment basculer FR / EN sans rechargement.
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
                  style={{ color: "var(--accent)" }}
                >
                  Stack du projet
                </span>
                <span
                  className="font-black leading-none lg:block lg:mt-2"
                  style={{
                    fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                    color: "var(--accent)",
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
                    style={{ color: "var(--accent)" }}
                  >
                    qui font tourner
                  </em>
                  {" "}
                  l&apos;app.
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
                  <span className="text-xs text-foreground/55 text-right max-w-[22rem] leading-snug">
                    {s.role}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ──────────────────────────────────────────────────────────────
            06 — ÉQUIPE (crédits)
            ────────────────────────────────────────────────────────────── */}
        {credits.length > 0 && (
          <section className="space-y-10">
            <Reveal>
              <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
                <div className="flex items-center gap-3 lg:block lg:pt-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.3em]"
                    style={{ color: "var(--mauve)" }}
                  >
                    Équipe
                  </span>
                  <span
                    className="font-black leading-none lg:block lg:mt-2"
                    style={{
                      fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                      color: "var(--mauve)",
                      opacity: 0.95,
                    }}
                  >
                    06
                  </span>
                </div>
                <div className="max-w-2xl">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
                    Avec qui
                    {" "}
                    <em
                      className="font-serif-display italic font-normal"
                      style={{ color: "var(--mauve)" }}
                    >
                      j&apos;ai travaillé
                    </em>
                    .
                  </h2>
                  <p className="mt-5 text-base text-foreground/72 leading-relaxed">
                    Projet mené chez Artefact 3000, en collaboration avec une équipe
                    design et un manager produit.
                  </p>
                </div>
              </header>
            </Reveal>

            <Reveal delay={0.06}>
              <div>
                {credits.map((c, i) => (
                  <div
                    key={c.nom}
                    className="grid grid-cols-[auto_1fr_auto] items-baseline gap-4 sm:gap-6 py-4 border-t border-foreground/10 last:border-b last:border-foreground/10"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 w-8">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-foreground">
                      {c.nom}
                    </span>
                    <span className="text-xs text-foreground/55 text-right max-w-[24rem] leading-snug">
                      {c.role}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>
        )}

        {/* ──────────────────────────────────────────────────────────────
            07 — AUJOURD'HUI EN STATION (résultats)
            Encart final qui valorise le champ resultats — spécifique
            aux projets agence où le projet est vivant et toujours en
            production.
            ────────────────────────────────────────────────────────────── */}
        {projet.resultats && (
          <section className="space-y-10">
            <Reveal>
              <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
                <div className="flex items-center gap-3 lg:block lg:pt-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.3em]"
                    style={{ color: "var(--gold)" }}
                  >
                    Aujourd&apos;hui
                  </span>
                  <span
                    className="font-black leading-none lg:block lg:mt-2"
                    style={{
                      fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                      color: "var(--gold)",
                      opacity: 0.95,
                    }}
                  >
                    07
                  </span>
                </div>
                <div className="max-w-2xl">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
                    En station,
                    {" "}
                    <em
                      className="font-serif-display italic font-normal"
                      style={{ color: "var(--gold)" }}
                    >
                      au quotidien
                    </em>
                    .
                  </h2>
                </div>
              </header>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12">
                <div aria-hidden className="hidden lg:block" />
                <div
                  className="rounded-2xl border p-7 lg:p-9 max-w-3xl"
                  style={{
                    background: "linear-gradient(135deg, hsl(47 72% 73% / 0.06) 0%, hsl(var(--card)) 60%)",
                    borderColor: "hsl(47 72% 73% / 0.25)",
                  }}
                >
                  <p className="text-base text-foreground/88 leading-relaxed">
                    {renderHighlight(projet.resultats)}
                  </p>
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* Séparateur final */}
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(163 24% 54% / 0.3) 40%, hsl(47 72% 73% / 0.2) 60%, transparent)",
          }}
        />

        {/* CTA Services */}
        <Reveal>
          <div
            className="relative rounded-2xl overflow-hidden px-7 py-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8"
            style={{ background: "hsl(163 24% 54% / 0.05)", border: "1px solid hsl(163 24% 54% / 0.2)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "var(--accent)" }} />
            <div className="flex-1 min-w-0">
              <p
                className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-2"
                style={{ color: "var(--accent)" }}
              >
                Une appli tactile à imaginer&nbsp;?
              </p>
              <p className="text-base font-bold text-foreground leading-snug">
                Je conçois et développe des apps statiques performantes, déployables hors ligne sur tablette ou borne.
              </p>
              <p className="text-sm text-foreground/50 mt-1.5 leading-relaxed">
                Next.js statique, Contentful, Framer Motion, conversion APK : ce projet a posé les briques que je peux remettre en œuvre ailleurs.
              </p>
            </div>
            <Link
              href="/services"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer"
              style={{ background: "var(--accent)", color: "hsl(158 24% 7%)" }}
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
                style={{ color: "var(--accent)" }}
              >
                Projet suivant
              </p>
              <p className="text-base font-bold text-foreground group-hover:text-(--accent) transition-colors">
                {nextProjet.clientShort ?? nextProjet.client}
              </p>
              <p className="text-xs text-foreground/40 mt-0.5">{nextProjet.titre}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-foreground/25 group-hover:text-(--accent) group-hover:translate-x-1 transition-all shrink-0 ml-4" />
          </Link>
        </Reveal>
      </div>

      {/* Boutons flottants */}
      <Link
        href={`/projets/${prevProjet.slug}`}
        className="fixed bottom-7 left-14 z-50 hidden lg:flex items-center gap-3 pr-4 pl-3 py-3 rounded-2xl bg-card/80 backdrop-blur-md border border-white/8 hover:border-white/18 transition-all group cursor-pointer shadow-xl shadow-black/30"
      >
        <ArrowLeft className="w-4 h-4 text-foreground/30 group-hover:text-(--accent) group-hover:-translate-x-0.5 transition-all shrink-0" />
        <div className="text-left">
          <p
            className="text-[9px] uppercase tracking-[0.25em] font-semibold mb-0.5"
            style={{ color: "var(--accent)" }}
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
            style={{ color: "var(--accent)" }}
          >
            Projet suivant
          </p>
          <p className="text-sm font-bold text-foreground/88 group-hover:text-foreground transition-colors leading-tight">
            {nextProjet.clientShort ?? nextProjet.client}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-(--accent) group-hover:translate-x-0.5 transition-all shrink-0" />
      </Link>
    </div>
  );
}
