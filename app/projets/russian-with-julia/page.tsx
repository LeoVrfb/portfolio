/* ──────────────────────────────────────────────────────────────────────────
   PAGE PROJET — Russian with Julia
   ────────────────────────────────────
   Cette route prend le pas sur la dynamic route /projets/[slug] uniquement
   pour ce projet. Les autres projets continuent de passer par la page
   générique app/projets/[slug]/page.tsx.

   PARTI PRIS
   ──────────
   • Mix entre la structure pro/cadrée des autres pages projets (header avec
     carte projet à droite, titre Space Grotesk font-black, intro lisible)
     et un raffinement éditorial inspiré du shape de Kalypso (numérotation
     romaine/arabe en filigrane, layout magazine 2 colonnes pour le côté
     technique, stack en index typographique, gros chiffres décoratifs).

   • Typographie strictement alignée avec /services/standard :
     – Sans-serif (Space Grotesk) en font-black/font-light pour les titres
     – Serif italique (DM Serif Display) UNIQUEMENT comme accent sur des
       mots clés isolés via le motif *mot* — jamais comme typo de bloc.

   • Animations au scroll très discrètes via <Reveal /> co-located :
     fade + petit translate-up + léger blur. Une seule fois par section.
     Objectif : donner du rythme à la lecture sans rien "spectaculariser".

   • Largeurs de container :
     – max-w-6xl pour le shell de page (~1152px) → laisse respirer les visuels
     – max-w-3xl pour les headers de section (eyebrow + titre + intro)
     – max-w-2xl pour les paragraphes longs (lisibilité ~70 caractères)
     Les images, sliders et grilles prennent toute la largeur du shell.
   ────────────────────────────────────────────────────────────────────────── */

import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { preload } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  User,
  CalendarCheck,
  Lock,
  Sparkles,
  CreditCard,
  Video,
  Palette,
  Globe,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { projets, type PillarIcon } from "@/lib/projets";
import { ProjetImageSlider } from "@/components/sections/projet-image-slider";
import { Reveal } from "../_components/reveal";
import { SectionHeader, SectionOffset } from "../_components/section-header";

/* ════════════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════════════ */

const SLUG = "russian-with-julia";

// Cast non-null : on contrôle la donnée, le projet existe forcément.
const projet = projets.find((p) => p.slug === SLUG)!;

const idx = projets.findIndex((p) => p.slug === SLUG);
const nextProjet = projets[(idx + 1) % projets.length];
const prevProjet = projets[(idx - 1 + projets.length) % projets.length];
const year = projet.date.split("-")[0];

/* ════════════════════════════════════════════════════════════════════════
   STACK — descriptions custom pour la section "index typographique"
   ════════════════════════════════════════════════════════════════════════ */

const STACK_DETAIL: { nom: string; role: string }[] = [
  { nom: "Next.js 16",        role: "App Router · pages statiques + zone authentifiée /courses" },
  { nom: "Convex",            role: "Base de données temps réel · auth · suivi de progression" },
  { nom: "Convex Auth",       role: "Magic link sans mot de passe · whitelist d'admins" },
  { nom: "Stripe",            role: "Paiement des packs vidéo · checkout des séances de cours" },
  { nom: "Cloudflare R2",     role: "Hébergement des vidéos · zéro frais d'egress · URL signées" },
  { nom: "Google Calendar",   role: "Création automatique des rendez-vous + lien de visioconférence" },
  { nom: "Resend",            role: "Envoi des magic links et confirmations · domaine vérifié" },
  { nom: "dotted-map",        role: "Carte du monde stylisée des élèves" },
  { nom: "next-intl",         role: "Internationalisation FR / EN" },
  { nom: "Tailwind · shadcn", role: "Système d'UI cohérent et productif" },
];

/* ════════════════════════════════════════════════════════════════════════
   ICÔNES PILIERS — strictement les mêmes mappings que la dynamic route
   ════════════════════════════════════════════════════════════════════════ */

