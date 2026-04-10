"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/projets", label: "Projets" },
  { href: "/services", label: "Services" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
]

const NAV_GLASS_CSS = `
@property --npg-angle { syntax: "<angle>"; inherits: false; initial-value: -75deg; }

.nav-pill-glass {
  --bw: 1px;
  --t: 500ms;
  --ease: cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
  background: linear-gradient(-75deg, rgba(255,255,255,0.04), rgba(255,255,255,0.10), rgba(255,255,255,0.04));
  border-radius: 999vw;
  box-shadow:
    inset 0 1px 1px rgba(255,255,255,0.08),
    inset 0 -1px 1px rgba(255,255,255,0.04),
    0 4px 12px -4px rgba(0,0,0,0.4),
    0 0 0 1px inset rgba(255,255,255,0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: box-shadow var(--t) var(--ease);
}
.nav-pill-glass:hover {
  box-shadow:
    inset 0 1px 1px rgba(255,255,255,0.10),
    inset 0 -1px 1px rgba(255,255,255,0.06),
    0 4px 16px -4px rgba(0,0,0,0.5),
    0 0 0 1px inset rgba(255,255,255,0.10);
}
.nav-pill-glass::after {
  content: "";
  position: absolute; z-index: 1; inset: 0; border-radius: 999vw;
  width: calc(100% + var(--bw)); height: calc(100% + var(--bw));
  top: calc(0% - var(--bw) / 2); left: calc(0% - var(--bw) / 2);
  padding: var(--bw); box-sizing: border-box;
  background:
    conic-gradient(from var(--npg-angle) at 50% 50%,
      rgba(255,255,255,0.25), rgba(255,255,255,0) 5% 45%,
      rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 60% 95%,
      rgba(255,255,255,0.25)),
    linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06));
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude; -webkit-mask-composite: xor;
  pointer-events: none;
  transition: --npg-angle 600ms var(--ease);
  box-shadow: inset 0 0 0 calc(var(--bw) / 2) rgba(255,255,255,0.08);
}
.nav-pill-glass:hover::after { --npg-angle: -125deg; }

/* CTA disponible */
.nav-cta {
  --t: 300ms;
  --ease: cubic-bezier(0.25, 1, 0.5, 1);
  display: inline-flex; align-items: center; gap: 6px;
  padding: 0.45em 1.1em; border-radius: 999vw;
  background: linear-gradient(-75deg, rgba(110,166,150,0.10), rgba(110,166,150,0.20), rgba(110,166,150,0.10));
  border: 1px solid rgba(110,166,150,0.30);
  color: rgba(180,230,215,1);
  font-size: 0.8125rem; font-weight: 600;
  box-shadow: 0 0 12px rgba(110,166,150,0.08), inset 0 1px rgba(255,255,255,0.06);
  backdrop-filter: blur(8px);
  transition: all var(--t) var(--ease);
  cursor: pointer; text-decoration: none;
}
.nav-cta:hover {
  background: linear-gradient(-75deg, rgba(110,166,150,0.16), rgba(110,166,150,0.28), rgba(110,166,150,0.16));
  border-color: rgba(110,166,150,0.50);
  box-shadow: 0 0 20px rgba(110,166,150,0.14), inset 0 1px rgba(255,255,255,0.08);
}
`

export function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <style>{NAV_GLASS_CSS}</style>
      <div className="layout-container py-5">
        <nav className="flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <span className="text-sm font-bold text-white/85 tracking-tight group-hover:text-white transition-colors">
              Léo Hengebaert
            </span>
            <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-accent/25 bg-accent/8 text-[10px] font-semibold text-accent tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Disponible
            </span>
          </Link>

          {/* Desktop nav — pill en verre */}
          <div className="nav-pill-glass hidden md:flex items-center gap-1 px-2 py-2">
            {links.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/")
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative z-10 text-sm px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer tracking-wide",
                    isActive
                      ? "text-white font-semibold bg-white/8"
                      : "text-foreground/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <Link href="/contact" className="nav-cta">
              Me contacter
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl border border-white/10 bg-white/4 text-zinc-300 hover:text-white hover:bg-white/8 transition-all cursor-pointer"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-3 rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-2xl overflow-hidden">
            {/* Header mobile menu */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Léo Hengebaert</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-accent/25 bg-accent/8 text-[10px] font-semibold text-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Disponible
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Links */}
            <div className="p-3 space-y-0.5">
              {links.map(({ href, label }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/")
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer",
                      isActive
                        ? "text-white bg-white/6"
                        : "text-foreground/65 hover:text-white hover:bg-white/4"
                    )}
                  >
                    <span>{label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                  </Link>
                )
              })}
            </div>

            {/* CTA bottom */}
            <div className="px-3 pb-3 pt-1">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
                style={{
                  background: "linear-gradient(-75deg, rgba(110,166,150,0.12), rgba(110,166,150,0.22), rgba(110,166,150,0.12))",
                  border: "1px solid rgba(110,166,150,0.30)",
                  color: "rgba(180,230,215,1)",
                }}
              >
                Me contacter
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
