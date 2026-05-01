"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { projets } from "@/lib/projets"

// Sélection statique : Bald (freelance e-commerce), Russian with Julia (freelance auth + vidéo + booking),
// Argedis (échelle multi-régions). TotalEnergies reste tant qu'on n'a pas un 3ᵉ projet freelance à mettre.
const FEATURED_SLUGS = ["bald-artiste", "russian-with-julia", "argedis-totalenergies"] as const

const CONTEXT_LABEL: Record<"freelance" | "agence" | "perso", string> = {
  freelance: "Freelance",
  agence: "Agence",
  perso: "Perso",
}

// Rotations en éventail — la card centrale reste droite, les bords s'inclinent légèrement.
const FAN_ROTATIONS = [-4, 0, 4] as const
const FAN_OFFSETS_Y = [12, 0, 12] as const

export function ServiceProjects({ color }: { color: string }) {
  const featured = FEATURED_SLUGS
    .map((slug) => projets.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section className="pt-16 pb-12">
      {/* En-tête compact */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 sm:mb-12 text-center max-w-2xl mx-auto"
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3 inline-block"
          style={{ color }}
        >
          Réalisations
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-[1.15] text-white">
          Une sélection des sites que j&apos;ai conçus
        </h2>
        <p
          className="mt-2 text-lg sm:text-xl font-serif-display italic leading-snug"
          style={{ color }}
        >
          Et si le prochain c&apos;était le vôtre&nbsp;?
        </p>
        <p className="mt-3 text-sm text-white/55 leading-relaxed">
          Du design fort, une vraie identité — jamais un template.
        </p>
      </motion.div>

      {/* Mobile : pile verticale simple — Desktop : éventail interactif */}
      <div className="block sm:hidden space-y-3">
        {featured.map((projet, i) => (
          <ProjectCardMobile key={projet.slug} projet={projet} color={color} index={i} />
        ))}
      </div>

      <div
        className="hidden sm:flex justify-center items-end gap-3 sm:gap-4 perspective-distant relative px-4 sm:px-8 pb-8"
        onMouseLeave={() => setHovered(null)}
      >
        {featured.map((projet, i) => (
          <ProjectCardFan
            key={projet.slug}
            projet={projet}
            color={color}
            index={i}
            isHovered={hovered === i}
            isAnyHovered={hovered !== null}
            onHover={() => setHovered(i)}
          />
        ))}
      </div>

      {/* Lien discret vers la page projets */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-6 flex justify-center"
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

// ─── Card éventail (desktop) ───────────────────────────────────────────────

function ProjectCardFan({
  projet,
  color,
  index,
  isHovered,
  isAnyHovered,
  onHover,
}: {
  projet: (typeof projets)[number]
  color: string
  index: number
  isHovered: boolean
  isAnyHovered: boolean
  onHover: () => void
}) {
  const baseRotate = FAN_ROTATIONS[index]
  const baseOffsetY = FAN_OFFSETS_Y[index]
  const year = projet.date.slice(0, 4)

  // Quand une autre card est hover : recule celle-ci légèrement, opacité plus faible.
  const dimmed = isAnyHovered && !isHovered

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: baseRotate }}
      whileInView={{ opacity: 1, y: baseOffsetY, rotate: baseRotate }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: 0.08 + index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      animate={{
        rotate: isHovered ? 0 : baseRotate,
        y: isHovered ? -16 : baseOffsetY,
        scale: isHovered ? 1.04 : dimmed ? 0.97 : 1,
        opacity: dimmed ? 0.55 : 1,
      }}
      onMouseEnter={onHover}
      style={{
        transformOrigin: "bottom center",
      }}
      className="relative"
    >
      <Link
        href={`/projets/${projet.slug}`}
        className="group block w-[200px] md:w-[220px] lg:w-[240px] rounded-2xl border border-white/10 bg-zinc-900 cursor-pointer transform-gpu isolate"
        style={{
          boxShadow: isHovered
            ? `0 20px 40px -10px color-mix(in oklab, ${color} 25%, rgba(0,0,0,0.4)), 0 0 0 1px color-mix(in oklab, ${color} 30%, transparent)`
            : "0 8px 24px -8px rgba(0,0,0,0.4)",
          transition: "box-shadow 0.4s ease",
          clipPath: "inset(0 round 1rem)",
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        }}
      >
        {/* Image — ratio portrait pour évoquer la "carte à jouer" */}
        <div className="relative aspect-3/4 w-full overflow-hidden">
          {projet.img && (
            <Image
              src={projet.img}
              alt={projet.titre}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              // Card desktop ~240px, ×2 DPR retina, +marge pour les zooms hover (scale-105) :
              // on demande à Next/Image une source plus large pour éviter l'effet flou.
              sizes="(max-width: 1024px) 280px, 320px"
              quality={92}
            />
          )}

          {/* Voile bas pour la lisibilité du texte overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />

          {/* Top : badge contexte + Live */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-1.5">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.18em] px-2 py-0.5 rounded-full backdrop-blur-md border"
              style={{
                color,
                borderColor: `color-mix(in oklab, ${color} 40%, transparent)`,
                background: `color-mix(in oklab, ${color} 15%, rgba(0,0,0,0.4))`,
              }}
            >
              {CONTEXT_LABEL[projet.contexte]}
            </span>

            {projet.url && (
              <span
                className="inline-flex items-center gap-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-full backdrop-blur-md bg-white/10 border border-white/15 text-white/85"
                title="Site en ligne"
              >
                <ExternalLink className="w-2 h-2" />
                Live
              </span>
            )}
          </div>

          {/* Bottom overlay : logo + nom client + titre + année */}
          <div className="absolute bottom-0 left-0 right-0 p-3.5">
            <div className="flex items-center gap-2 mb-1">
              {projet.logo && (
                <div className="relative w-7 h-7 shrink-0 rounded-md overflow-hidden bg-white p-0.5 ring-1 ring-white/15">
                  <Image
                    src={projet.logo}
                    alt={`Logo ${projet.clientShort ?? projet.client}`}
                    fill
                    className="object-contain p-0.5"
                    sizes="28px"
                  />
                </div>
              )}
              <h3 className="text-base font-bold text-white leading-tight tracking-tight truncate">
                {projet.clientShort ?? projet.client}
              </h3>
            </div>
            <p className="text-[11px] text-white/70 leading-snug line-clamp-2 mb-1.5">
              {projet.titre}
            </p>
            <span className="text-[9px] font-mono tracking-wider text-white/45">
              {year}
            </span>
          </div>

          {/* Petit arrow rond visible au hover */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
            style={{
              background: `color-mix(in oklab, ${color} 25%, rgba(0,0,0,0.55))`,
              borderColor: `color-mix(in oklab, ${color} 60%, transparent)`,
            }}
          >
            <ArrowUpRight className="w-5 h-5" style={{ color }} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Card mobile ───────────────────────────────────────────────────────────

function ProjectCardMobile({
  projet,
  color,
  index,
}: {
  projet: (typeof projets)[number]
  color: string
  index: number
}) {
  const year = projet.date.slice(0, 4)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={`/projets/${projet.slug}`}
        className="group flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5 transition-all cursor-pointer"
      >
        {/* Vignette */}
        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden ring-1 ring-white/10">
          {projet.img && (
            <Image
              src={projet.img}
              alt={projet.titre}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="160px"
              quality={92}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-white leading-tight tracking-tight truncate">
              {projet.clientShort ?? projet.client}
            </h3>
            {projet.url && (
              <ExternalLink className="w-3 h-3 shrink-0 text-white/40" />
            )}
          </div>
          <p className="text-xs text-white/65 leading-snug line-clamp-1 mb-1.5">
            {projet.titre}
          </p>
          <div className="flex items-center gap-2">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
              style={{
                color,
                background: `color-mix(in oklab, ${color} 12%, transparent)`,
              }}
            >
              {CONTEXT_LABEL[projet.contexte]}
            </span>
            <span className="text-[10px] font-mono text-white/35 ml-auto">
              {year}
            </span>
          </div>
        </div>

        <ArrowUpRight className="w-4 h-4 shrink-0 text-white/30 group-hover:text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </Link>
    </motion.div>
  )
}
