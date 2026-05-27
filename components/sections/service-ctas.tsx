"use client"

import { useTranslations } from "next-intl"
import { Calendar, Mail } from "lucide-react"
import { scrollToAnchor } from "@/lib/scroll-to-anchor"

function handleAnchor(id: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToAnchor(id)
  }
}

export function ServiceCtaInline({ color }: { color: string }) {
  const t = useTranslations("serviceCtas")

  return (
    <section className="py-10 sm:py-12 flex justify-center">
      <a
        href="#booking"
        onClick={handleAnchor("booking")}
        className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 cursor-pointer"
        style={{ background: color, color: "var(--background)" }}
      >
        <Calendar className="w-4 h-4" />
        {t("bookMyCall")}
      </a>
    </section>
  )
}

export function ServiceCtaFinal({ color }: { color: string }) {
  const t = useTranslations("serviceCtas")

  return (
    <section className="py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3">
          {t("readyToAct").split(t("readyToActAccent")).map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>
                {part}
                <span style={{ color }}>{t("readyToActAccent")}</span>
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </h2>
        <p className="text-sm sm:text-base text-white/65 leading-relaxed mb-7">
          {t("finalDescription")}
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <a
            href="#booking"
            onClick={handleAnchor("booking")}
            className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 cursor-pointer"
            style={{ background: color, color: "var(--background)" }}
          >
            <Calendar className="w-4 h-4" />
            {t("bookCall")}
          </a>

          <a
            href="#configurateur"
            onClick={handleAnchor("configurateur")}
            className="group inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-white border border-white/15 hover:border-white/30 hover:bg-white/4 transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            {t("receiveEstimation")}
          </a>
        </div>
      </div>
    </section>
  )
}
