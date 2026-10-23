
import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getSanityWriteClient } from "@/sanity/lib/server-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const POST_FIELDS = `{
  _id,
  _type,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  body,
  mainImage,
  "authorName": author->name
}`;

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  if (!(await hasAdminSession())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;

    if (!/^[a-zA-Z0-9_-]{1,128}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid post ID." },
        { status: 400 },
      );
    }

    const client = getSanityWriteClient();

    const [draft, published] = await Promise.all([
      client.fetch(
        `*[_id == $documentId && _type == "post"][0] ${POST_FIELDS}`,
        { documentId: `drafts.${id}` },
        { perspective: "raw" },
      ),
      client.fetch(
        `*[_id == $documentId && _type == "post"][0] ${POST_FIELDS}`,
        { documentId: id },
        { perspective: "raw" },
      ),
    ]);

    const post = draft ?? published;

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        post: {
          ...post,
          id,
          isPublished: Boolean(published),
          hasDraft: Boolean(draft),
          status: draft
            ? published
              ? "draft changes"
              : "draft"
            : "published",
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Admin blog post fetch failed:", error);

    return NextResponse.json(
      { success: false, error: "Unable to load this blog post." },
      { status: 500 },
    );
  }
            }
