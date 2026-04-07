"use client"

import Link from "next/link"
import { Marquee } from "@/components/animations/marquee"

type Item = {
  text: string
  color: "muted" | "lavender" | "mauve" | "accent"
  href?: string
  external?: boolean
}

const ITEMS: Item[] = [
  { text: "À propos", href: "/a-propos", color: "lavender" },
  { text: "Code soigné", color: "muted" },
  { text: "Argedis × TotalEnergies", href: "/projets/argedis-totalenergies", color: "mauve" },
  { text: "Interfaces performantes", color: "muted" },
  { text: "Services", href: "/services", color: "lavender" },
  { text: "Design sur mesure", color: "muted" },
  { text: "Sweetime × ADP", href: "/projets/sweetime-adp-extime", color: "mauve" },
  { text: "Accessibilité & SEO", color: "muted" },
  { text: "Projets", href: "/projets", color: "lavender" },
  { text: "Exigence à chaque ligne", color: "muted" },
  { text: "Instagram", href: "https://instagram.com/leohengebaert", color: "mauve", external: true },
  { text: "Architecture évolutive", color: "muted" },
  { text: "Contact", href: "/contact", color: "lavender" },
  { text: "Responsive & mobile-first", color: "muted" },
  { text: "Hurepoix Nettoyage", href: "/projets/hurepoix-nettoyage", color: "mauve" },
  { text: "Collaboration fluide", color: "muted" },
]

const colorMap: Record<Item["color"], string> = {
  muted: "text-zinc-400 hover:text-white",
  lavender: "hover:opacity-70",
  mauve: "hover:opacity-70",
  accent: "text-accent hover:opacity-80",
}

export function TechBand() {
  return (
    <section className="py-5 border-y border-white/5 bg-background overflow-hidden cursor-pointer">
      <Marquee pauseOnHover className="[--duration:55s] [--gap:0rem]">
        {ITEMS.map((item) => {
          const isLink = !!item.href
          const baseClass = `text-xs font-semibold uppercase tracking-[0.18em] select-none transition-all duration-200 ${
            isLink ? "cursor-pointer" : "cursor-default"
          } ${colorMap[item.color]}`

          const style =
            item.color === "lavender"
              ? { color: "var(--lavender)" }
              : item.color === "mauve"
                ? { color: "var(--mauve)" }
                : undefined

          const content = (
            <>
              {item.text}
              <span className="mx-8 text-zinc-600">·</span>
            </>
          )

          if (item.href && item.external) {
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
          if (item.href) {
            return (
              <Link key={item.text} href={item.href} className={baseClass} style={style}>
                {content}
              </Link>
            )
          }
          return (
            <span key={item.text} className={baseClass} style={style}>
              {content}
            </span>
          )
        })}
      </Marquee>
    </section>
  )
}
