"use client";

/* ──────────────────────────────────────────────────────────────────────────
   PROJET FICTIF — DOMAINE DE L'OPALINE
   Page projet construite from scratch comme un magazine d'auteur.

   DIRECTION ARTISTIQUE
   ────────────────────
   Editorial dark · raffiné · luxe sourd. Pas de purple gradient cliché,
   pas de glassmorphisme convenu. La page se lit comme un livre : index en
   marge, chiffres en filigrane, citations serif italique, légendes mono,
   placeholders gris travaillés (à remplacer par de vraies photos).
   ────────────────────────────────────────────────────────────────────────── */

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
   DONNÉES NON TRADUISIBLES (techniques, couleurs, icônes)
   ════════════════════════════════════════════════════════════════════════ */

const PROJET_STATIC = {
  numero: "N°007",
  annee: "2026",
  lieu: "Saint-Aubin · Côte de Beaune",
  url: "domaine-opaline.fr",
} as const;

const PILIER_META = [
  { ico: Wine,          tint: "var(--gold)",     bg: "hsl(47 72% 73% / 0.05)",   offset: "md:-mt-8" },
  { ico: CalendarHeart, tint: "var(--mauve)",    bg: "hsl(295 38% 68% / 0.05)",  offset: "" },
  { ico: BedDouble,     tint: "var(--lavender)", bg: "hsl(199 88% 78% / 0.05)",  offset: "md:mt-12" },
] as const;

const CHALLENGE_ACCENTS = [
  "var(--gold)",
  "var(--mauve)",
  "var(--lavender)",
  "var(--accent)",
  "var(--gold)",
] as const;

/* ════════════════════════════════════════════════════════════════════════
   PETITS COMPOSANTS
   ════════════════════════════════════════════════════════════════════════ */

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
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, hsl(158 18% 14%) 0%, hsl(158 22% 11%) 60%, hsl(158 26% 8%) 100%)" }} />
      <div aria-hidden className="absolute inset-0 opacity-[0.18] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")" }} />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/8" />
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "linear-gradient(135deg, transparent 49.6%, white 49.8%, white 50.2%, transparent 50.4%)" }} />
      <figcaption className="absolute bottom-3 right-3 text-[9px] uppercase tracking-[0.32em] font-mono text-foreground/45">
        {label}
      </figcaption>
    </figure>
  );
}

