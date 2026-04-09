import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Briefcase, User } from "lucide-react";
import { projets, getProjet } from "@/lib/projets";
import { ProjetGallery } from "@/components/sections/projet-gallery";
import { ProjetImageSlider } from "@/components/sections/projet-image-slider";

type Props = { params: Promise<{ slug: string }> };

const TAG_COLORS = [
  { color: "var(--lavender)", bg: "hsl(284 24% 70% / 0.12)" },
  { color: "var(--mauve)",    bg: "hsl(328 24% 61% / 0.12)" },
  { color: "var(--accent)",   bg: "hsl(163 24% 54% / 0.12)" },
];

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
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    /^\*\*[^*]+\*\*$/.test(part) ? (
      <strong key={i} className="font-semibold" style={{ color: "var(--accent)" }}>
        {part.slice(2, -2)}
      </strong>
    ) : part
  );
}

function renderParagraphs(text: string) {
  return text.split("\n\n").map((para, i) => (
    <p key={i} className={`text-base text-foreground/80 leading-relaxed${i > 0 ? " mt-4" : ""}`}>
      {renderHighlight(para)}
    </p>
  ));
}

export default async function ProjetPage({ params }: Props) {
  const { slug } = await params;
  const projet = getProjet(slug);
  if (!projet) notFound();

  const idx = projets.findIndex((p) => p.slug === projet.slug);
  const nextProjet = projets[(idx + 1) % projets.length];
  const year = projet.date.split("-")[0];

  // Quand une vidéo existe, images[0] est le fond de la vidéo → on le skippe dans le zigzag
  const zigzagImages = projet.video
    ? (projet.images?.slice(1) ?? [])
    : (projet.images ?? []);

  return (
    <div className="pt-28 pb-28">

      {/* ── HEADER — légèrement plus large que le contenu ── */}
      <div className="max-w-5xl mx-auto px-6 lg:px-10 mb-16">
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
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight mb-4">
              {projet.client}
            </h1>

            {/* Logos + année + badges */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {(projet.logos ?? (projet.logo ? [projet.logo] : [])).map((src, i) => (
                <div key={i} className="relative w-9 h-9 shrink-0 rounded-lg overflow-hidden bg-white p-1">
                  <Image src={src} alt="" fill className="object-contain p-0.5" sizes="36px" />
                </div>
              ))}
              <span className="text-xs font-mono text-foreground/30 font-semibold">{year}</span>
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider"
                style={
                  projet.contexte === "agence"
                    ? { color: "var(--accent)", borderColor: "var(--accent)", background: "hsl(163 24% 54% / 0.08)" }
                    : projet.contexte === "freelance"
                    ? { color: "var(--lavender)", borderColor: "var(--lavender)", background: "hsl(240 24% 70% / 0.08)" }
                    : { color: "var(--mauve)", borderColor: "var(--mauve)", background: "hsl(328 24% 61% / 0.08)" }
                }
              >
                {projet.contexte === "agence"
                  ? "Mission studio · Artefact 3000"
                  : projet.contexte === "freelance"
                  ? "Freelance"
                  : "Projet perso"}
              </span>
              {projet.enCours && (
                <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 uppercase tracking-wider">
                  En cours
                </span>
              )}
            </div>

            {/* Titre app */}
            <p className="text-sm uppercase tracking-widest mb-6" style={{ color: "var(--accent)" }}>
              {projet.titre}
            </p>

            {/* Intro */}
            <p className="text-base text-foreground/80 leading-relaxed max-w-xl">
              {renderHighlight(projet.intro)}
            </p>
          </div>

          {/* Droite : meta card */}
          <div className="space-y-3 lg:pt-2">
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-1.5 font-semibold" style={{ color: "var(--accent)" }}>Client</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {(projet.logos ?? (projet.logo ? [projet.logo] : [])).map((src, i) => (
                    <div key={i} className="relative w-6 h-6 shrink-0 rounded overflow-hidden bg-white p-0.5">
                      <Image src={src} alt="" fill className="object-contain" sizes="24px" />
                    </div>
                  ))}
                  <p className="text-sm font-semibold text-foreground">{projet.client}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-1.5 font-semibold" style={{ color: "var(--accent)" }}>Contexte</p>
                <div className="flex items-center gap-1.5 text-sm text-foreground/80">
                  {projet.contexte === "agence" ? (
                    <><Briefcase size={11} className="text-(--lavender)" /><span>Artefact 3000</span></>
                  ) : projet.contexte === "freelance" ? (
                    <><User size={11} className="text-(--mauve)" /><span>Projet freelance</span></>
                  ) : (
                    <><User size={11} className="text-zinc-500" /><span>Projet personnel</span></>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-1.5 font-semibold" style={{ color: "var(--accent)" }}>Année</p>
                <p className="text-sm font-semibold text-foreground/75">{year}</p>
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
      <div className="max-w-4xl mx-auto px-6 lg:px-10 space-y-16">
        <div className="h-px bg-border/40" />

        {/* BLOC 1 — Vidéo GAUCHE / Description DROITE */}
        {(projet.video || (projet.img && !projet.video)) && (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Vidéo ou image principale */}
            <div>
              {projet.video ? (
                <div>
                  <video src={projet.video} autoPlay muted loop playsInline className="w-full block rounded-xl" />
                </div>
              ) : projet.img ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-border/60">
                  <Image src={projet.img} alt={projet.titre} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              ) : null}
            </div>

            {/* Description éditoriale avec highlights */}
            {projet.descriptionPublic && (
              <div className="pt-1">
                {renderParagraphs(projet.descriptionPublic)}
              </div>
            )}
          </div>
        )}

        {/* Points clés — labels en en-tête + liste unique, centré */}
        {projet.pointsCles && projet.pointsCles.length > 0 && (
          <div className="flex flex-col items-center text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-foreground/35 mb-4">
              {projet.pointsCles.map((g) => g.label).join(" · ")}
            </p>
            <ul className="flex flex-col gap-2.5">
              {projet.pointsCles.flatMap((group) => group.items).map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/65 leading-relaxed">
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
              <li key={i} className="flex items-start gap-3 text-sm text-foreground/65 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-[7px]" style={{ background: "var(--accent)" }} />
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* BLOC 2 — Slider si >= 3 images / double si 2 / simple si 1 */}
        {zigzagImages.length >= 3 ? (
          <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              {(projet.imageCaptions?.[0] ?? projet.descriptionPublic) && renderParagraphs(projet.imageCaptions?.[0] ?? projet.descriptionPublic ?? "")}
            </div>
            <ProjetImageSlider
              images={zigzagImages.slice(0, zigzagImages.length >= 5 ? -2 : -1)}
              alt={projet.titre}
            />
          </div>
        ) : zigzagImages.length === 2 ? (
          <div className="grid md:grid-cols-[1fr_380px] gap-8 items-start">
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
          <div className="grid md:grid-cols-[1fr_180px] gap-8 items-start">
            <div>
              {(projet.imageCaptions?.[0] ?? projet.descriptionPublic) && renderParagraphs(projet.imageCaptions?.[0] ?? projet.descriptionPublic ?? "")}
            </div>
            <Image
              src={zigzagImages[0]}
              alt={`${projet.titre} — vue 1`}
              width={540}
              height={960}
              className="rounded-xl w-full h-auto -mt-4 md:-mt-6 relative z-10 mx-auto md:mx-0 block"
              quality={90}
            />
          </div>
        ) : null}

        {/* BLOC 3 — Slider (FR + EN) ou image seule / Texte DROITE */}
        {zigzagImages.length >= 3 && (() => {
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

        {/* Gallery slider si pas de vidéo */}
        {!projet.video && projet.images && projet.images.length > 0 && (
          <ProjetGallery images={projet.images} />
        )}

        {/* ── SÉPARATEUR ── */}
        <div className="h-px bg-border/40" />

        {/* TECHNOLOGIES */}
        {projet.technologies && projet.technologies.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: "var(--accent)" }}>
              Stack du projet
            </h2>
            <div className="space-y-6">
              {projet.technologies.map((tech, ti) => (
                <div key={tech.nom} className="flex gap-4">
                  <div
                    className="w-px shrink-0 self-stretch opacity-40"
                    style={{ background: TAG_COLORS[ti % TAG_COLORS.length].color }}
                  />
                  <div>
                    <p className="text-sm font-semibold mb-0.5" style={{ color: TAG_COLORS[ti % TAG_COLORS.length].color }}>
                      {tech.nom}
                    </p>
                    <p className="text-sm text-foreground/70 leading-relaxed">{tech.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DÉFIS */}
        {projet.challenges && projet.challenges.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: "var(--accent)" }}>
              Défis &amp; solutions techniques
            </h2>
            <div className="space-y-7">
              {projet.challenges.map((ch, i) => (
                <div key={i} className="flex gap-5">
                  <span
                    className="text-4xl font-black leading-none shrink-0 select-none tabular-nums mt-0.5"
                    style={{ color: "rgba(255,255,255,0.12)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1">
                    <p className="text-sm font-bold text-foreground mb-1.5">{ch.titre}</p>
                    <p className="text-sm text-foreground/70 leading-relaxed">{ch.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RÉSULTATS (si pas encore affiché dans le zigzag) */}
        {projet.resultats && zigzagImages.length < 3 && (
          <div className="pl-5 py-1 border-l-2" style={{ borderColor: "var(--accent)" }}>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: "var(--accent)" }}>
              Résultats
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{projet.resultats}</p>
          </div>
        )}

        {/* CRÉDITS */}
        {projet.credits && projet.credits.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: "var(--accent)" }}>
              Équipe
            </h2>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {projet.credits.map((c, i) => (
                <div key={i}>
                  <span className="text-sm text-foreground/80 font-medium">{c.nom}</span>
                  <span className="text-xs text-foreground/35 ml-2">{c.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SÉPARATEUR ── */}
        <div className="h-px bg-border/40" />

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
    </div>
  );
}
