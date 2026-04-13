"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"



const BASE = "https://raw.githubusercontent.com/HoanghoDev/neon_v1/main"

// Dimensions originales 1100×600 — le scale est géré dynamiquement en mode responsive
const S = 0.75

const ANIM_CSS = `
.hna-root {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  width: ${Math.round(1100 * S)}px;
  height: ${Math.round(600 * S)}px;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
  opacity: 0.92;
}
.hna-inner {
  width: 1100px;
  height: 600px;
  transform-origin: top left;
  transform: scale(${S});
  position: relative;
}

/* ── Cartes latérales ── */
.hna-wall-left {
  border: 2px solid var(--accent);
  position: absolute;
  left: 10%;
  top: 80px;
  transition: 0.6s;
  width: 200px;
  border-radius: 5px;
  height: 440px;
  box-shadow: 0 0 18px var(--accent), 0 0 50px rgba(110,166,150,0.35), inset 0 0 20px rgba(110,166,150,0.08);
  transform: perspective(290px) rotate(-11deg) rotateY(29deg);
  background: rgba(110,166,150,0.05);
}
.hna-wall-right {
  border: 2px solid var(--mauve);
  position: absolute;
  left: 72%;
  top: 80px;
  border-radius: 5px;
  transition: 0.6s;
  width: 200px;
  height: 440px;
  box-shadow: 0 0 18px var(--mauve), 0 0 50px rgba(180,133,158,0.35), inset 0 0 20px rgba(180,133,158,0.08);
  transform: perspective(290px) rotate(11deg) rotateY(-29deg);
  background: rgba(180,133,158,0.05);
}

/* ── Flicker néon sur les murs ── */
@keyframes hna-wall-flicker {
  0%,100% { opacity:1; }
  7%       { opacity:0.4; }
  9%       { opacity:1; }
  18%      { opacity:0.6; }
  20%      { opacity:1; }
  55%      { opacity:0.8; }
  57%      { opacity:0.3; }
  59%      { opacity:1; }
}
.hna-wall-left  { animation: hna-wall-flicker 4s ease-in-out infinite 0.2s; }
.hna-wall-right { animation: hna-wall-flicker 4s ease-in-out infinite 0.9s; }

/* ── Mains ── */
.hna-hand1 {
  width: 250px;
  height: 150px;
  background-image: url(${BASE}/hand1.png);
  background-position: left top;
  background-size: 100%;
  background-repeat: no-repeat;
  position: absolute;
  top: 50%;
  right: 45%;
  opacity: 0;
  filter: drop-shadow(0 0 2px rgba(110,166,150,1))
          drop-shadow(0 0 8px rgba(110,166,150,0.9))
          drop-shadow(0 0 24px rgba(110,166,150,0.6));
}
.hna-hand2 {
  width: 250px;
  height: 250px;
  background-image: url(${BASE}/hand2.png);
  background-position: left top;
  background-size: 100%;
  background-repeat: no-repeat;
  position: absolute;
  top: 37%;
  left: 45%;
  opacity: 0;
  filter: drop-shadow(0 0 2px rgba(110,166,150,1))
          drop-shadow(0 0 8px rgba(110,166,150,0.9))
          drop-shadow(0 0 24px rgba(110,166,150,0.6));
}

/* ── Portrait ── */
.hna-sphere-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 450px;
  animation: hna-float 4s ease-in-out infinite;
}
.hna-sphere {
  width: 100%;
  height: 100%;
  background-image: url(/assets/portrait-professionnel.webp);
  background-size: cover;
  background-position: center 8%;
  transform-origin: center center;
  opacity: 0;
  transform: scale(0);
  mask-image: radial-gradient(ellipse 82% 86% at 50% 50%, black 38%, rgba(0,0,0,0.5) 58%, transparent 76%);
  -webkit-mask-image: radial-gradient(ellipse 82% 86% at 50% 50%, black 38%, rgba(0,0,0,0.5) 58%, transparent 76%);
}
@keyframes hna-float {
  0%, 100% { transform: translate(-50%, -50%) translateY(0); }
  50%       { transform: translate(-50%, -50%) translateY(-16px); }
}

/* ── Cycle 3.5s — claqué
   Murs : delay 0.7s + durée 0.65s → fermeture à ~1.07s (30%), rouverts à ~1.35s (38%)
   Sphère :
     0%→18%  (0→0.63s)  : visible
     18%→30% (0.63→1.07s): disparition
     35%→40% (1.22→1.4s) : réapparition explosive
     40%→100%            : visible, respiration ── */
.hna-inner.playing .hna-sphere {
  animation: hna-sphere-cycle 6.5s linear 0s 1 forwards;
}
@keyframes hna-sphere-cycle {
  0%  { opacity: 0; transform: scale(0); }
  30% { opacity: 0; transform: scale(0); }
  38% { opacity: 1; transform: scale(1.1); }
  42% { opacity: 1; transform: scale(0.97); }
  46% { opacity: 1; transform: scale(1); }
  80% { opacity: 1; transform: scale(1.02); }
  100%{ opacity: 1; transform: scale(1); }
}

/* ── Flicker de la sphère après réapparition ── */
.hna-inner.playing .hna-sphere-wrap {
  animation: hna-float 4s ease-in-out infinite, hna-sphere-flicker 6.5s linear 0s 1 forwards;
}
@keyframes hna-sphere-flicker {
  0%,37%   { filter: none; }
  38%      { filter: brightness(1.5) drop-shadow(0 0 28px rgba(110,166,150,0.85)); }
  41%      { filter: brightness(1.1) drop-shadow(0 0 12px rgba(110,166,150,0.4)); }
  43%      { filter: brightness(1.3) drop-shadow(0 0 20px rgba(180,133,158,0.6)); }
  46%      { filter: brightness(1.05); }
  58%      { filter: brightness(1.08) drop-shadow(0 0 6px rgba(110,166,150,0.25)); }
  62%      { filter: none; }
  100%     { filter: none; }
}

/* ── Éléments décoratifs flottants ── */
.hna-deco {
  position: absolute;
  width: 100%;
  height: 100%;
  animation: hna-deco-drift 5s ease-in-out infinite alternate;
}
@keyframes hna-deco-drift {
  0%   { transform: translate(0, 24px); }
  100% { transform: translate(0, 0); }
}
.hna-deco-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid;
  opacity: 0.5;
}
.hna-deco-ring:nth-child(1) {
  width: 60px; height: 60px;
  border-color: var(--accent);
  top: 26%; left: 24%;
  box-shadow: 0 0 12px var(--accent), 0 0 24px rgba(110,166,150,0.3);
  animation: hna-spin 6s linear infinite;
}
.hna-deco-ring:nth-child(2) {
  width: 28px; height: 28px;
  border-color: var(--mauve);
  top: 62%; right: 24%;
  box-shadow: 0 0 10px var(--mauve), 0 0 20px rgba(180,133,158,0.3);
  animation: hna-spin 4s linear infinite reverse;
}
.hna-deco-ring:nth-child(3) {
  width: 16px; height: 16px;
  border-color: var(--lavender);
  top: 50%; right: 12%;
  box-shadow: 0 0 8px var(--lavender);
  animation: hna-spin 7s linear infinite;
}
.hna-deco-dot {
  position: absolute;
  border-radius: 50%;
}
.hna-deco-dot:nth-child(4) {
  width: 8px; height: 8px;
  background: var(--accent);
  top: 46%; left: 31%;
  box-shadow: 0 0 10px var(--accent), 0 0 20px rgba(110,166,150,0.5);
  animation: hna-pulse 2s ease-in-out infinite;
}
.hna-deco-dot:nth-child(5) {
  width: 5px; height: 5px;
  background: var(--lavender);
  top: 36%; right: 26%;
  box-shadow: 0 0 8px var(--lavender);
  animation: hna-pulse 2.5s ease-in-out infinite 0.7s;
}

/* ── Texte sur le mur gauche ── */
.hna-content {
  position: absolute;
  width: 200px;
  color: rgba(255,255,255,0.9);
  padding: 20px;
  top: 38%;
  left: 13%;
  opacity: 0;
  transform: perspective(290px) rotate(-11deg) rotateY(29deg);
}
.hna-content h2 {
  font-size: 20px;
  font-weight: 800;
  color: var(--accent);
  text-shadow: 0 0 8px var(--accent), 0 0 20px rgba(110,166,150,0.5);
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}
.hna-content p {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.75);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.hna-inner.playing .hna-content {
  animation: hna-content-show 1s ease-out forwards;
  animation-delay: 2.4s;
}
@keyframes hna-content-show {
  from { opacity: 0; transform: perspective(290px) rotate(-11deg) rotateY(29deg) translateY(8px); }
  to   { opacity: 1; transform: perspective(290px) rotate(-11deg) rotateY(29deg) translateY(0); }
}

/* ── Sparks électriques ── */
.hna-spark {
  position: absolute;
  width: 2px;
  border-radius: 1px;
  opacity: 0;
  pointer-events: none;
}
.hna-inner.playing .hna-spark:nth-child(1) {
  height: 22px; background: var(--accent);
  top: 46%; left: 49%;
  box-shadow: 0 0 8px var(--accent), 0 0 20px rgba(110,166,150,0.9);
  animation: hna-spark-zap 0.5s ease-out 1.95s 1 forwards;
  transform-origin: bottom center;
}
.hna-inner.playing .hna-spark:nth-child(2) {
  height: 16px; background: var(--mauve);
  top: 42%; left: 51%;
  box-shadow: 0 0 8px var(--mauve), 0 0 18px rgba(180,133,158,0.9);
  animation: hna-spark-zap 0.5s ease-out 2.05s 1 forwards;
  transform: rotate(22deg);
  transform-origin: bottom center;
}
.hna-inner.playing .hna-spark:nth-child(3) {
  height: 12px; background: white;
  top: 52%; left: 50%;
  box-shadow: 0 0 10px white, 0 0 20px rgba(255,255,255,0.6);
  animation: hna-spark-zap 0.45s ease-out 2.0s 1 forwards;
  transform: rotate(-18deg);
  transform-origin: bottom center;
}
@keyframes hna-spark-zap {
  0%   { opacity: 0; transform: scaleY(0); }
  10%  { opacity: 1; transform: scaleY(1); }
  30%  { opacity: 0; transform: scaleY(0.5) translateY(-8px); }
  100% { opacity: 0; }
}

@keyframes hna-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes hna-pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(2); }
}

/* ── Animations mains ── */
.hna-inner.playing .hna-hand1 {
  animation: hna-hand1 1.8s ease-in-out 0.2s 1 forwards;
}
.hna-inner.playing .hna-hand2 {
  animation: hna-hand2 1.8s ease-in-out 0.2s 1 forwards;
}
@keyframes hna-hand1 {
  0%   { width:0;     height:0;     transform:rotate(-40deg) translate(0,150px); opacity:0; }
  50%  { width:250px; height:250px; transform:rotate(0);                         opacity:0.9; }
  100% { width:250px; height:250px; transform:rotate(45deg) translate(90px,-90px); opacity:0; }
}
@keyframes hna-hand2 {
  0%   { width:0;     height:0;     transform:rotate(-40deg) translate(0,150px);   opacity:0; }
  50%  { width:250px; height:250px; transform:rotate(0);                           opacity:0.9; }
  100% { width:250px; height:250px; transform:rotate(45deg) translate(-30px,90px); opacity:0; }
}

/* ── Animations cartes — claquées ── */
.hna-inner.playing .hna-wall-left {
  animation: hna-wall-flicker 4s ease-in-out infinite 0.2s, hna-wall-left 1.5s cubic-bezier(0.6,0,0.4,1) 1.2s 1 forwards;
}
.hna-inner.playing .hna-wall-right {
  animation: hna-wall-flicker 4s ease-in-out infinite 0.9s, hna-wall-right 1.5s cubic-bezier(0.6,0,0.4,1) 1.2s 1 forwards;
}
@keyframes hna-wall-left {
  0%   { left:10%; width:200px; transform:perspective(290px) rotate(-11deg) rotateY(29deg); }
  55%  { left:50%; width:2px;   transform:perspective(290px) rotate(0)      rotateY(29deg); filter:brightness(3) drop-shadow(0 0 12px var(--accent)); }
  100% { left:10%; width:200px; transform:perspective(290px) rotate(-11deg) rotateY(29deg); }
}
@keyframes hna-wall-right {
  0%   { left:72%; width:200px; transform:perspective(290px) rotate(11deg) rotateY(-29deg); }
  55%  { left:50%; width:2px;   transform:perspective(290px) rotate(0)     rotateY(-29deg); filter:brightness(3) drop-shadow(0 0 12px var(--mauve)); }
  100% { left:72%; width:200px; transform:perspective(290px) rotate(11deg) rotateY(-29deg); }
}
.hna-inner.playing .hna-deco-ring:nth-child(1) {
  animation: hna-spin 6s linear infinite, hna-scatter-1 1.2s ease-out 1s 1 forwards;
}
.hna-inner.playing .hna-deco-ring:nth-child(2) {
  animation: hna-spin 4s linear infinite reverse, hna-scatter-2 1.2s ease-out 1s 1 forwards;
}
@keyframes hna-scatter-1 {
  0%   { opacity:0.5; top:26%; left:24%; }
  40%  { opacity:0;   top:16%; left:10%; }
  80%  { opacity:0;   top:28%; left:25%; }
  100% { opacity:0.5; top:26%; left:24%; }
}
@keyframes hna-scatter-2 {
  0%   { opacity:0.5; top:62%; right:24%; }
  40%  { opacity:0;   top:74%; right:14%; }
  80%  { opacity:0;   top:63%; right:25%; }
  100% { opacity:0.5; top:62%; right:24%; }
}
`

