import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { preload } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Briefcase,
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
import { projets, getProjet, type PillarIcon } from "@/lib/projets";
import { ProjetGallery } from "@/components/sections/projet-gallery";
import { ProjetImageSlider } from "@/components/sections/projet-image-slider";
import { WideVideoPlayer } from "@/components/sections/wide-video-player";
import { BaldIdentityShowcase } from "@/components/sections/bald-identity-showcase";

type Props = { params: Promise<{ slug: string }> };

const TAG_COLORS = [
  { color: "var(--lavender)", bg: "hsl(284 24% 70% / 0.12)" },
  { color: "var(--mauve)",    bg: "hsl(328 24% 61% / 0.12)" },
  { color: "var(--accent)",   bg: "hsl(163 24% 54% / 0.12)" },
];

// Mapping nom de pilier -> icône Lucide. Étendre quand un nouveau pilier en a besoin
// (et ajouter le nom dans le type `PillarIcon` côté lib/projets.ts).
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

// Couleurs des cards : on cycle entre lavender, mauve et accent pour donner du rythme
// sans tomber dans le bariolé (toutes les cards restent sur la même grammaire visuelle).
const PILLAR_COLORS = [
  { tint: "var(--accent)",   bg: "hsl(163 52% 76% / 0.08)",   border: "hsl(163 52% 76% / 0.22)" },
  { tint: "var(--lavender)", bg: "hsl(199 88% 78% / 0.08)",   border: "hsl(199 88% 78% / 0.22)" },
  { tint: "var(--gold)",     bg: "hsl(47 72% 73% / 0.08)",    border: "hsl(47 72% 73% / 0.22)" },
] as const;

const TECH_PALETTE = [
  { tint: "var(--lavender)", bg: "hsl(199 88% 78% / 0.06)" },
  { tint: "var(--gold)",     bg: "hsl(47 72% 73% / 0.06)" },
  { tint: "var(--mauve)",    bg: "hsl(295 38% 68% / 0.06)" },
  { tint: "var(--accent)",   bg: "hsl(163 52% 76% / 0.06)" },
] as const;

const AVATAR_COLORS = ["var(--accent)", "var(--lavender)", "var(--mauve)", "var(--gold)"] as const;

export async function generateStaticParams() {
  return projets.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const projet = getProjet(slug);
  if (!projet) return {};
  return {
    title: `${projet.client} — Léo Hengebaert`,
    description: projet.description,
  };
}

function renderHighlight(text: string): React.ReactNode {
  // Tous les emphases du corps de texte restent BLANCHES — seuls les titres/eyebrows portent la couleur d'accent.
  // Un retour ligne simple `\n` (sans paragraphe vide) est rendu comme <br /> pour autoriser des sauts de ligne dans une même phrase.
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
      return <em key={i} className="font-serif-display italic font-normal text-foreground">{part.slice(1, -1)}</em>;
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

type Challenge = { titre: string; solution: string };

function ClientLogo({ projet, size = "lg" }: { projet: typeof import("@/lib/projets").projets[0]; size?: "sm" | "lg" }) {
  if (projet.slug === "bald-artiste") {
    const isLg = size === "lg";
    return (
      <div
        className={`shrink-0 rounded-lg overflow-hidden bg-white flex items-center justify-center relative ${isLg ? "w-10 h-10" : "w-8 h-8"}`}
      >
        <span
          aria-hidden
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('/assets/bald/bg-logo-yellow.png')",
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0.65,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-bebas), Impact, sans-serif",
            fontSize: isLg ? 22 : 17,
            letterSpacing: "0.06em",
            lineHeight: 1,
            color: "#1A1A1A",
            position: "relative",
            zIndex: 1,
          }}
        >
          BALD
        </span>
      </div>
    );
  }
  const srcs = projet.logos ?? (projet.logo ? [projet.logo] : []);
  if (srcs.length === 0) return null;
  return (
    <>
      {srcs.map((src, i) =>
        size === "lg" ? (
          <div key={i} className="shrink-0 rounded-lg overflow-hidden bg-white px-2 py-1 flex items-center h-9">
            <img src={src} alt="" className="h-6 w-auto max-w-[80px] object-contain" />
          </div>
        ) : (
          <div key={i} className="shrink-0 rounded-md overflow-hidden bg-white px-1.5 py-0.5 flex items-center h-7">
            <img src={src} alt="" className="h-5 w-auto max-w-[64px] object-contain" />
          </div>
        )
      )}
    </>
  );
}

