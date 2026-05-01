/* ──────────────────────────────────────────────────────────────────────────
   PAGE PROJET — Artefact / Make a Scene (outil de formation au prompting IA)
   ────────────────────────────────────────────────────────────────────────────
   Override de la dynamic route /projets/[slug] pour ce projet uniquement.

   Mode : agence — vidéo desktop 16:9 (même catégorie que BNP)
   Spécificité : pas de credits ni de resultats dans la donnée
   → on saute la section "Équipe" et la section "Aujourd'hui / Après"
     pour rester épuré. Deux sliderSets thématiques (le funnel + le rendu).
   Palette dominante : --mauve (créatif / IA générative).
   ────────────────────────────────────────────────────────────────────────── */

import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { preload } from "react-dom";
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react";
import { projets } from "@/lib/projets";
import { ProjetImageSlider } from "@/components/sections/projet-image-slider";
import { WideVideoPlayer } from "@/components/sections/wide-video-player";
import { Reveal } from "../_components/reveal";

const SLUG = "make-a-scene";

const projet = projets.find((p) => p.slug === SLUG)!;
const idx = projets.findIndex((p) => p.slug === SLUG);
const nextProjet = projets[(idx + 1) % projets.length];
const prevProjet = projets[(idx - 1 + projets.length) % projets.length];
const year = projet.date.split("-")[0];

/* ════════════════════════════════════════════════════════════════════════
   STACK — résumé court
   ════════════════════════════════════════════════════════════════════════ */

const STACK_DETAIL: { nom: string; role: string }[] = [
  { nom: "Next.js (App Router)",       role: "Routes par étape · pas de backend pour stocker les images" },
  { nom: "API de génération d'images", role: "1 requête, 4 variantes via `n: 4` côté serveur" },
  { nom: "Zustand",                    role: "Store unique · 3 × 14 sous-étapes · pas de prop drilling" },
  { nom: "Storybook",                  role: "Composants design system validés en isolation" },
  { nom: "next-intl",                  role: "FR / EN · questions et options externalisées" },
  { nom: "Embla Carousel + Radix UI",  role: "Carrousels d'options + sliders accessibles" },
];

const TAG_COLORS = [
  { color: "var(--mauve)",    bg: "hsl(290 16% 58% / 0.12)" },
  { color: "var(--lavender)", bg: "hsl(284 24% 70% / 0.12)" },
  { color: "var(--accent)",   bg: "hsl(163 24% 54% / 0.12)" },
];

const CHALLENGE_PALETTE = [
  "var(--mauve)",
  "var(--lavender)",
  "var(--accent)",
] as const;

