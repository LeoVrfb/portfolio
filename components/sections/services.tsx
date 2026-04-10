"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BlurFade } from "@/components/animations/blur-fade"

export function ServicesSection() {
  return (
    <section className="pt-16 pb-28 bg-background">
      <div className="layout-container">
        <div className="grid lg:grid-cols-[1fr_1px_1fr] gap-0 items-stretch">

          {/* Pitch 1 — projet web */}
          <BlurFade delay={0.1} direction="up" inView>
            <div className="lg:pr-16 pb-12 lg:pb-0">
              <p className="text-xs uppercase tracking-[0.45em] text-accent font-semibold mb-4">
                Sites web sur mesure
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight mb-5">
                Vous avez<br />un projet web ?
              </h2>
              <p className="text-base text-foreground/55 leading-relaxed mb-8 max-w-md">
                Artisan, coach, artiste, restaurant, entrepreneur — peu importe votre activité. Je crée des sites sur mesure, performants et faciles à trouver sur Google. Pas de template, pas de WordPress. Du code propre, livré rapidement.
              </p>
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-accent/40 bg-accent/8 text-sm font-bold text-accent hover:bg-accent/15 hover:border-accent/60 transition-all cursor-pointer"
              >
                Voir les formules & tarifs
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </BlurFade>

          {/* Separator */}
          <div className="hidden lg:block bg-white/8" />
          <div className="lg:hidden h-px bg-white/8 mb-12" />

          {/* Pitch 2 — recrutement */}
          <BlurFade delay={0.2} direction="up" inView>
            <div className="lg:pl-16">
              <p className="text-xs uppercase tracking-[0.45em] font-semibold mb-4" style={{ color: "var(--lavender)" }}>
                Collaboration
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight mb-5">
                Mon profil<br />vous intéresse ?
              </h2>
              <p className="text-base text-foreground/55 leading-relaxed mb-8 max-w-md">
                Je suis ouvert aux opportunités — en CDI dans une équipe tech ambitieuse, ou en mission freelance pour renforcer vos projets React & Next.js. Basé en Île-de-France, disponible en remote.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full border text-sm font-bold transition-all cursor-pointer"
                style={{
                  borderColor: "color-mix(in srgb, var(--lavender) 40%, transparent)",
                  background: "color-mix(in srgb, var(--lavender) 8%, transparent)",
                  color: "var(--lavender)",
                }}
              >
                Me contacter
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </BlurFade>

        </div>
      </div>
    </section>
  )
}
