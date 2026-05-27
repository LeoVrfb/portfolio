"use client"

import { useTranslations } from "next-intl"
import { motion, useInView } from "motion/react"
import { useRef } from "react"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { projets, type Projet } from "@/lib/projets"
import { localizeProjetCard } from "@/lib/projets-i18n"

const ease = [0.16, 1, 0.3, 1] as const

function ProjectCard({
  projet,
  index,
  color,
  viewLabel,
  titre,
  description,
}: {
  projet: Projet
  index: number
  color: string
  viewLabel: string
  titre: string
  description: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease, delay: index * 0.06 }}
    >
      <Link
        href={`/projets/${projet.slug}`}
        className="group block overflow-hidden rounded-xl border border-white/8 bg-white/2 transition-all hover:border-white/15 hover:bg-white/4"
        aria-label={viewLabel}
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-white/4">
          {projet.img && (
            <Image
              src={projet.img}
              alt={titre}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
        </div>
        <div className="p-4 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-bold text-white mb-0.5 truncate">{titre}</h3>
            <p className="text-xs text-white/55 line-clamp-2 leading-relaxed">{description}</p>
          </div>
          <ArrowRight
            className="w-4 h-4 shrink-0 mt-0.5 text-white/30 transition-all duration-200 group-hover:text-white/70 group-hover:translate-x-0.5"
            style={{ color: "inherit" }}
          />
        </div>
      </Link>
    </motion.div>
  )
}

const TAG_MAP: Record<string, string[]> = {
  essentiel: ["vitrine", "landing"],
  standard: ["vitrine", "e-commerce", "blog"],
  premium: ["custom", "e-commerce", "app"],
}

function getProjectsForSlug(slug: string, limit = 3): Projet[] {
  const tags = TAG_MAP[slug] ?? []
  const filtered = projets.filter(
    (p) => tags.length === 0 || tags.some((tag) => p.tags?.includes(tag))
  )
  return filtered.slice(0, limit).length > 0 ? filtered.slice(0, limit) : projets.slice(0, limit)
}

export function ServiceProjects({ color, formuleSlug }: { color: string; formuleSlug: string }) {
  const t = useTranslations("serviceProjects")
  const tProjetsData = useTranslations("projetsData")
  const featured = getProjectsForSlug(formuleSlug)

  return (
    <section className="py-16 sm:py-20">
      <div className="text-center mb-10 sm:mb-12">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3 block"
          style={{ color }}
        >
          {t("eyebrow")}
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
          {t("title")}
        </h2>
        <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {featured.map((projet, i) => {
          const { titre, description } = localizeProjetCard(projet, tProjetsData)
          return (
            <ProjectCard
              key={projet.slug}
              projet={projet}
              index={i}
              color={color}
              viewLabel={t("viewProject", { nom: titre })}
              titre={titre}
              description={description}
            />
          )
        })}
      </div>

      <div className="flex justify-center mt-10">
        <Link
          href="/projets"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 hover:text-white transition-colors group"
        >
          {t("viewAll")}
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  )
}
