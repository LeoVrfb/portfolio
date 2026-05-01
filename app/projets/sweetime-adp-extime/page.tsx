/* ──────────────────────────────────────────────────────────────────────────
   PAGE PROJET — Aéroports de Paris / Extime — Sweetime Factory
   ────────────────────────────────────────────────────────────────────────────
   Override de la dynamic route /projets/[slug] pour ce projet uniquement.

   Mode : agence — vidéo mobile/tablette (portrait)
   Spécificité vs TotalEnergies (même mode) :
   - Pas de `imageCaptions` (donc pas de quinconce caption + image),
     mais un `sliderSets` à 1 entrée avec 4 captures d'un parcours funnel.
     → Section 02 = frise séquentielle des 4 étapes (1 / 2 / 3 / 4)
       avec numérotation et labels typés "ce que voit l'utilisateur".
   - Palette dominante --gold (rappelle le ticket à gratter / luxe travel retail).
   ────────────────────────────────────────────────────────────────────────── */

import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { preload } from "react-dom";
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react";
import { projets } from "@/lib/projets";
import { Reveal } from "../_components/reveal";

const SLUG = "sweetime-adp-extime";

const projet = projets.find((p) => p.slug === SLUG)!;
const idx = projets.findIndex((p) => p.slug === SLUG);
const nextProjet = projets[(idx + 1) % projets.length];
const prevProjet = projets[(idx - 1 + projets.length) % projets.length];
const year = projet.date.split("-")[0];

/* ════════════════════════════════════════════════════════════════════════
   STACK — résumé court
   ════════════════════════════════════════════════════════════════════════ */

const STACK_DETAIL: { nom: string; role: string }[] = [
  { nom: "Next.js (App Router)",   role: "App + API routes · proxy serveur sécurisé pour MongoDB" },
  { nom: "MongoDB",                role: "Charge d'écriture intense · structure flexible par boutique" },
  { nom: "Canvas API",             role: "Grattage tactile · effacement progressif sous le doigt" },
  { nom: "Storybook",              role: "Composants graphiques validés en isolation" },
  { nom: "Lottie + Framer Motion", role: "Pluie de bonbons design + transitions programmatiques" },
  { nom: "i18next",                role: "FR / EN sans changement d'URL · terminal identifié par UTM" },
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
  "var(--mauve)",
  "var(--gold)",
] as const;

/* Labels des étapes du parcours pour le sliderSets[0].images
   (4 captures : registration → scratch full → revealing → result)        */
const FUNNEL_STEPS = [
  { num: "01", label: "Saisie email" },
  { num: "02", label: "Flip de carte" },
  { num: "03", label: "Grattage tactile" },
  { num: "04", label: "Récompense" },
] as const;

