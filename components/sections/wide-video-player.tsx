"use client"

import { useRef, useEffect } from "react"

interface WideVideoPlayerProps {
  src: string
  loopStart?: number // seconds — video starts (and loops back) from this point
  loopEnd?: number   // seconds — loop restarts before this point
  className?: string
}

export function WideVideoPlayer({ src, loopStart = 0, loopEnd, className }: WideVideoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const handleCanPlay = () => {
      if (loopStart > 0 && video.currentTime < loopStart) {
        video.currentTime = loopStart
      }
    }

    const handleTimeUpdate = () => {
      if (loopEnd !== undefined && video.currentTime >= loopEnd) {
        video.currentTime = loopStart
      }
    }

    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("timeupdate", handleTimeUpdate)
    return () => {
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [loopStart, loopEnd])

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop={loopEnd === undefined}
      playsInline
      preload="auto"
      className={className}
    />
  )
}
