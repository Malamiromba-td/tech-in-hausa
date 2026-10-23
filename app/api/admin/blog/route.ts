
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


function normalizeSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const input = await request.json();

    const title =
      typeof input.title === "string" ? input.title.trim() : "";
    const excerpt =
      typeof input.excerpt === "string" ? input.excerpt.trim() : "";
    const slug = normalizeSlug(
      typeof input.slug === "string" && input.slug.trim()
        ? input.slug
        : title,
    );
    const status = input.status;
    const authorName =
      typeof input.authorName === "string"
        ? input.authorName.trim()
        : "";
    const body = input.body;

    if (!title || title.length > 200) {
      return NextResponse.json(
        { success: false, error: "Enter a title of at most 200 characters." },
        { status: 400 },
      );
    }

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Enter a valid post slug." },
        { status: 400 },
      );
    }

    if (!excerpt || excerpt.length > 200) {
      return NextResponse.json(
        { success: false, error: "Enter an excerpt of at most 200 characters." },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(body) ||
      body.some(
        (block) =>
          !block ||
          typeof block !== "object" ||
          block._type !== "block" ||
          !Array.isArray(block.children),
      )
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid article content." },
        { status: 400 },
      );
    }

    if (status !== "draft" && status !== "published") {
      return NextResponse.json(
        { success: false, error: "Status must be draft or published." },
        { status: 400 },
      );
    }

    const client = getSanityWriteClient();

    const suppliedId =
      typeof input.id === "string" ? input.id.trim() : "";

    if (suppliedId && !/^[a-zA-Z0-9_-]{1,128}$/.test(suppliedId)) {
      return NextResponse.json(
        { success: false, error: "Invalid post ID." },
        { status: 400 },
      );
    }

    const id = suppliedId || crypto.randomUUID();
    const draftId = `drafts.${id}`;

    const [existingPublished, existingDraft] = await Promise.all([
      client.getDocument(id),
      client.getDocument(draftId),
    ]);

    if (
      suppliedId &&
      !existingPublished &&
      !existingDraft
    ) {
      return NextResponse.json(
        { success: false, error: "Post not found." },
        { status: 404 },
      );
    }

    if (
      (existingPublished && existingPublished._type !== "post") ||
      (existingDraft && existingDraft._type !== "post")
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid post document." },
        { status: 400 },
      );
    }

    const slugTaken = await client.fetch(
      `count(*[
        _type == "post" &&
        slug.current == $slug &&
        !(_id in [$id, $draftId])
      ]) > 0`,
      { slug, id, draftId },
    );

    if (slugTaken) {
      return NextResponse.json(
        { success: false, error: "That slug is already in use." },
        { status: 409 },
      );
    }

    let author:
      | { _type: "reference"; _ref: string }
      | undefined;

    if (authorName) {
      const authorDocument = await client.fetch(
        `*[_type == "author" && name == $name][0]{_id}`,
        { name: authorName },
      );

      if (!authorDocument?._id) {
        return NextResponse.json(
          {
            success: false,
            error: "Author not found. Use an existing Sanity author name.",
          },
          { status: 400 },
        );
      }

      author = {
        _type: "reference",
        _ref: authorDocument._id,
      };
    } else {
      const previousAuthor =
        existingDraft?.author ?? existingPublished?.author;

      if (previousAuthor?._ref) {
        author = {
          _type: "reference",
          _ref: previousAuthor._ref,
        };
      }
    }

    const post = {
      _type: "post",
      _id: id,
      title,
      slug: { _type: "slug", current: slug },
      excerpt,
      body,
      ...(author ? { author } : {}),
      ...(existingDraft?.mainImage || existingPublished?.mainImage
        ? {
            mainImage:
              existingDraft?.mainImage ?? existingPublished?.mainImage,
          }
        : {}),
      publishedAt:
        existingPublished?.publishedAt ??
        (status === "published" ? new Date().toISOString() : undefined),
    };

    if (status === "draft") {
      await client.createOrReplace({
        ...post,
        _id: draftId,
      });

      return NextResponse.json({
        success: true,
        status: existingPublished ? "draft changes" : "draft",
        id,
      });
    }

    const publishedPost = { ...post };
    if (!publishedPost.publishedAt) {
      publishedPost.publishedAt = new Date().toISOString();
    }

    const transaction = client.transaction().createOrReplace(publishedPost);

    if (existingDraft) {
      transaction.delete(draftId);
    }

    await transaction.commit();

    return NextResponse.json({
      success: true,
      status: "published",
      id,
    });
  } catch (error) {
    console.error("Admin blog save failed:", error);

    return NextResponse.json(
      { success: false, error: "Unable to save the blog post." },
      { status: 500 },
    );
  }
         }
       
