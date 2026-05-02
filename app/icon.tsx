import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Logo : rectangle outline incline (-10deg) + L turquoise centre.
// Fond sombre du site pour contraster dans le rond blanc des SERPs Google.
export default function Icon() {
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
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 40,
            height: 48,
            border: "3px solid #7fffd4",
            borderRadius: 6,
            transform: "rotate(-10deg)",
          }}
        />
        <div
          style={{
            position: "relative",
            color: "#7fffd4",
            fontSize: 36,
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
