"use client"

import { useEffect, useState } from "react"

const BASE = "https://raw.githubusercontent.com/HoanghoDev/neon_v1/main"

function getIntroCss(scale: number) {
  return `
.intro-inner {
  position: absolute; top: 0; left: 0;
  width: 1100px; height: 600px;
  transform-origin: top left;
  transform: scale(${scale});
}

/* ── Cartes ── */
.intro-wall-left {
  border: 1.5px solid var(--accent);
  position: absolute; left: 10%; top: 100px;
  width: 200px; height: 400px; border-radius: 5px;
  box-shadow: 0 0 12px var(--accent), 0 0 30px rgba(110,166,150,0.2);
  transform: perspective(290px) rotate(-11deg) rotateY(29deg);
  background: rgba(110,166,150,0.03);
  animation: intro-wall-left-anim 3s ease-in-out 1.5s 1 forwards;
}
.intro-wall-right {
  border: 1.5px solid var(--mauve);
  position: absolute; left: 72%; top: 100px;
  width: 200px; height: 400px; border-radius: 5px;
  box-shadow: 0 0 12px var(--mauve), 0 0 30px rgba(180,133,158,0.2);
  transform: perspective(290px) rotate(11deg) rotateY(-29deg);
  background: rgba(180,133,158,0.03);
  animation: intro-wall-right-anim 3s ease-in-out 1.5s 1 forwards;
}
@keyframes intro-wall-left-anim {
  0%   { left: 10%; width: 200px; transform: perspective(290px) rotate(-11deg) rotateY(29deg); }
  50%  { left: 50%; width: 1px;   transform: perspective(290px) rotate(0)      rotateY(29deg); }
  100% { left: 10%; width: 200px; transform: perspective(290px) rotate(-11deg) rotateY(29deg); }
}
@keyframes intro-wall-right-anim {
  0%   { left: 72%; width: 200px; transform: perspective(290px) rotate(11deg)  rotateY(-29deg); }
  50%  { left: 50%; width: 1px;   transform: perspective(290px) rotate(0)      rotateY(-29deg); }
  100% { left: 72%; width: 200px; transform: perspective(290px) rotate(11deg)  rotateY(-29deg); }
}

/* ── Mains — démarrent immédiatement ── */
.intro-hand1 {
  width: 250px; height: 150px;
  background-image: url(${BASE}/hand1.png);
  background-size: 100%; background-position: left top; background-repeat: no-repeat;
  position: absolute; top: 50%; right: 45%; opacity: 0;
  filter: drop-shadow(0 0 1px rgba(110,166,150,0.95))
          drop-shadow(0 0 5px rgba(110,166,150,0.8))
          drop-shadow(0 0 16px rgba(110,166,150,0.5));
  animation: intro-hand1-anim 3s ease-in-out 0s 1 forwards;
}
.intro-hand2 {
  width: 250px; height: 250px;
  background-image: url(${BASE}/hand2.png);
  background-size: 100%; background-position: left top; background-repeat: no-repeat;
  position: absolute; top: 37%; left: 45%; opacity: 0;
  filter: drop-shadow(0 0 1px rgba(110,166,150,0.95))
          drop-shadow(0 0 5px rgba(110,166,150,0.8))
          drop-shadow(0 0 16px rgba(110,166,150,0.5));
  animation: intro-hand2-anim 3s ease-in-out 0s 1 forwards;
}
@keyframes intro-hand1-anim {
  0%   { width: 0;     height: 0;     transform: rotate(-40deg) translate(0, 150px);   opacity: 0; }
  50%  { width: 250px; height: 250px; transform: rotate(0);                             opacity: 0.9; }
  100% { width: 250px; height: 250px; transform: rotate(45deg) translate(90px, -90px);  opacity: 0; }
}
@keyframes intro-hand2-anim {
  0%   { width: 0;     height: 0;     transform: rotate(-40deg) translate(0, 150px);   opacity: 0; }
  50%  { width: 250px; height: 250px; transform: rotate(0);                             opacity: 0.9; }
  100% { width: 250px; height: 250px; transform: rotate(45deg) translate(-30px, 90px); opacity: 0; }
}

/* ── Sphère ── */
.intro-sphere-wrap {
  position: absolute; left: 50%; top: 20%;
  transform: translateX(-50%);
  width: 260px; height: 260px;
  animation: intro-float 6s ease-in-out infinite;
}
.intro-sphere {
  width: 100%; height: 100%; border-radius: 50%;
  background: radial-gradient(circle at 35% 35%,
    rgba(187,160,197,0.3) 0%,
    rgba(110,166,150,0.18) 50%,
    transparent 75%
  );
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 0 50px rgba(110,166,150,0.15), inset 0 0 30px rgba(180,133,158,0.1);
  animation: intro-sphere-cycle 5s linear 0s 1 forwards;
}
.intro-sphere::after {
  content: ''; position: absolute; top: 15%; left: 20%;
  width: 40%; height: 30%;
  background: radial-gradient(ellipse, rgba(255,255,255,0.1), transparent 70%);
  border-radius: 50%;
}
@keyframes intro-float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(-18px); }
}
/* Sphère synchro walls : walls démarrent à t=1.5s, fermées à t=3s, ouvertes à t=4.5s */
@keyframes intro-sphere-cycle {
  0%   { opacity: 1; transform: scale(1); }
  30%  { opacity: 1; transform: scale(1); }     /* t=1.5s, walls commencent à se fermer */
  60%  { opacity: 0; transform: scale(0); }     /* t=3s, walls fermées */
  85%  { opacity: 1; transform: scale(1.06); }  /* t=4.25s, walls en train de s'ouvrir */
  90%  { opacity: 1; transform: scale(1); }     /* t=4.5s, walls ouvertes */
  100% { opacity: 1; transform: scale(1); }
}

/* ── Déco ── */
.intro-deco { position: absolute; width: 100%; height: 100%; }
.intro-deco-ring { position: absolute; border-radius: 50%; border: 1px solid; opacity: 0.35; }
.intro-deco-ring:nth-child(1) {
  width: 50px; height: 50px; border-color: var(--accent);
  top: 28%; left: 27%; box-shadow: 0 0 8px var(--accent);
  animation: intro-spin 8s linear infinite;
}
.intro-deco-ring:nth-child(2) {
  width: 22px; height: 22px; border-color: var(--mauve);
  top: 62%; right: 26%; box-shadow: 0 0 6px var(--mauve);
  animation: intro-spin 5s linear infinite reverse;
}
.intro-deco-ring:nth-child(3) {
  width: 14px; height: 14px; border-color: var(--lavender);
  top: 52%; right: 13%; box-shadow: 0 0 5px var(--lavender);
}
.intro-deco-dot { position: absolute; border-radius: 50%; }
.intro-deco-dot:nth-child(4) {
  width: 6px; height: 6px; background: var(--accent);
  top: 48%; left: 33%; box-shadow: 0 0 6px var(--accent);
  animation: intro-pulse 3s ease-in-out infinite;
}
.intro-deco-dot:nth-child(5) {
  width: 4px; height: 4px; background: var(--lavender);
  top: 38%; right: 28%; box-shadow: 0 0 5px var(--lavender);
  animation: intro-pulse 4s ease-in-out infinite 1s;
}
@keyframes intro-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes intro-pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.6); }
}
`
}

