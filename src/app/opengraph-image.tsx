import { ImageResponse } from "next/og";
export const alt =
  "Namak Indian Restaurant & Bar — Where spice becomes a story";
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
        background:
          "radial-gradient(circle at 78% 38%, #8b2443, #2c1411 30%, #100d0a 70%)",
        color: "#f5ebdd",
        fontFamily: "Georgia",
      }}
    >
      <div
        style={{
          display: "flex",
          color: "#b89b62",
          fontFamily: "Arial",
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
        <span>Where spice</span>
        <span style={{ color: "#d4832f", fontStyle: "italic" }}>
          becomes a story.
        </span>
      </div>
      <div style={{ display: "flex", fontFamily: "Arial", fontSize: 23 }}>
        Indian Restaurant &amp; Bar · Greenville Avenue
      </div>
    </div>,
    size,
  );
}
