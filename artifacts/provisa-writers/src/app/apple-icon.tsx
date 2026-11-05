import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#00666B",
        }}
      >
        <div
          style={{
            width: 122,
            height: 122,
            borderRadius: 999,
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 82, height: 82, borderRadius: 999, background: "#EA6427" }} />
        </div>
      </div>
    ),
    size,
  );
}
