"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Marquee } from "@/components/animations/marquee"

type Color = "lavender" | "mauve" | "accent"

type InternalItem = {
  kind: "internal"
  text: string
  color: Color
  href: "/projets" | "/a-propos" | "/services" | "/contact"
}

type ProjectItem = {
  kind: "project"
  text: string
  color: Color
  slug: string
}

type ExternalItem = {
  kind: "external"
  text: string
  color: Color
  href: string
}

type Item = InternalItem | ProjectItem | ExternalItem

const NEON: Record<Color, { base: string; glow: string }> = {
  lavender: {
    base: "var(--lavender)",
    glow: "0 0 6px rgba(187,160,197,0.9), 0 0 18px rgba(187,160,197,0.5), 0 0 35px rgba(187,160,197,0.25)",
  },
  mauve: {
    base: "var(--mauve)",
    glow: "0 0 6px rgba(180,133,158,0.9), 0 0 18px rgba(180,133,158,0.5), 0 0 35px rgba(180,133,158,0.25)",
  },
  accent: {
    base: "var(--accent)",
    glow: "0 0 6px rgba(110,166,150,0.9), 0 0 18px rgba(110,166,150,0.5), 0 0 35px rgba(110,166,150,0.25)",
  },
}

function BandItem({ item }: { item: Item }) {
  const [hovered, setHovered] = useState(false)
  const neon = NEON[item.color]

  const style: React.CSSProperties = {
    color: neon.base,
    textShadow: hovered ? neon.glow : "none",
    transition: "text-shadow 0.15s ease",
    display: "flex",
    alignItems: "center",
    paddingBlock: "0.6rem",
    cursor: "pointer",
  }

  const content = (
    <>
      {item.text}
      <span style={{ margin: "0 1.5rem", color: "rgb(63,63,70)", textShadow: "none" }}>|</span>
    </>
  )

  const className = "text-xl font-black uppercase tracking-[0.08em] select-none"

  if (item.kind === "external") {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {content}
      </a>
    )
  }

  if (item.kind === "project") {
    return (
      <Link
        href={`/projets/${item.slug}`}
        className={className}
        style={style}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {content}
      </Link>
    )
  }

  return (
    <Link
      href={item.href}
      className={className}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {content}
    </Link>
  )
}

export function TechBand() {
  const [paused, setPaused] = useState(false)
  const t = useTranslations("nav")

  // Mix d'items i18n (liens internes) + items "littéraux" (noms propres
  // qui ne se traduisent pas : marques, projets, réseaux sociaux).
  const items: Item[] = [
    { kind: "internal", text: t("projects"), href: "/projets", color: "lavender" },
    { kind: "project", text: "Argedis × TotalEnergies", slug: "argedis-totalenergies", color: "mauve" },
    { kind: "internal", text: t("about"), href: "/a-propos", color: "lavender" },
    { kind: "project", text: "Sweetime × ADP", slug: "sweetime-adp-extime", color: "mauve" },
    { kind: "external", text: "LinkedIn", href: "https://linkedin.com/in/leo-hengebaert", color: "accent" },
    { kind: "project", text: "BNP Paribas", slug: "bnp-paribas-elearning", color: "mauve" },
    { kind: "internal", text: t("services"), href: "/services", color: "lavender" },
    { kind: "project", text: "Make a Scene", slug: "make-a-scene", color: "mauve" },
    { kind: "external", text: "GitHub", href: "https://github.com/LeoVrfb", color: "accent" },
    { kind: "internal", text: t("contact"), href: "/contact", color: "lavender" },
    { kind: "project", text: "Bald", slug: "bald-artiste", color: "mauve" },
    { kind: "external", text: "Instagram", href: "https://instagram.com/leohengebaert", color: "accent" },
  ]

  return (
    <section
      className="border-y border-white/5 bg-background overflow-hidden cursor-pointer"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Marquee paused={paused} className="[--duration:60s] [--gap:0rem]">
        {items.map((item, i) => (
          <BandItem key={`${item.kind}-${i}-${item.text}`} item={item} />
        ))}
      </Marquee>
    </section>
  )
}
