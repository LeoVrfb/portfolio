"use client"

import { useState, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type SlideMockType = "browser" | "card-grid" | "form" | "stat" | "story"

export type DemoSlide = {
  label: string
  caption?: string
  type: SlideMockType
  /** couleur accent pour les éléments de l'UI mock */
  tint: string
}

interface DemoShowcaseSliderProps {
  slides: DemoSlide[]
  /** couleur dominante du chapitre — pour les flèches/dots */
  accent: string
  aspectRatio?: string
}

/* ─────────────────────────────────────────────────────────────────────
   MOCK UI — quelques templates différents pour chaque type de slide
───────────────────────────────────────────────────────────────────── */

function MockBrowser({ tint }: { tint: string }) {
  return (
    <div className="absolute inset-0 p-6 sm:p-8 flex flex-col">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: "hsl(0 0% 100% / 0.12)" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "hsl(0 0% 100% / 0.12)" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "hsl(0 0% 100% / 0.12)" }} />
        </div>
        <div className="flex-1 h-5 rounded-md ml-3" style={{ background: "hsl(0 0% 100% / 0.04)" }} />
      </div>

      {/* Hero text */}
      <div className="space-y-2 mb-5">
        <div className="h-2.5 w-1/2 rounded" style={{ background: tint, opacity: 0.4 }} />
        <div className="h-6 w-3/4 rounded" style={{ background: "hsl(0 0% 100% / 0.18)" }} />
        <div className="h-6 w-2/3 rounded" style={{ background: "hsl(0 0% 100% / 0.18)" }} />
      </div>

      {/* Content grid */}
      <div className="flex-1 grid grid-cols-3 gap-2.5">
        <div className="rounded-md" style={{ background: `linear-gradient(135deg, ${tint}, ${tint})`, opacity: 0.12 }} />
        <div className="rounded-md" style={{ background: "hsl(0 0% 100% / 0.06)" }} />
        <div className="rounded-md" style={{ background: "hsl(0 0% 100% / 0.04)" }} />
      </div>
    </div>
  )
}

