"use client"

import { motion, useInView } from "motion/react"
import { useRef } from "react"
import { MessageSquare, Palette, Sparkles, Rocket } from "lucide-react"

type Step = {
  num: string
  titre: string
  description: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
}

const steps: Step[] = [
  {
    num: "01",
    titre: "Le brief",
    description: "On échange et je comprends votre univers, votre clientèle, vos objectifs.",
    icon: MessageSquare,
  },
  {
    num: "02",
    titre: "La direction",
    description: "Je vous propose 2 ou 3 ambiances visuelles par mail, vous choisissez celle qui vous parle.",
    icon: Palette,
  },
  {
    num: "03",
    titre: "La première ébauche",
    description: "Une page clé conçue pour valider le style. Vous validez, je continue avec votre confiance.",
    icon: Sparkles,
  },
  {
    num: "04",
    titre: "Production & livraison",
    description: "Finitions, optimisations, mise en ligne. Le site est à vous, prêt à accueillir vos clients.",
    icon: Rocket,
  },
]

const ease = [0.16, 1, 0.3, 1] as const

function StepCell({ step, index, color }: { step: Step; index: number; color: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const Icon = step.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease, delay: index * 0.08 }}
      className="relative z-1 flex flex-col items-center text-center px-2"
    >
      {/* Icône ronde avec halo couleur formule */}
      <div
        className="relative w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{
          background: "var(--bg2, #191918)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <Icon className="w-5 h-5" strokeWidth={1.6} style={{ color }} />
        {/* Halo extérieur — repris du V3 */}
        <span
          aria-hidden
          className="absolute -inset-1 rounded-full pointer-events-none"
          style={{
            border: `1px solid color-mix(in oklab, ${color} 30%, transparent)`,
          }}
        />
      </div>

      <span
        className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55 mb-1.5"
      >
        {step.num}
      </span>
      <h3 className="text-[13px] sm:text-sm font-bold text-white mb-1.5">
        {step.titre}
      </h3>
      <p className="text-[11px] sm:text-xs text-white/85 leading-relaxed max-w-[16rem]">
        {step.description}
      </p>
    </motion.div>
  )
}

export function ServiceWorkflow({ color, delai }: { color: string; delai: string }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="text-center mb-10 sm:mb-12">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3 block"
          style={{ color }}
        >
          Comment ça se passe
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
          Un process en <span style={{ color }}>4 étapes</span>, livré en {delai}
        </h2>
        <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto leading-relaxed">
          Vous savez à tout moment où on en est. Pas de surprise, pas de tunnel sans nouvelles.
        </p>
      </div>

      {/* Process steps — 4 cellules en ligne sur lg, 2x2 sur md, 1 col sur mobile.
          La ligne pointillée passe DERRIÈRE les cercles (z-0), uniquement sur lg+. */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 lg:gap-y-0 lg:gap-x-4 mt-10">
        {/* Ligne pointillée horizontale — repère visuel reliant les 4 étapes */}
        <span
          aria-hidden
          className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-px pointer-events-none z-0"
          style={{
            background: `repeating-linear-gradient(90deg, color-mix(in oklab, ${color} 32%, transparent) 0, color-mix(in oklab, ${color} 32%, transparent) 6px, transparent 6px, transparent 14px)`,
          }}
        />

        {steps.map((step, i) => (
          <StepCell key={step.num} step={step} index={i} color={color} />
        ))}
      </div>
    </section>
  )
}
