"use client"

import { useEffect, useState } from "react"
import { Calendar } from "lucide-react"

// Floating Action Button "Réserver un appel" — visible en permanence pendant
// le scroll, scroll smooth vers #booking au clic.
//
// Logique d'apparition :
// - Caché tout en haut de la page (juste avant le 1er bouton "Réserver" du header)
// - Apparaît dès qu'on a scrollé un peu (300px)
// - Caché quand le calendar est visible (intersection observer sur #booking)

type BookingFloatingCtaProps = {
  /** Couleur d'accent de la formule (var CSS ou couleur hex). */
  color?: string
}

export function BookingFloatingCta({ color = "var(--accent)" }: BookingFloatingCtaProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Logique d'affichage : visible si on a scrollé > 300px ET que la section
    // booking n'est pas (ou plus) dans la viewport. Calcul scroll-based plutôt
    // qu'IntersectionObserver pour être plus fiable face aux animations / mount
    // progressif (FadeUp, etc.).
    const update = () => {
      const scrolled = window.scrollY > 300
      const bookingEl = document.getElementById("booking")
      if (!bookingEl) {
        setVisible(scrolled)
        return
      }
      const rect = bookingEl.getBoundingClientRect()
      // On cache dès que le top du booking entre dans la viewport (rect.top < innerHeight)
      // et qu'on n'a pas encore complètement dépassé la section (rect.bottom > 80).
      const bookingInView = rect.top < window.innerHeight && rect.bottom > 80
      setVisible(scrolled && !bookingInView)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update, { passive: true })
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById("booking")
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <a
      href="#booking"
      onClick={handleClick}
      aria-label="Réserver un appel découverte"
      className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 inline-flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full text-sm font-bold cursor-pointer transition-all duration-300 shadow-2xl hover:scale-[1.03] ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{
        background: color,
        color: "var(--background)",
        boxShadow: `0 10px 30px -8px color-mix(in oklab, ${color} 60%, transparent), 0 4px 12px -4px rgba(0,0,0,0.4)`,
      }}
    >
      <Calendar className="w-4 h-4" />
      <span className="hidden sm:inline">Réserver un appel</span>
      <span className="sm:hidden">Réserver</span>
    </a>
  )
}
