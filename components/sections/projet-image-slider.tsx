"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjetImageSliderProps {
  images: string[]
  alt: string
  wide?: boolean
  /**
   * Tailwind aspect-ratio class pour le track en mode wide.
   * Default: "aspect-video" (16:9) — bien pour les vidéos / mockups 16:9.
   * Pour les screenshots de site web full-page (~2:1), utiliser "aspect-[2/1]"
   * pour éviter le crop des bords gauche/droite.
   */
  aspectRatio?: string
}

export function ProjetImageSlider({ images, alt, wide = false, aspectRatio = "aspect-video" }: ProjetImageSliderProps) {
  const count = images.length
  if (count === 0) return null

  const loopImages = count > 1
    ? [images[count - 1], ...images, images[0]]
    : images

  const [idx, setIdx] = useState(count > 1 ? 1 : 0)
  const [animated, setAnimated] = useState(true)
  const [dragOffset, setDragOffset] = useState(0)

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const isHorizontal = useRef<boolean | null>(null)
  const jumping = useRef(false)

  const handleTransitionEnd = useCallback(() => {
    if (count <= 1) return
    if (idx >= count + 1) {
      jumping.current = true
      setAnimated(false)
      setIdx(1)
    } else if (idx <= 0) {
      jumping.current = true
      setAnimated(false)
      setIdx(count)
    }
  }, [idx, count])

  useEffect(() => {
    if (!animated && jumping.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimated(true)
          jumping.current = false
        })
      })
    }
  }, [animated])

  const goNext = useCallback(() => {
    if (count <= 1 || jumping.current) return
    setAnimated(true)
    setIdx(i => i + 1)
  }, [count])

  const goPrev = useCallback(() => {
    if (count <= 1 || jumping.current) return
    setAnimated(true)
    setIdx(i => i - 1)
  }, [count])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isHorizontal.current = null
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current
    if (isHorizontal.current === null) {
      isHorizontal.current = Math.abs(dx) > Math.abs(dy)
    }
    if (isHorizontal.current) setDragOffset(dx)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isHorizontal.current) {
      touchStartX.current = null
      return
    }
    const dx = e.changedTouches[0].clientX - (touchStartX.current ?? 0)
    setDragOffset(0)
    if (Math.abs(dx) > 40) dx < 0 ? goNext() : goPrev()
    touchStartX.current = null
    touchStartY.current = null
    isHorizontal.current = null
  }

  const dotIdx = count > 1 ? (idx - 1 + count) % count : 0

  const arrowClass =
    "hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full " +
    "bg-zinc-950/50 backdrop-blur-sm border border-white/10 items-center justify-center " +
    "text-white/50 hover:text-white hover:border-white/25 transition-all cursor-pointer shrink-0"

  return (
    <div className={cn("flex flex-col gap-3", wide && "w-full")}>

      {/* ── Slider + arrows ── */}
      <div className={cn(
        "relative",
        wide ? "w-full" : "w-[260px] mx-auto"
      )}>
        {/* Prev — desktop only, positioned outside the image area */}
        {count > 1 && (
          <button
            onClick={goPrev}
            className={cn(arrowClass, "-left-6 lg:-left-11")}
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Track */}
        <div
          className={cn(
            "overflow-hidden rounded-xl",
            wide ? `${aspectRatio} w-full` : "w-[260px]"
          )}
          style={{ touchAction: "pan-y" }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex h-full"
            style={{
              transform: `translateX(calc(-${idx * 100}% + ${dragOffset}px))`,
              transition: animated && dragOffset === 0
                ? "transform 300ms ease-in-out"
                : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {loopImages.map((src, i) =>
              wide ? (
                <div key={i} className="shrink-0 w-full h-full relative">
                  <Image
                    src={src}
                    alt={`${alt} — vue ${i}`}
                    fill
                    className="object-cover select-none"
                    quality={90}
                    draggable={false}
                  />
                </div>
              ) : (
                <Image
                  key={i}
                  src={src}
                  alt={`${alt} — vue ${i}`}
                  width={540}
                  height={960}
                  className="shrink-0 w-full h-auto select-none"
                  quality={90}
                  draggable={false}
                />
              )
            )}
          </div>
        </div>

        {/* Next — desktop only */}
        {count > 1 && (
          <button
            onClick={goNext}
            className={cn(arrowClass, "-right-6 lg:-right-11")}
            aria-label="Image suivante"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dots — toujours visibles */}
      {count > 1 && (
        <div className="flex gap-2 justify-center">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!jumping.current) {
                  setAnimated(true)
                  setIdx(i + 1)
                }
              }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                i === dotIdx
                  ? "bg-foreground/70 w-4"
                  : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
              )}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