const PILLAR_ICONS: Record<PillarIcon, LucideIcon> = {
  "calendar-check": CalendarCheck,
  "lock": Lock,
  "sparkles": Sparkles,
  "credit-card": CreditCard,
  "video": Video,
  "palette": Palette,
  "globe": Globe,
  "shield-check": ShieldCheck,
};

const PILLAR_COLORS = [
  { tint: "var(--accent)",   bg: "hsl(163 52% 76% / 0.08)", border: "hsl(163 52% 76% / 0.22)" },
  { tint: "var(--lavender)", bg: "hsl(199 88% 78% / 0.08)", border: "hsl(199 88% 78% / 0.22)" },
  { tint: "var(--gold)",     bg: "hsl(47 72% 73% / 0.08)",  border: "hsl(47 72% 73% / 0.22)" },
] as const;

const TAG_COLORS = [
  { color: "var(--lavender)", bg: "hsl(284 24% 70% / 0.12)" },
  { color: "var(--mauve)",    bg: "hsl(328 24% 61% / 0.12)" },
  { color: "var(--accent)",   bg: "hsl(163 24% 54% / 0.12)" },
];

const CHALLENGE_PALETTE = [
  "var(--accent)",
  "var(--lavender)",
  "var(--mauve)",
  "var(--gold)",
  "var(--accent)",
  "var(--lavender)",
] as const;

/* ════════════════════════════════════════════════════════════════════════
   METADATA
   ════════════════════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  // Le layout root applique déjà le template "%s — Léo Hengebaert".
  title: projet.client,
  description: projet.description,
};

/* ════════════════════════════════════════════════════════════════════════
   PARSEUR DE TEXTE — copie locale alignée sur la dynamic route
   ════════════════════════════════════════════════════════════════════════ */