function Eyebrow({ children, color = "var(--gold)" }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="block w-8 h-px" style={{ background: color, opacity: 0.6 }} />
      <span className="text-[10px] font-bold uppercase tracking-[0.4em] font-mono" style={{ color }}>{children}</span>
    </div>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
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
   PAGE CLIENT
   ════════════════════════════════════════════════════════════════════════ */

export default function KalypsoClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: rootRef });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });
  const progressWidth = useTransform(progress, (v) => `${v * 100}%`);

  const t = useTranslations("projetContent");
  const tK = useTranslations("projetsData.kalypso");

  const projet = {
    numero:        PROJET_STATIC.numero,
    annee:         PROJET_STATIC.annee,
    lieu:          PROJET_STATIC.lieu,
    url:           PROJET_STATIC.url,
    edition:       tK("projet.edition"),
    client:        tK("projet.client"),
    signature:     tK("projet.signature"),
    contexte:      tK("projet.contexte"),
    citation:      tK("projet.citation"),
    citationAuteur:tK("projet.citationAuteur"),
    tagline:       {
      haut:   tK("projet.tagline.haut"),
      milieu: tK("projet.tagline.milieu"),
      bas:    tK("projet.tagline.bas"),
    },
  };

  const ticker     = tK.raw("ticker") as string[];
  const piliers    = tK.raw("piliers") as { n: string; eyebrow: string; titre: string; texte: string }[];
  const challenges = tK.raw("challenges") as { n: string; titre: string; extrait: string }[];
  const stack      = tK.raw("stack") as { nom: string; role: string }[];
  const credits    = tK.raw("credits") as { role: string; nom: string }[];
  const indexNav   = tK.raw("page.indexNav") as { n: string; label: string }[];

  return (
    <div ref={rootRef} className="relative pt-16 pb-32 overflow-x-hidden">

      {/* Reading progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
        style={{ width: progressWidth, background: "linear-gradient(90deg, var(--gold) 0%, var(--mauve) 60%, var(--lavender) 100%)" }}
      />

      {/* Grain global */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />

      {/* Halo coloré derrière le hero */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[700px] -z-10 opacity-60"
        style={{ background: "radial-gradient(ellipse at 30% 20%, hsl(47 72% 73% / 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(295 38% 68% / 0.08) 0%, transparent 60%)" }} />

      {/* Index romain en marge (xl+) */}
      <aside className="hidden xl:flex flex-col gap-1.5 fixed left-8 top-1/2 -translate-y-1/2 z-40 select-none">
        {indexNav.map((item, i) => (
          <a key={i} href={`#section-${item.n.toLowerCase()}`}
            className="group flex items-center gap-3 py-1.5 text-foreground/55 hover:text-foreground transition-colors cursor-pointer">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] w-6" style={{ color: "var(--gold)" }}>{item.n}</span>
            <span className="text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">{item.label}</span>
          </a>
        ))}
      </aside>

      {/* TICKER ÉDITORIAL */}
      <div className="relative z-10 mb-10 border-y border-foreground/10 overflow-hidden">
        <div className="flex gap-12 py-3 animate-[marquee_40s_linear_infinite] whitespace-nowrap">
          {[...ticker, ...ticker, ...ticker].map((item, i) => (
            <div key={i} className="flex items-center gap-12 text-[10px] font-mono uppercase tracking-[0.4em] text-foreground/55 shrink-0">
              <span>{item}</span>
              <span aria-hidden className="w-1 h-1 rounded-full" style={{ background: "var(--gold)", opacity: 0.6 }} />
            </div>
          ))}
        </div>
      </div>

      {/* HEADER — back / marqueur d'édition / lien live */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 mb-14 relative z-10">
        <div className="flex items-center justify-between gap-4">
          <Link href="/projets" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-foreground/45 hover:text-foreground transition-colors cursor-pointer">
            <ArrowLeft size={13} />
            {t("retour")}
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/55">
            <span>{projet.numero}</span>
            <span aria-hidden className="w-3 h-px bg-foreground/20" />
            <span>{projet.edition}</span>
            <span aria-hidden className="w-3 h-px bg-foreground/20" />
            <span>{projet.annee}</span>
          </div>
          <a href={`https://${projet.url}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-foreground/45 hover:text-foreground transition-colors cursor-pointer">
            {projet.url}
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>

      {/* SECTION I — HERO ÉDITORIAL */}
      <section id="section-i" className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10 mb-32 sm:mb-40">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
            <div className="space-y-3">
              <Eyebrow color="var(--gold)">{tK("page.sectionI.eyebrow")}</Eyebrow>
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-foreground/45">{projet.contexte} · {projet.lieu}</p>
            </div>
            <div className="flex items-center gap-2 text-foreground/55">
              <MapPin size={13} style={{ color: "var(--gold)" }} />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em]">{projet.signature}</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="font-serif-display italic font-normal leading-[0.98] tracking-[-0.01em] text-foreground" style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}>
            <span className="block">{projet.tagline.haut}</span>
            <span className="block pl-[10vw]" style={{ color: "var(--gold)" }}>{projet.tagline.milieu}</span>
            <span className="block pl-[4vw]">{projet.tagline.bas}</span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-14 grid sm:grid-cols-[1fr_auto] gap-6 items-end">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-foreground/55 mb-2">{tK("page.sectionI.clientLabel")}</p>
              <p className="text-xl sm:text-2xl font-serif-display font-normal text-foreground tracking-tight">{projet.client}</p>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-serif-display italic font-normal" style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)", color: "var(--gold)", lineHeight: 1 }}>7</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 pb-2 whitespace-pre-line">{tK("page.sectionI.sevenLabel")}</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-16 sm:mt-20 relative">
            <PlateImage ratio="aspect-[16/8]" label={tK("page.figCaption.heroShot")} />
            <div className="absolute -bottom-8 left-4 sm:left-12 max-w-md hidden md:block">
              <p className="font-serif-display italic font-normal text-base text-foreground/85 leading-snug pl-6 border-l border-foreground/15 bg-background/85 backdrop-blur-sm py-3 pr-4">
                {tK("page.heroQuote")}
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* GRANDE CITATION DU CLIENT */}
      <section className="max-w-5xl mx-auto px-6 lg:px-12 mb-32 sm:mb-40 relative z-10">
        <Reveal>
          <div className="relative">
            <Quote size={56} className="absolute -top-4 -left-2 sm:-left-8 opacity-30" style={{ color: "var(--gold)" }} strokeWidth={1} />
            <blockquote className="font-serif-display italic font-normal text-foreground/92 pl-10 sm:pl-16" style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)", lineHeight: 1.3 }}>
              {projet.citation}
            </blockquote>
            <p className="mt-6 pl-10 sm:pl-16 text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/45">{projet.citationAuteur}</p>
          </div>
        </Reveal>
      </section>

      {/* SECTION II — TROIS PILIERS */}
      <section id="section-ii" className="max-w-[1280px] mx-auto px-6 lg:px-12 mb-32 sm:mb-40 relative z-10">
        <div className="relative mb-20">
          <span aria-hidden className="absolute -top-6 -left-2 font-serif-display italic font-normal pointer-events-none select-none"
            style={{ fontSize: "clamp(7rem, 16vw, 14rem)", lineHeight: 0.85, color: "var(--foreground)", opacity: 0.04 }}>II</span>
          <Reveal>
            <Eyebrow color="var(--mauve)">{tK("page.sectionII.eyebrow")}</Eyebrow>
            <h2 className="font-serif-display italic font-normal mt-5 max-w-3xl tracking-tight text-foreground leading-[1.05]"
              style={{ fontSize: "clamp(1.85rem, 4vw, 3.25rem)" }}>
              {tK("page.sectionII.titlePart1")}
              <span style={{ color: "var(--mauve)" }}> {tK("page.sectionII.titlePart2")} </span>
              {tK("page.sectionII.titlePart3")}
            </h2>
            <p className="mt-6 max-w-xl text-base text-foreground/72 leading-relaxed">{tK("page.sectionII.subtitle")}</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12 lg:gap-x-10">
          {piliers.map((p, i) => {
            const meta = PILIER_META[i];
            const Ico = meta.ico;
            return (
              <Reveal key={p.n} delay={0.1 + i * 0.08}>
                <article className={`relative pt-10 px-6 pb-8 border-t border-foreground/12 ${meta.offset}`} style={{ background: meta.bg }}>
                  <span aria-hidden className="absolute top-3 right-4 font-serif-display italic font-normal select-none pointer-events-none"
                    style={{ fontSize: "4.5rem", lineHeight: 1, color: meta.tint, opacity: 0.18 }}>{p.n}</span>
                  <Ico size={20} strokeWidth={1.5} style={{ color: meta.tint }} className="mb-6" />
                  <p className="text-[10px] font-mono uppercase tracking-[0.4em] mb-3" style={{ color: meta.tint }}>{p.eyebrow}</p>
                  <h3 className="font-serif-display italic font-normal text-foreground leading-[1.12] tracking-tight whitespace-pre-line mb-5"
                    style={{ fontSize: "clamp(1.25rem, 1.7vw, 1.6rem)" }}>{p.titre}</h3>
                  <p className="text-sm text-foreground/72 leading-relaxed">{p.texte}</p>
                  <PlateImage ratio="aspect-[5/3]" label={`Fig.0${i + 2}`} className="mt-8" />
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* IMAGE PLEINE LARGEUR — coupure magazine */}
      <section id="section-iii" className="mb-32 sm:mb-40 relative z-10">
        <Reveal>
          <div className="relative">
            <PlateImage ratio="aspect-[21/9]" label={tK("page.figCaption.cellar")} />
            <div className="max-w-[1280px] mx-auto px-6 lg:px-12 mt-6">
              <p className="font-serif-display italic font-normal text-foreground/55 max-w-2xl" style={{ fontSize: "clamp(1rem, 1.4vw, 1.25rem)" }}>
                {tK("page.sectionIII.caption")}
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SECTION IV — CÔTÉ TECHNIQUE */}
      <section id="section-iv" className="max-w-[1280px] mx-auto px-6 lg:px-12 mb-32 sm:mb-40 relative z-10">
        <div className="relative mb-20">
          <span aria-hidden className="absolute -top-6 -left-2 font-serif-display italic font-normal pointer-events-none select-none"
            style={{ fontSize: "clamp(7rem, 16vw, 14rem)", lineHeight: 0.85, color: "var(--foreground)", opacity: 0.04 }}>IV</span>
          <Reveal>
            <Eyebrow color="var(--lavender)">{tK("page.sectionIV.eyebrow")}</Eyebrow>
            <h2 className="font-serif-display italic font-normal mt-5 max-w-3xl tracking-tight text-foreground leading-[1.05]"
              style={{ fontSize: "clamp(1.85rem, 4vw, 3.25rem)" }}>
              {tK("page.sectionIV.titlePart1")}
              <span style={{ color: "var(--lavender)" }}> {tK("page.sectionIV.titlePart2")}</span>.
            </h2>
            <p className="mt-6 max-w-2xl text-base text-foreground/72 leading-relaxed">{tK("page.sectionIV.subtitle")}</p>
          </Reveal>
        </div>

        <div className="space-y-0">
          {challenges.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.05}>
              <article className="group grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-12 py-10 border-t border-foreground/10">
                <div className="space-y-3">
                  <span className="font-serif-display italic font-normal block" style={{ fontSize: "clamp(2.25rem, 3.5vw, 3rem)", lineHeight: 0.9, color: CHALLENGE_ACCENTS[i % CHALLENGE_ACCENTS.length] }}>{c.n}</span>
                  <h3 className="font-serif-display font-normal text-foreground tracking-tight leading-[1.15]" style={{ fontSize: "clamp(1.2rem, 1.6vw, 1.5rem)" }}>{c.titre}</h3>
                </div>
                <div className="md:pt-6">
                  <p className="text-[15px] text-foreground/82 leading-[1.65]">{c.extrait}</p>
                  <div className="mt-5 h-px w-12 transition-all duration-500 group-hover:w-32" style={{ background: CHALLENGE_ACCENTS[i % CHALLENGE_ACCENTS.length], opacity: 0.6 }} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SECTION V — STACK */}
      <section id="section-v" className="max-w-[1280px] mx-auto px-6 lg:px-12 mb-32 sm:mb-40 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <Eyebrow color="var(--gold)">{tK("page.sectionV.eyebrow")}</Eyebrow>
              <h2 className="font-serif-display italic font-normal mt-5 tracking-tight text-foreground leading-[1.05]" style={{ fontSize: "clamp(1.85rem, 3.5vw, 2.85rem)" }}>
                {tK("page.sectionV.titlePart1")}
                <br />{tK("page.sectionV.titlePart2")}
                <br /><span style={{ color: "var(--gold)" }}>{tK("page.sectionV.titlePart3")}</span>
              </h2>
              <p className="mt-6 text-sm text-foreground/65 leading-relaxed max-w-sm">{tK("page.sectionV.subtitle")}</p>
            </div>
          </Reveal>
          <div>
            {stack.map((s, i) => (
              <Reveal key={s.nom} delay={i * 0.04}>
                <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-6 py-5 border-t border-foreground/10">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 w-8">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-serif-display font-normal text-foreground" style={{ fontSize: "clamp(1.15rem, 1.5vw, 1.4rem)" }}>{s.nom}</span>
                  <span className="text-xs text-foreground/55 text-right max-w-[18rem] leading-snug">{s.role}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION VI — COLOPHON / CRÉDITS */}
      <section id="section-vi" className="max-w-[1280px] mx-auto px-6 lg:px-12 mb-24 relative z-10">
        <Reveal>
          <div className="grid md:grid-cols-2 gap-16 pt-20 border-t border-foreground/15">
            <div>
              <Eyebrow color="var(--mauve)">{tK("page.sectionVI.eyebrow")}</Eyebrow>
              <p className="font-serif-display italic font-normal mt-6 text-foreground/85 leading-snug" style={{ fontSize: "clamp(1.15rem, 1.5vw, 1.4rem)" }}>
                {tK("page.sectionVI.colophon")}
              </p>
              <a href={`https://${projet.url}`} target="_blank" rel="noopener noreferrer"
                className="group mt-10 inline-flex items-baseline gap-3 cursor-pointer">
                <span className="font-serif-display italic font-normal underline underline-offset-[6px] decoration-1"
                  style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--gold)", textDecorationColor: "color-mix(in oklab, var(--gold) 50%, transparent)" }}>
                  {projet.url}
                </span>
                <ExternalLink size={18} className="text-foreground/55 group-hover:text-foreground transition-colors" />
              </a>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-foreground/55 mb-6">{t("contributed")}</p>
              <ul className="space-y-4">
                {credits.map((c) => (
                  <li key={c.role + c.nom} className="grid grid-cols-[1fr_1.5fr] gap-4 items-baseline pb-4 border-b border-foreground/8">
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-foreground/45">{c.role}</span>
                    <span className="font-serif-display font-normal text-foreground tracking-tight">{c.nom}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* PROJET SUIVANT — inline simple */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">
        <Reveal>
          <Link href="/projets" className="group flex items-center justify-between pt-8 border-t border-foreground/15 cursor-pointer">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-foreground/55 mb-2">{t("readingNext")}</p>
              <p className="font-serif-display italic font-normal text-foreground group-hover:translate-x-1 transition-transform"
                style={{ fontSize: "clamp(1.35rem, 2vw, 1.85rem)" }}>
                {t("allProjects")}
              </p>
            </div>
            <ArrowRight className="w-7 h-7 text-foreground/55 group-hover:text-foreground group-hover:translate-x-2 transition-all" strokeWidth={1.25} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