export function ClientIntro() {
  const [show, setShow] = useState<boolean | null>(null)
  const [scale, setScale] = useState(0.8)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const sw = (window.innerWidth * 0.82) / 1100
    const sh = (window.innerHeight * 0.82) / 600
    setScale(Math.min(sw, sh, 1.4))
    setShow(true)

    const fade = setTimeout(() => setFading(true), 4800)
    const done = setTimeout(() => setShow(false), 5500)
    return () => {
      clearTimeout(fade)
      clearTimeout(done)
    }
  }, [])

  const handleSkip = () => {
    setFading(true)
    setTimeout(() => setShow(false), 700)
  }

  if (show !== true) return null

  const w = Math.round(1100 * scale)
  const h = Math.round(600 * scale)

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "hsl(240 10% 3.9%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 700ms ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: getIntroCss(scale) }} />
      <div style={{ position: "relative", width: w, height: h, overflow: "hidden" }}>
        <div className="intro-inner">
          <div className="intro-sphere-wrap">
            <div className="intro-sphere" />
          </div>
          <div className="intro-deco">
            <div className="intro-deco-ring" />
            <div className="intro-deco-ring" />
            <div className="intro-deco-ring" />
            <div className="intro-deco-dot" />
            <div className="intro-deco-dot" />
          </div>
          <div className="intro-wall-left" />
          <div className="intro-wall-right" />
          <div className="intro-hand1" />
          <div className="intro-hand2" />
        </div>
      </div>
      <button
        onClick={handleSkip}
        style={{
          position: "absolute",
          bottom: 28,
          right: 32,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(255,255,255,0.25)",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          transition: "color 200ms",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
      >
        Passer →
      </button>
    </div>
  )
}
