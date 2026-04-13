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
  { text: "Make a Scene", href: "/projets/make-a-scene", color: "mauve" },
  { text: "GitHub", href: "https://github.com/LeoVrfb", color: "accent", external: true },
  { text: "Contact", href: "/contact", color: "lavender" },
  { text: "Bald", href: "/projets/bald-artiste", color: "mauve" },
  { text: "Instagram", href: "https://instagram.com/leohengebaert", color: "accent", external: true },
]

const NEON: Record<Item["color"], { base: string; glow: string }> = {
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

  if (item.external) {
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

  return (
    <section
      className="border-y border-white/5 bg-background overflow-hidden cursor-pointer"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Marquee paused={paused} className="[--duration:60s] [--gap:0rem]">
        {ITEMS.map((item) => (
          <BandItem key={item.text} item={item} />
        ))}
      </Marquee>
    </section>
  )
}
