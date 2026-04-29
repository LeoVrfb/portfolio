"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { projets } from "@/lib/projets"

// Sélection statique pour les pages services :
// Bald = freelance e-commerce (le plus aligné), Argedis = grosse échelle multi-régions,
// Sweetime = gamification + paiement. On évite Make a Scene (outil interne) et BNP (LMS, pas accessible).
const FEATURED_SLUGS = ["bald-artiste", "argedis-totalenergies", "sweetime-adp-extime"] as const

const CONTEXT_LABEL: Record<"freelance" | "agence" | "perso", string> = {
  freelance: "Freelance",
  agence: "Mission agence",
  perso: "Projet perso",
}

export function ServiceProjects({ color }: { color: string }) {
  const featured = FEATURED_SLUGS
    .map((slug) => projets.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <section className="pt-16 pb-12">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 sm:mb-12"
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4 inline-block"
          style={{ color }}
        >
          Réalisations
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.05] text-white max-w-3xl">
          Quelques projets que{" "}
          <span
            className="font-serif-display italic font-normal"
            style={{ color }}
          >
            j&apos;ai déjà construits
          </span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-white/65 max-w-2xl leading-relaxed">
          Sites freelance et missions agence pour des marques exigeantes.
          Chaque projet est pensé, designé et codé à la main — pas de template,
          pas de no-code.
        </p>
      </motion.div>

      {/* Grille — hero (Bald) à gauche, deux compagnons à droite empilés sur desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {featured.map((projet, index) => (
          <ProjectCard
            key={projet.slug}
            projet={projet}
            index={index}
            color={color}
          />
        ))}
      </div>

      {/* Lien discret vers la page projets */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-8 flex justify-center"
      >
        <Link
          href="/projets"
          className="group inline-flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors cursor-pointer"
        >
          Voir tous les projets
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </motion.div>
    </section>
  )
}

function ProjectCard({
  projet,
  index,
  color,
}: {
  projet: (typeof projets)[number]
  index: number
  color: string
}) {
  const isHero = index === 0
  const year = projet.date.slice(0, 4)
  const tags = projet.tags.slice(0, 3)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={
        isHero
          ? "lg:col-span-7 lg:row-span-2"
          : "lg:col-span-5"
      }
    >
      <Link
        href={`/projets/${projet.slug}`}
        className="group block h-full overflow-hidden rounded-2xl border border-white/8 bg-white/2 transition-all duration-500 hover:border-white/20 cursor-pointer"
        style={
          {
            "--card-accent": color,
          } as React.CSSProperties
        }
      >
        {/* Image */}
        <div
          className={`relative w-full overflow-hidden ${
            isHero ? "aspect-16/10 lg:aspect-16/11" : "aspect-16/10"
          }`}
        >
          {projet.img && (
            <Image
              src={projet.img}
              alt={projet.titre}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes={
                isHero
                  ? "(max-width: 1024px) 100vw, 58vw"
                  : "(max-width: 1024px) 100vw, 42vw"
              }
            />
          )}

          {/* Overlay gradient (always there, plus marked on hover) */}
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top row : badge contexte + lien externe si site live */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full backdrop-blur-md border"
              style={{
                color,
                borderColor: `color-mix(in oklab, ${color} 40%, transparent)`,
                background: `color-mix(in oklab, ${color} 12%, rgba(0,0,0,0.35))`,
              }}
            >
              {CONTEXT_LABEL[projet.contexte]}
            </span>

            {projet.url && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full backdrop-blur-md bg-white/10 border border-white/15 text-white/85"
                title="Site en ligne"
              >
                <ExternalLink className="w-2.5 h-2.5" />
                Live
              </span>
            )}
          </div>

          {/* Bottom row : nom client + arrow */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {projet.logo && (
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-lg overflow-hidden bg-white p-1 ring-1 ring-white/15">
                  <Image
                    src={projet.logo}
                    alt={`Logo ${projet.clientShort ?? projet.client}`}
                    fill
                    className="object-contain p-0.5"
                    sizes="44px"
                  />
                </div>
              )}
              <div className="min-w-0">
                <h3
                  className={`font-black text-white leading-tight tracking-tight truncate ${
                    isHero
                      ? "text-2xl sm:text-3xl lg:text-4xl"
                      : "text-xl sm:text-2xl"
                  }`}
                >
                  {projet.clientShort ?? projet.client}
                </h3>
                <p className="text-[11px] sm:text-xs text-white/60 mt-0.5 font-mono tracking-wider">
                  {year}
                </p>
              </div>
            </div>

            <div
              className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                background: `color-mix(in oklab, ${color} 18%, rgba(0,0,0,0.4))`,
                borderColor: `color-mix(in oklab, ${color} 50%, transparent)`,
              }}
            >
              <ArrowUpRight
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color }}
              />
            </div>
          </div>
        </div>

        {/* Footer texte */}
        <div className="p-5 sm:p-6 flex flex-col gap-3">
          <p
            className={`text-white leading-snug font-semibold ${
              isHero ? "text-base sm:text-lg" : "text-sm sm:text-base"
            }`}
          >
            {projet.titre}
          </p>

          {/* Stack — petits tags sobres */}
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/70"
              >
                {tag}
              </span>
            ))}
            {projet.tags.length > 3 && (
              <span className="text-[10px] text-white/40 font-mono">
                +{projet.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
