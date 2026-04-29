"use client"

import { Calendar, Mail, ArrowRight } from "lucide-react"

// ─── Mini CTA inline ───────────────────────────────────────────────────────
// Petit bouton seul après les témoignages, pour les visiteurs déjà chauds qui
// veulent réserver tout de suite sans passer par le configurateur.
// Pas de bloc lourd ici : juste un bouton qui scroll vers le calendar.

export function ServiceCtaInline({ color }: { color: string }) {
  return (
    <section className="py-10 sm:py-12 flex justify-center">
      <a
        href="#booking"
        className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 cursor-pointer"
        style={{ background: color, color: "var(--background)" }}
      >
        <Calendar className="w-4 h-4" />
        Réserver mon appel découverte
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </section>
  )
}

// ─── CTA final — après le configurateur ────────────────────────────────────
// Double choix : Réserver un appel (primaire) OU Voir mon estimation (scroll
// vers la sticky card du configurateur). C'est le seul gros bloc CTA de la
// page : on a viré l'ancien "ServiceCtaDiscovery" pour ne pas surcharger.

export function ServiceCtaFinal({ color }: { color: string }) {
  return (
    <section className="py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3">
          Prêt à <span style={{ color }}>passer à l&apos;action</span> ?
        </h2>
        <p className="text-sm sm:text-base text-white/65 leading-relaxed mb-7">
          Que vous préfériez en parler maintenant ou recevoir d&apos;abord votre estimation par
          mail, on avance ensemble à votre rythme.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <a
            href="#booking"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 cursor-pointer"
            style={{ background: color, color: "var(--background)" }}
          >
            <Calendar className="w-4 h-4" />
            Réserver un appel
          </a>

          <a
            href="#configurateur"
            className="group inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-white border border-white/15 hover:border-white/30 hover:bg-white/4 transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            Recevoir mon estimation
          </a>
        </div>
      </div>
    </section>
  )
}
