"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/projets", label: "Projets" },
  { href: "/services", label: "Services" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
]

// Glass effect sur le conteneur pill du nav
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

/* Bordure avec reflet lumineux qui tourne au hover */
.nav-pill-glass::after {
  content: "";
  position: absolute;
  z-index: 1;
  inset: 0;
  border-radius: 999vw;
  width: calc(100% + var(--bw));
  height: calc(100% + var(--bw));
  top: calc(0% - var(--bw) / 2);
  left: calc(0% - var(--bw) / 2);
  padding: var(--bw);
  box-sizing: border-box;
  background:
    conic-gradient(
      from var(--npg-angle) at 50% 50%,
      rgba(255,255,255,0.25),
      rgba(255,255,255,0) 5% 45%,
      rgba(255,255,255,0.25) 50%,
      rgba(255,255,255,0) 60% 95%,
      rgba(255,255,255,0.25)
    ),
    linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06));
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  pointer-events: none;
  transition: --npg-angle 600ms var(--ease);
  box-shadow: inset 0 0 0 calc(var(--bw) / 2) rgba(255,255,255,0.08);
}

.nav-pill-glass:hover::after {
  --npg-angle: -125deg;
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
            className="text-sm font-semibold text-white/80 tracking-tight hover:text-white transition-colors cursor-pointer"
          >
            Léo Hengebaert
          </Link>

          {/* Desktop nav — pill en verre */}
          <div className="nav-pill-glass hidden md:flex items-center gap-6 px-7 py-3">
            {links.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/")
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative z-10 text-sm transition-colors duration-200 cursor-pointer tracking-wide",
                    isActive
                      ? "text-white font-medium"
                      : "text-zinc-500 hover:text-zinc-200"
                  )}
                >
                  {label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* CTA — pill blanche simple */}
          <div className="hidden md:flex items-center">
            <a
              href="mailto:leo.hengebaert75@gmail.com"
              className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors cursor-pointer"
            >
              Disponible
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-3 p-4 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl space-y-1">
            {links.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/")
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors",
                    isActive
                      ? "text-white font-medium"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/4"
                  )}
                >
                  {isActive && <span className="w-1 h-1 rounded-full bg-accent" />}
                  {label}
                </Link>
              )
            })}
            <div className="pt-2 border-t border-white/8 mt-2">
              <a
                href="mailto:leo.hengebaert75@gmail.com"
                className="block px-4 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-zinc-200 hover:bg-white/4 transition-colors"
              >
                leo.hengebaert75@gmail.com
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