type Pillar = NonNullable<typeof import("@/lib/projets").projets[0]["pillarsCards"]>[number];

function PillarsSection({ pillars }: { pillars: Pillar[] }) {
  if (!pillars.length) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
      {pillars.map((p, i) => {
        const Icon = PILLAR_ICONS[p.iconName];
        const c = PILLAR_COLORS[i % PILLAR_COLORS.length];
        return (
          <div
            key={i}
            className="relative rounded-2xl overflow-hidden flex flex-col gap-5 p-7"
            style={{ background: c.bg, border: `1px solid ${c.border}` }}
          >
            {/* barre couleur top */}
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: c.tint }} />
            {/* numéro décoratif coin haut droit */}
            <span
              className="absolute top-4 right-5 font-black leading-none select-none"
              style={{ fontSize: "3.5rem", color: c.tint, opacity: 0.12 }}
              aria-hidden
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `color-mix(in oklab, ${c.tint} 18%, transparent)`, color: c.tint }}
            >
              <Icon size={24} strokeWidth={1.5} />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.35em]" style={{ color: c.tint }}>
              {p.eyebrow}
            </p>
            <h3 className="text-xl font-bold text-foreground leading-tight">{p.titre}</h3>
            <p className="text-sm text-foreground/75 leading-relaxed">{p.description}</p>
          </div>
        );
      })}
    </div>
  );
}

