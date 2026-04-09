"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowUpRight } from "lucide-react"

const FLASH_GREEN = "var(--accent)"

const ROLES = [
  {
    num: "01",
    role: "Développeur",
    roleBold: "Front-End",
    description:
      "Je conçois des interfaces web exigeantes — applications, plateformes, outils data. Pour des marques comme TotalEnergies, Aéroports de Paris et BNP Paribas.",
    cta: "Mon parcours",
    href: "/a-propos",
    side: "left",
  },
  {
    num: "02",
    role: "Créateur de",
    roleBold: "Sites Web",
    description:
      "En parallèle, j'aide les entreprises et les particuliers à donner vie à leurs projets. Sites sur mesure, sans template, livrés avec exigence.",
    cta: "Mes réalisations",
    href: "/projets",
    side: "right",
  },
]

export function AboutIntro() {
  return (
    <section className="pt-8 pb-6 bg-background border-b border-border/40">
      <div className="layout-container">
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40">
          {ROLES.map((item, i) => (
            <motion.div
              key={item.num}
              className={`flex flex-col justify-between py-6 ${i === 0 ? "md:pr-12" : "md:pl-12"}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
            >
              {/* Numéro */}
              <span className="font-mono text-xs text-foreground/90 mb-6 select-none">
                {item.num}
              </span>

              {/* Titre — vert flashy */}
              <div className="mb-6">
                <p className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]" style={{ color: FLASH_GREEN }}>
                  {item.role}
                  <br />
                  {item.roleBold}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-foreground/65 leading-relaxed mb-8 max-w-xs">
                {item.description}
              </p>

              {/* CTA */}
              <Link
                href={item.href}
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors cursor-pointer group w-fit"
                style={{ color: FLASH_GREEN }}
              >
                {item.cta}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
