"use client";

import { useState, useId } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CREAM = "#F5F0E8";
const INK = "#1A1A1A";
const GOLD = "#E8C030";
const FONT = "var(--font-bebas), 'Anton', Impact, sans-serif";

// ── Slide 1 : Logo héro — réplique exacte du hero greg-art ──

function HeroLogoSlide() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-5 px-8"
      style={{ background: CREAM }}
    >
      {/* Tagline + coup de pinceau */}
      <div className="relative inline-flex items-center justify-center">
        <span
          className="absolute overflow-hidden"
          style={{
            inset: "-14px -52px",
            zIndex: 0,
            animation: "bald-brush-reveal 0.7s cubic-bezier(0.25,0.1,0.25,1) 0.2s both",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/bald/trait-noir.png"
            alt=""
            aria-hidden
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
          />
        </span>
        <p
          className="relative z-10 text-[11px] tracking-[0.3em] uppercase font-bold"
          style={{
            color: CREAM,
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            animation: "bald-fade-in 0.5s ease 0.75s both",
          }}
        >
          Artiste Peintre Contemporain
        </p>
      </div>

      {/* BALD — BA en encre, LD en feuille d'or */}
      <h2
        style={{
          fontFamily: FONT,
          fontSize: "clamp(4.5rem, 15vw, 8rem)",
          lineHeight: 0.9,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          animation: "bald-hero-reveal 0.8s cubic-bezier(0.16,1,0.3,1) 0.7s both",
        }}
      >
        <span style={{ color: INK }}>BA</span>
        <span
          style={{
            color: "transparent",
            backgroundImage: "url('/assets/bald/feuille-or.avif')",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            backgroundSize: "300px auto",
            backgroundRepeat: "repeat",
          }}
        >
          LD
        </span>
      </h2>
    </div>
  );
}

// ── Slide 2 : Badge circulaire rotatif — réplique exacte greg-art ──

function RotatingBadgeSlide() {
  const id = useId();
  const text = "ABSTRACTION GESTUELLE • ART CONTEMPORAIN • BALD • ";
  const radius = 27;
  const fontSize = 4.2;

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: CREAM }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: 200, height: 200 }}
      >
        {/* Anneau texte rotatif */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            animation: "bald-spin 25s linear infinite",
          }}
        >
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
            <defs>
              <path
                id={`circle-${id}`}
                d={`M 50,50 m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
                fill="none"
              />
            </defs>
            <text
              style={{
                fontSize: `${fontSize}px`,
                letterSpacing: "0.25em",
                fontFamily: FONT,
                fill: `${INK}cc`,
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              <textPath href={`#circle-${id}`}>{text}</textPath>
            </text>
          </svg>
        </div>

        {/* Cercle doré central */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundImage: "url('/assets/bald/feuille-or.avif')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 8px 30px rgba(232,192,48,0.45), 0 2px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: FONT, fontSize: 22, letterSpacing: "0.06em", lineHeight: 1 }}>
            <span style={{ color: INK }}>BA</span>
            <span style={{ color: CREAM }}>LD</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Slide 3 : Logo BALD en code (éclaboussure dorée + texte) ──

function PaintSplashSlide() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: CREAM }}
    >
      <div
        style={{
          position: "relative",
          width: "clamp(140px, 38%, 200px)",
          aspectRatio: "1 / 1",
          borderRadius: 16,
          overflow: "hidden",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "bald-splash-in 0.65s cubic-bezier(0.16,1,0.3,1) 0.1s both",
        }}
      >
        {/* Éclaboussure jaune en background */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/assets/bald/bg-logo-yellow.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.75,
          }}
        />
        {/* Texte BALD */}
        <span
          style={{
            fontFamily: FONT,
            fontSize: "clamp(3.5rem, 12vw, 5.5rem)",
            letterSpacing: "0.06em",
            lineHeight: 1,
            color: INK,
            position: "relative",
            zIndex: 1,
          }}
        >
          BALD
        </span>
      </div>
    </div>
  );
}

// ── Composant principal ──

const SLIDES = [
  { label: "Logo & typographie", Component: HeroLogoSlide },
  { label: "Badge circulaire", Component: RotatingBadgeSlide },
  { label: "Éclaboussure dorée", Component: PaintSplashSlide },
] as const;

export function BaldIdentityShowcase() {
  const [current, setCurrent] = useState(0);
  const { Component, label } = SLIDES[current];

  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrent((c) => (c + 1) % SLIDES.length);

  return (
    <>
      <style>{`
        @keyframes bald-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes bald-brush-reveal {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0 0 0); }
        }
        @keyframes bald-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bald-hero-reveal {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bald-title-reveal {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bald-splash-in {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border/60">
        {/* Slide content — key force remount → animations replayed */}
        <div key={current} className="absolute inset-0">
          <Component />
        </div>

        {/* Label */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span
            className="text-[10px] tracking-[0.3em] uppercase font-semibold px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(26,26,26,0.13)",
              color: INK,
              backdropFilter: "blur(6px)",
            }}
          >
            {label}
          </span>
        </div>

        {/* Flèche gauche */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
          style={{ background: "rgba(26,26,26,0.14)", color: INK }}
          aria-label="Slide précédent"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Flèche droite */}
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
          style={{ background: "rgba(26,26,26,0.14)", color: INK }}
          aria-label="Slide suivant"
        >
          <ChevronRight size={16} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="w-1.5 h-1.5 rounded-full transition-all cursor-pointer"
              style={{
                background: i === current ? INK : `${INK}44`,
                transform: i === current ? "scale(1.3)" : "scale(1)",
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
