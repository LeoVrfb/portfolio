"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import { projets } from "@/lib/projets"

const TAG_COLORS = [
  { color: "var(--accent)", bg: "hsl(163 24% 54% / 0.12)" },
  { color: "var(--lavender)", bg: "hsl(284 24% 70% / 0.12)" },
  { color: "var(--mauve)", bg: "hsl(328 24% 61% / 0.12)" },
]

export function ProjetsSection() {
  return (
    <section className="pt-20 pb-16 bg-background">
      <div className="layout-container">
        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-accent font-medium mb-3">
              Réalisations
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tighter leading-[0.95]">
              Projets
              <br />
              <span className="text-accent">sélectionnés</span>
            </h2>
          </div>
          <Link
            href="/projets"
            className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
          >
            Voir tout
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Liste */}
        <ul className="divide-y divide-border/50">
          {projets.slice(0, 3).map((projet, i) => {
            const year = projet.date.split("-")[0]
            return (
              <motion.li
                key={projet.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              >
                <Link
                  href={`/projets/${projet.slug}`}
                  className="group flex items-center gap-6 py-7 transition-colors cursor-pointer"
                >
                  {/* Vignette — image seule, sans overlay logo */}
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border border-border/60">
                    {projet.img ? (
                      <Image
                        src={projet.img}
                        alt={projet.client}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="80px"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-linear-to-br from-accent/20 to-zinc-900" />
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    {/* Ligne 1 : client (prioritaire) + logos + année en flex-wrap */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
                      <h3 className="text-lg font-bold leading-tight transition-colors" style={{ color: "var(--accent)" }}>
                        {projet.clientShort ?? projet.client}
                      </h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {(projet.logos ?? (projet.logo ? [projet.logo] : [])).map((src, li) => (
                          <div key={li} className="relative w-5 h-5 rounded-md overflow-hidden bg-white/90">
                            <Image
                              src={src}
                              alt={`Logo ${projet.clientShort ?? projet.client}`}
                              fill
                              className="object-contain p-0.5"
                              sizes="20px"
                            />
                          </div>
                        ))}
                        <span className="text-xs text-foreground/90 font-mono">
                          {year}
                        </span>
                      </div>
                    </div>
                    {/* Ligne 2 : titre secondaire */}
                    <p className="text-sm text-foreground/75 leading-snug truncate">
                      {projet.titre}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="hidden md:flex items-center gap-2 shrink-0">
                    {projet.tags.slice(0, 3).map((tag, ti) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-[10px] font-medium rounded-full"
                        style={{
                          color: TAG_COLORS[(i + ti) % TAG_COLORS.length].color,
                          background: TAG_COLORS[(i + ti) % TAG_COLORS.length].bg,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Arrow */}
                  <ArrowUpRight className="w-5 h-5 text-foreground/20 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </Link>
              </motion.li>
            )
          })}
        </ul>

        {/* Voir tout — bas de liste */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            href="/projets"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-accent transition-colors cursor-pointer group"
          >
            Voir tous les projets
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
