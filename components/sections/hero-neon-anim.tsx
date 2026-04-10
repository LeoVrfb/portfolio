"use client"

import { useEffect, useRef, useState } from "react"



const BASE = "https://raw.githubusercontent.com/HoanghoDev/neon_v1/main"

// Dimensions originales 1100×600 → scale 0.75
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
  opacity: 0.85;
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
  border: 1.5px solid var(--accent);
  position: absolute;
  left: 10%;
  top: 100px;
  transition: 1s;
  width: 200px;
  border-radius: 5px;
  height: 400px;
  box-shadow: 0 0 12px var(--accent), 0 0 30px rgba(110,166,150,0.2);
  transform: perspective(290px) rotate(-11deg) rotateY(29deg);
  background: rgba(110,166,150,0.03);
}
.hna-wall-right {
  border: 1.5px solid var(--mauve);
  position: absolute;
  left: 72%;
  top: 100px;
  border-radius: 5px;
  transition: 1s;
  width: 200px;
  height: 400px;
  box-shadow: 0 0 12px var(--mauve), 0 0 30px rgba(180,133,158,0.2);
  transform: perspective(290px) rotate(11deg) rotateY(-29deg);
  background: rgba(180,133,158,0.03);
}

/* ── Mains — transparentes avec bordure néon blanche ── */
/* Pas de brightness(0) : image originale visible par transparence + glow blanc en outline */
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
  filter: drop-shadow(0 0 1px rgba(110,166,150,0.95))
          drop-shadow(0 0 5px rgba(110,166,150,0.8))
          drop-shadow(0 0 16px rgba(110,166,150,0.5));
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
  filter: drop-shadow(0 0 1px rgba(110,166,150,0.95))
          drop-shadow(0 0 5px rgba(110,166,150,0.8))
          drop-shadow(0 0 16px rgba(110,166,150,0.5));
}

/* ── Sphère — wrapper flotte, inner gère UNIQUEMENT scale/opacity ── */
.hna-sphere-wrap {
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translateX(-50%);
  width: 260px;
  height: 260px;
  animation: hna-float 6s ease-in-out infinite;
}
.hna-sphere {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%,
    rgba(187,160,197,0.3) 0%,
    rgba(110,166,150,0.18) 50%,
    transparent 75%
  );
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow:
    0 0 50px rgba(110,166,150,0.15),
    inset 0 0 30px rgba(180,133,158,0.1);
  transform-origin: center center;
  opacity: 1;
  transform: scale(1);
}
.hna-sphere::after {
  content: '';
  position: absolute;
  top: 15%;
  left: 20%;
  width: 40%;
  height: 30%;
  background: radial-gradient(ellipse, rgba(255,255,255,0.1), transparent 70%);
  border-radius: 50%;
}
@keyframes hna-float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(-18px); }
}

/* ── Cycle complet en une seule animation 10s (= intervalle de la boucle)
   Murs :  delay 2s + durée 3s — se rejoignent au centre à t=3.5s (35%), rouverts à t=5s (50%)
   Sphère :
     t=0s→2s   (0%→20%)  : visible, légère respiration
     t=2s→3.5s (20%→35%) : DISPARITION — miroir inverse de l'apparition
                            scale(1)→scale(1.06)→scale(0), opacity 1→0
     t=3.5s→5s (35%→50%) : APPARITION — murs en train de s'ouvrir
                            scale(0)→scale(1.06)→scale(1), opacity 0→1
     t=5s→10s  (50%→100%): visible, légère respiration ── */
.hna-inner.playing .hna-sphere {
  animation: hna-sphere-cycle 10s linear 0s 1 forwards;
}
@keyframes hna-sphere-cycle {
  /* Visible au début */
  0%  { opacity: 1; transform: scale(1); }

  /* DISPARITION — dès que les cartes commencent à se rapprocher (t=2s = 20%) */
  20% { opacity: 1; transform: scale(1); }
  35% { opacity: 0; transform: scale(0); }

  /* APPARITION — murs en train de s'ouvrir (t=3.5s→5s = 35%→50%)
     burst (1.2s) puis settle (0.3s) = miroir temporel de la disparition */
  47% { opacity: 1; transform: scale(1.06); }
  50% { opacity: 1; transform: scale(1); }

  /* Visible jusqu'à la fin */
  80% { opacity: 1; transform: scale(1.03); }
  100%{ opacity: 1; transform: scale(1); }
}

