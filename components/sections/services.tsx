"use client"

import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { BlurFade } from "@/components/animations/blur-fade"

export function ServicesSection() {
  const t = useTranslations("home.services")

  return (
    <section className="pt-16 pb-28 bg-background">
      <div className="layout-container">
        <div className="grid lg:grid-cols-[1fr_1px_1fr] gap-0 items-stretch">

          {/* Pitch 1 — projet web */}
          <BlurFade delay={0.1} direction="up" inView className="h-full">
            <div className="lg:pr-16 pb-12 lg:pb-0 h-full flex flex-col">
              <p className="text-xs uppercase tracking-[0.45em] text-accent font-semibold mb-4">
                {t("web.eyebrow")}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight mb-5">
                {t("web.titleLine1")}<br />{t("web.titleLine2")}
              </h2>
              <p className="text-base text-foreground/55 leading-relaxed max-w-md flex-1">
                {t("web.description")}
              </p>
              <div className="mt-8">
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-accent/40 bg-accent/8 text-sm font-bold text-accent hover:bg-accent/15 hover:border-accent/60 transition-all cursor-pointer"
                >
                  {t("web.cta")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </BlurFade>

          {/* Separator */}
          <div className="hidden lg:block bg-white/8" />
          <div className="lg:hidden h-px bg-white/8 mb-12" />

          {/* Pitch 2 — recrutement */}
          <BlurFade delay={0.2} direction="up" inView className="h-full">
            <div className="lg:pl-16 h-full flex flex-col">
              <p className="text-xs uppercase tracking-[0.45em] font-semibold mb-4" style={{ color: "var(--lavender)" }}>
                {t("collab.eyebrow")}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight mb-5">
                {t("collab.titleLine1")}<br />{t("collab.titleLine2")}
              </h2>
              <p className="text-base text-foreground/55 leading-relaxed max-w-md flex-1">
                {t("collab.description")}
              </p>
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full border text-sm font-bold transition-all cursor-pointer"
                  style={{
                    borderColor: "color-mix(in srgb, var(--lavender) 40%, transparent)",
                    background: "color-mix(in srgb, var(--lavender) 8%, transparent)",
                    color: "var(--lavender)",
                  }}
                >
                  {t("collab.cta")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </BlurFade>

        </div>
      </div>
    </section>
  )
}
