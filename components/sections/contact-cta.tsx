"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BackgroundGradientAnimation } from "@/components/animations/bg-gradient"
import { BlurFade } from "@/components/animations/blur-fade"

export function ContactCTA() {
  return (
    <section className="relative overflow-hidden">
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(13, 21, 18)"
        gradientBackgroundEnd="rgb(8, 16, 14)"
        firstColor="110, 166, 150"
        secondColor="77, 138, 120"
        thirdColor="187, 160, 197"
        fourthColor="180, 133, 158"
        fifthColor="139, 191, 175"
        pointerColor="110, 166, 150"
        size="65%"
        interactive={false}
        containerClassName="!h-auto !w-full min-h-[50vh] flex items-center justify-center"
        className="absolute inset-0 z-10 flex items-center justify-center"
      >
        <div className="relative z-20 text-center max-w-3xl mx-auto px-6 py-28">
          <BlurFade delay={0.1} direction="up" inView>
            <p className="text-xs uppercase tracking-[0.5em] text-accent/60 font-semibold mb-6">
              Travaillons ensemble
            </p>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
              Un projet ?<br />
              <span className="text-white/50">Parlons-en.</span>
            </h2>
            <p className="text-lg text-zinc-400 font-light mb-10 max-w-md mx-auto leading-relaxed">
              Que ce soit pour un site vitrine, une app web ou une collaboration — je suis disponible.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-200 cursor-pointer"
              >
                Envoyer un message
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="mailto:leo.hengebaert75@gmail.com"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/15 text-zinc-300 text-sm font-medium hover:bg-white/5 hover:border-white/30 transition-all duration-200 cursor-pointer"
              >
                leo.hengebaert75@gmail.com
              </a>
            </div>
          </BlurFade>
        </div>
      </BackgroundGradientAnimation>
    </section>
  )
}
