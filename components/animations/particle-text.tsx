"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ParticleTextProps = {
  text: string
  className?: string
  height?: number
  fontSize?: number
  fontFamily?: string
  fontWeight?: number | string
  color?: string
  particleSize?: number
  /** Plus petit = plus dense (echantillonnage des pixels du texte). 1-3 est un bon range. */
  sampleStep?: number
  /** Laisse une legere trainee derriere les particules en mouvement. Couleur en rgba() avec alpha faible. */
  trailColor?: string
  /** Rayon de l'influence du curseur (px). */
  repelRadius?: number
  /** Force de repulsion. */
  repelForce?: number
  spring?: number
  friction?: number
  /** Simule un curseur qui traverse le texte automatiquement (mode demo). */
  autoWave?: boolean
  /** Delai avant que le balayage automatique demarre (ms). */
  autoWaveDelay?: number
  /** Duree du balayage automatique (ms). Defaut : 2500ms. */
  autoWaveDuration?: number
  /** Effet typewriter : le texte apparait lettre par lettre a l'apparition. */
  typewriter?: boolean
  /** Delai entre chaque lettre (ms). Defaut : 150ms. */
  typewriterDelay?: number
  /** Delai avant le debut du typewriter (ms). */
  startDelay?: number
  /** Marge en px autour du texte ou les particules peuvent flotter. Le canvas est elargi mais ne pousse pas le layout. */
  padding?: number
}

type ParticleData = {
  N: number
  px: Float32Array
  py: Float32Array
  vx: Float32Array
  vy: Float32Array
  tx: Float32Array
  ty: Float32Array
}

function makeEmpty(): ParticleData {
  return {
    N: 0,
    px: new Float32Array(0),
    py: new Float32Array(0),
    vx: new Float32Array(0),
    vy: new Float32Array(0),
    tx: new Float32Array(0),
    ty: new Float32Array(0),
  }
}

function shufflePairs(arr: number[]) {
  const n = arr.length / 2
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const ix = i * 2
    const jx = j * 2
    const tmpX = arr[ix]
    const tmpY = arr[ix + 1]
    arr[ix] = arr[jx]
    arr[ix + 1] = arr[jx + 1]
    arr[jx] = tmpX
    arr[jx + 1] = tmpY
  }
}

