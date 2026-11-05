import { ImageResponse } from "next/og";

export const alt = "Provisa Writers: connecting professionals to global opportunities";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TEAL = "#00666B";
const ORANGE = "#EA6427";
const CREAM = "#F6F1E8";
const INK = "#1F2D33";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CREAM,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: 999,
              background: TEAL,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 999,
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 50, height: 50, borderRadius: 999, background: ORANGE }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 56, fontWeight: 800, color: TEAL, letterSpacing: -1 }}>PROVISA</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: TEAL, letterSpacing: 6 }}>WRITERS LTD.</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, color: INK, lineHeight: 1.05, letterSpacing: -2 }}>
            Connecting Professionals
          </div>
          <div style={{ fontSize: 76, fontWeight: 800, color: ORANGE, lineHeight: 1.05, letterSpacing: -2 }}>
            to Global Opportunities
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: INK }}>Discover • Access • Pursue</div>
          <div style={{ fontSize: 28, fontWeight: 600, color: TEAL }}>provisawriters.com</div>
        </div>
      </div>
    ),
    size,
  );
}
