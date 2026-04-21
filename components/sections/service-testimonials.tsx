"use client"

import { motion, useInView } from "motion/react"
import { useRef } from "react"
import { Star } from "lucide-react"
import { testimonials, type Testimonial } from "@/lib/testimonials"

const ease = [0.16, 1, 0.3, 1] as const

function TestimonialCard({
  testimonial,
  index,
  color,
}: {
  testimonial: Testimonial
  index: number
  color: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const initial = testimonial.nom.charAt(0).toUpperCase()

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease, delay: index * 0.06 }}
      className="rounded-xl border border-white/8 bg-white/2.5 p-6 flex flex-col gap-3"
    >
      <header className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
            border: "1px solid rgba(255,255,255,0.08)",
            color,
          }}
        >
          {initial}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-white truncate">{testimonial.nom}</div>
          <div className="text-xs text-white/55 truncate">
            {testimonial.role} · {testimonial.projet}
          </div>
        </div>
      </header>

      <div className="flex items-center gap-0.5" aria-label={`${testimonial.note} étoiles sur 5`}>
        {Array.from({ length: testimonial.note }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <p className="text-[13px] text-white/65 leading-relaxed font-normal">
        {testimonial.avis}
      </p>
    </motion.article>
  )
}

export function ServiceTestimonials({ color }: { color: string }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="text-center mb-10 sm:mb-12">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3 block"
          style={{ color }}
        >
          Ils m&apos;ont fait confiance
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
          Quelques retours de <span style={{ color }}>vrais clients</span>
        </h2>
        <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto leading-relaxed">
          Des indépendants et petites entreprises qui ont transformé leur présence en ligne avec moi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {testimonials.map((t, i) => (
          <TestimonialCard key={t.nom + t.projet} testimonial={t} index={i} color={color} />
        ))}
      </div>
    </section>
  )
}
