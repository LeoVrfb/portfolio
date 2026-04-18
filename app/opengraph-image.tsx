import { ImageResponse } from "next/og";

export const alt = "Léo Hengebaert — Développeur Front-End";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "hsl(158, 24%, 7%)",
          padding: "80px 96px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top : badge formule */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "hsl(163, 52%, 76%)",
              color: "hsl(158, 24%, 7%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 900,
              letterSpacing: "-0.05em",
            }}
          >
            L
          </div>
          <span
            style={{
              color: "hsl(163, 52%, 76%)",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
            }}
          >
            leohengebaert.fr
          </span>
        </div>

        {/* Center : nom + sous-titre */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h1
            style={{
              color: "hsl(180, 20%, 98%)",
              fontSize: 124,
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 0.95,
              margin: 0,
            }}
          >
            Léo Hengebaert
          </h1>
          <p
            style={{
              color: "hsl(163, 52%, 76%)",
              fontSize: 44,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Développeur Front-End — React & Next.js
          </p>
        </div>

        {/* Bottom : tagline */}
        <p
          style={{
            color: "hsl(180, 8%, 70%)",
            fontSize: 26,
            fontWeight: 400,
            margin: 0,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Sites web sur mesure pour entreprises et particuliers — au-delà de ce qu'un outil no-code peut offrir.
        </p>
      </div>
    ),
    { ...size }
  );
}
