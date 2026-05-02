import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Version 180x180 (iOS / écran d'accueil) du même design : fond sombre,
// rectangle outline incliné, L turquoise.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "hsl(158, 24%, 7%)",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 112,
            height: 134,
            border: "8px solid #7fffd4",
            borderRadius: 16,
            transform: "rotate(-10deg)",
          }}
        />
        <div
          style={{
            position: "relative",
            color: "#7fffd4",
            fontSize: 100,
            fontWeight: 700,
            fontFamily: "sans-serif",
            lineHeight: 1,
          }}
        >
          L
        </div>
      </div>
    ),
    { ...size }
  );
}