function MockCardGrid({ tint }: { tint: string }) {
  return (
    <div className="absolute inset-0 p-6 sm:p-8 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-1.5 w-12 rounded" style={{ background: tint, opacity: 0.5 }} />
          <div className="h-3 w-28 rounded" style={{ background: "hsl(0 0% 100% / 0.18)" }} />
        </div>
        <div className="flex gap-1.5">
          <div className="w-7 h-7 rounded-md" style={{ background: "hsl(0 0% 100% / 0.05)" }} />
          <div className="w-7 h-7 rounded-md" style={{ background: tint, opacity: 0.18 }} />
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="rounded-lg p-3 flex flex-col gap-1.5"
            style={{
              background: "hsl(0 0% 100% / 0.03)",
              border: "1px solid hsl(0 0% 100% / 0.04)",
            }}
          >
            <div className="aspect-[4/3] rounded-md mb-1" style={{
              background: i % 2 === 0
                ? `linear-gradient(135deg, ${tint} 0%, transparent 100%)`
                : "hsl(0 0% 100% / 0.06)",
              opacity: i % 2 === 0 ? 0.18 : 1,
            }} />
            <div className="h-1.5 w-3/4 rounded" style={{ background: "hsl(0 0% 100% / 0.18)" }} />
            <div className="h-1.5 w-1/2 rounded" style={{ background: "hsl(0 0% 100% / 0.08)" }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function MockForm({ tint }: { tint: string }) {
  return (
    <div className="absolute inset-0 p-6 sm:p-8 flex flex-col gap-4">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        <div className="h-1 w-8 rounded-full" style={{ background: tint, opacity: 0.7 }} />
        <div className="h-1 w-8 rounded-full" style={{ background: tint, opacity: 0.4 }} />
        <div className="h-1 w-8 rounded-full" style={{ background: "hsl(0 0% 100% / 0.08)" }} />
        <div className="h-1 w-8 rounded-full" style={{ background: "hsl(0 0% 100% / 0.08)" }} />
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <div className="h-1.5 w-16 rounded" style={{ background: tint, opacity: 0.5 }} />
        <div className="h-4 w-3/4 rounded" style={{ background: "hsl(0 0% 100% / 0.22)" }} />
      </div>

      {/* Question card */}
      <div
        className="flex-1 rounded-xl p-4 flex flex-col gap-2.5"
        style={{
          background: `linear-gradient(135deg, ${tint} 0%, transparent 100%)`,
          backgroundColor: "hsl(0 0% 100% / 0.02)",
          border: `1px solid ${tint}`,
        }}
      >
        <div className="h-2.5 w-1/2 rounded" style={{ background: "hsl(0 0% 100% / 0.18)" }} />
        <div className="space-y-1.5 mt-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="h-7 rounded-md flex items-center px-3 gap-2"
              style={{
                background: i === 1 ? `color-mix(in oklab, ${tint} 18%, transparent)` : "hsl(0 0% 100% / 0.04)",
                border: i === 1 ? `1px solid ${tint}` : "1px solid hsl(0 0% 100% / 0.05)",
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{
                background: i === 1 ? tint : "hsl(0 0% 100% / 0.1)",
              }} />
              <div className="h-1.5 flex-1 rounded" style={{ background: "hsl(0 0% 100% / 0.1)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MockStat({ tint }: { tint: string }) {
  return (
    <div className="absolute inset-0 p-6 sm:p-8 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-1.5 w-12 rounded" style={{ background: tint, opacity: 0.5 }} />
          <div className="h-3 w-24 rounded" style={{ background: "hsl(0 0% 100% / 0.2)" }} />
        </div>
        <div className="h-6 w-16 rounded-full" style={{ background: `color-mix(in oklab, ${tint} 18%, transparent)`, border: `1px solid ${tint}` }} />
      </div>

      {/* Big number */}
      <div className="flex items-end gap-3">
        <div
          className="h-12 w-32 rounded"
          style={{ background: `linear-gradient(180deg, ${tint} 0%, transparent 130%)`, opacity: 0.5 }}
        />
        <div className="h-3 w-12 rounded mb-2" style={{ background: "hsl(0 0% 100% / 0.15)" }} />
      </div>

      {/* Chart */}
      <div className="flex-1 flex items-end gap-1.5 mt-1">
        {[40, 60, 35, 80, 55, 95, 70, 85, 50, 75].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t"
            style={{
              height: `${h}%`,
              background: i >= 7 ? tint : `color-mix(in oklab, ${tint} 35%, transparent)`,
              opacity: i >= 7 ? 0.7 : 1,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function MockStory({ tint }: { tint: string }) {
  return (
    <div className="absolute inset-0 flex">
      {/* Left side: image */}
      <div
        className="w-1/2 relative"
        style={{
          background: `linear-gradient(135deg, ${tint} 0%, transparent 100%)`,
          opacity: 0.18,
        }}
      >
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at 30% 40%, hsl(0 0% 100% / 0.08), transparent 60%)",
        }} />
      </div>

      {/* Right side: editorial layout */}
      <div className="w-1/2 p-6 sm:p-7 flex flex-col gap-3">
        <div className="h-1.5 w-16 rounded" style={{ background: tint, opacity: 0.6 }} />
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded" style={{ background: "hsl(0 0% 100% / 0.22)" }} />
          <div className="h-3 w-5/6 rounded" style={{ background: "hsl(0 0% 100% / 0.22)" }} />
        </div>
        <div className="space-y-1 mt-1">
          <div className="h-1.5 w-full rounded" style={{ background: "hsl(0 0% 100% / 0.1)" }} />
          <div className="h-1.5 w-full rounded" style={{ background: "hsl(0 0% 100% / 0.1)" }} />
          <div className="h-1.5 w-3/4 rounded" style={{ background: "hsl(0 0% 100% / 0.1)" }} />
        </div>
        <div className="mt-auto flex gap-2">
          <div className="h-7 w-20 rounded-full" style={{ background: tint, opacity: 0.7 }} />
          <div className="h-7 w-7 rounded-full" style={{ background: "hsl(0 0% 100% / 0.05)" }} />
        </div>
      </div>
    </div>
  )
}

const MOCK_COMPONENTS: Record<SlideMockType, React.FC<{ tint: string }>> = {
  browser: MockBrowser,
  "card-grid": MockCardGrid,
  form: MockForm,
  stat: MockStat,
  story: MockStory,
}

/* ─────────────────────────────────────────────────────────────────────
   SLIDER
───────────────────────────────────────────────────────────────────── */

export function DemoShowcaseSlider({
  slides,
  accent,
  aspectRatio = "aspect-[4/3]",
}: DemoShowcaseSliderProps) {
  const count = slides.length
  const [idx, setIdx] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const goNext = useCallback(() => setIdx(i => (i + 1) % count), [count])
  const goPrev = useCallback(() => setIdx(i => (i - 1 + count) % count), [count])

  if (count === 0) return null

  return (
    <div className="relative w-full">
      {/* Slider arrows — hors du cadre */}
      {count > 1 && (
        <>
          <button
            onClick={goPrev}
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-5 lg:-left-12 z-20 w-10 h-10 rounded-full items-center justify-center transition-all cursor-pointer"
            style={{
              background: "hsl(158 22% 8% / 0.85)",
              border: `1px solid ${accent}`,
              borderColor: `color-mix(in oklab, ${accent} 30%, transparent)`,
              backdropFilter: "blur(8px)",
              color: accent,
            }}
            aria-label="Slide précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goNext}
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-5 lg:-right-12 z-20 w-10 h-10 rounded-full items-center justify-center transition-all cursor-pointer"
            style={{
              background: "hsl(158 22% 8% / 0.85)",
              border: `1px solid ${accent}`,
              borderColor: `color-mix(in oklab, ${accent} 30%, transparent)`,
              backdropFilter: "blur(8px)",
              color: accent,
            }}
            aria-label="Slide suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Track */}
      <div
        className={cn("relative w-full overflow-hidden rounded-2xl", aspectRatio)}
        style={{
          background: "hsl(158 22% 9%)",
          border: "1px solid hsl(163 30% 90% / 6%)",
          touchAction: "pan-y",
        }}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return
          const dx = e.changedTouches[0].clientX - touchStartX.current
          if (Math.abs(dx) > 40) (dx < 0 ? goNext : goPrev)()
          touchStartX.current = null
        }}
      >
        <div
          className="flex h-full transition-transform duration-500"
          style={{
            transform: `translateX(-${idx * 100}%)`,
            transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
          }}
        >
          {slides.map((slide, i) => {
            const Mock = MOCK_COMPONENTS[slide.type]
            return (
              <div key={i} className="shrink-0 w-full h-full relative">
                <Mock tint={slide.tint} />

                {/* Caption en bas */}
                <div className="absolute bottom-0 left-0 right-0 p-5 pt-12 pointer-events-none"
                  style={{ background: "linear-gradient(180deg, transparent, hsl(158 22% 6% / 0.85))" }}
                >
                  <div className="flex items-baseline gap-3">
                    <p className="text-[9px] font-mono uppercase tracking-[0.3em]" style={{ color: slide.tint }}>
                      {String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                    </p>
                    <p className="text-xs font-bold text-foreground/80">{slide.label}</p>
                  </div>
                  {slide.caption && (
                    <p className="text-[11px] text-foreground/45 mt-1 leading-relaxed">{slide.caption}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dots */}
      {count > 1 && (
        <div className="flex gap-2 justify-center mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                i === idx ? "w-6" : "w-1.5"
              )}
              style={{
                background: i === idx ? accent : "hsl(0 0% 100% / 0.15)",
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
