import { ImageResponse } from "next/og";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 38,
        background: "#100d0a",
        color: "#f5ebdd",
        fontFamily: "Georgia",
        fontSize: 92,
        fontStyle: "italic",
        border: "8px solid #b89b62",
      }}
    >
      N
    </div>,
    size,
  );
}
