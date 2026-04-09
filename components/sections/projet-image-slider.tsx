"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjetImageSliderProps {
  images: string[]
  alt: string
}

export function ProjetImageSlider({ images, alt }: ProjetImageSliderProps) {
  const [current, setCurrent] = useState(0)
  const dragStartX = useRef<number | null>(null)

  if (images.length === 0) return null

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length)
  const next = () => setCurrent((c) => (c + 1) % images.length)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3 md:gap-5">
        <button
          onClick={prev}
          className="shrink-0 w-9 h-9 rounded-full border border-border/40 flex items-center justify-center text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
          aria-label="Image précédente"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          className="overflow-hidden rounded-xl w-[260px]"
          onPointerDown={(e) => {
            dragStartX.current = e.clientX
          }}
          onPointerUp={(e) => {
            if (dragStartX.current === null) return
            const diff = dragStartX.current - e.clientX
            if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
            dragStartX.current = null
          }}
        >
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`${alt} — vue ${i + 1}`}
                width={540}
                height={960}
                className="shrink-0 w-full h-auto select-none"
                quality={90}
                draggable={false}
              />
            ))}
          </div>
        </div>

        <button
          onClick={next}
          className="shrink-0 w-9 h-9 rounded-full border border-border/40 flex items-center justify-center text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
          aria-label="Image suivante"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors cursor-pointer",
              i === current ? "bg-foreground/70" : "bg-foreground/20 hover:bg-foreground/40"
            )}
            aria-label={`Image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