function renderHighlight(text: string): React.ReactNode {
  // - **mot** ou __mot__ → strong blanc
  // - *mot*               → serif italique, accent visuel posé (typo du site)
  // - ~~mot~~             → strong lavender
  // - [label](href)       → lien accent souligné
  // - \n                  → <br />
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

export default function RussianWithJuliaPage() {
  const mainImg = projet.heroImg ?? projet.img;
  if (mainImg) preload(mainImg, { as: "image" });

  const sliderSets = projet.sliderSets ?? [];
  const challenges = projet.challenges ?? [];
  const pillars = projet.pillarsCards ?? [];

  return (
    <div className="pt-28 pb-28">

      {/* ════════════════════════════════════════════════════════════════
          HEADER — carte projet à droite, layout pro (du SIEN, gardé)
          ════════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 mb-12">
        {/* Back */}
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
            {/* Eyebrow contexte */}
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/55 border border-white/12 rounded-full px-3 py-1">
                Projet freelance
              </span>
              <span className="text-[11px] text-foreground/40 font-mono">{year}</span>
            </div>

            {/* Titre client en BLACK SANS-SERIF — code typo de la page actuelle */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.02em] text-foreground leading-[1.05] mb-3">
              {projet.client}
            </h1>

            {/* Mobile only — meta condensée (remplace la carte) */}
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

            {/* Sous-titre du site */}
            <p className="text-sm uppercase tracking-widest mb-5" style={{ color: "var(--accent)" }}>
              {projet.titre}
            </p>

            {/* Intro lisible — bloc qui présente le projet (gardé) */}
            <p className="text-base text-foreground/88 leading-relaxed max-w-xl">
              {renderHighlight(projet.intro)}
            </p>
          </Reveal>

          {/* ─── Droite : carte projet meta ─── */}
          <Reveal duration={0.55} y={18} delay={0.12} className="space-y-3 lg:pt-2 hidden sm:block">
            <div
              className="p-5 rounded-xl border border-border space-y-4"
              style={{ background: "linear-gradient(135deg, hsl(163 52% 76% / 0.05) 0%, hsl(var(--card)) 60%)" }}
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
                  <User size={11} className="text-(--mauve)" />
                  <span>Projet freelance</span>
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

            {projet.url && (
              <a
                href={projet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-accent/30 bg-accent/5 text-sm font-semibold text-accent hover:bg-accent/10 transition-colors cursor-pointer group"
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
              "linear-gradient(90deg, transparent, hsl(163 52% 76% / 0.3) 40%, hsl(199 88% 78% / 0.2) 60%, transparent)",
          }}
        />

        {/* ──────────────────────────────────────────────────────────────
            01 — VUE D'ENSEMBLE
            Pattern grille label/contenu uniforme avec 03→07 :
            - Colonne gauche (180px) : label texte + gros chiffre éditorial
            - Colonne droite : tagline (puis hero full container, puis description
              alignée sur la colonne contenu via mini-grille spacer).
            ────────────────────────────────────────────────────────────── */}
        <section className="space-y-10 lg:space-y-12">

          {/* Header : label + tagline */}
          <Reveal>
            <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
              {/* Colonne gauche — label éditorial */}
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

              {/* Colonne droite — tagline éditoriale */}
              <div className="max-w-3xl">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.15] tracking-[-0.01em] text-foreground">
                  {renderHighlight(projet.tagline ?? "")}
                </p>
              </div>
            </header>
          </Reveal>

          {/* Hero image — full container, légende mono Fig.01 */}
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

          {/* Description longue — alignée sur la colonne contenu via mini-grille.
              max-w-3xl (~48rem) : un peu plus généreux que les autres paragraphes
              de section pour donner de la respiration au bloc d'introduction. */}
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
            02 — ENJEUX & DÉFIS : 3 piliers révisés
            (la section que tu voulais retrouver)
            ────────────────────────────────────────────────────────────── */}
        <section className="space-y-10 lg:space-y-12">
          <Reveal>
            <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
              {/* Colonne gauche — label éditorial */}
              <div className="flex items-center gap-3 lg:block lg:pt-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.3em]"
                  style={{ color: "var(--mauve)" }}
                >
                  Enjeux & défis
                </span>
                <span
                  className="font-black leading-none lg:block lg:mt-2"
                  style={{
                    fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                    color: "var(--mauve)",
                    opacity: 0.95,
                  }}
                >
                  02
                </span>
              </div>

              {/* Colonne droite — titre + intro */}
              <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
                  Trois questions à trancher
                  {" "}
                  <em
                    className="font-serif-display italic font-normal"
                    style={{ color: "var(--mauve)" }}
                  >
                    avant la première ligne de code
                  </em>
                  .
                </h2>
                <p className="mt-5 text-base text-foreground/72 leading-relaxed">
                  Chaque pilier ci-dessous correspond à un choix structurant : ce qui rend ce
                  site spécifique, et ce qui l&apos;a forcé à sortir des sentiers battus du site
                  vitrine classique.
                </p>
              </div>
            </header>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {pillars.map((p, i) => {
              const Icon = PILLAR_ICONS[p.iconName];
              const c = PILLAR_COLORS[i % PILLAR_COLORS.length];
              return (
                <Reveal key={i} delay={0.06 + i * 0.08}>
                <div
                  className="relative rounded-2xl overflow-hidden flex flex-col gap-5 p-7"
                  style={{ background: c.bg, border: `1px solid ${c.border}` }}
                >
                  {/* Barre top couleur */}
                  <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: c.tint }} />
                  {/* Numéro filigrane */}
                  <span
                    className="absolute top-4 right-5 font-black leading-none select-none pointer-events-none"
                    style={{ fontSize: "3.5rem", color: c.tint, opacity: 0.12 }}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `color-mix(in oklab, ${c.tint} 18%, transparent)`,
                      color: c.tint,
                    }}
                  >
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <p
                    className="text-[9px] font-bold uppercase tracking-[0.35em]"
                    style={{ color: c.tint }}
                  >
                    {p.eyebrow}
                  </p>
                  <h3 className="text-xl font-bold text-foreground leading-tight">
                    {p.titre}
                  </h3>
                  <p className="text-sm text-foreground/75 leading-relaxed">
                    {p.description}
                  </p>
                </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────
            03 / 04 / 05 — LES SCREENSHOTS, sections numérotées
            Pattern grille label/contenu : numéro éditorial à gauche,
            titre + description à droite, slider full container dessous.
            ────────────────────────────────────────────────────────────── */}
        {sliderSets.map((set, si) => {
          const sectionNum = String(si + 3).padStart(2, "0");
          return (
            <section key={si} className="space-y-8">
              <Reveal>
                <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">

                  {/* Colonne gauche — numéro éditorial : label mono en haut + gros chiffre accent */}
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
                      {sectionNum}
                    </span>
                  </div>

                  {/* Colonne droite — titre + description */}
                  <div className="max-w-2xl">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.01em] text-foreground leading-[1.1]">
                      {set.title}
                    </h3>
                    <p className="mt-4 text-base text-foreground/85 leading-relaxed">
                      {renderHighlight(set.description)}
                    </p>
                  </div>
                </header>
              </Reveal>

              <Reveal delay={0.08} y={20} duration={0.6}>
                <ProjetImageSlider
                  images={set.images}
                  alt={`${projet.titre} — ${set.title}`}
                  wide
                  aspectRatio="aspect-[2/1]"
                />
              </Reveal>
            </section>
          );
        })}

        {/* ──────────────────────────────────────────────────────────────
            06 — CÔTÉ TECHNIQUE : layout magazine 2 colonnes
            (numéro+titre à gauche, détail à droite, ligne fine entre items)
            ────────────────────────────────────────────────────────────── */}
        {challenges.length > 0 && (
          <section className="space-y-10 lg:space-y-12">
            <Reveal>
              <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
                {/* Colonne gauche — label éditorial */}
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
                    06
                  </span>
                </div>

                {/* Colonne droite — titre + intro */}
                <div className="max-w-2xl">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
                    Six décisions
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
                    Pour les développeurs et les recruteurs qui ouvrent cette page : voici les
                    choix techniques que ce projet m&apos;a obligé à formuler, pas ceux que
                    j&apos;aurais pris par défaut. Chaque entrée est documentée en interne sous
                    forme d&apos;ADR (Architecture Decision Record).
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
                    <article
                      className="group grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-12 py-9 border-t border-foreground/10"
                    >
                      {/* Colonne gauche — numéro + titre */}
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

                      {/* Colonne droite — solution (max-w-2xl pour la lisibilité) */}
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
            07 — STACK : index typographique pro
            ────────────────────────────────────────────────────────────── */}
        <section className="space-y-10">
          <Reveal>
            <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
              {/* Colonne gauche — label éditorial */}
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
                  07
                </span>
              </div>

              {/* Colonne droite — titre uniquement (pas d'intro pour cette section) */}
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
              "linear-gradient(90deg, transparent, hsl(163 52% 76% / 0.3) 40%, hsl(199 88% 78% / 0.2) 60%, transparent)",
          }}
        />

        {/* ──────────────────────────────────────────────────────────────
            CTA SERVICES — repris quasi tel quel de la page actuelle
            ────────────────────────────────────────────────────────────── */}
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
                Identité visuelle, e-commerce, interface d&apos;administration — chaque projet est pensé et codé de A à Z.
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

        {/* ──────────────────────────────────────────────────────────────
            PROJET SUIVANT
            ────────────────────────────────────────────────────────────── */}
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
              <p className="text-base font-bold text-foreground group-hover:text-accent transition-colors">
                {nextProjet.clientShort ?? nextProjet.client}
              </p>
              <p className="text-xs text-foreground/40 mt-0.5">{nextProjet.titre}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-foreground/25 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 ml-4" />
          </Link>
        </Reveal>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          BOUTONS FLOTTANTS — projet précédent / suivant (gardés)
          ════════════════════════════════════════════════════════════════ */}
      <Link
        href={`/projets/${prevProjet.slug}`}
        className="fixed bottom-7 left-14 z-50 hidden lg:flex items-center gap-3 pr-4 pl-3 py-3 rounded-2xl bg-card/80 backdrop-blur-md border border-white/8 hover:border-white/18 transition-all group cursor-pointer shadow-xl shadow-black/30"
      >
        <ArrowLeft className="w-4 h-4 text-foreground/30 group-hover:text-accent group-hover:-translate-x-0.5 transition-all shrink-0" />
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
        <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
      </Link>
    </div>
  );
}
