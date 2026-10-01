import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.title ?? SITE_NAME;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
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
            gap: 14,
            fontSize: 26,
            fontWeight: 600,
            color: "#E8C877",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 26 26" fill="none">
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
            fontSize: 52,
            fontWeight: 500,
            lineHeight: 1.2,
            maxWidth: 980,
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...size }
  );
}
