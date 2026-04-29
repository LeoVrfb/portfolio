"use client"

import { motion, useInView } from "motion/react"
import { useRef } from "react"
import { MessageSquare, Palette, Sparkles, Rocket, type LucideIcon } from "lucide-react"

type Step = {
  num: string
  titre: string
  description: string
  icon: LucideIcon
}

// Process différencié par formule. La direction artistique évolue clairement
// d'une formule à l'autre : Essentiel reste modeste (palette de couleurs +
// confiance), Standard pousse l'effort (vraie identité + page démo codée),
// Premium va beaucoup plus loin (recherche d'identité, composants sur mesure).
// Pas de mention de Figma ou de maquettes : tout est codé directement.
const STEPS_BY_FORMULE: Record<string, Step[]> = {
  essentiel: [
    {
      num: "01",
      titre: "Le brief",
      description:
        "On échange en visio. Je comprends votre univers, votre clientèle, vos objectifs.",
      icon: MessageSquare,
    },
    {
      num: "02",
      titre: "La direction",
      description:
        "Je vous propose une palette de couleurs et un style adapté à votre activité. Une fois décidé, je prends les commandes.",
      icon: Palette,
    },
    {
      num: "03",
      titre: "La première ébauche",
      description:
        "Je vous montre une première page complète. À partir de là, vous me faites confiance jusqu'à la livraison.",
      icon: Sparkles,
    },
    {
      num: "04",
      titre: "Production & livraison",
      description:
        "Finitions, optimisations, mise en ligne. Votre site est prêt à accueillir vos premiers visiteurs.",
      icon: Rocket,
    },
  ],
  standard: [
    {
      num: "01",
      titre: "Le brief",
      description:
        "On échange en visio. Je comprends votre univers, votre clientèle, vos objectifs.",
      icon: MessageSquare,
    },
    {
      num: "02",
      titre: "La direction",
      description:
        "Je vous propose une vraie identité visuelle : palette, typographies, et une page de démo codée pour vous montrer concrètement le rendu.",
      icon: Palette,
    },
    {
      num: "03",
      titre: "La première ébauche",
      description:
        "On affine ensemble cette page jusqu'à ce qu'elle vous ressemble vraiment. C'est la base qui guide tout le reste du site.",
      icon: Sparkles,
    },
    {
      num: "04",
      titre: "Production & livraison",
      description:
        "Construction des autres pages, finitions, optimisations, mise en ligne. Votre site est prêt à convertir.",
      icon: Rocket,
    },
  ],
  premium: [
    {
      num: "01",
      titre: "Le brief",
      description:
        "Échange approfondi sur votre univers, votre clientèle, votre positionnement et vos ambitions à 3-5 ans.",
      icon: MessageSquare,
    },
    {
      num: "02",
      titre: "La direction",
      description:
        "Recherche d'identité poussée : 2 ou 3 univers visuels distincts, composants sur mesure, inspirations puisées dans le meilleur du web.",
      icon: Palette,
    },
    {
      num: "03",
      titre: "La première ébauche",
      description:
        "Une page clé entièrement designée et codée pour incarner l'identité. Itérations jusqu'à ce qu'elle vous représente parfaitement.",
      icon: Sparkles,
    },
    {
      num: "04",
      titre: "Production & livraison",
      description:
        "Construction complète, animations sur mesure, performance poussée, mise en ligne. Un site qui marque les esprits.",
      icon: Rocket,
    },
  ],
}

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

type ServiceWorkflowProps = {
  color: string
  delai: string
  /** Slug de la formule pour récupérer le bon process. Fallback sur "standard" si inconnu. */
  formuleSlug: string
}

export function ServiceWorkflow({ color, delai, formuleSlug }: ServiceWorkflowProps) {
  const steps = STEPS_BY_FORMULE[formuleSlug] ?? STEPS_BY_FORMULE.standard

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