export function ParticleText({
  text,
  className,
  height = 220,
  fontSize,
  fontFamily = "'Arial Black', Impact, sans-serif",
  fontWeight = 900,
  color = "#f4f4f5",
  particleSize = 0.7,
  sampleStep = 2,
  trailColor,
  repelRadius = 90,
  repelForce = 7,
  spring = 0.025,
  friction = 0.82,
  autoWave = false,
  autoWaveDelay = 0,
  autoWaveDuration = 2500,
  typewriter = false,
  typewriterDelay = 150,
  startDelay = 0,
  padding = 0,
}: ParticleTextProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const [displayedText, setDisplayedText] = React.useState(
    typewriter ? "" : text,
  )

  React.useEffect(() => {
    if (!typewriter) {
      setDisplayedText(text)
      return
    }
    setDisplayedText("")
    let interval: ReturnType<typeof setInterval> | null = null
    const timeout = setTimeout(() => {
      let i = 0
      interval = setInterval(() => {
        i++
        setDisplayedText(text.slice(0, i))
        if (i >= text.length && interval) clearInterval(interval)
      }, typewriterDelay)
    }, startDelay)
    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [text, typewriter, typewriterDelay, startDelay])

  const dataRef = React.useRef<ParticleData>(makeEmpty())

  const textRef = React.useRef(displayedText)
  const fontSizeRef = React.useRef(fontSize)
  const fontFamilyRef = React.useRef(fontFamily)
  const fontWeightRef = React.useRef(fontWeight)
  const sampleStepRef = React.useRef(sampleStep)

  // sizeRef stocke les dimensions TOTAL du canvas (incluant padding)
  const sizeRef = React.useRef({ width: 0, height: 0, dpr: 1 })

  const resample = React.useCallback(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const rect = container.getBoundingClientRect()
    const containerWidth = Math.max(1, Math.floor(rect.width))
    const cssHeight = Math.max(1, Math.floor(height))
    const totalWidth = containerWidth + padding * 2
    const totalHeight = cssHeight + padding * 2

    const off = document.createElement("canvas")
    off.width = totalWidth
    off.height = totalHeight
    const offCtx = off.getContext("2d")
    if (!offCtx) return

    const t = textRef.current || " "
    const computedFontSize =
      fontSizeRef.current ??
      Math.min(cssHeight * 0.7, (containerWidth / Math.max(t.length, 1)) * 1.6)

    offCtx.fillStyle = "#ffffff"
    offCtx.textAlign = "left"
    offCtx.textBaseline = "middle"
    offCtx.font = `${fontWeightRef.current} ${computedFontSize}px ${fontFamilyRef.current}`
    // Texte aligne sur le bord gauche du wrapper visible (donc decale du padding)
    offCtx.fillText(t, padding, padding + cssHeight / 2)

    const imageData = offCtx.getImageData(0, 0, totalWidth, totalHeight).data
    const step = sampleStepRef.current
    const targets: number[] = []

    for (let y = 0; y < totalHeight; y += step) {
      for (let x = 0; x < totalWidth; x += step) {
        const idx = (y * totalWidth + x) * 4 + 3
        if (imageData[idx] > 128) {
          targets.push(
            x + (Math.random() - 0.5) * 0.6,
            y + (Math.random() - 0.5) * 0.6,
          )
        }
      }
    }

    shufflePairs(targets)

    const newN = targets.length / 2
    const prev = dataRef.current
    const oldN = prev.N

    const px = new Float32Array(newN)
    const py = new Float32Array(newN)
    const vx = new Float32Array(newN)
    const vy = new Float32Array(newN)
    const tx = new Float32Array(newN)
    const ty = new Float32Array(newN)

    const reuse = Math.min(oldN, newN)
    for (let i = 0; i < reuse; i++) {
      px[i] = prev.px[i]
      py[i] = prev.py[i]
      vx[i] = prev.vx[i]
      vy[i] = prev.vy[i]
    }

    for (let i = reuse; i < newN; i++) {
      px[i] = Math.random() * totalWidth
      py[i] = Math.random() * totalHeight
      vx[i] = 0
      vy[i] = 0
    }

    for (let i = 0; i < newN; i++) {
      tx[i] = targets[i * 2]
      ty[i] = targets[i * 2 + 1]
    }

    dataRef.current = { N: newN, px, py, vx, vy, tx, ty }
  }, [height, padding])

  React.useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let mouseX = -9999
    let mouseY = -9999
    let animationFrame = 0
    const waveStart = performance.now() + autoWaveDelay

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const containerWidth = Math.max(1, Math.floor(rect.width))
      const cssHeight = Math.max(1, Math.floor(height))
      const totalWidth = containerWidth + padding * 2
      const totalHeight = cssHeight + padding * 2
      const dpr = Math.min(2, window.devicePixelRatio || 1)

      canvas.width = totalWidth * dpr
      canvas.height = totalHeight * dpr
      canvas.style.width = `${totalWidth}px`
      canvas.style.height = `${totalHeight}px`
      sizeRef.current = { width: totalWidth, height: totalHeight, dpr }
    }

    const draw = (time: number) => {
      const { width, height: cssHeight, dpr } = sizeRef.current
      const data = dataRef.current

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (trailColor) {
        ctx.fillStyle = trailColor
        ctx.fillRect(0, 0, width, cssHeight)
      } else {
        ctx.clearRect(0, 0, width, cssHeight)
      }

      let mx = mouseX
      let my = mouseY
      if (autoWave) {
        const elapsed = (time - waveStart) / 1000
        const duration = autoWaveDuration / 1000
        if (elapsed > 0 && elapsed < duration) {
          const t = elapsed / duration
          mx = -repelRadius + t * (width + repelRadius * 2)
          my = cssHeight / 2
        }
      }

      const { px, py, vx, vy, tx, ty, N } = data
      for (let i = 0; i < N; i++) {
        let fx = (tx[i] - px[i]) * spring
        let fy = (ty[i] - py[i]) * spring

        const dx = px[i] - mx
        const dy = py[i] - my
        const d2 = dx * dx + dy * dy
        const r2 = repelRadius * repelRadius
        if (d2 < r2 && d2 > 0.01) {
          const d = Math.sqrt(d2)
          const force = (repelForce * (1 - d / repelRadius)) / d
          fx += dx * force
          fy += dy * force
        }

        vx[i] = (vx[i] + fx) * friction
        vy[i] = (vy[i] + fy) * friction
        px[i] += vx[i]
        py[i] += vy[i]

        const spd = Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i])
        const alpha = Math.min(1, 0.55 + spd * 0.15)
        ctx.globalAlpha = alpha
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(px[i], py[i], particleSize, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      animationFrame = requestAnimationFrame(draw)
    }

    // Mouse listener au niveau de la window pour que la repulsion fonctionne
    // meme quand le curseur est sur le canvas (qui a pointer-events: none).
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    const onWindowBlur = () => {
      mouseX = -9999
      mouseY = -9999
    }

    const ro = new ResizeObserver(() => {
      resize()
      resample()
    })
    ro.observe(container)

    resize()
    resample()

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => resample()).catch(() => {})
    }

    animationFrame = requestAnimationFrame(draw)

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("blur", onWindowBlur)

    return () => {
      cancelAnimationFrame(animationFrame)
      ro.disconnect()
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("blur", onWindowBlur)
    }
  }, [
    color,
    height,
    padding,
    particleSize,
    repelRadius,
    repelForce,
    spring,
    friction,
    autoWave,
    autoWaveDelay,
    autoWaveDuration,
    trailColor,
    resample,
  ])

  React.useEffect(() => {
    textRef.current = displayedText
    fontSizeRef.current = fontSize
    fontFamilyRef.current = fontFamily
    fontWeightRef.current = fontWeight
    sampleStepRef.current = sampleStep
    resample()
  }, [displayedText, fontSize, fontFamily, fontWeight, sampleStep, resample])

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      style={{ height }}
    >
      <canvas
        ref={canvasRef}
        className="block absolute pointer-events-none"
        style={{ top: -padding, left: -padding }}
      />
    </div>
  )
}
