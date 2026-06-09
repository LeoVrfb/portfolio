/* ──────────────────────────────────────────────────────────────────────────
   PAGE PROJET — Aéroports de Paris / Extime — Sweetime Factory
   ────────────────────────────────────────────────────────────────────────── */

import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { preload } from "react-dom";
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react";
import { hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { projets } from "@/lib/projets";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildProjetSchemas } from "@/lib/seo/projet-schemas";
import { JsonLd } from "@/components/seo/json-ld";
import { Reveal } from "../_components/reveal";

const SLUG = "sweetime-adp-extime";

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

type Props = { params: Promise<{ locale: string }> };

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const projet = projets.find((p) => p.slug === SLUG)!;
  const tProjet = await getTranslations({ locale, namespace: "projetsData" });
  return buildPageMetadata({
    title: `${projet.client} — Étude de cas`,
    description: tProjet(`${SLUG}.description`),
    pathname: `/projets/${SLUG}`,
    locale: locale as Locale,
    ogType: "article",
  });
}

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
      return <em key={i} className="font-serif-display italic font-normal" style={{ color: "var(--gold)" }}>{part.slice(1, -1)}</em>;
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const external = /^https?:/.test(href);
      return (
        <a key={i} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="font-semibold underline underline-offset-4 decoration-[1.5px] transition-colors cursor-pointer"
          style={{ color: "var(--gold)", textDecorationColor: "color-mix(in oklab, var(--gold) 50%, transparent)" }}>
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

export default async function SweetimeAdpExtimePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return null;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("projetContent");
  const tProjet = await getTranslations("projetsData");

  const projet = projets.find((p) => p.slug === SLUG)!;
  const idx = projets.findIndex((p) => p.slug === SLUG);
  const nextProjet = projets[(idx + 1) % projets.length];
  const prevProjet = projets[(idx - 1 + projets.length) % projets.length];
  const year = projet.date.split("-")[0];

  const challenges = tProjet.raw(`${SLUG}.challenges`) as { titre: string; solution: string }[];
  const credits = tProjet.raw(`${SLUG}.credits`) as { nom: string; role: string }[];
  const stackDetail = tProjet.raw(`${SLUG}.stackDetail`) as { nom: string; role: string }[];
  const descriptionPublic = tProjet(`${SLUG}.descriptionPublic`);
  const resultats = tProjet(`${SLUG}.resultats`);
  const projetTitre = tProjet(`${SLUG}.titre`);
  const projetDescription = tProjet(`${SLUG}.description`);
  const pageSchemas = buildProjetSchemas({
    projet,
    locale: locale as Locale,
    titre: projetTitre,
    description: projetDescription,
  });
  const projetIntro = tProjet(`${SLUG}.intro`);
  const funnelImages = projet.sliderSets?.[0]?.images ?? [];
  const funnelDescription = (tProjet.raw(`${SLUG}.sliderSets`) as { title: string; description: string }[])?.[0]?.description;
  const operationNumbers = tProjet.raw(`${SLUG}.page.operationNumbers`) as { label: string; stats: { value: string; label: string }[] };
  const funnelSteps = tProjet.raw(`${SLUG}.page.funnelSteps`) as { num: string; label: string }[];

  if (projet.video) preload(projet.video, { as: "video" });

  return (
    <div className="pt-28 pb-28">
      <JsonLd data={pageSchemas} />

      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 mb-12">
        <Reveal duration={0.4} y={8}>
          <div className="mb-10">
            <Link href="/projets" className="inline-flex items-center gap-2 text-sm text-foreground/55 hover:text-foreground transition-colors cursor-pointer">
              <ArrowLeft size={14} />
              {t("backToAll")}
            </Link>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-start">
          <Reveal duration={0.55} y={18}>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/55 border border-white/12 rounded-full px-3 py-1">
                {t("badge.agenceArtefact3000")}
              </span>
              <span className="text-[11px] text-foreground/55 font-mono">{year}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.02em] text-foreground leading-[1.05] mb-3">
              {projet.clientShort ?? projet.client}
            </h1>

            <div className="sm:hidden mb-5 space-y-2.5">
              <div className="flex flex-wrap gap-1.5">
                {projet.tags.map((tag, ti) => (
                  <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                    style={{ color: TAG_COLORS[ti % TAG_COLORS.length].color, background: TAG_COLORS[ti % TAG_COLORS.length].bg, borderColor: TAG_COLORS[ti % TAG_COLORS.length].color, opacity: 0.9 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm uppercase tracking-widest mb-5" style={{ color: "var(--gold)" }}>{projetTitre}</p>
            <p className="text-base text-foreground/88 leading-relaxed max-w-xl">{renderHighlight(projetIntro)}</p>
          </Reveal>

          <Reveal duration={0.55} y={18} delay={0.12} className="space-y-3 lg:pt-2 hidden sm:block">
            <div className="p-5 rounded-xl border border-border space-y-4"
              style={{ background: "linear-gradient(135deg, hsl(47 72% 73% / 0.05) 0%, hsl(var(--card)) 60%)" }}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-2 font-semibold" style={{ color: "var(--gold)" }}>{t("meta.client")}</p>
                <p className="text-sm font-semibold text-foreground">{projet.client}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-1.5 font-semibold" style={{ color: "var(--gold)" }}>{t("meta.context")}</p>
                <div className="flex items-center gap-1.5 text-sm text-foreground/88">
                  <Briefcase size={11} className="text-(--mauve)" />
                  <span>{t("context.agenceSimple")}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-1.5 font-semibold" style={{ color: "var(--gold)" }}>{t("meta.year")}</p>
                <p className="text-sm font-semibold text-foreground/85">{year}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-2 font-semibold" style={{ color: "var(--gold)" }}>{t("meta.stack")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {projet.tags.map((tag, ti) => (
                    <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                      style={{ color: TAG_COLORS[ti % TAG_COLORS.length].color, background: TAG_COLORS[ti % TAG_COLORS.length].bg, borderColor: TAG_COLORS[ti % TAG_COLORS.length].color, opacity: 0.9 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 space-y-24 sm:space-y-32">

        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(47 72% 73% / 0.3) 40%, hsl(284 24% 70% / 0.2) 60%, transparent)" }} />

        {/* 01 — VUE D'ENSEMBLE */}
        <section className="space-y-10 lg:space-y-12">
          <Reveal>
            <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
              <div className="flex items-center gap-3 lg:block lg:pt-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--gold)" }}>{t("section.overview")}</span>
                <span className="font-black leading-none lg:block lg:mt-2" style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", color: "var(--gold)", opacity: 0.95 }}>01</span>
              </div>
              <div className="max-w-3xl">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
                  {tProjet(`${SLUG}.page.section01.titlePart1`)}
                  {" "}
                  <em className="font-serif-display italic font-normal" style={{ color: "var(--gold)" }}>
                    {tProjet(`${SLUG}.page.section01.titlePart2`)}
                  </em>
                  .
                </h2>
                <p className="mt-5 text-base text-foreground/72 leading-relaxed">
                  {tProjet(`${SLUG}.page.section01.subtitle`)}
                </p>
              </div>
            </header>
          </Reveal>

          {projet.video && (
            <Reveal delay={0.08} y={20} duration={0.65}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                <figure className="lg:col-span-5 mx-auto lg:mx-0 w-full max-w-[400px] lg:max-w-none lg:w-full">
                  <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-[0_32px_80px_-8px_rgba(0,0,0,0.6)]">
                    <video src={projet.video} autoPlay muted loop playsInline preload="auto" className="block w-full h-auto" />
                  </div>
                  <figcaption className="mt-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.32em] text-foreground/55">
                    <span>Fig.01 — {tProjet(`${SLUG}.page.figCaption.video`)}</span>
                    <span>Canvas</span>
                  </figcaption>
                </figure>

                <div className="lg:col-span-7 lg:pt-2 space-y-10">
                  {descriptionPublic && <div>{renderParagraphs(descriptionPublic)}</div>}
                  <div className="pt-8 border-t border-foreground/10">
                    <p className="text-[10px] font-mono uppercase tracking-[0.32em] text-foreground/55 mb-6">
                      {operationNumbers.label}
                    </p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-7">
                      {operationNumbers.stats.map((stat, i) => {
                        const colors = ["var(--gold)", "var(--lavender)", "var(--accent)", "var(--mauve)"];
                        const color = colors[i % colors.length];
                        return (
                          <div key={i} className="border-l-2 pl-4" style={{ borderColor: color }}>
                            <p className="font-black leading-none mb-2" style={{ fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)", color }}>{stat.value}</p>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/55 leading-snug">{stat.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </section>

        {/* 02 — LE PARCOURS EN QUATRE ÉTAPES */}
        {funnelImages.length > 0 && (
          <section className="space-y-10 lg:space-y-12">
            <Reveal>
              <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
                <div className="flex items-center gap-3 lg:block lg:pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--lavender)" }}>{t("section.section")}</span>
                  <span className="font-black leading-none lg:block lg:mt-2" style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", color: "var(--lavender)", opacity: 0.95 }}>02</span>
                </div>
                <div className="max-w-2xl">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.01em] text-foreground leading-[1.1]">
                    {tProjet(`${SLUG}.page.section02.titlePart1`)}
                    {" "}
                    <em className="font-serif-display italic font-normal" style={{ color: "var(--lavender)" }}>
                      {tProjet(`${SLUG}.page.section02.titlePart2`)}
                    </em>
                    .
                  </h3>
                  {funnelDescription && (
                    <p className="mt-4 text-base text-foreground/85 leading-relaxed">{renderHighlight(funnelDescription)}</p>
                  )}
                </div>
              </header>
            </Reveal>

            <Reveal delay={0.08} y={20} duration={0.65}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
                {funnelImages.map((src, i) => {
                  const step = funnelSteps[i] ?? { num: String(i + 1).padStart(2, "0"), label: "" };
                  return (
                    <Reveal key={src} delay={0.05 + i * 0.06} y={14} duration={0.5}>
                      <figure className="space-y-3">
                        <div className="flex items-baseline gap-3">
                          <span className="font-black leading-none" style={{ fontSize: "clamp(1.25rem, 2vw, 1.6rem)", color: "var(--lavender)", opacity: 0.9 }}>{step.num}</span>
                          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-foreground/70 leading-tight">{step.label}</span>
                        </div>
                        <div className="relative rounded-xl overflow-hidden border border-border/60 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)]">
                          <Image src={src} alt={`${projetTitre} — ${step.num} ${step.label}`} width={1080} height={1920} className="block w-full h-auto" sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 240px" />
                        </div>
                        <div className="h-px w-full" style={{ background: `linear-gradient(90deg, var(--lavender) 0%, var(--lavender) ${((i + 1) / funnelImages.length) * 100}%, transparent ${((i + 1) / funnelImages.length) * 100}%)`, opacity: 0.45 }} />
                      </figure>
                    </Reveal>
                  );
                })}
              </div>
            </Reveal>
          </section>
        )}

        {/* 03 — CÔTÉ TECHNIQUE */}
        {challenges.length > 0 && (
          <section className="space-y-10 lg:space-y-12">
            <Reveal>
              <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
                <div className="flex items-center gap-3 lg:block lg:pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--accent)" }}>{t("section.technical")}</span>
                  <span className="font-black leading-none lg:block lg:mt-2" style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", color: "var(--accent)", opacity: 0.95 }}>03</span>
                </div>
                <div className="max-w-2xl">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
                    {tProjet(`${SLUG}.page.section03.titlePart1`)}
                    {" "}
                    <em className="font-serif-display italic font-normal" style={{ color: "var(--accent)" }}>
                      {tProjet(`${SLUG}.page.section03.titlePart2`)}
                    </em>
                    .
                  </h2>
                  <p className="mt-5 text-base text-foreground/72 leading-relaxed">
                    {tProjet(`${SLUG}.page.section03.subtitle`)}
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
                        <span className="block font-black leading-none" style={{ fontSize: "clamp(2rem, 3vw, 2.75rem)", color: accent, opacity: 0.85 }}>{num}</span>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight leading-snug">{ch.titre}</h3>
                      </div>
                      <div className="md:pt-3">
                        <p className="text-[15px] text-foreground/82 leading-[1.7] max-w-2xl">{renderHighlight(ch.solution)}</p>
                        <div className="mt-5 h-px w-12 transition-all duration-500 group-hover:w-32" style={{ background: accent, opacity: 0.6 }} />
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}

        {/* 04 — STACK */}
        <section className="space-y-10">
          <Reveal>
            <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
              <div className="flex items-center gap-3 lg:block lg:pt-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--gold)" }}>{t("section.stack")}</span>
                <span className="font-black leading-none lg:block lg:mt-2" style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", color: "var(--gold)", opacity: 0.95 }}>04</span>
              </div>
              <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
                  {tProjet(`${SLUG}.page.section04.titlePart1`)}
                  {" "}
                  <em className="font-serif-display italic font-normal" style={{ color: "var(--gold)" }}>
                    {tProjet(`${SLUG}.page.section04.titlePart2`)}
                  </em>
                  {" "}
                  {tProjet(`${SLUG}.page.section04.titlePart3`)}
                </h2>
              </div>
            </header>
          </Reveal>
          <Reveal delay={0.06}>
            <div>
              {stackDetail.map((s, i) => (
                <div key={s.nom} className="grid grid-cols-[auto_1fr_auto] items-baseline gap-4 sm:gap-6 py-4 border-t border-foreground/10 last:border-b last:border-foreground/10">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 w-8">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-base sm:text-lg font-bold text-foreground">{s.nom}</span>
                  <span className="text-xs text-foreground/55 text-right max-w-[22rem] leading-snug">{s.role}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* 05 — ÉQUIPE */}
        {credits.length > 0 && (
          <section className="space-y-10">
            <Reveal>
              <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
                <div className="flex items-center gap-3 lg:block lg:pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--mauve)" }}>{t("section.team")}</span>
                  <span className="font-black leading-none lg:block lg:mt-2" style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", color: "var(--mauve)", opacity: 0.95 }}>05</span>
                </div>
                <div className="max-w-2xl">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
                    {tProjet(`${SLUG}.page.section05.titlePart1`)}
                    {" "}
                    <em className="font-serif-display italic font-normal" style={{ color: "var(--mauve)" }}>
                      {tProjet(`${SLUG}.page.section05.titlePart2`)}
                    </em>
                    .
                  </h2>
                  <p className="mt-5 text-base text-foreground/72 leading-relaxed">
                    {tProjet(`${SLUG}.page.section05.subtitle`)}
                  </p>
                </div>
              </header>
            </Reveal>
            <Reveal delay={0.06}>
              <div>
                {credits.map((c, i) => (
                  <div key={c.nom} className="grid grid-cols-[auto_1fr_auto] items-baseline gap-4 sm:gap-6 py-4 border-t border-foreground/10 last:border-b last:border-foreground/10">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 w-8">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-base sm:text-lg font-bold text-foreground">{c.nom}</span>
                    <span className="text-xs text-foreground/55 text-right max-w-[24rem] leading-snug">{c.role}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>
        )}

        {/* 06 — APRÈS L'OPÉRATION */}
        {resultats && (
          <section className="space-y-10">
            <Reveal>
              <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
                <div className="flex items-center gap-3 lg:block lg:pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--lavender)" }}>{t("section.afterOperation")}</span>
                  <span className="font-black leading-none lg:block lg:mt-2" style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", color: "var(--lavender)", opacity: 0.95 }}>06</span>
                </div>
                <div className="max-w-2xl">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
                    {tProjet(`${SLUG}.page.section06.titlePart1`)}
                    {" "}
                    <em className="font-serif-display italic font-normal" style={{ color: "var(--lavender)" }}>
                      {tProjet(`${SLUG}.page.section06.titlePart2`)}
                    </em>
                    .
                  </h2>
                </div>
              </header>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12">
                <div aria-hidden className="hidden lg:block" />
                <div className="rounded-2xl border p-7 lg:p-9 max-w-3xl"
                  style={{ background: "linear-gradient(135deg, hsl(284 24% 70% / 0.06) 0%, hsl(var(--card)) 60%)", borderColor: "hsl(284 24% 70% / 0.25)" }}>
                  <p className="text-base text-foreground/88 leading-relaxed">{renderHighlight(resultats)}</p>
                </div>
              </div>
            </Reveal>
          </section>
        )}

        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(47 72% 73% / 0.3) 40%, hsl(284 24% 70% / 0.2) 60%, transparent)" }} />

        {/* CTA Services */}
        <Reveal>
          <div className="relative rounded-2xl overflow-hidden px-7 py-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8"
            style={{ background: "hsl(47 72% 73% / 0.05)", border: "1px solid hsl(47 72% 73% / 0.2)" }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "var(--gold)" }} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-2" style={{ color: "var(--gold)" }}>
                {tProjet(`${SLUG}.page.cta.eyebrow`)}
              </p>
              <p className="text-base font-bold text-foreground leading-snug">{tProjet(`${SLUG}.page.cta.title`)}</p>
              <p className="text-sm text-foreground/50 mt-1.5 leading-relaxed">{tProjet(`${SLUG}.page.cta.description`)}</p>
            </div>
            <Link href="/services" className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer"
              style={{ background: "var(--gold)", color: "hsl(158 24% 7%)" }}>
              {t("viewServices")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        {/* Projet suivant */}
        <Reveal delay={0.05}>
          <Link href={`/projets/${nextProjet.slug}`} className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-white/15 transition-colors cursor-pointer group">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-1.5 font-semibold" style={{ color: "var(--gold)" }}>{t("nextProject")}</p>
              <p className="text-base font-bold text-foreground group-hover:text-(--gold) transition-colors">{nextProjet.clientShort ?? nextProjet.client}</p>
              <p className="text-xs text-foreground/55 mt-0.5">{nextProjet.titre}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-foreground/25 group-hover:text-(--gold) group-hover:translate-x-1 transition-all shrink-0 ml-4" />
          </Link>
        </Reveal>
      </div>

      {/* Boutons flottants */}
      <Link href={`/projets/${prevProjet.slug}`}
        className="fixed bottom-7 left-14 z-50 hidden lg:flex items-center gap-3 pr-4 pl-3 py-3 rounded-2xl bg-card/80 backdrop-blur-md border border-white/8 hover:border-white/18 transition-all group cursor-pointer shadow-xl shadow-black/30">
        <ArrowLeft className="w-4 h-4 text-foreground/30 group-hover:text-(--gold) group-hover:-translate-x-0.5 transition-all shrink-0" />
        <div className="text-left">
          <p className="text-[9px] uppercase tracking-[0.25em] font-semibold mb-0.5" style={{ color: "var(--gold)" }}>{t("prevProject")}</p>
          <p className="text-sm font-bold text-foreground/88 group-hover:text-foreground transition-colors leading-tight">{prevProjet.clientShort ?? prevProjet.client}</p>
        </div>
      </Link>

      <Link href={`/projets/${nextProjet.slug}`}
        className="fixed bottom-7 right-14 z-50 hidden lg:flex items-center gap-3 pl-4 pr-3 py-3 rounded-2xl bg-card/80 backdrop-blur-md border border-white/8 hover:border-white/18 transition-all group cursor-pointer shadow-xl shadow-black/30">
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-[0.25em] font-semibold mb-0.5" style={{ color: "var(--gold)" }}>{t("nextProject")}</p>
          <p className="text-sm font-bold text-foreground/88 group-hover:text-foreground transition-colors leading-tight">{nextProjet.clientShort ?? nextProjet.client}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-(--gold) group-hover:translate-x-0.5 transition-all shrink-0" />
      </Link>
    </div>
  );
}
