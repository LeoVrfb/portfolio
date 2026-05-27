"use client"

import { useTranslations } from "next-intl"
import { motion, useInView } from "motion/react"
import { useRef } from "react"
import { MessageSquare, Palette, Sparkles, Rocket, type LucideIcon } from "lucide-react"

type Step = {
  num: string
  titre: string
  description: string
  icon: LucideIcon
}

// Icons keyed by step index (0-based)
const STEP_ICONS: LucideIcon[] = [MessageSquare, Palette, Sparkles, Rocket]

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
      <div
        className="relative w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{
          background: "var(--bg2, #191918)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <Icon className="w-5 h-5" strokeWidth={1.6} style={{ color }} />
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
  formuleSlug: string
}

export function ServiceWorkflow({ color, delai, formuleSlug }: ServiceWorkflowProps) {
  const t = useTranslations("serviceWorkflow")

  // Get steps for the current formule (fallback to "standard")
  const slug = ["essentiel", "standard", "premium"].includes(formuleSlug) ? formuleSlug : "standard"
  const rawSteps = t.raw(`steps.${slug}`) as Array<{ num: string; titre: string; description: string }>

  const steps: Step[] = rawSteps.map((s, i) => ({
    ...s,
    icon: STEP_ICONS[i] ?? Rocket,
  }))

  return (
    <section className="py-16 sm:py-20">
      <div className="text-center mb-10 sm:mb-12">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3 block"
          style={{ color }}
        >
          {t("eyebrow")}
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
          {t("title", { delai }).split(delai).map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>
                {part}
                <span style={{ color }}>{delai}</span>
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </h2>
        <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 lg:gap-y-0 lg:gap-x-4 mt-10">
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
