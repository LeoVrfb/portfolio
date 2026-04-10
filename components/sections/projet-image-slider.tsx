"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjetImageSliderProps {
  images: string[]
  alt: string
  wide?: boolean
}

export function ProjetImageSlider({ images, alt, wide = false }: ProjetImageSliderProps) {
  const count = images.length
  if (count === 0) return null

  // Infinite loop: clone last image at start, clone first image at end
  const loopImages = count > 1
    ? [images[count - 1], ...images, images[0]]
    : images

  // Start at idx=1 (first real image in the extended array)
  const [idx, setIdx] = useState(count > 1 ? 1 : 0)
  const [animated, setAnimated] = useState(true)
  const [dragOffset, setDragOffset] = useState(0)

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const isHorizontal = useRef<boolean | null>(null)
  const jumping = useRef(false)

  // After transition: silently jump from clone back to real image
  const handleTransitionEnd = useCallback(() => {
    if (count <= 1) return
    if (idx >= count + 1) {
      // Was on clone of first → jump to real first
      jumping.current = true
      setAnimated(false)
      setIdx(1)
    } else if (idx <= 0) {
      // Was on clone of last → jump to real last
      jumping.current = true
      setAnimated(false)
      setIdx(count)
    }
  }, [idx, count])

  // Re-enable animation after silent jump
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

  // Touch handlers
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
    if (isHorizontal.current) {
      setDragOffset(dx)
    }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isHorizontal.current) {
      touchStartX.current = null
      return
    }
    const dx = e.changedTouches[0].clientX - (touchStartX.current ?? 0)
    setDragOffset(0)
    if (Math.abs(dx) > 40) {
      dx < 0 ? goNext() : goPrev()
    }
    touchStartX.current = null
    touchStartY.current = null
    isHorizontal.current = null
  }

  // Dot index (0-based, real images only)
  const dotIdx = count > 1 ? (idx - 1 + count) % count : 0

  return (
    <div className={cn("flex flex-col items-center gap-4", wide && "w-full")}>
      <div className={cn("flex items-center gap-3 md:gap-5", wide && "w-full")}>
        {count > 1 && (
          <button
            onClick={goPrev}
            className="shrink-0 w-9 h-9 rounded-full border border-border/40 flex items-center justify-center text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        <div
          className={cn(
            "overflow-hidden rounded-xl",
            wide ? "flex-1 aspect-video" : "w-[260px]"
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
            {loopImages.map((src, i) => (
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
            ))}
          </div>
        </div>

        {count > 1 && (
          <button
            onClick={goNext}
            className="shrink-0 w-9 h-9 rounded-full border border-border/40 flex items-center justify-center text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => { if (!jumping.current) { setAnimated(true); setIdx(i + 1) } }}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors cursor-pointer",
                i === dotIdx ? "bg-foreground/70" : "bg-foreground/20 hover:bg-foreground/40"
              )}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
