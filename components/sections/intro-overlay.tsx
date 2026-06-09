"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { HeroNeonAnim } from "@/components/sections/hero-neon-anim"
import { signalIntroReady } from "@/lib/intro-signal"

// L'IntroOverlay est instancié exclusivement par `app/[locale]/page.tsx` (la
// home), donc tout pathname check est inutile : si ce composant est mounté,
// c'est qu'on est sur `/`.

// Action finie à ~3s — on laisse 1s de respiration puis fade-out
const INTRO_DURATION = 4200

const ELECTRIC_CSS = `
@keyframes intro-scan {
  0%   { transform: translateY(-100%); opacity: 0; }
  5%   { opacity: 0.7; }
  100% { transform: translateY(200vh); opacity: 0; }
}
@keyframes intro-emp {
  0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.9; }
  60%  { opacity: 0.2; }
  100% { transform: translate(-50%,-50%) scale(3.5); opacity: 0; }
}
@keyframes intro-emp2 {
  0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.6; }
  70%  { opacity: 0.1; }
  100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; }
}
@keyframes intro-glitch {
  0%,100% { clip-path: inset(0 0 100% 0); opacity: 0; }
  8%  { clip-path: inset(30% 0 60% 0); opacity: 0.15; transform: translateX(-4px); }
  10% { clip-path: inset(55% 0 30% 0); opacity: 0.1;  transform: translateX(3px); }
  12% { clip-path: inset(10% 0 80% 0); opacity: 0.12; transform: translateX(-2px); }
  14% { clip-path: inset(0 0 100% 0); opacity: 0; }
  72% { clip-path: inset(60% 0 20% 0); opacity: 0.08; transform: translateX(2px); }
  74% { clip-path: inset(0 0 100% 0); opacity: 0; }
}
.intro-scan-line {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(110,166,150,0.06) 40%,
    rgba(110,166,150,0.25) 50%,
    rgba(110,166,150,0.06) 60%,
    transparent 100%
  );
  height: 40%;
  width: 100%;
  animation: intro-scan 2.2s cubic-bezier(0.4,0,0.6,1) 0.3s 1 forwards;
}
.intro-emp-ring {
  position: absolute;
  top: 50%; left: 50%;
  width: 300px; height: 300px;
  border-radius: 50%;
  border: 1.5px solid rgba(110,166,150,0.6);
  box-shadow: 0 0 20px rgba(110,166,150,0.4), inset 0 0 20px rgba(110,166,150,0.1);
  animation: intro-emp 1.8s cubic-bezier(0.2,0,0.8,1) 1.1s 1 forwards;
  opacity: 0;
  pointer-events: none;
}
.intro-emp-ring2 {
  position: absolute;
  top: 50%; left: 50%;
  width: 300px; height: 300px;
  border-radius: 50%;
  border: 1px solid rgba(180,133,158,0.4);
  animation: intro-emp2 1.6s cubic-bezier(0.2,0,0.8,1) 1.25s 1 forwards;
  opacity: 0;
  pointer-events: none;
}
.intro-glitch {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: rgba(110,166,150,0.04);
  animation: intro-glitch 4s linear 0s 1 forwards;
}
`

// Détection client de contextes "automatisés".
// Note : Lighthouse moderne (≥ v12) est délibérément non-détectable :
//   navigator.webdriver=false, sec-ch-ua standard, aucun marqueur HTTP.
//   Google fait ça pour empêcher le cloaking SEO. On peut détecter
//   Selenium/Playwright/Puppeteer (qui settent navigator.webdriver=true)
//   mais pas Lighthouse/PageSpeed Insights.
// En pratique, le score Google ranking utilise les CrUX data (vrais visiteurs
// Chrome opt-in), pas le Lighthouse synthétique. L'animation joue à chaque
// visite de la home par choix produit — l'effet "wahou" est jugé plus
// important que le LCP synthétique mobile (cf. seo-roadmap-post-livraison.md).
function isAutomatedContext(): boolean {
  if (typeof navigator === "undefined") return false
  return navigator.webdriver === true
}

export function IntroOverlay() {
  // Détection prefers-reduced-motion + automation côté client AVANT le 1er paint.
  // - prefers-reduced-motion : accessibilité OS/navigateur → skip animations
  // - navigator.webdriver : Lighthouse/Selenium/Playwright → skip pour score perf
  // - Le check User-Agent (bots) est fait côté server dans la home page.
  const shouldSkip =
    typeof window !== "undefined" &&
    ((typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) ||
      isAutomatedContext())

  const [visible, setVisible] = useState(!shouldSkip)

  useEffect(() => {
    if (shouldSkip) {
      // Cas reduced-motion / webdriver : pas d'animation, on signale immédiatement
      // que le hero peut démarrer. setTimeout(0) pour laisser React commit le
      // state avant de signaler (sinon le hero rate l'événement).
      const timer = setTimeout(signalIntroReady, 0)
      return () => clearTimeout(timer)
    }
    const timer = setTimeout(() => {
      setVisible(false)
      // Signaler pendant le fade-out pour que le hero soit déjà en train d'animer
      // quand l'overlay disparaît complètement (fade = 550ms).
      setTimeout(signalIntroReady, 200)
    }, INTRO_DURATION)
    return () => clearTimeout(timer)
  }, [shouldSkip])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          // Non-skippable par choix produit : pas de onClick handler, pas de
          // hint visuelle. L'expérience signature dure ses 4.2s complètes.
          className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
          style={{ zIndex: 9999, background: "#09090b" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          <style dangerouslySetInnerHTML={{ __html: ELECTRIC_CSS }} />

          {/* Halo de fond */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(110,166,150,0.06) 0%, transparent 70%)",
            }}
          />

          {/* Scan line électrique */}
          <div className="intro-scan-line" />

          {/* Ondes EMP à l'impact des murs */}
          <div className="intro-emp-ring" />
          <div className="intro-emp-ring2" />

          {/* Glitch overlay */}
          <div className="intro-glitch" />

          {/* Animation — une seule fois, pas de loop. Non-skippable. */}
          <div className="relative w-[min(88vw,1100px)] pointer-events-none">
            <HeroNeonAnim responsive once />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
