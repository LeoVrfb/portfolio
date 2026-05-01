"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Instagram, Linkedin, Github } from "lucide-react"
import { motion } from "motion/react"
import { Boxes } from "@/components/animations/background-boxes"
import { ParticleText } from "@/components/animations/particle-text"
import { onIntroReady } from "@/lib/intro-signal"

const PALETTE = [
  "#6ea696", "#8bbfaf", "#4d8a78",
  "#bba0c5", "#d4b8dd", "#9a80a8",
  "#b4859e", "#c9a1b8", "#96697e",
]

// Sequence:
// 1. "Léo" se tape lettre par lettre
// 2. Petit gap, puis "Hengebaert" se tape lettre par lettre
// 3. Le curseur balaie "Léo" de gauche a droite
// 4. Sans pause, le curseur balaie "Hengebaert"
// Repulsion au survol active des le mount.
const TYPEWRITER_DELAY = 110
const TYPING_GAP = 280
const AUTO_WAVE_DURATION = 1400
const AUTO_WAVE_OVERLAP = 700 // les deux balayages se chevauchent largement pour un enchainement fluide
const TYPING_LEO_START = 300
const TYPING_LEO_END = TYPING_LEO_START + 3 * TYPEWRITER_DELAY
const TYPING_HENGEBAERT_START = TYPING_LEO_END + TYPING_GAP
const TYPING_HENGEBAERT_END = TYPING_HENGEBAERT_START + 10 * TYPEWRITER_DELAY
const AUTO_WAVE_LEO_START = TYPING_HENGEBAERT_END + 200
const AUTO_WAVE_HENGEBAERT_START =
  AUTO_WAVE_LEO_START + AUTO_WAVE_DURATION - AUTO_WAVE_OVERLAP

function ParticleName({
  text,
  typingStartDelay,
  autoWaveDelay,
  dimmed = false,
}: {
  text: string
  typingStartDelay: number
  autoWaveDelay: number
  dimmed?: boolean
}) {
  const [size, setSize] = useState({ height: 150, fontSize: 130 })

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth
      if (w < 480) {
        setSize({ height: 72, fontSize: 60 })
      } else if (w < 768) {
        setSize({ height: 96, fontSize: 80 })
      } else if (w < 1280) {
        setSize({ height: 124, fontSize: 108 })
      } else {
        setSize({ height: 156, fontSize: 138 })
      }
    }
    compute()
    window.addEventListener("resize", compute)
    return () => window.removeEventListener("resize", compute)
  }, [])

  return (
    <ParticleText
      text={text}
      typewriter
      autoWave
      startDelay={typingStartDelay}
      autoWaveDelay={autoWaveDelay}
      autoWaveDuration={AUTO_WAVE_DURATION}
      typewriterDelay={TYPEWRITER_DELAY}
      height={size.height}
      fontSize={size.fontSize}
      fontFamily="'Space Grotesk', system-ui, sans-serif"
      fontWeight={700}
      color={dimmed ? "#a2e2d0" : "#f9fbfb"}
      sampleStep={2}
      particleSize={1}
      repelRadius={110}
      repelForce={9}
      padding={60}
      className={dimmed ? "opacity-90" : undefined}
    />
  )
}


function GlassButton({ children, href, variant = "green" }: { children: React.ReactNode; href: string; variant?: "green" | "mauve" | "blue" }) {
  const wrap = variant === "mauve" ? "glass-btn-wrap-mauve" : variant === "blue" ? "glass-btn-wrap-blue" : "glass-btn-wrap-dark"
  const btn = variant === "mauve" ? "glass-btn-mauve" : variant === "blue" ? "glass-btn-blue" : "glass-btn-dark"
  const txt = variant === "mauve" ? "glass-btn-text-mauve" : variant === "blue" ? "glass-btn-text-blue" : "glass-btn-text-dark"
  const shadow = variant === "mauve" ? "glass-btn-shadow-mauve" : variant === "blue" ? "glass-btn-shadow-blue" : "glass-btn-shadow-dark"
  return (
    <>
      <style>{GLASS_CSS}</style>
      <div className={`${wrap} text-base`}>
        <Link href={href} className={`${btn} cursor-pointer`}>
          <span className={txt}>{children}</span>
        </Link>
        <div className={shadow} />
      </div>
    </>
  )
}

