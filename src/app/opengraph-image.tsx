import { ImageResponse } from "next/og";

export const alt = "ICADE vs CUNEF — Padel Cup";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen al compartir el enlace (Instagram, WhatsApp, X...).
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f3d2e",
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 40, border: "3px solid rgba(255,255,255,0.18)", display: "flex" }} />
        <div style={{ position: "absolute", top: 20, bottom: 20, left: 598, width: 4, background: "rgba(255,255,255,0.25)", display: "flex" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 48, fontSize: 150, fontWeight: 900, letterSpacing: -4 }}>
          <span>ICADE</span>
          <span style={{ fontSize: 70, color: "#dcf24f" }}>VS</span>
          <span>CUNEF</span>
        </div>
        <div style={{ display: "flex", fontSize: 52, fontWeight: 800, letterSpacing: 18, color: "#c3c8cc", marginTop: 8 }}>
          PADEL CUP
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            padding: "14px 34px",
            borderRadius: 999,
            background: "#dcf24f",
            color: "#0b0c0b",
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          TORNEO + TARDEO CON DJ + 2 COPAS
        </div>
      </div>
    ),
    size,
  );
}
