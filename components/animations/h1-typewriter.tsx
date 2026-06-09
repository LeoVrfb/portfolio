"use client";

import { useEffect, useState } from "react";

// Effet typewriter avec glow néon : chaque lettre apparaît en couleur "accent"
// (vert pour Léo, mauve pour Hengebaert) avec un text-shadow néon qui
// s'estompe en 600ms vers la couleur finale (blanc cassé / vert pâle).
//
// Le curseur clignotant garde un glow néon discret pour rester cohérent.
//
// Implémentation : on slice `text` à `revealed` lettres et on map. La key=index
// stable empêche les anciennes lettres de re-monter (donc leur animation ne
// rejoue pas). Seule la nouvelle lettre est mountée → son animation se
// déclenche (CSS animation forwards qui passe de glow → couleur finale).

type H1TypewriterProps = {
  text: string;
  /** Couleur finale de la lettre (après extinction du glow). */
  color?: string;
  /** Couleur du glow néon à l'apparition de chaque lettre. */
  glowColor?: string;
  /** Délai avant que la frappe commence, en secondes. */
  delay?: number;
  /** Vitesse de frappe en ms entre chaque lettre. */
  speed?: number;
  /** Force le rerun de l'animation quand cette key change (page de test). */
  replayKey?: number;
};

const KEYFRAMES_ID = "h1-typewriter-keyframes";

// Injecte les keyframes une seule fois côté client. CSS plus performant que
// motion.span sur des dizaines de lettres (pas de listeners, pas de runtime
// framer-motion par lettre).
function ensureKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement("style");
  style.id = KEYFRAMES_ID;
  style.textContent = `
    /* Animation d'apparition de chaque lettre : flash néon vif → couleur finale
       avec un glow résiduel doux et discret. Volontairement subtil (pas un effet
       Las Vegas) — on cherche un détail élégant, pas une enseigne lumineuse. */
    @keyframes h1-letter-neon {
      0% {
        color: var(--h1-glow-color);
        text-shadow:
          0 0 4px var(--h1-glow-color),
          0 0 12px var(--h1-glow-color);
        opacity: 0.92;
        transform: translateY(2px);
      }
      35% {
        color: var(--h1-glow-color);
        text-shadow:
          0 0 3px var(--h1-glow-color),
          0 0 8px var(--h1-glow-color);
        opacity: 1;
        transform: translateY(0);
      }
      100% {
        color: var(--h1-final-color);
        /* Glow résiduel léger — juste assez pour qu'on devine le néon
           sans dominer la lecture. Un seul halo serré + opacité. */
        text-shadow: 0 0 6px color-mix(in srgb, var(--h1-glow-color) 40%, transparent);
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes h1-cursor-blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

export function H1Typewriter({
  text,
  color = "#f9fbfb",
  glowColor = "#6ea696",
  delay = 0,
  speed = 90,
  replayKey = 0,
}: H1TypewriterProps) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    ensureKeyframes();
    setRevealed(0);
    const startTimer = setTimeout(() => {
      let i = 0;
      const timer = setInterval(() => {
        i += 1;
        setRevealed(i);
        if (i >= text.length) clearInterval(timer);
      }, speed);
      return () => clearInterval(timer);
    }, delay * 1000);
    return () => clearTimeout(startTimer);
  }, [text, delay, speed, replayKey]);

  return (
    <span
      style={
        {
          whiteSpace: "pre",
          // Variables CSS lues par les keyframes.
          ["--h1-glow-color" as string]: glowColor,
          ["--h1-final-color" as string]: color,
        } as React.CSSProperties
      }
    >
      {text.slice(0, revealed).split("").map((char, i) => (
        <span
          // key stable = pas de re-mount des lettres déjà tapées.
          key={`${replayKey}-${i}`}
          style={{
            display: "inline-block",
            color,
            // Apparition rapide (0.7s) qui pose ensuite le glow résiduel discret.
            // Pas de pulsation infinie — l'effet doit rester sobre, pas tape-à-l'œil.
            animation: "h1-letter-neon 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
            willChange: "color, text-shadow, transform",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      {revealed < text.length && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "0.55ch",
            background: glowColor,
            marginLeft: "0.05em",
            verticalAlign: "baseline",
            height: "0.85em",
            transform: "translateY(0.1em)",
            boxShadow: `0 0 8px ${glowColor}, 0 0 18px ${glowColor}`,
            animation: "h1-cursor-blink 0.85s steps(2) infinite",
          }}
        />
      )}
    </span>
  );
}
