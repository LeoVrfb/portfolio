"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { projets } from "@/lib/projets"
import { localizeProjetCard } from "@/lib/projets-i18n"

// Sélection statique des 3 réalisations mises en avant sur les pages formules :
// Bald (freelance e-commerce art), Russian with Julia (freelance auth + vidéo + booking),
// Tiffany Voix Off (freelance one-page comédienne voix off). Ces 3 projets ont tous un
// site EN LIGNE : les cards ouvrent directement le site réel dans un nouvel onglet
// (et non la page-étude de cas, qui est réservée aux curieux via « voir tous les projets »).
const FEATURED_SLUGS = ["bald-artiste", "russian-with-julia", "tiffany-voixoff"] as const

// Rotations en éventail — la card centrale reste droite, les bords s'inclinent légèrement.
const FAN_ROTATIONS = [-4, 0, 4] as const
const FAN_OFFSETS_Y = [12, 0, 12] as const
// Décalage horizontal de départ (px) : les cards partent resserrées au centre puis
// s'écartent en s'ouvrant comme un éventail au scroll.
const FAN_CLOSED_X = [70, 0, -70] as const

// La prop formuleSlug est conservée pour compat API mais n'est plus utilisée :
// la sélection des 3 cards est statique (cf. FEATURED_SLUGS).
export function ServiceProjects({ color, formuleSlug: _formuleSlug }: { color: string; formuleSlug?: string }) {
  const t = useTranslations("serviceProjects")
  const tProjetsData = useTranslations("projetsData")

  const featured = FEATURED_SLUGS
    .map((slug) => projets.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  const [hovered, setHovered] = useState<number | null>(null)

  const contextLabel = (key: "freelance" | "agence" | "perso") =>
    t(`contextLabels.${key}` as const)

  return (
    <section className="pt-16 pb-12">
      {/* En-tête compact, centré */}
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
          {t("eyebrow")}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-[1.15] text-white">
          {t("title")}
        </h2>
        <p
          className="mt-2 text-lg sm:text-xl font-serif-display italic leading-snug"
          style={{ color }}
        >
          {t("subtitle")}
        </p>
        <p className="mt-3 text-sm text-white/55 leading-relaxed">{t("description")}</p>
      </motion.div>

      {/* Mobile : pile verticale compacte avec mini-vignette horizontale */}
      <div className="block sm:hidden space-y-3">
        {featured.map((projet, i) => {
          const { titre } = localizeProjetCard(projet, tProjetsData)
          return (
            <ProjectCardMobile
              key={projet.slug}
              projet={projet}
              titre={titre}
              color={color}
              index={i}
              contextLabel={contextLabel(projet.contexte)}
              liveLabel={t("liveSite")}
            />
          )
        })}
      </div>

      {/* Desktop : éventail interactif */}
      <div
        className="hidden sm:flex justify-center items-end gap-3 sm:gap-4 perspective-distant relative px-4 sm:px-8 pb-8"
        onMouseLeave={() => setHovered(null)}
      >
        {/* Halo animé derrière l'éventail — attire l'œil sur la section */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto h-[280px] max-w-lg rounded-full blur-3xl"
          style={{ background: `radial-gradient(ellipse at center, color-mix(in oklab, ${color} 22%, transparent), transparent 70%)` }}
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {featured.map((projet, i) => {
          const { titre } = localizeProjetCard(projet, tProjetsData)
          return (
            <ProjectCardFan
              key={projet.slug}
              projet={projet}
              titre={titre}
              color={color}
              index={i}
              isHovered={hovered === i}
              isAnyHovered={hovered !== null}
              onHover={() => setHovered(i)}
              contextLabel={contextLabel(projet.contexte)}
              liveLabel={t("liveSite")}
              viewLiveLabel={t("viewLive")}
            />
          )
        })}
      </div>

      {/* Lien discret vers la page projets (études de cas détaillées) */}
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
          {t("viewAll")}
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </motion.div>
    </section>
  )
}

// ─── Card éventail (desktop) ───────────────────────────────────────────────

function ProjectCardFan({
  projet,
  titre,
  color,
  index,
  isHovered,
  isAnyHovered,
  onHover,
  contextLabel,
  liveLabel,
  viewLiveLabel,
}: {
  projet: (typeof projets)[number]
  titre: string
  color: string
  index: number
  isHovered: boolean
  isAnyHovered: boolean
  onHover: () => void
  contextLabel: string
  liveLabel: string
  viewLiveLabel: string
}) {
  const baseRotate = FAN_ROTATIONS[index]
  const baseOffsetY = FAN_OFFSETS_Y[index]
  const closedX = FAN_CLOSED_X[index]
  const year = projet.date.slice(0, 4)
  const dimmed = isAnyHovered && !isHovered

  return (
    <motion.div
      // Éventail fermé (resserré au centre) → ouvert au scroll dans le viewport
      initial={{ opacity: 0, y: 40, x: closedX, rotate: 0, scale: 0.9 }}
      whileInView={{
        opacity: 1,
        y: baseOffsetY,
        x: 0,
        rotate: baseRotate,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 120,
          damping: 16,
          delay: 0.12 + index * 0.1,
        },
      }}
      viewport={{ once: true, margin: "-80px" }}
      // États de survol (prennent le relais après l'entrée)
      animate={{
        rotate: isHovered ? 0 : baseRotate,
        y: isHovered ? -18 : baseOffsetY,
        scale: isHovered ? 1.05 : dimmed ? 0.96 : 1,
        opacity: dimmed ? 0.5 : 1,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      onMouseEnter={onHover}
      style={{ transformOrigin: "bottom center" }}
      className="relative"
    >
      <a
        href={projet.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${liveLabel} — ${titre}`}
        className="group block w-[200px] md:w-[220px] lg:w-[240px] rounded-2xl border border-white/10 bg-zinc-900 cursor-pointer transform-gpu isolate"
        style={{
          boxShadow: isHovered
            ? `0 24px 48px -10px color-mix(in oklab, ${color} 30%, rgba(0,0,0,0.45)), 0 0 0 1px color-mix(in oklab, ${color} 45%, transparent)`
            : "0 8px 24px -8px rgba(0,0,0,0.4)",
          transition: "box-shadow 0.4s ease",
          clipPath: "inset(0 round 1rem)",
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        }}
      >
        {/* Image — ratio portrait pour évoquer la "carte à jouer" */}
        <div className="relative aspect-3/4 w-full overflow-hidden">
          {(projet.cardImg ?? projet.img) && (
            <Image
              src={projet.cardImg ?? projet.img}
              alt={titre}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              // Card desktop ~240px, ×2 DPR retina, +marge pour les zooms hover
              sizes="(max-width: 1024px) 280px, 320px"
              quality={92}
            />
          )}

          {/* Voile bas pour la lisibilité du texte overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/25 to-transparent" />

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
              {contextLabel}
            </span>

            {projet.url && (
              <span
                className="inline-flex items-center gap-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-full backdrop-blur-md bg-white/10 border border-white/15 text-white/85"
                title={liveLabel}
              >
                <ExternalLink className="w-2 h-2" />
                {liveLabel}
              </span>
            )}
          </div>

          {/* Bottom overlay : logo + nom client + titre + année + CTA live */}
          <div className="absolute bottom-0 left-0 right-0 p-3.5">
            <div className="flex items-center gap-2 mb-1">
              {projet.logo && (
                <div className="relative w-7 h-7 shrink-0 rounded-md overflow-hidden bg-white p-0.5 ring-1 ring-white/15">
                  <Image
                    src={projet.logo}
                    alt={`${projet.clientShort ?? projet.client}`}
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
              {titre}
            </p>

            {/* Ligne du bas : année + CTA "Voir le site" qui se révèle au survol */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono tracking-wider text-white/55">{year}</span>
              <span
                className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide max-w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-[140px] group-hover:opacity-100"
                style={{ color }}
              >
                {viewLiveLabel}
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Arrow rond visible au hover (indice de clic) */}
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
      </a>
    </motion.div>
  )
}

// ─── Card mobile ───────────────────────────────────────────────────────────

function ProjectCardMobile({
  projet,
  titre,
  color,
  index,
  contextLabel,
  liveLabel,
}: {
  projet: (typeof projets)[number]
  titre: string
  color: string
  index: number
  contextLabel: string
  liveLabel: string
}) {
  const year = projet.date.slice(0, 4)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <a
        href={projet.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${liveLabel} — ${titre}`}
        className="group flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5 transition-all cursor-pointer"
      >
        <div className="relative w-16 h-20 shrink-0 rounded-lg overflow-hidden ring-1 ring-white/10">
          {(projet.cardImg ?? projet.img) && (
            <Image
              src={projet.cardImg ?? projet.img}
              alt={titre}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="128px"
              quality={92}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-white leading-tight tracking-tight truncate">
              {projet.clientShort ?? projet.client}
            </h3>
            {projet.url && <ExternalLink className="w-3 h-3 shrink-0 text-white/55" />}
          </div>
          <p className="text-xs text-white/65 leading-snug line-clamp-1 mb-1.5">{titre}</p>
          <div className="flex items-center gap-2">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
              style={{
                color,
                background: `color-mix(in oklab, ${color} 12%, transparent)`,
              }}
            >
              {contextLabel}
            </span>
            <span className="text-[10px] font-mono text-white/35 ml-auto">{year}</span>
          </div>
        </div>

        <ArrowUpRight className="w-4 h-4 shrink-0 text-white/30 group-hover:text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </a>
    </motion.div>
  )
}
