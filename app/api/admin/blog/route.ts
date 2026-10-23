
import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getSanityWriteClient } from "@/sanity/lib/server-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const POSTS_QUERY = `
  *[_type == "post" && !(_id in path("versions.**"))] 
    | order(_updatedAt desc) {
      _id,
      _updatedAt,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      "author": author->name
    }
`;

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const client = getSanityWriteClient();

    const documents = await client.fetch(
      POSTS_QUERY,
      {},
      { perspective: "raw" },
    );

    // Prefer the draft when a published post also has an unpublished draft.
    const postsById = new Map<string, Record<string, unknown>>();

    for (const document of documents) {
      const isDraft = document._id.startsWith("drafts.");
      const id = isDraft ? document._id.slice(7) : document._id;
      const existing = postsById.get(id);

      if (!existing || isDraft) {
        postsById.set(id, {
          ...document,
          id,
          hasDraft: isDraft,
          isPublished: isDraft
            ? Boolean(existing?.isPublished)
            : true,
          status: isDraft
            ? existing?.isPublished
              ? "draft changes"
              : "draft"
            : "published",
        });
      } else if (!isDraft) {
        existing.isPublished = true;
        existing.status = "published";
      }
    }

    const posts = Array.from(postsById.values()).sort(
      (a, b) =>
        new Date(String(b._updatedAt ?? "")).getTime() -
        new Date(String(a._updatedAt ?? "")).getTime(),
    );

    return NextResponse.json(
      { success: true, posts },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Admin blog list failed:", error);

    return NextResponse.json(
      { success: false, error: "Unable to load blog posts." },
      { status: 500 },
    );
  }
}
  