/* ════════════════════════════════════════════════════════════════════════
   METADATA
   ════════════════════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  title: projet.client,
  description: projet.description,
};

/* ════════════════════════════════════════════════════════════════════════
   PARSEUR DE TEXTE — accent local --gold
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
      return <strong key={i} className="font-semibold" style={{ color: "var(--gold)" }}>{part.slice(2, -2)}</strong>;
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

export default function SweetimeAdpExtimePage() {
  if (projet.video) preload(projet.video, { as: "video" });

  const challenges = projet.challenges ?? [];
  const credits = projet.credits ?? [];
  const funnelImages = projet.sliderSets?.[0]?.images ?? [];
  const funnelDescription = projet.sliderSets?.[0]?.description;

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
                Projet agence · Artefact 3000
              </span>
              <span className="text-[11px] text-foreground/40 font-mono">{year}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.02em] text-foreground leading-[1.05] mb-3">
              {projet.clientShort ?? projet.client}
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
                  <Briefcase size={11} className="text-(--mauve)" />
                  <span>Projet d&apos;agence</span>
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
            Vidéo portrait + descriptionPublic + key facts
            (même pattern que TotalEnergies)
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
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
                  Un ticket virtuel
                  {" "}
                  <em
                    className="font-serif-display italic font-normal"
                    style={{ color: "var(--gold)" }}
                  >
                    à gratter avec le doigt
                  </em>
                  .
                </h2>
                <p className="mt-5 text-base text-foreground/72 leading-relaxed">
                  Un jeu concours déployé sur l&apos;ensemble des terminaux de Roissy
                  pendant deux semaines. QR code remis en boutique, grattage tactile
                  sur Canvas, récompense instantanée — tout joué debout, avant l&apos;embarquement.
                </p>
              </div>
            </header>
          </Reveal>

          {projet.video && (
            <Reveal delay={0.08} y={20} duration={0.65}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

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
                    <span>Fig.01 — Mobile, en aéroport</span>
                    <span>Canvas</span>
                  </figcaption>
                </figure>

                <div className="lg:col-span-7 lg:pt-2 space-y-10">
                  {projet.descriptionPublic && (
                    <div>{renderParagraphs(projet.descriptionPublic)}</div>
                  )}

                  {/* Key facts — opération courte, charge intense, anti-fraude, multi-langue */}
                  <div className="pt-8 border-t border-foreground/10">
                    <p className="text-[10px] font-mono uppercase tracking-[0.32em] text-foreground/40 mb-6">
                      L&apos;opération en chiffres
                    </p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-7">
                      {[
                        { value: "× 100k+",   label: "Joueurs en 2 semaines",        color: "var(--gold)" },
                        { value: "6 étapes",  label: "Du QR code au gain",           color: "var(--lavender)" },
                        { value: "FR · EN",   label: "Sans création de compte",      color: "var(--accent)" },
                        { value: "0 fraude",  label: "Cookie + vérif email serveur", color: "var(--mauve)" },
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
            02 — LE PARCOURS EN QUATRE ÉTAPES
            Frise séquentielle : 4 captures portraits côte à côte avec
            numérotation 01 → 04 et label de chaque étape. Pattern propre
            aux projets "funnel" (alternative au quinconce caption/image
            quand la donnée est un sliderSet de captures séquentielles).
            ────────────────────────────────────────────────────────────── */}
        {funnelImages.length > 0 && (
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
                    02
                  </span>
                </div>
                <div className="max-w-2xl">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.01em] text-foreground leading-[1.1]">
                    Le parcours,
                    {" "}
                    <em
                      className="font-serif-display italic font-normal"
                      style={{ color: "var(--lavender)" }}
                    >
                      en quatre captures
                    </em>
                    .
                  </h3>
                  {funnelDescription && (
                    <p className="mt-4 text-base text-foreground/85 leading-relaxed">
                      {renderHighlight(funnelDescription)}
                    </p>
                  )}
                </div>
              </header>
            </Reveal>

            {/* Frise — 4 portraits côte à côte sur desktop, 2x2 sur tablette, 1 col sur mobile */}
            <Reveal delay={0.08} y={20} duration={0.65}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
                {funnelImages.map((src, i) => {
                  const step = FUNNEL_STEPS[i] ?? { num: String(i + 1).padStart(2, "0"), label: "" };
                  return (
                    <Reveal key={src} delay={0.05 + i * 0.06} y={14} duration={0.5}>
                      <figure className="space-y-3">
                        {/* En-tête étape : numéro + label, typo mono */}
                        <div className="flex items-baseline gap-3">
                          <span
                            className="font-black leading-none"
                            style={{
                              fontSize: "clamp(1.25rem, 2vw, 1.6rem)",
                              color: "var(--lavender)",
                              opacity: 0.9,
                            }}
                          >
                            {step.num}
                          </span>
                          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-foreground/70 leading-tight">
                            {step.label}
                          </span>
                        </div>

                        <div className="relative rounded-xl overflow-hidden border border-border/60 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)]">
                          <Image
                            src={src}
                            alt={`${projet.titre} — étape ${step.num} ${step.label}`}
                            width={1080}
                            height={1920}
                            className="block w-full h-auto"
                            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 240px"
                          />
                        </div>

                        {/* Filet de progression : trait coloré sous chaque étape */}
                        <div
                          className="h-px w-full"
                          style={{
                            background: `linear-gradient(90deg, var(--lavender) 0%, var(--lavender) ${((i + 1) / funnelImages.length) * 100}%, transparent ${((i + 1) / funnelImages.length) * 100}%)`,
                            opacity: 0.45,
                          }}
                        />
                      </figure>
                    </Reveal>
                  );
                })}
              </div>
            </Reveal>
          </section>
        )}

        {/* ──────────────────────────────────────────────────────────────
            03 — CÔTÉ TECHNIQUE
            ────────────────────────────────────────────────────────────── */}
        {challenges.length > 0 && (
          <section className="space-y-10 lg:space-y-12">
            <Reveal>
              <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
                <div className="flex items-center gap-3 lg:block lg:pt-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.3em]"
                    style={{ color: "var(--accent)" }}
                  >
                    Côté technique
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
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
                    Cinq décisions
                    {" "}
                    <em
                      className="font-serif-display italic font-normal"
                      style={{ color: "var(--accent)" }}
                    >
                      qui ont fait le projet
                    </em>
                    .
                  </h2>
                  <p className="mt-5 text-base text-foreground/72 leading-relaxed">
                    Pour les développeurs et les recruteurs : pourquoi Canvas pour le grattage,
                    comment sécuriser MongoDB côté serveur, comment garantir l&apos;anti-fraude
                    avec une double couche, et comment distribuer des récompenses à stocks limités.
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
            04 — STACK
            ────────────────────────────────────────────────────────────── */}
        <section className="space-y-10">
          <Reveal>
            <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
              <div className="flex items-center gap-3 lg:block lg:pt-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.3em]"
                  style={{ color: "var(--gold)" }}
                >
                  Stack du projet
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
                  Les outils
                  {" "}
                  <em
                    className="font-serif-display italic font-normal"
                    style={{ color: "var(--gold)" }}
                  >
                    qui font tenir
                  </em>
                  {" "}
                  l&apos;opération.
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
            05 — ÉQUIPE
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
                    05
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
                    Projet mené chez Artefact 3000, avec une équipe design Extime
                    et un manager produit côté Artefact.
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
            06 — APRÈS L'OPÉRATION (résultats)
            ────────────────────────────────────────────────────────────── */}
        {projet.resultats && (
          <section className="space-y-10">
            <Reveal>
              <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
                <div className="flex items-center gap-3 lg:block lg:pt-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.3em]"
                    style={{ color: "var(--lavender)" }}
                  >
                    Après l&apos;opération
                  </span>
                  <span
                    className="font-black leading-none lg:block lg:mt-2"
                    style={{
                      fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                      color: "var(--lavender)",
                      opacity: 0.95,
                    }}
                  >
                    06
                  </span>
                </div>
                <div className="max-w-2xl">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
                    En deux semaines,
                    {" "}
                    <em
                      className="font-serif-display italic font-normal"
                      style={{ color: "var(--lavender)" }}
                    >
                      sur tous les terminaux
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
                    background: "linear-gradient(135deg, hsl(284 24% 70% / 0.06) 0%, hsl(var(--card)) 60%)",
                    borderColor: "hsl(284 24% 70% / 0.25)",
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
                Une opération digitale à imaginer&nbsp;?
              </p>
              <p className="text-base font-bold text-foreground leading-snug">
                Je conçois et développe des expériences gamifiées en marque blanche, du QR code à l&apos;envoi du gain.
              </p>
              <p className="text-sm text-foreground/50 mt-1.5 leading-relaxed">
                Canvas tactile, MongoDB sécurisé, anti-fraude double couche, multi-langue : ce projet a posé les briques que je peux remettre en œuvre ailleurs.
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