/* ── Éléments décoratifs flottants ── */
.hna-deco {
  position: absolute;
  width: 100%;
  height: 100%;
  animation: hna-deco-drift 7s ease-in-out infinite alternate;
}
@keyframes hna-deco-drift {
  0%   { transform: translate(0, 30px); }
  100% { transform: translate(0, 0); }
}
.hna-deco-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid;
  opacity: 0.35;
}
.hna-deco-ring:nth-child(1) {
  width: 50px; height: 50px;
  border-color: var(--accent);
  top: 28%; left: 27%;
  box-shadow: 0 0 8px var(--accent);
  animation: hna-spin 8s linear infinite;
}
.hna-deco-ring:nth-child(2) {
  width: 22px; height: 22px;
  border-color: var(--mauve);
  top: 62%; right: 26%;
  box-shadow: 0 0 6px var(--mauve);
  animation: hna-spin 5s linear infinite reverse;
}
.hna-deco-ring:nth-child(3) {
  width: 14px; height: 14px;
  border-color: var(--lavender);
  top: 52%; right: 13%;
  box-shadow: 0 0 5px var(--lavender);
}
.hna-deco-dot {
  position: absolute;
  border-radius: 50%;
}
.hna-deco-dot:nth-child(4) {
  width: 6px; height: 6px;
  background: var(--accent);
  top: 48%; left: 33%;
  box-shadow: 0 0 6px var(--accent);
  animation: hna-pulse 3s ease-in-out infinite;
}
.hna-deco-dot:nth-child(5) {
  width: 4px; height: 4px;
  background: var(--lavender);
  top: 38%; right: 28%;
  box-shadow: 0 0 5px var(--lavender);
  animation: hna-pulse 4s ease-in-out infinite 1s;
}
@keyframes hna-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes hna-pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.6); }
}

/* ── Animations mains (déclenchées par .playing) ── */
.hna-inner.playing .hna-hand1 {
  animation: hna-hand1 3s ease-in-out 0.5s 1 forwards;
}
.hna-inner.playing .hna-hand2 {
  animation: hna-hand2 3s ease-in-out 0.5s 1 forwards;
}
/* Opacity max 0.9 : silhouette noire bien visible, glow blanc en bordure */
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

/* ── Animations cartes ── */
.hna-inner.playing .hna-wall-left {
  animation: hna-wall-left 3s ease-in-out 2s 1 forwards;
}
.hna-inner.playing .hna-wall-right {
  animation: hna-wall-right 3s ease-in-out 2s 1 forwards;
}
@keyframes hna-wall-left {
  0%   { left:10%; width:200px; transform:perspective(290px) rotate(-11deg) rotateY(29deg); }
  50%  { left:50%; width:1px;   transform:perspective(290px) rotate(0)      rotateY(29deg); }
  100% { left:10%; width:200px; transform:perspective(290px) rotate(-11deg) rotateY(29deg); }
}
@keyframes hna-wall-right {
  0%   { left:72%; width:200px; transform:perspective(290px) rotate(11deg) rotateY(-29deg); }
  50%  { left:50%; width:1px;   transform:perspective(290px) rotate(0)     rotateY(-29deg); }
  100% { left:72%; width:200px; transform:perspective(290px) rotate(11deg) rotateY(-29deg); }
}
.hna-inner.playing .hna-deco-ring:nth-child(1) {
  animation: hna-spin 8s linear infinite, hna-scatter-1 3.5s ease-out 2.5s 1 forwards;
}
.hna-inner.playing .hna-deco-ring:nth-child(2) {
  animation: hna-spin 5s linear infinite reverse, hna-scatter-2 3.5s ease-out 2.5s 1 forwards;
}
@keyframes hna-scatter-1 {
  0%   { opacity:0.35; top:28%; left:27%; }
  40%  { opacity:0;    top:20%; left:15%; }
  80%  { opacity:0;    top:30%; left:28%; }
  100% { opacity:0.35; top:28%; left:27%; }
}
@keyframes hna-scatter-2 {
  0%   { opacity:0.35; top:62%; right:26%; }
  40%  { opacity:0;    top:70%; right:18%; }
  80%  { opacity:0;    top:63%; right:27%; }
  100% { opacity:0.35; top:62%; right:26%; }
}
`

export function HeroNeonAnim({ responsive = false }: { responsive?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [rScale, setRScale] = useState(0.4)

  useEffect(() => {
    const first = setTimeout(() => {
      setPlaying(true)
      intervalRef.current = setInterval(() => {
        setPlaying(false)
        setTimeout(() => setPlaying(true), 80)
      }, 10000)
    }, 1800)

    return () => {
      clearTimeout(first)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (!responsive) return
    const el = containerRef.current
    if (!el) return
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
      <div className="hna-hand1" />
      <div className="hna-hand2" />
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
          <div
            className={`hna-inner${playing ? " playing" : ""}`}
            style={{ position: "absolute", top: 0, left: 0, transform: `scale(${rScale})` }}
          >
            {innerContent}
          </div>
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