function TechSection({ challenges }: { challenges: Challenge[] }) {
  if (!challenges.length) return null;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-7 h-[3px] rounded-full shrink-0" style={{ background: "var(--gold)" }} />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--gold)" }}>Côté technique</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {challenges.map((ch, i) => {
          const c = TECH_PALETTE[i % TECH_PALETTE.length];
          return (
            <div
              key={i}
              className="relative rounded-xl p-5 overflow-hidden"
              style={{
                background: c.bg,
                borderLeft: `3px solid ${c.tint}`,
                border: `1px solid color-mix(in oklab, ${c.tint} 20%, transparent)`,
                borderLeftWidth: "3px",
              }}
            >
              <span
                className="absolute top-3 right-4 font-black leading-none select-none pointer-events-none"
                style={{ fontSize: "3rem", color: c.tint, opacity: 0.12 }}
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-base font-black text-foreground mb-2 pr-12">{ch.titre}</p>
              <p className="text-sm text-foreground/78 leading-relaxed">{renderHighlight(ch.solution)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function ProjetPage({ params }: Props) {
  const { slug } = await params;
  const projet = getProjet(slug);
  if (!projet) notFound();

  const idx = projets.findIndex((p) => p.slug === projet.slug);
  const nextProjet = projets[(idx + 1) % projets.length];
  const prevProjet = projets[(idx - 1 + projets.length) % projets.length];
  const year = projet.date.split("-")[0];

  // Preload des assets critiques (vidéo + image principale)
  if (projet.video) preload(projet.video, { as: "video" });
  const mainImg = projet.heroImg ?? projet.img;
  if (mainImg) preload(mainImg, { as: "image" });

  // Quand une vidéo existe ET que images[0] === img (ex: TotalEnergies), on skippe le doublon
  // Pour wideMedia (BNP), images[0] est distinct du miniature → pas de skip
  const zigzagImages = projet.video && !projet.wideMedia
    ? (projet.images?.slice(1) ?? [])
    : (projet.images ?? []);

  // Sliders wide : ratio 2:1 pour les sites web full-page (RWJ, Bald) — évite le crop des bords
  // gauche/droite qui apparaît avec aspect-video (16:9). Pour les mockups 16:9 (vidéo BNP),
  // on garde aspect-video.
  const wideAspectRatio = projet.video ? "aspect-video" : "aspect-[2/1]";

  // Interleave challenges entre BLOC 2 et BLOC 3 pour les projets portrait avec assez d'images
  const interleaveZigzag =
    !projet.wideMedia &&
    !projet.sliderSets &&
    zigzagImages.length >= 5 &&
    (projet.challenges?.length ?? 0) > 0;

  return (
    <div className="pt-28 pb-28">

      {/* ── HEADER — légèrement plus large que le contenu ── */}
      <div className="max-w-5xl mx-auto px-6 lg:px-10 mb-8">
        {/* Back */}
        <div className="mb-10">
          <Link
            href="/projets"
            className="inline-flex items-center gap-2 text-sm text-foreground/35 hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            Tous les projets
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-12 items-start">

          {/* Gauche : titre + intro */}
          <div>
            {/* Client */}
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight mb-3">
              {projet.client}
            </h1>

            {/* Mobile only — logos + contexte + année + stack (remplace la carte) */}
            <div className="sm:hidden mb-5 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <ClientLogo projet={projet} size="sm" />
                <span className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 bg-white/4 text-foreground/55">
                  {projet.contexte === "agence" ? "Mission studio · Artefact 3000"
                    : projet.contexte === "freelance" ? "Projet freelance"
                    : "Projet personnel"}
                </span>
                <span className="text-[11px] text-foreground/40 font-mono">{year}</span>
              </div>
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

            {/* Titre app */}
            <p className="text-sm uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>
              {projet.titre}
            </p>

            {/* Intro */}
            <p className="text-base text-foreground/88 leading-relaxed max-w-xl">
              {renderHighlight(projet.intro)}
            </p>
          </div>

          {/* Droite : meta card — tablette et desktop seulement */}
          <div className="space-y-3 lg:pt-2 hidden sm:block">
            <div className="p-5 rounded-xl border border-border space-y-4" style={{ background: "linear-gradient(135deg, hsl(163 52% 76% / 0.05) 0%, hsl(var(--card)) 60%)" }}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-2 font-semibold" style={{ color: "var(--accent)" }}>Client</p>
                <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                  <ClientLogo projet={projet} size="lg" />
                </div>
                <p className="text-sm font-semibold text-foreground">{projet.client}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-1.5 font-semibold" style={{ color: "var(--accent)" }}>Contexte</p>
                <div className="flex items-center gap-1.5 text-sm text-foreground/88">
                  {projet.contexte === "agence" ? (
                    <><Briefcase size={11} className="text-(--lavender)" /><span>Mission studio · Artefact 3000</span></>
                  ) : projet.contexte === "freelance" ? (
                    <><User size={11} className="text-(--mauve)" /><span>Projet freelance</span></>
                  ) : (
                    <><User size={11} className="text-zinc-500" /><span>Projet personnel</span></>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-1.5 font-semibold" style={{ color: "var(--accent)" }}>Année</p>
                <p className="text-sm font-semibold text-foreground/85">{year}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-2 font-semibold" style={{ color: "var(--accent)" }}>Stack</p>
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
                <ExternalLink size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENU PRINCIPAL — même container ── */}
      <div className="max-w-4xl mx-auto px-6 lg:px-10 space-y-16 sm:space-y-24">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(163 52% 76% / 0.3) 40%, hsl(199 88% 78% / 0.2) 60%, transparent)" }} />

        {/* BLOC 1 — Paysage (wideMedia) : vidéo/image pleine largeur, texte en dessous
                    Portrait : vidéo/image à gauche, texte à droite */}
        {(projet.video || projet.img || projet.descriptionPublic) && (
          <div className="space-y-5">
            {(projet.video || projet.img) && projet.videoTitle && (
              <div className="text-center space-y-1">
                {projet.sliderSets && projet.sliderSets.length > 0 && (
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--accent)" }}>01 —</p>
                )}
                <p className="text-sm font-bold uppercase tracking-[0.25em]" style={{ color: "var(--accent)" }}>{projet.videoTitle}</p>
              </div>
            )}

            {/* Tagline éditoriale (avant le hero) — uniquement quand le projet la définit explicitement.
                Donne le rythme de la page : eyebrow numéroté + grande punch line serif (style /services/standard). */}
            {projet.tagline && (
              <div className="max-w-3xl pb-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "var(--accent)" }}>
                  {projet.sliderSets && projet.sliderSets.length > 0 ? "01 — Vue d'ensemble" : "Vue d'ensemble"}
                </p>
                <p className="text-4xl sm:text-5xl lg:text-7xl font-serif-display font-normal leading-[1.08] tracking-tight text-foreground">
                  {renderHighlight(projet.tagline)}
                </p>
              </div>
            )}

            {projet.wideMedia ? (
              /* ── Paysage : empilé ── */
              <>
                {projet.video ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border/60 shadow-[0_32px_80px_-8px_rgba(0,0,0,0.6)]">
                    <WideVideoPlayer
                      src={projet.video}
                      loopStart={projet.videoLoopStart}
                      loopEnd={projet.videoLoopEnd}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : mainImg ? (
                  /* Image fixe : pas d'aspect-ratio forcé — on respecte le ratio natif de l'image (sinon le hero d'un site web non 16:9 se fait crop sur les côtés) */
                  <div className="relative w-full rounded-xl overflow-hidden border border-border/60 shadow-[0_32px_80px_-8px_rgba(0,0,0,0.6)]">
                    <Image
                      src={mainImg}
                      alt={projet.titre}
                      width={2400}
                      height={1200}
                      className="w-full h-auto block"
                      priority
                      sizes="100vw"
                    />
                  </div>
                ) : null}
                {projet.descriptionPublic && (
                  <div className="max-w-2xl pt-2">
                    {renderParagraphs(projet.descriptionPublic)}
                  </div>
                )}
              </>
            ) : (
              /* ── Portrait : vidéo à gauche, texte à droite ── */
              <div className="flex flex-col md:grid md:grid-cols-[auto_1fr] gap-8 md:gap-10 items-center md:items-start">
                {(projet.video || projet.img) && (
                  <div className="mx-auto md:mx-0">
                    {projet.video ? (
                      <video src={projet.video} autoPlay muted loop playsInline preload="auto" className="rounded-xl border border-border/60 max-h-[520px] w-auto shadow-[0_32px_80px_-8px_rgba(0,0,0,0.6)]" />
                    ) : (
                      <div className="relative rounded-xl overflow-hidden border border-border/60 shadow-[0_32px_80px_-8px_rgba(0,0,0,0.6)]">
                        <Image src={projet.img!} alt={projet.titre} width={400} height={800} className="w-auto max-h-[520px] object-contain" priority />
                      </div>
                    )}
                  </div>
                )}
                {projet.descriptionPublic && (
                  <div className="pt-1">
                    {renderParagraphs(projet.descriptionPublic)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Piliers — 3 cards visuelles avec icônes Lucide. Quand `pillarsCards` est défini,
            il remplace `pointsCles` (les deux sont la même chose conceptuellement). */}
        {projet.pillarsCards && projet.pillarsCards.length > 0 ? (
          <PillarsSection pillars={projet.pillarsCards} />
        ) : projet.pointsCles && projet.pointsCles.length > 0 && (
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold uppercase tracking-wider text-foreground mb-5">
              {projet.pointsCles.map((g) => g.label).join(" · ")}
            </p>
            <ul className="flex flex-col gap-2.5">
              {projet.pointsCles.flatMap((group) => group.items).map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80 leading-relaxed text-left">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-[7px]" style={{ background: "var(--accent)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Points clés simples (projets sans groupes) */}
        {!projet.pointsCles && projet.caracteristiques && projet.caracteristiques.length > 0 && (
          <ul className="flex flex-col gap-3">
            {projet.caracteristiques.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-[7px]" style={{ background: "var(--accent)" }} />
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* BLOC 2 — Wide media : slider full-width 16:9 / Portrait : zigzag classique */}
        {projet.wideMedia && zigzagImages.length > 0 ? (
          <div className="space-y-4">
            <ProjetImageSlider
              images={zigzagImages}
              alt={projet.titre}
              wide
              aspectRatio={wideAspectRatio}
            />
          </div>
        ) : zigzagImages.length >= 3 ? (
          <div className="flex flex-col-reverse md:grid md:grid-cols-[1fr_auto] gap-8 md:gap-10 items-center">
            <div>
              {(projet.imageCaptions?.[0] ?? projet.descriptionPublic) && renderParagraphs(projet.imageCaptions?.[0] ?? projet.descriptionPublic ?? "")}
            </div>
            <ProjetImageSlider
              images={zigzagImages.slice(0, zigzagImages.length >= 5 ? -2 : -1)}
              alt={projet.titre}
            />
          </div>
        ) : zigzagImages.length === 2 ? (
          <div className="flex flex-col-reverse md:grid md:grid-cols-[1fr_380px] gap-8 items-start">
            <div>
              {(projet.imageCaptions?.[0] ?? projet.descriptionPublic) && renderParagraphs(projet.imageCaptions?.[0] ?? projet.descriptionPublic ?? "")}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Image
                src={zigzagImages[0]}
                alt={`${projet.titre} — vue 1`}
                width={540}
                height={960}
                className="rounded-xl w-full h-auto relative z-10 block"
                quality={90}
              />
              <Image
                src={zigzagImages[1]}
                alt={`${projet.titre} — vue 2`}
                width={540}
                height={960}
                className="rounded-xl w-full h-auto relative z-10 block mt-8"
                quality={90}
              />
            </div>
          </div>
        ) : zigzagImages.length === 1 ? (
          <div className="flex flex-col-reverse md:grid md:grid-cols-[1fr_180px] gap-8 items-start">
            <div>
              {(projet.imageCaptions?.[0] ?? projet.descriptionPublic) && renderParagraphs(projet.imageCaptions?.[0] ?? projet.descriptionPublic ?? "")}
            </div>
            <Image
              src={zigzagImages[0]}
              alt={`${projet.titre} — vue 1`}
              width={540}
              height={960}
              className="rounded-xl w-full h-auto md:-mt-6 relative z-10 mx-auto md:mx-0 block"
              quality={90}
            />
          </div>
        ) : null}

        {/* Côté technique — entre BLOC 2 et BLOC 3 (projets portrait avec zigzagImages >= 5) */}
        {interleaveZigzag && projet.challenges && (
          <TechSection challenges={projet.challenges.slice(0, 2)} />
        )}

        {/* BLOC 3 — Portrait seulement : Slider (FR + EN) ou image seule / Texte DROITE */}
        {!projet.wideMedia && zigzagImages.length >= 3 && (() => {
          const bloc3Images = zigzagImages.length >= 5
            ? zigzagImages.slice(-2)
            : [zigzagImages[zigzagImages.length - 1]];
          return (
            <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">
              <ProjetImageSlider
                images={bloc3Images}
                alt={projet.titre}
              />
              <div>
                {(projet.imageCaptions?.[1] ?? projet.descriptionTech) && renderParagraphs(projet.imageCaptions?.[1] ?? projet.descriptionTech ?? "")}
              </div>
            </div>
          );
        })()}

        {/* Côté technique — après BLOC 3 pour les challenges restants */}
        {interleaveZigzag && projet.challenges && projet.challenges.length > 2 && (
          <TechSection challenges={projet.challenges.slice(2)} />
        )}

        {/* Gallery slider si pas de vidéo */}
        {!projet.video && projet.images && projet.images.length > 0 && (
          <ProjetGallery images={projet.images} />
        )}

        {/* ── SLIDERS + DÉFIS : interleaved si les deux existent, standard sinon ── */}
        {projet.sliderSets && projet.challenges && projet.challenges.length > 0 ? (() => {
          const splitAt = 2; // défis 1-2 avant slider 0, reste avant slider 1+
          // Si une vidéo OU une tagline ouvre la page, le 1er sliderSet est numéroté 02 (et non 01).
          const sectionOffset = (projet.video || projet.tagline) ? 1 : 0;
          const batch1 = projet.challenges.slice(0, splitAt);
          const batch2 = projet.challenges.slice(splitAt);

          const SliderSetBlock = ({ set, si }: { set: { title: string; description: string; images: string[] }; si: number }) => (
            <div className="space-y-5">
              <div className="relative overflow-hidden pb-1">
                <span
                  className="absolute -top-5 left-0 font-black leading-none select-none pointer-events-none text-foreground opacity-[0.04]"
                  style={{ fontSize: "7rem" }}
                  aria-hidden="true"
                >
                  {String(si + 1 + sectionOffset).padStart(2, "0")}
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-2 relative z-10" style={{ color: "var(--accent)" }}>
                  {String(si + 1 + sectionOffset).padStart(2, "0")} —
                </p>
                <h3 className="text-2xl font-bold text-foreground mb-3 relative z-10">{set.title}</h3>
                <p className="text-base text-foreground/85 leading-relaxed max-w-2xl relative z-10">{renderHighlight(set.description)}</p>
              </div>
              {projet.customSlider === "bald-identity" && set.images.length === 0
                ? <BaldIdentityShowcase />
                : <ProjetImageSlider images={set.images} alt={`${projet.titre} — ${set.title}`} wide={!!projet.wideMedia} aspectRatio={wideAspectRatio} />
              }
            </div>
          );

          return (
            <>
              {batch1.length > 0 && <TechSection challenges={batch1} />}
              <SliderSetBlock set={projet.sliderSets![0]} si={0} />
              {batch2.length > 0 && <TechSection challenges={batch2} />}
              {projet.sliderSets!.slice(1).map((set, i) => (
                <SliderSetBlock key={i} set={set} si={i + 1} />
              ))}
            </>
          );
        })() : (
          /* Standard : sliderSets sans challenges interleaved */
          <>
            {projet.sliderSets && projet.sliderSets.map((set, si) => (
              <div key={si} className="space-y-5">
                <div className="relative overflow-hidden pb-1">
                  <span
                    className="absolute -top-5 left-0 font-black leading-none select-none pointer-events-none text-foreground opacity-[0.04]"
                    style={{ fontSize: "7rem" }}
                    aria-hidden="true"
                  >
                    {String(si + 1 + ((projet.video || projet.tagline) ? 1 : 0)).padStart(2, "0")}
                  </span>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-2 relative z-10" style={{ color: "var(--accent)" }}>
                    {String(si + 1 + ((projet.video || projet.tagline) ? 1 : 0)).padStart(2, "0")} —
                  </p>
                  <h3 className="text-2xl font-bold text-foreground mb-3 relative z-10">{set.title}</h3>
                  <p className="text-base text-foreground/85 leading-relaxed max-w-2xl relative z-10">{renderHighlight(set.description)}</p>
                </div>
                {projet.customSlider === "bald-identity" && set.images.length === 0
                  ? <BaldIdentityShowcase />
                  : <ProjetImageSlider images={set.images} alt={`${projet.titre} — ${set.title}`} wide={!!projet.wideMedia} aspectRatio={wideAspectRatio} />
                }
              </div>
            ))}
            {/* Challenges standard — uniquement si pas déjà interleaved via zigzag */}
            {!interleaveZigzag && projet.challenges && projet.challenges.length > 0 && (
              <TechSection challenges={projet.challenges} />
            )}
          </>
        )}

        {/* ── SÉPARATEUR ── */}
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(163 52% 76% / 0.3) 40%, hsl(199 88% 78% / 0.2) 60%, transparent)" }} />

        {/* TECHNOLOGIES */}
        {projet.technologies && projet.technologies.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-7 h-[3px] rounded-full shrink-0" style={{ background: "var(--lavender)" }} />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--lavender)" }}>
                Stack du projet
              </h2>
            </div>
            <div className="space-y-3">
              {projet.technologies.map((tech, ti) => {
                const c = TAG_COLORS[ti % TAG_COLORS.length];
                return (
                  <div key={tech.nom} className="grid sm:grid-cols-[160px_1fr] gap-3 sm:gap-6 items-start py-3 border-b border-white/5 last:border-0">
                    <span
                      className="inline-flex self-start text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"
                      style={{
                        color: c.color,
                        background: c.bg,
                        border: `1px solid color-mix(in oklab, ${c.color} 35%, transparent)`,
                      }}
                    >
                      {tech.nom}
                    </span>
                    <p className="text-sm text-foreground/78 leading-relaxed">{tech.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RÉSULTATS (si pas encore affiché dans le zigzag) */}
        {projet.resultats && zigzagImages.length < 3 && (
          <div
            className="rounded-2xl border px-8 py-7"
            style={{
              background: "hsl(163 52% 76% / 0.04)",
              borderColor: "color-mix(in oklab, var(--accent) 22%, transparent)",
            }}
          >
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "var(--accent)" }}>
              Résultats
            </h2>
            <p className="text-sm text-foreground/88 leading-relaxed">{projet.resultats}</p>
          </div>
        )}

        {/* CRÉDITS */}
        {projet.credits && projet.credits.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-7 h-[3px] rounded-full shrink-0" style={{ background: "var(--mauve)" }} />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--mauve)" }}>Équipe</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {projet.credits.map((c, i) => {
                const initials = c.nom.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                const col = AVATAR_COLORS[i % AVATAR_COLORS.length];
                return (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-white/8 px-4 py-3 bg-white/2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black"
                      style={{ background: `color-mix(in oklab, ${col} 18%, transparent)`, color: col }}
                    >
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-none mb-0.5">{c.nom}</p>
                      <p className="text-xs text-foreground/40">{c.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SÉPARATEUR ── */}
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(163 52% 76% / 0.3) 40%, hsl(199 88% 78% / 0.2) 60%, transparent)" }} />

        {/* ── CTA SERVICES ── */}
        <div
          className="relative rounded-2xl overflow-hidden px-7 py-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8"
          style={{ background: "hsl(47 72% 73% / 0.05)", border: "1px solid hsl(47 72% 73% / 0.2)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "var(--gold)" }} />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-2" style={{ color: "var(--gold)" }}>
              Vous aimez ce type de site ?
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
            style={{
              background: "var(--gold)",
              color: "hsl(158 24% 7%)",
            }}
          >
            Voir mes formules
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* PROJET SUIVANT */}
        <Link
          href={`/projets/${nextProjet.slug}`}
          className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-white/15 transition-colors cursor-pointer group"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] mb-1.5 font-semibold" style={{ color: "var(--accent)" }}>
              Projet suivant
            </p>
            <p className="text-base font-bold text-foreground group-hover:text-accent transition-colors">
              {nextProjet.clientShort ?? nextProjet.client}
            </p>
            <p className="text-xs text-foreground/40 mt-0.5">{nextProjet.titre}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-foreground/25 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 ml-4" />
        </Link>

      </div>

      {/* ── BOUTON FLOTTANT — projet précédent (gauche) ── */}
      <Link
        href={`/projets/${prevProjet.slug}`}
        className="fixed bottom-7 left-14 z-50 hidden lg:flex items-center gap-3 pr-4 pl-3 py-3 rounded-2xl bg-card/80 backdrop-blur-md border border-white/8 hover:border-white/18 transition-all group cursor-pointer shadow-xl shadow-black/30"
      >
        <ArrowLeft className="w-4 h-4 text-foreground/30 group-hover:text-accent group-hover:-translate-x-0.5 transition-all shrink-0" />
        <div className="text-left">
          <p className="text-[9px] uppercase tracking-[0.25em] font-semibold mb-0.5" style={{ color: "var(--accent)" }}>
            Projet précédent
          </p>
          <p className="text-sm font-bold text-foreground/88 group-hover:text-foreground transition-colors leading-tight">
            {prevProjet.clientShort ?? prevProjet.client}
          </p>
        </div>
      </Link>

      {/* ── BOUTON FLOTTANT — projet suivant, toujours visible ── */}
      <Link
        href={`/projets/${nextProjet.slug}`}
        className="fixed bottom-7 right-14 z-50 hidden lg:flex items-center gap-3 pl-4 pr-3 py-3 rounded-2xl bg-card/80 backdrop-blur-md border border-white/8 hover:border-white/18 transition-all group cursor-pointer shadow-xl shadow-black/30"
      >
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-[0.25em] font-semibold mb-0.5" style={{ color: "var(--accent)" }}>
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