export function HeroSection() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    return onIntroReady(() => setReady(true))
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-background pt-32">
      {/* Background boxes */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-background z-20 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_30%,black_100%)] pointer-events-none" />
        <Boxes colors={PALETTE} />
      </div>

      {/* Content — monté uniquement quand l'intro est terminée */}
      {ready && <div className="relative z-10 layout-container w-full pb-10">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-10 items-end">
          {/* Left */}
          <div>
            {/* Badge */}
            <motion.div
              className="flex items-center gap-2 mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-medium text-accent tracking-wide">
                  Dev front-end @ Artefact · Paris
                </span>
              </div>
            </motion.div>

            {/* Name — particules en typewriter, balayage curseur sequentiel (Léo puis Hengebaert), repulsion au survol */}
            <h1 aria-label="Léo" className="leading-none mb-1">
              <ParticleName
                text="Léo"
                typingStartDelay={TYPING_LEO_START}
                autoWaveDelay={AUTO_WAVE_LEO_START}
              />
            </h1>
            <h1 aria-label="Hengebaert" className="leading-none mb-8">
              <ParticleName
                text="Hengebaert"
                typingStartDelay={TYPING_HENGEBAERT_START}
                autoWaveDelay={AUTO_WAVE_HENGEBAERT_START}
                dimmed
              />
            </h1>

            {/* Tagline */}
            <motion.div
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-12 h-px bg-accent" />
              <p className="text-sm text-accent tracking-widest uppercase font-medium">
                Développeur front-end & créateur de sites web
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-lg font-light max-w-xl leading-relaxed mb-10 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.88, ease: "easeOut" }}
            >
              Je construis des interfaces qui durent — pour les grandes entreprises chez{" "}
              <span className="font-medium text-foreground">Artefact</span>{" "}
              <span style={{ color: "var(--lavender)" }}>(Data & IA)</span>, et des sites
              sur mesure qui convertissent pour les{" "}
              <span style={{ color: "var(--mauve)" }}>entreprises et les particuliers</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
            >
              <GlassButton href="/projets">Mes projets</GlassButton>
              <GlassButton href="/services" variant="blue">Mes services</GlassButton>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 text-foreground/75 text-sm font-medium hover:text-accent transition-colors cursor-pointer"
              >
                Me contacter
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right — socials */}
          <motion.div
            className="flex lg:flex-col items-center gap-5 lg:gap-6"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
          >
            <a
              href="https://linkedin.com/in/leo-hengebaert"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-accent transition-colors cursor-pointer"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com/leohengebaert"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-accent transition-colors cursor-pointer"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/LeoVrfb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-accent transition-colors cursor-pointer"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <div className="hidden lg:block w-px h-16 bg-linear-to-b from-muted-foreground/20 to-transparent mt-2" />
          </motion.div>
        </div>
      </div>}

    </section>
  )
}

