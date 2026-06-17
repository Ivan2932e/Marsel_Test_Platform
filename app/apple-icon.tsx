import { ImageResponse } from "next/og";

export const runtime = "edge";
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
          background:
            "linear-gradient(135deg, #FAF8F4 0%, #DDE3D5 100%)",
          color: "#2A2724",
          fontFamily: "serif",
          fontStyle: "italic",
          fontSize: 132,
          fontWeight: 500,
          letterSpacing: -2,
        }}
      >
        Т
      </div>
    ),
    { ...size },
  );
}