export function HeroNeonAnim({ responsive = false, once = false }: { responsive?: boolean; once?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [rScale, setRScale] = useState<number | null>(null)

  useEffect(() => {
    const first = setTimeout(() => {
      setPlaying(true)
      if (!once) {
        intervalRef.current = setInterval(() => {
          setPlaying(false)
          setTimeout(() => setPlaying(true), 60)
        }, 6500)
      }
    }, 300)

    return () => {
      clearTimeout(first)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [once])

  useLayoutEffect(() => {
    if (!responsive) return
    const el = containerRef.current
    if (!el) return
    // Calcul synchrone avant le premier paint — évite le saut haut-gauche
    setRScale(el.getBoundingClientRect().width / 1100)
    const ro = new ResizeObserver(([entry]) => {
      setRScale(entry.contentRect.width / 1100)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [responsive])

  const innerContent = (
    <>
      <div className="hna-sphere-wrap">
        <div className="hna-sphere" />
      </div>
      <div className="hna-deco">
        <div className="hna-deco-ring" />
        <div className="hna-deco-ring" />
        <div className="hna-deco-ring" />
        <div className="hna-deco-dot" />
        <div className="hna-deco-dot" />
      </div>
      <div className="hna-wall-left" />
      <div className="hna-wall-right" />
      <div className="hna-content">
        <h2>Léo Hengebaert</h2>
        <p>Développeur front-end</p>
      </div>
      <div className="hna-hand1" />
      <div className="hna-hand2" />
      <div className="hna-spark" />
      <div className="hna-spark" />
      <div className="hna-spark" />
    </>
  )

  if (responsive) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: ANIM_CSS }} />
        <div
          ref={containerRef}
          style={{ width: "100%", aspectRatio: "11/6", position: "relative", overflow: "hidden", opacity: 0.85 }}
        >
          {rScale !== null && (
            <div
              className={`hna-inner${playing ? " playing" : ""}`}
              style={{ position: "absolute", top: 0, left: 0, transform: `scale(${rScale})` }}
            >
              {innerContent}
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ANIM_CSS }} />
      <div className="hna-root">
        <div className={`hna-inner${playing ? " playing" : ""}`}>
          {innerContent}
        </div>
      </div>
    </>
  )
}
