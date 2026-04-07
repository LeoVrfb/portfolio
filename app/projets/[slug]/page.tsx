import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Briefcase, User } from "lucide-react";
import { projets, getProjet } from "@/lib/projets";
import { ProjetGallery } from "@/components/sections/projet-gallery";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projets.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const projet = getProjet(slug);
  if (!projet) return {};
  return {
    title: `${projet.titre} — Léo Hengebaert`,
    description: projet.description,
  };
}

export default async function ProjetPage({ params }: Props) {
  const { slug } = await params;
  const projet = getProjet(slug);
  if (!projet) notFound();

  const idx = projets.findIndex((p) => p.slug === projet.slug);
  const nextProjet = projets[(idx + 1) % projets.length];

  return (
    <div className="pt-28 pb-28">
      {/* Back */}
      <div className="layout-container mb-12">
        <Link
          href="/projets"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Tous les projets
        </Link>
      </div>

      {/* Layout 2 colonnes */}
      <div className="layout-container grid lg:grid-cols-[1fr_340px] gap-14 items-start">

        {/* ── Colonne gauche ── */}
        <div>
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight mb-2">
              {projet.client}
            </h1>
            <p className="text-sm text-muted-foreground/60 uppercase tracking-widest mb-6">
              {projet.titre}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {projet.intro}
            </p>
          </div>

          {/* Image inline (projets sans vidéo — 16/9 dans le texte) */}
          {!projet.video && (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-border mb-12 max-w-xl">
              <Image src={projet.img} alt={projet.titre} fill className="object-cover" priority />
            </div>
          )}

          {/* Points clés */}
          {projet.caracteristiques && projet.caracteristiques.length > 0 && (
            <div className="mb-10">
              <h2 className="text-sm font-bold text-foreground mb-5">Points clés</h2>
              <ul className="space-y-3">
                {projet.caracteristiques.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies */}
          {projet.technologies && projet.technologies.length > 0 && (
            <div className="mb-10">
              <h2 className="text-sm font-bold text-foreground mb-5">Technologies utilisées</h2>
              <div className="space-y-5">
                {projet.technologies.map((tech) => (
                  <div key={tech.nom} className="flex gap-4">
                    <div className="w-px bg-border shrink-0 self-stretch" />
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-0.5">{tech.nom}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tech.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Défis — numérotés, sans cartes */}
          {projet.challenges && projet.challenges.length > 0 && (
            <div className="mb-10">
              <h2 className="text-sm font-bold text-foreground mb-5">Défis & solutions</h2>
              <div className="space-y-6">
                {projet.challenges.map((ch, i) => (
                  <div key={i} className="flex gap-5">
                    <span className="text-4xl font-black leading-none shrink-0 select-none tabular-nums mt-0.5" style={{ color: "rgba(255,255,255,0.06)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="pt-1">
                      <p className="text-sm font-semibold text-foreground mb-1.5">{ch.titre}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{ch.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Résultats */}
          {projet.resultats && (
            <div className="border-l-2 border-accent/40 pl-5 py-1">
              <h2 className="text-sm font-bold text-foreground mb-2">Résultats</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{projet.resultats}</p>
            </div>
          )}
        </div>

        {/* ── Colonne droite ── */}
        <aside>

          {/* Meta + liens — scrollent avec la page */}
          <div className="space-y-4 mb-6">

            {/* Meta card */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Client</p>
                <p className="text-sm font-semibold text-foreground">{projet.client}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Contexte</p>
                <div className="flex items-center gap-1.5 text-sm text-foreground">
                  {projet.contexte === "pro" ? (
                    <>
                      <Briefcase size={12} className="text-[var(--lavender)]" />
                      <span>Mission studio</span>
                    </>
                  ) : (
                    <>
                      <User size={12} className="text-[var(--mauve)]" />
                      <span>Projet freelance</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {projet.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Lien site externe */}
            {projet.url && (
              <a
                href={projet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl border border-accent/30 bg-accent/5 text-sm font-semibold text-accent hover:bg-accent/10 transition-colors cursor-pointer group"
              >
                Voir le site en ligne
                <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}

            {/* Projet suivant */}
            <Link
              href={`/projets/${nextProjet.slug}`}
              className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-white/15 transition-colors cursor-pointer group"
            >
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Projet suivant</p>
                <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors leading-snug">
                  {nextProjet.titre}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 ml-3" />
            </Link>
          </div>

          {/* Médias — sticky : restent visibles pendant le scroll */}
          <div className="lg:sticky lg:top-28 space-y-4">

            {/* Vidéo portrait — pleine largeur */}
            {projet.video && (
              <div
                className="w-full rounded-xl overflow-hidden border border-border"
                style={{ aspectRatio: "9/16" }}
              >
                <video
                  src={projet.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ display: "block" }}
                />
              </div>
            )}

            {/* 2 images portrait côte à côte (quand vidéo présente) */}
            {projet.video && projet.images && projet.images.length >= 2 && (
              <div className="grid grid-cols-2 gap-2">
                {projet.images.slice(0, 2).map((src, i) => (
                  <div
                    key={i}
                    className="relative rounded-lg overflow-hidden border border-border"
                    style={{ aspectRatio: "9/16" }}
                  >
                    <Image
                      src={src}
                      alt={`${projet.titre} — vue ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Gallery slider (quand pas de vidéo) */}
            {!projet.video && projet.images && projet.images.length > 0 && (
              <ProjetGallery images={projet.images} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
