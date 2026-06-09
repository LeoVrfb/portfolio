"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import { LocaleSwitcher } from "@/components/layout/locale-switcher"
import { cn } from "@/lib/utils"

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
`

export function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const t = useTranslations("nav")

  const links = [
    { href: "/" as const, label: t("home") },
    { href: "/projets" as const, label: t("projects") },
    { href: "/services" as const, label: t("services") },
    { href: "/a-propos" as const, label: t("about") },
    { href: "/contact" as const, label: t("contact") },
  ]

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
          </Link>

          {/* Desktop nav — pill en verre */}
          <div className="nav-pill-glass hidden md:flex items-center gap-1 px-2 py-2">
            {links.map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/")
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

          {/* Desktop — locale switcher à droite */}
          <div className="hidden md:flex items-center">
            <LocaleSwitcher />
          </div>

          {/* Mobile — switcher + burger */}
          <div className="md:hidden flex items-center gap-2">
            <LocaleSwitcher />
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? t("menuClose") : t("menuOpen")}
              aria-expanded={open}
              className="p-2 rounded-xl border border-white/10 bg-white/4 text-zinc-300 hover:text-white hover:bg-white/8 transition-all cursor-pointer"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-3 rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-2xl overflow-hidden">
            {/* Header mobile menu */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
              <span className="text-sm font-bold text-white">Léo Hengebaert</span>
              <button
                onClick={() => setOpen(false)}
                aria-label={t("menuClose")}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Links */}
            <div className="p-3 space-y-0.5">
              {links.map(({ href, label }) => {
                const isActive = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/")
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
          </div>
        )}
      </div>
    </header>
  )
}