const GLASS_CSS = `
.glass-btn-wrap-dark {
  --anim-time: 400ms;
  --anim-ease: cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
  z-index: 2;
  border-radius: 999vw;
  background: transparent;
  pointer-events: none;
  transition: all var(--anim-time) var(--anim-ease);
  display: inline-block;
}

.glass-btn-shadow-dark {
  --shadow-fix: 2em;
  position: absolute;
  width: calc(100% + var(--shadow-fix));
  height: calc(100% + var(--shadow-fix));
  top: calc(0% - var(--shadow-fix) / 2);
  left: calc(0% - var(--shadow-fix) / 2);
  filter: blur(clamp(2px, 0.125em, 12px));
  overflow: visible;
  pointer-events: none;
}

.glass-btn-shadow-dark::after {
  content: "";
  position: absolute;
  z-index: 0;
  inset: 0;
  border-radius: 999vw;
  background: linear-gradient(180deg, rgba(110,166,150,0.2), rgba(110,166,150,0.08));
  width: calc(100% - var(--shadow-fix) - 0.25em);
  height: calc(100% - var(--shadow-fix) - 0.25em);
  top: calc(var(--shadow-fix) - 0.5em);
  left: calc(var(--shadow-fix) - 0.875em);
  padding: 0.125em;
  box-sizing: border-box;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  transition: all var(--anim-time) var(--anim-ease);
}

@property --gb-angle-1 { syntax: "<angle>"; inherits: false; initial-value: -75deg; }
@property --gb-angle-2 { syntax: "<angle>"; inherits: false; initial-value: -45deg; }

.glass-btn-dark {
  --border-w: clamp(1px, 0.0625em, 4px);
  all: unset;
  cursor: pointer;
  position: relative;
  display: inline-block;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  pointer-events: auto;
  z-index: 3;
  background: linear-gradient(-75deg, rgba(110,166,150,0.06), rgba(110,166,150,0.14), rgba(110,166,150,0.06));
  border-radius: 999vw;
  box-shadow:
    inset 0 0.125em 0.125em rgba(255,255,255,0.05),
    inset 0 -0.125em 0.125em rgba(110,166,150,0.12),
    0 0.25em 0.125em -0.125em rgba(0,0,0,0.5),
    0 0 0.1em 0.25em inset rgba(110,166,150,0.08);
  backdrop-filter: blur(clamp(1px, 0.125em, 4px));
  -webkit-backdrop-filter: blur(clamp(1px, 0.125em, 4px));
  transition: all var(--anim-time) var(--anim-ease);
}

.glass-btn-dark:hover {
  transform: scale(0.975);
  box-shadow:
    inset 0 0.125em 0.125em rgba(255,255,255,0.05),
    inset 0 -0.125em 0.125em rgba(110,166,150,0.18),
    0 0.15em 0.05em -0.1em rgba(0,0,0,0.6),
    0 0 0.05em 0.1em inset rgba(110,166,150,0.14),
    0 0 0.6em 0.05em rgba(110,166,150,0.15);
}

.glass-btn-text-dark {
  position: relative;
  display: block;
  user-select: none;
  letter-spacing: -0.01em;
  font-weight: 700;
  font-size: 0.875rem;
  color: rgba(180,230,215,1);
  -webkit-font-smoothing: antialiased;
  text-shadow: 0em 0.1em 0.3em rgba(110,166,150,0.4);
  transition: all var(--anim-time) var(--anim-ease);
  padding-inline: 1.75em;
  padding-block: 0.9em;
}

.glass-btn-text-dark::after {
  content: "";
  display: block;
  position: absolute;
  z-index: 3;
  width: calc(100% - var(--border-w));
  height: calc(100% - var(--border-w));
  top: calc(0% + var(--border-w) / 2);
  left: calc(0% + var(--border-w) / 2);
  box-sizing: border-box;
  border-radius: 999vw;
  overflow: clip;
  background: linear-gradient(var(--gb-angle-2), rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 40% 50%, rgba(255,255,255,0) 55%);
  mix-blend-mode: screen;
  pointer-events: none;
  background-size: 200% 200%;
  background-position: 0% 50%;
  background-repeat: no-repeat;
  transition: background-position calc(var(--anim-time) * 1.25) var(--anim-ease), --gb-angle-2 calc(var(--anim-time) * 1.25) var(--anim-ease);
}

.glass-btn-dark:hover .glass-btn-text-dark::after { background-position: 25% 50%; }
.glass-btn-dark:active .glass-btn-text-dark::after { background-position: 50% 15%; --gb-angle-2: -15deg; }

.glass-btn-dark::after {
  content: "";
  position: absolute;
  z-index: 1;
  inset: 0;
  border-radius: 999vw;
  width: calc(100% + var(--border-w));
  height: calc(100% + var(--border-w));
  top: calc(0% - var(--border-w) / 2);
  left: calc(0% - var(--border-w) / 2);
  padding: var(--border-w);
  box-sizing: border-box;
  background:
    conic-gradient(from var(--gb-angle-1) at 50% 50%, rgba(110,166,150,0.5), rgba(110,166,150,0) 5% 40%, rgba(110,166,150,0.5) 50%, rgba(110,166,150,0) 60% 95%, rgba(110,166,150,0.5)),
    linear-gradient(180deg, rgba(110,166,150,0.2), rgba(110,166,150,0.1));
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  transition: all var(--anim-time) var(--anim-ease), --gb-angle-1 500ms ease;
  box-shadow: inset 0 0 0 calc(var(--border-w) / 2) rgba(110,166,150,0.3);
}

.glass-btn-dark:hover::after { --gb-angle-1: -125deg; }
.glass-btn-dark:active::after { --gb-angle-1: -75deg; }

.glass-btn-wrap-dark:has(.glass-btn-dark:active) { transform: rotate3d(1, 0, 0, 20deg); }

/* === Variante mauve === */
.glass-btn-wrap-mauve {
  --anim-time: 400ms;
  --anim-ease: cubic-bezier(0.25, 1, 0.5, 1);
  position: relative; z-index: 2; border-radius: 999vw;
  background: transparent; pointer-events: none;
  transition: all var(--anim-time) var(--anim-ease); display: inline-block;
}
.glass-btn-shadow-mauve {
  --shadow-fix: 2em;
  position: absolute;
  width: calc(100% + var(--shadow-fix)); height: calc(100% + var(--shadow-fix));
  top: calc(0% - var(--shadow-fix) / 2); left: calc(0% - var(--shadow-fix) / 2);
  filter: blur(clamp(2px, 0.125em, 12px)); overflow: visible; pointer-events: none;
}
.glass-btn-shadow-mauve::after {
  content: ""; position: absolute; z-index: 0; inset: 0; border-radius: 999vw;
  background: linear-gradient(180deg, rgba(199,142,204,0.2), rgba(199,142,204,0.08));
  width: calc(100% - var(--shadow-fix) - 0.25em); height: calc(100% - var(--shadow-fix) - 0.25em);
  top: calc(var(--shadow-fix) - 0.5em); left: calc(var(--shadow-fix) - 0.875em);
  padding: 0.125em; box-sizing: border-box;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude; -webkit-mask-composite: xor;
  transition: all var(--anim-time) var(--anim-ease);
}
@property --gm-angle-1 { syntax: "<angle>"; inherits: false; initial-value: -75deg; }
@property --gm-angle-2 { syntax: "<angle>"; inherits: false; initial-value: -45deg; }
.glass-btn-mauve {
  --border-w: clamp(1px, 0.0625em, 4px);
  all: unset; cursor: pointer; position: relative; display: inline-block;
  -webkit-tap-highlight-color: rgba(0,0,0,0); pointer-events: auto; z-index: 3;
  background: linear-gradient(-75deg, rgba(199,142,204,0.06), rgba(199,142,204,0.14), rgba(199,142,204,0.06));
  border-radius: 999vw;
  box-shadow:
    inset 0 0.125em 0.125em rgba(255,255,255,0.05),
    inset 0 -0.125em 0.125em rgba(199,142,204,0.12),
    0 0.25em 0.125em -0.125em rgba(0,0,0,0.5),
    0 0 0.1em 0.25em inset rgba(199,142,204,0.08);
  backdrop-filter: blur(clamp(1px, 0.125em, 4px));
  -webkit-backdrop-filter: blur(clamp(1px, 0.125em, 4px));
  transition: all var(--anim-time) var(--anim-ease);
}
.glass-btn-mauve:hover {
  transform: scale(0.975);
  box-shadow:
    inset 0 0.125em 0.125em rgba(255,255,255,0.05),
    inset 0 -0.125em 0.125em rgba(199,142,204,0.18),
    0 0.15em 0.05em -0.1em rgba(0,0,0,0.6),
    0 0 0.05em 0.1em inset rgba(199,142,204,0.14),
    0 0 0.6em 0.05em rgba(199,142,204,0.15);
}
.glass-btn-text-mauve {
  position: relative; display: block; user-select: none;
  letter-spacing: -0.01em; font-weight: 700; font-size: 0.875rem;
  color: rgba(225,188,228,1);
  -webkit-font-smoothing: antialiased;
  text-shadow: 0em 0.1em 0.3em rgba(199,142,204,0.4);
  transition: all var(--anim-time) var(--anim-ease);
  padding-inline: 1.75em; padding-block: 0.9em;
}
.glass-btn-text-mauve::after {
  content: ""; display: block; position: absolute; z-index: 3;
  width: calc(100% - var(--border-w)); height: calc(100% - var(--border-w));
  top: calc(0% + var(--border-w) / 2); left: calc(0% + var(--border-w) / 2);
  box-sizing: border-box; border-radius: 999vw; overflow: clip;
  background: linear-gradient(var(--gm-angle-2), rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 40% 50%, rgba(255,255,255,0) 55%);
  mix-blend-mode: screen; pointer-events: none;
  background-size: 200% 200%; background-position: 0% 50%; background-repeat: no-repeat;
  transition: background-position calc(var(--anim-time) * 1.25) var(--anim-ease), --gm-angle-2 calc(var(--anim-time) * 1.25) var(--anim-ease);
}
.glass-btn-mauve:hover .glass-btn-text-mauve::after { background-position: 25% 50%; }
.glass-btn-mauve:active .glass-btn-text-mauve::after { background-position: 50% 15%; --gm-angle-2: -15deg; }
.glass-btn-mauve::after {
  content: ""; position: absolute; z-index: 1; inset: 0; border-radius: 999vw;
  width: calc(100% + var(--border-w)); height: calc(100% + var(--border-w));
  top: calc(0% - var(--border-w) / 2); left: calc(0% - var(--border-w) / 2);
  padding: var(--border-w); box-sizing: border-box;
  background:
    conic-gradient(from var(--gm-angle-1) at 50% 50%, rgba(199,142,204,0.5), rgba(199,142,204,0) 5% 40%, rgba(199,142,204,0.5) 50%, rgba(199,142,204,0) 60% 95%, rgba(199,142,204,0.5)),
    linear-gradient(180deg, rgba(199,142,204,0.2), rgba(199,142,204,0.1));
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude; -webkit-mask-composite: xor;
  transition: all var(--anim-time) var(--anim-ease), --gm-angle-1 500ms ease;
  box-shadow: inset 0 0 0 calc(var(--border-w) / 2) rgba(199,142,204,0.3);
}
.glass-btn-mauve:hover::after { --gm-angle-1: -125deg; }
.glass-btn-mauve:active::after { --gm-angle-1: -75deg; }
.glass-btn-wrap-mauve:has(.glass-btn-mauve:active) { transform: rotate3d(1, 0, 0, 20deg); }

/* === Variante blue === */
.glass-btn-wrap-blue {
  --anim-time: 400ms;
  --anim-ease: cubic-bezier(0.25, 1, 0.5, 1);
  position: relative; z-index: 2; border-radius: 999vw;
  background: transparent; pointer-events: none;
  transition: all var(--anim-time) var(--anim-ease); display: inline-block;
}
.glass-btn-shadow-blue {
  --shadow-fix: 2em;
  position: absolute;
  width: calc(100% + var(--shadow-fix)); height: calc(100% + var(--shadow-fix));
  top: calc(0% - var(--shadow-fix) / 2); left: calc(0% - var(--shadow-fix) / 2);
  filter: blur(clamp(2px, 0.125em, 12px)); overflow: visible; pointer-events: none;
}
.glass-btn-shadow-blue::after {
  content: ""; position: absolute; z-index: 0; inset: 0; border-radius: 999vw;
  background: linear-gradient(180deg, rgba(148,217,249,0.2), rgba(148,217,249,0.08));
  width: calc(100% - var(--shadow-fix) - 0.25em); height: calc(100% - var(--shadow-fix) - 0.25em);
  top: calc(var(--shadow-fix) - 0.5em); left: calc(var(--shadow-fix) - 0.875em);
  padding: 0.125em; box-sizing: border-box;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude; -webkit-mask-composite: xor;
  transition: all var(--anim-time) var(--anim-ease);
}
@property --gb2-angle-1 { syntax: "<angle>"; inherits: false; initial-value: -75deg; }
@property --gb2-angle-2 { syntax: "<angle>"; inherits: false; initial-value: -45deg; }
.glass-btn-blue {
  --border-w: clamp(1px, 0.0625em, 4px);
  all: unset; cursor: pointer; position: relative; display: inline-block;
  -webkit-tap-highlight-color: rgba(0,0,0,0); pointer-events: auto; z-index: 3;
  background: linear-gradient(-75deg, rgba(148,217,249,0.06), rgba(148,217,249,0.14), rgba(148,217,249,0.06));
  border-radius: 999vw;
  box-shadow:
    inset 0 0.125em 0.125em rgba(255,255,255,0.05),
    inset 0 -0.125em 0.125em rgba(148,217,249,0.12),
    0 0.25em 0.125em -0.125em rgba(0,0,0,0.5),
    0 0 0.1em 0.25em inset rgba(148,217,249,0.08);
  backdrop-filter: blur(clamp(1px, 0.125em, 4px));
  -webkit-backdrop-filter: blur(clamp(1px, 0.125em, 4px));
  transition: all var(--anim-time) var(--anim-ease);
}
.glass-btn-blue:hover {
  transform: scale(0.975);
  box-shadow:
    inset 0 0.125em 0.125em rgba(255,255,255,0.05),
    inset 0 -0.125em 0.125em rgba(148,217,249,0.18),
    0 0.15em 0.05em -0.1em rgba(0,0,0,0.6),
    0 0 0.05em 0.1em inset rgba(148,217,249,0.14),
    0 0 0.6em 0.05em rgba(148,217,249,0.15);
}
.glass-btn-text-blue {
  position: relative; display: block; user-select: none;
  letter-spacing: -0.01em; font-weight: 700; font-size: 0.875rem;
  color: rgba(185,235,253,1);
  -webkit-font-smoothing: antialiased;
  text-shadow: 0em 0.1em 0.3em rgba(148,217,249,0.4);
  transition: all var(--anim-time) var(--anim-ease);
  padding-inline: 1.75em; padding-block: 0.9em;
}
.glass-btn-text-blue::after {
  content: ""; display: block; position: absolute; z-index: 3;
  width: calc(100% - var(--border-w)); height: calc(100% - var(--border-w));
  top: calc(0% + var(--border-w) / 2); left: calc(0% + var(--border-w) / 2);
  box-sizing: border-box; border-radius: 999vw; overflow: clip;
  background: linear-gradient(var(--gb2-angle-2), rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 40% 50%, rgba(255,255,255,0) 55%);
  mix-blend-mode: screen; pointer-events: none;
  background-size: 200% 200%; background-position: 0% 50%; background-repeat: no-repeat;
  transition: background-position calc(var(--anim-time) * 1.25) var(--anim-ease), --gb2-angle-2 calc(var(--anim-time) * 1.25) var(--anim-ease);
}
.glass-btn-blue:hover .glass-btn-text-blue::after { background-position: 25% 50%; }
.glass-btn-blue:active .glass-btn-text-blue::after { background-position: 50% 15%; --gb2-angle-2: -15deg; }
.glass-btn-blue::after {
  content: ""; position: absolute; z-index: 1; inset: 0; border-radius: 999vw;
  width: calc(100% + var(--border-w)); height: calc(100% + var(--border-w));
  top: calc(0% - var(--border-w) / 2); left: calc(0% - var(--border-w) / 2);
  padding: var(--border-w); box-sizing: border-box;
  background:
    conic-gradient(from var(--gb2-angle-1) at 50% 50%, rgba(148,217,249,0.5), rgba(148,217,249,0) 5% 40%, rgba(148,217,249,0.5) 50%, rgba(148,217,249,0) 60% 95%, rgba(148,217,249,0.5)),
    linear-gradient(180deg, rgba(148,217,249,0.2), rgba(148,217,249,0.1));
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude; -webkit-mask-composite: xor;
  transition: all var(--anim-time) var(--anim-ease), --gb2-angle-1 500ms ease;
  box-shadow: inset 0 0 0 calc(var(--border-w) / 2) rgba(148,217,249,0.3);
}
.glass-btn-blue:hover::after { --gb2-angle-1: -125deg; }
.glass-btn-blue:active::after { --gb2-angle-1: -75deg; }
.glass-btn-wrap-blue:has(.glass-btn-blue:active) { transform: rotate3d(1, 0, 0, 20deg); }
`
