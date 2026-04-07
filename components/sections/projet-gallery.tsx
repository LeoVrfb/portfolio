"use client"

import { useState, useRef, useLayoutEffect, useCallback } from "react"
import Image from "next/image"

const GAP = 12

export function ProjetGallery({ images }: { images: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(320)
  const [pos, setPos] = useState(0)
  const posRef = useRef(0)

  const dragging = useRef(false)
  const dragStart = useRef(0)
  const dragStartPos = useRef(0)
  const velocity = useRef(0)
  const lastMoveTime = useRef(0)
  const lastMoveCoord = useRef(0)
  const rafRef = useRef(0)
  const animating = useRef(false)

  const maxPos = images.length - 1

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => setWidth(el.offsetWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const slideW = width

  const animateTo = useCallback(
    (target: number) => {
      const start = posRef.current
      const startTime = performance.now()
      const dist = Math.abs(target - start)
      const duration = Math.max(280, Math.min(550, dist * 450))
      animating.current = true

      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration)
        const eased = 1 - Math.pow(1 - t, 4)
        const val = start + (target - start) * eased
        posRef.current = val
        setPos(val)
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          animating.current = false
        }
      }

      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(tick)
    },
    []
  )

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (animating.current) {
      cancelAnimationFrame(rafRef.current)
      animating.current = false
    }
    dragging.current = true
    dragStart.current = e.clientX
    dragStartPos.current = posRef.current
    lastMoveTime.current = performance.now()
    lastMoveCoord.current = e.clientX
    velocity.current = 0
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return
      const now = performance.now()
      const dt = now - lastMoveTime.current
      if (dt > 8) {
        velocity.current = (lastMoveCoord.current - e.clientX) / dt
        lastMoveTime.current = now
        lastMoveCoord.current = e.clientX
      }
      const delta = dragStart.current - e.clientX
      const raw = dragStartPos.current + delta / (width * 0.7)
      posRef.current = Math.max(-0.15, Math.min(maxPos + 0.15, raw))
      setPos(posRef.current)
    },
    [width, maxPos]
  )

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return
    dragging.current = false
    const v = velocity.current
    const base = Math.floor(dragStartPos.current + 0.5)
    let target = Math.abs(v) > 0.15 ? (v > 0 ? base + 1 : base - 1) : Math.round(posRef.current)
    animateTo(Math.max(0, Math.min(maxPos, target)))
  }, [maxPos, animateTo])

  // Hauteur adaptée : portrait (9/16) pour Argedis, paysage (16/9) sinon
  const slideH = Math.round(slideW * (9 / 16))

  return (
    <div className="space-y-3">
      {/* Slider */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl border border-border select-none touch-none cursor-grab active:cursor-grabbing"
        style={{ height: slideH }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {images.map((src, i) => {
          const offset = (i - pos) * (slideW + GAP)
          const absP = Math.abs(i - pos)
          const opacity = Math.max(0.3, 1 - absP * 0.5)

          return (
            <div
              key={i}
              className="absolute top-0 rounded-xl overflow-hidden"
              style={{
                left: 0,
                width: slideW,
                height: slideH,
                transform: `translateX(${offset}px)`,
                opacity,
                willChange: "transform, opacity",
              }}
            >
              <Image
                src={src}
                alt={`Vue ${i + 1}`}
                fill
                className="object-cover pointer-events-none"
                sizes="380px"
                draggable={false}
              />
            </div>
          )
        })}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5">
        {images.map((_, i) => {
          const active = Math.round(pos) === i
          return (
            <button
              key={i}
              onClick={() => animateTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                active ? "w-5 h-1 bg-accent" : "w-1 h-1 bg-white/20 hover:bg-white/40"
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
