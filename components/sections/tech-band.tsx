"use client"

import { useState } from "react"
import Link from "next/link"
import { Marquee } from "@/components/animations/marquee"

type Item = {
  text: string
  color: "lavender" | "mauve" | "accent"
  href: string
  external?: boolean
}

const ITEMS: Item[] = [
  { text: "Projets", href: "/projets", color: "lavender" },
  { text: "Argedis × TotalEnergies", href: "/projets/argedis-totalenergies", color: "mauve" },
  { text: "À propos", href: "/a-propos", color: "lavender" },
  { text: "Sweetime × ADP", href: "/projets/sweetime-adp-extime", color: "mauve" },
  { text: "LinkedIn", href: "https://linkedin.com/in/leo-hengebaert", color: "accent", external: true },
  { text: "BNP Paribas", href: "/projets/bnp-paribas-elearning", color: "mauve" },
  { text: "Services", href: "/services", color: "lavender" },
  { text: "Hurepoix Nettoyage", href: "/projets/hurepoix-nettoyage", color: "mauve" },
  { text: "GitHub", href: "https://github.com/LeoVrfb", color: "accent", external: true },
  { text: "Make a Scene", href: "/projets/make-a-scene", color: "mauve" },
  { text: "Contact", href: "/contact", color: "lavender" },
  { text: "Bald", href: "/projets/bald-artiste", color: "mauve" },
  { text: "Instagram", href: "https://instagram.com/leohengebaert", color: "accent", external: true },
  { text: "Memorized", href: "/projets/memorized", color: "mauve" },
  { text: "Prof de Langue", href: "/projets/prof-de-langue", color: "mauve" },
]

const colorMap: Record<Item["color"], string> = {
  lavender: "hover:opacity-70",
  mauve: "hover:opacity-70",
  accent: "text-accent hover:opacity-80",
}

export function TechBand() {
  const [paused, setPaused] = useState(false)

  return (
    <section
      className="py-6 border-y border-white/5 bg-background overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Marquee paused={paused} className="[--duration:70s] [--gap:0rem]">
        {ITEMS.map((item) => {
          const baseClass = `text-xl font-black uppercase tracking-[0.08em] select-none transition-all duration-200 cursor-pointer ${colorMap[item.color]}`

          const style =
            item.color === "lavender"
              ? { color: "var(--lavender)" }
              : item.color === "mauve"
                ? { color: "var(--mauve)" }
                : undefined

          const content = (
            <>
              {item.text}
              <span className="mx-6 text-zinc-700">/</span>
            </>
          )

          if (item.external) {
            return (
              <a
                key={item.text}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={baseClass}
                style={style}
              >
                {content}
              </a>
            )
          }
          return (
            <Link key={item.text} href={item.href} className={baseClass} style={style}>
              {content}
            </Link>
          )
        })}
      </Marquee>
    </section>
  )
}
