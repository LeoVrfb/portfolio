"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { HeroNeonAnim } from "@/components/sections/hero-neon-anim"
import { signalIntroReady } from "@/lib/intro-signal"

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

export function IntroOverlay() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      // Signaler pendant le fade-out pour que le hero soit déjà en train d'animer
      // quand l'overlay disparaît complètement (fade = 550ms)
      setTimeout(signalIntroReady, 200)
    }, INTRO_DURATION)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
          style={{ zIndex: 9999, background: "#09090b" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          onClick={() => setVisible(false)}
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

          {/* Animation — une seule fois, pas de loop */}
          <div className="relative w-[min(88vw,1100px)] pointer-events-none">
            <HeroNeonAnim responsive once />
          </div>

          {/* Hint skip */}
          <motion.p
            className="absolute bottom-8 text-xs tracking-widest uppercase"
            style={{ color: "rgba(110,166,150,0.35)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            Cliquer pour passer
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