/* ════════════════════════════════════════════════════════════════════════
   METADATA
   ════════════════════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  title: projet.client,
  description: projet.description,
};

/* ════════════════════════════════════════════════════════════════════════
   PARSEUR DE TEXTE — accent local --mauve
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
      return <strong key={i} className="font-semibold" style={{ color: "var(--mauve)" }}>{part.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(part))
      return (
        <em
          key={i}
          className="font-serif-display italic font-normal"
          style={{ color: "var(--mauve)" }}
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
          style={{ color: "var(--mauve)", textDecorationColor: "color-mix(in oklab, var(--mauve) 50%, transparent)" }}
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

export default function MakeASceneePage() {
  if (projet.video) preload(projet.video, { as: "video" });

  const sliderSets = projet.sliderSets ?? [];
  const challenges = projet.challenges ?? [];

  return (
    <div className="pt-28 pb-28">

      {/* ════════════════════════════════════════════════════════════════
          HEADER
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
                Projet agence · Artefact
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

            <p className="text-sm uppercase tracking-widest mb-5" style={{ color: "var(--mauve)" }}>
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
              style={{ background: "linear-gradient(135deg, hsl(290 16% 58% / 0.05) 0%, hsl(var(--card)) 60%)" }}
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-2 font-semibold" style={{ color: "var(--mauve)" }}>
                  Client
                </p>
                <p className="text-sm font-semibold text-foreground">{projet.client}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-1.5 font-semibold" style={{ color: "var(--mauve)" }}>
                  Contexte
                </p>
                <div className="flex items-center gap-1.5 text-sm text-foreground/88">
                  <Briefcase size={11} className="text-(--mauve)" />
                  <span>Projet d&apos;agence · interne</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-1.5 font-semibold" style={{ color: "var(--mauve)" }}>
                  Année
                </p>
                <p className="text-sm font-semibold text-foreground/85">{year}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-2 font-semibold" style={{ color: "var(--mauve)" }}>
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
              "linear-gradient(90deg, transparent, hsl(290 16% 58% / 0.3) 40%, hsl(284 24% 70% / 0.2) 60%, transparent)",
          }}
        />

        {/* ──────────────────────────────────────────────────────────────
            01 — VUE D'ENSEMBLE
            Hero vidéo 16:9 desktop (même pattern que BNP) + descriptionPublic
            décalée sur la colonne contenu (max-w-3xl).
            ────────────────────────────────────────────────────────────── */}
        <section className="space-y-10 lg:space-y-12">

          <Reveal>
            <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
              <div className="flex items-center gap-3 lg:block lg:pt-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.3em]"
                  style={{ color: "var(--mauve)" }}
                >
                  Vue d&apos;ensemble
                </span>
                <span
                  className="font-black leading-none lg:block lg:mt-2"
                  style={{
                    fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                    color: "var(--mauve)",
                    opacity: 0.95,
                  }}
                >
                  01
                </span>
              </div>
              <div className="max-w-3xl">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
                  Un funnel pour
                  {" "}
                  <em
                    className="font-serif-display italic font-normal"
                    style={{ color: "var(--mauve)" }}
                  >
                    parler à une IA
                  </em>
                  , mot à mot.
                </h2>
                <p className="mt-5 text-base text-foreground/72 leading-relaxed">
                  3 étapes, 14 sous-étapes. Chaque option choisie s&apos;ajoute en temps réel
                  à la barre de prompt en bas de l&apos;écran. Au bout du funnel, 4 variantes
                  d&apos;images sont générées en une seule requête.
                </p>
              </div>
            </header>
          </Reveal>

          {/* Vidéo 16:9 — full container, légende mono Fig.01 */}
          {projet.video && (
            <Reveal delay={0.08} y={20} duration={0.65}>
              <figure className="space-y-3">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border/60 shadow-[0_32px_80px_-8px_rgba(0,0,0,0.6)]">
                  <WideVideoPlayer
                    src={projet.video}
                    loopStart={projet.videoLoopStart}
                    loopEnd={projet.videoLoopEnd}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <figcaption className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.32em] text-foreground/40">
                  <span>
                    Fig.01
                    {projet.videoTitle ? ` — ${projet.videoTitle}` : ""}
                  </span>
                  <span>Outil interne Artefact</span>
                </figcaption>
              </figure>
            </Reveal>
          )}

          {/* Description longue — alignée sur la colonne contenu (max-w-3xl) */}
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
            02 / 03 — SLIDERS THÉMATIQUES
            Le funnel pas à pas, puis Du prompt à l'image.
            Même pattern que BNP : header label/contenu + slider plein cadre.
            ────────────────────────────────────────────────────────────── */}
        {sliderSets.map((set, si) => {
          const sectionNum = String(si + 2).padStart(2, "0");
          const accent = si % 2 === 0 ? "var(--lavender)" : "var(--accent)";
          return (
            <section key={si} className="space-y-8">
              <Reveal>
                <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
                  <div className="flex items-center gap-3 lg:block lg:pt-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.3em]"
                      style={{ color: accent }}
                    >
                      Section
                    </span>
                    <span
                      className="font-black leading-none lg:block lg:mt-2"
                      style={{
                        fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                        color: accent,
                        opacity: 0.95,
                      }}
                    >
                      {sectionNum}
                    </span>
                  </div>
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
                  aspectRatio="aspect-video"
                />
              </Reveal>
            </section>
          );
        })}

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
                    Trois décisions
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
                    Pour les développeurs et les recruteurs : pourquoi un store Zustand
                    pour 3×14 sous-étapes, pourquoi une seule requête pour les 4 variantes,
                    et pourquoi générer les aperçus offline plutôt qu&apos;à la volée.
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
                  style={{ color: "var(--mauve)" }}
                >
                  Stack du projet
                </span>
                <span
                  className="font-black leading-none lg:block lg:mt-2"
                  style={{
                    fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                    color: "var(--mauve)",
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
                    style={{ color: "var(--mauve)" }}
                  >
                    qui font tourner
                  </em>
                  {" "}
                  l&apos;outil.
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

        {/* Séparateur final */}
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(290 16% 58% / 0.3) 40%, hsl(284 24% 70% / 0.2) 60%, transparent)",
          }}
        />

        {/* CTA Services */}
        <Reveal>
          <div
            className="relative rounded-2xl overflow-hidden px-7 py-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8"
            style={{ background: "hsl(290 16% 58% / 0.05)", border: "1px solid hsl(290 16% 58% / 0.2)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "var(--mauve)" }} />
            <div className="flex-1 min-w-0">
              <p
                className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-2"
                style={{ color: "var(--mauve)" }}
              >
                Un outil de formation à imaginer&nbsp;?
              </p>
              <p className="text-base font-bold text-foreground leading-snug">
                Je conçois et développe des funnels guidés et des outils internes intégrant la génération d&apos;images IA.
              </p>
              <p className="text-sm text-foreground/50 mt-1.5 leading-relaxed">
                Funnel multi-étapes, store Zustand, génération d&apos;images en 1 requête, design system Storybook : ce projet a posé les briques que je peux remettre en œuvre ailleurs.
              </p>
            </div>
            <Link
              href="/services"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer"
              style={{ background: "var(--mauve)", color: "hsl(158 24% 7%)" }}
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
                style={{ color: "var(--mauve)" }}
              >
                Projet suivant
              </p>
              <p className="text-base font-bold text-foreground group-hover:text-(--mauve) transition-colors">
                {nextProjet.clientShort ?? nextProjet.client}
              </p>
              <p className="text-xs text-foreground/40 mt-0.5">{nextProjet.titre}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-foreground/25 group-hover:text-(--mauve) group-hover:translate-x-1 transition-all shrink-0 ml-4" />
          </Link>
        </Reveal>
      </div>

      {/* Boutons flottants */}
      <Link
        href={`/projets/${prevProjet.slug}`}
        className="fixed bottom-7 left-14 z-50 hidden lg:flex items-center gap-3 pr-4 pl-3 py-3 rounded-2xl bg-card/80 backdrop-blur-md border border-white/8 hover:border-white/18 transition-all group cursor-pointer shadow-xl shadow-black/30"
      >
        <ArrowLeft className="w-4 h-4 text-foreground/30 group-hover:text-(--mauve) group-hover:-translate-x-0.5 transition-all shrink-0" />
        <div className="text-left">
          <p
            className="text-[9px] uppercase tracking-[0.25em] font-semibold mb-0.5"
            style={{ color: "var(--mauve)" }}
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
            style={{ color: "var(--mauve)" }}
          >
            Projet suivant
          </p>
          <p className="text-sm font-bold text-foreground/88 group-hover:text-foreground transition-colors leading-tight">
            {nextProjet.clientShort ?? nextProjet.client}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-(--mauve) group-hover:translate-x-0.5 transition-all shrink-0" />
      </Link>
    </div>
  );
}
