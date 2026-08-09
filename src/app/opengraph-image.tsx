import { ImageResponse } from "next/og";
export const alt =
  "Namak Indian Restaurant & Bar — Modern Indian dining, made for sharing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 68,
        background: "#F8F4EC",
        color: "#1E2522",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          display: "flex",
          color: "#1F5A4A",
          fontSize: 22,
          letterSpacing: 8,
        }}
      >
        NAMAK · DALLAS
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 82,
          lineHeight: 0.95,
        }}
      >
        <span>Modern Indian dining,</span>
        <span style={{ color: "#1F5A4A" }}>made for sharing.</span>
      </div>
      <div style={{ display: "flex", fontSize: 23 }}>
        Indian Restaurant &amp; Bar · Greenville Avenue
      </div>
    </div>,
    size,
  );
}
