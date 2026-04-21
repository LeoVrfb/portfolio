"use client"

import { Calendar, ArrowDown, Mail, ArrowRight } from "lucide-react"

// ─── CTA #1 — Transition vers le configurateur ─────────────────────────────
// Affiché après les témoignages : on pousse l'appel découverte en CTA principal,
// le configurateur devient un outil bonus pour ceux qui veulent juste estimer.

export function ServiceCtaDiscovery({
  color,
  formuleNom,
}: {
  color: string
  formuleNom: string
}) {
  return (
    <section className="py-16 sm:py-20">
      <div
        className="rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 text-center"
        style={{
          background: `linear-gradient(135deg, color-mix(in oklab, ${color} 12%, transparent), color-mix(in oklab, var(--accent) 6%, transparent))`,
          border: `1px solid color-mix(in oklab, ${color} 25%, transparent)`,
        }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3 block"
          style={{ color }}
        >
          Prochaine étape
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-[1.05]">
          Le mieux,
          <br />
          c&apos;est <span style={{ color }}>d&apos;en parler</span>
        </h2>
        <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed mb-8">
          Un appel découverte de 15 minutes pour vous, c&apos;est{" "}
          <span className="text-white font-semibold">
            la meilleure façon de voir si la formule {formuleNom} colle à votre projet
          </span>
          . On échange, je vous donne mon avis franc, vous repartez avec un plan clair.
          Aucun engagement, aucun paiement.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href="#calendly"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 cursor-pointer"
            style={{ background: color, color: "var(--background)" }}
          >
            <Calendar className="w-4 h-4" />
            Réserver mon appel découverte
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>

          <span className="hidden sm:block text-xs text-white/40">ou</span>

          <a
            href="#configurateur"
            className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white/80 hover:text-white border border-white/15 hover:border-white/30 hover:bg-white/4 transition-all cursor-pointer"
          >
            Voir le configurateur
            <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>

        <p className="text-[11px] text-white/45 mt-6">
          L&apos;estimation par mail reste possible · Le configurateur est juste là pour vous
          donner une idée des options
        </p>
      </div>
    </section>
  )
}

// ─── CTA #2 — Final, après le configurateur ────────────────────────────────
// Double choix : Réserver un appel (primaire) OU Voir mon estimation (secondaire,
// scroll vers la sticky card du configurateur).

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
            href="#calendly"
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
