import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#1A2340",
          color: "#FDFBF6",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 34,
            fontWeight: 600,
            marginBottom: 28,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 26 26" fill="none">
            <path
              d="M13 1L24 13L13 25L2 13L13 1Z"
              stroke="#D4A03C"
              strokeWidth="1.6"
            />
            <path d="M13 7L19 13L13 19L7 13L13 7Z" fill="#2C3E6B" />
          </svg>
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 58,
            fontWeight: 500,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          Fasaha, cikin harshen mutane.
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 26,
            color: "rgba(253,251,246,0.75)",
            maxWidth: 800,
          }}
        >
          Technology and AI education, taught entirely in Hausa.
        </div>
      </div>
    ),
    { ...size }
  );
}
