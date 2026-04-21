"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Calendar, Phone, Video, ArrowRight } from "lucide-react"

// Type minimal de l'API JS exposée par Calendly une fois le script chargé.
type CalendlyAPI = {
  initInlineWidgets?: () => void
}

// Récupère l'URL Calendly depuis les variables d'env (Next.js : NEXT_PUBLIC_* est exposé côté client).
// Tant que Léo n'a pas configuré son event Calendly et défini cette variable, on affiche un fallback propre.
//
// Pour activer le widget, ajouter dans .env.local :
//   NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/<username>/<event-slug>
//
// L'event Calendly attendu :
// - Durée : 15 min
// - Disponibilités : après-midi uniquement
// - Custom field : "Comment préférez-vous échanger ?" (Google Meet par défaut, Téléphone en alternative)
// - Si Téléphone choisi : champ "Numéro" devient requis
const CALENDLY_URL_RAW = process.env.NEXT_PUBLIC_CALENDLY_URL ?? ""

// Ajoute les params Calendly pour un widget compact :
// - hide_event_type_details=1 : cache la colonne de gauche (titre + durée + visio)
// - hide_gdpr_banner=1 : cache la bannière cookies en bas
// Conserve les params éventuellement déjà présents dans l'URL fournie par l'utilisateur.
const CALENDLY_URL = (() => {
  if (!CALENDLY_URL_RAW) return ""
  const sep = CALENDLY_URL_RAW.includes("?") ? "&" : "?"
  return `${CALENDLY_URL_RAW}${sep}hide_event_type_details=1&hide_gdpr_banner=1`
})()

type CalendlyEmbedProps = {
  /** Couleur de la formule (ex: service.color) — utilisée pour les highlights visuels. */
  accentColor?: string
}

export function CalendlyEmbed({ accentColor = "var(--accent)" }: CalendlyEmbedProps) {
  const hasCalendly = CALENDLY_URL.length > 0

  // Charge le script + le CSS officiel Calendly une seule fois côté client.
  // Si déjà chargés (HMR, navigation), on demande à Calendly de re-scanner le DOM
  // pour qu'il monte les nouveaux .calendly-inline-widget.
  useEffect(() => {
    if (!hasCalendly) return

    const STYLE_ID = "calendly-widget-style"
    if (!document.getElementById(STYLE_ID)) {
      const link = document.createElement("link")
      link.id = STYLE_ID
      link.rel = "stylesheet"
      link.href = "https://assets.calendly.com/assets/external/widget.css"
      document.head.appendChild(link)
    }

    const SCRIPT_ID = "calendly-widget-script"
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      const calendly = (window as unknown as { Calendly?: CalendlyAPI }).Calendly
      calendly?.initInlineWidgets?.()
      return
    }

    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)
  }, [hasCalendly])

  return (
    <section id="calendly" className="scroll-mt-24 py-16 sm:py-20">
      <div className="text-center mb-8 sm:mb-10">
        <span
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] mb-3"
          style={{ color: accentColor }}
        >
          <Calendar className="w-3.5 h-3.5" />
          Appel découverte · 15 min · offert
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
          On en parle <span style={{ color: accentColor }}>de vive voix</span> ?
        </h2>
        <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto leading-relaxed">
          Un appel de 15 minutes pour comprendre votre projet, répondre à vos questions
          et voir si on peut travailler ensemble. Aucun engagement.
        </p>

        <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/55">
          <span className="inline-flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5" />
            Google Meet
          </span>
          <span className="text-white/25">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            ou par téléphone
          </span>
          <span className="text-white/25">·</span>
          <span>Créneaux en après-midi</span>
        </div>
      </div>

      {hasCalendly ? (
        <div
          className="calendly-inline-widget rounded-2xl overflow-hidden"
          data-url={CALENDLY_URL}
          style={{ minWidth: "320px", height: "700px" }}
        />
      ) : (
        <CalendlyFallback accentColor={accentColor} />
      )}
    </section>
  )
}

function CalendlyFallback({ accentColor }: { accentColor: string }) {
  return (
    <div
      className="rounded-2xl border bg-white/2 p-8 sm:p-12 text-center max-w-2xl mx-auto"
      style={{
        borderColor: `color-mix(in oklab, ${accentColor} 22%, transparent)`,
        background: `linear-gradient(135deg, color-mix(in oklab, ${accentColor} 6%, transparent), transparent)`,
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{
          background: `color-mix(in oklab, ${accentColor} 14%, transparent)`,
          border: `1px solid color-mix(in oklab, ${accentColor} 30%, transparent)`,
        }}
      >
        <Calendar className="w-5 h-5" style={{ color: accentColor }} />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
        La prise de rendez-vous en ligne arrive bientôt
      </h3>
      <p className="text-sm text-white/65 max-w-md mx-auto mb-7 leading-relaxed">
        En attendant, écrivez-moi via le formulaire de contact. Je vous propose
        un créneau d&apos;appel découverte dans la foulée.
      </p>

      <Link
        href="/contact"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity"
        style={{ background: accentColor, color: "var(--background)" }}
      >
        Aller à la page contact
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
