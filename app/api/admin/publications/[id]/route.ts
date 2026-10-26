
import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getSanityWriteClient } from "@/sanity/lib/server-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

function validId(id: string) {
  return /^[a-zA-Z0-9_-]{1,128}$/.test(id);
}

export async function GET(_request: Request, { params }: Context) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!validId(id)) {
      return NextResponse.json({ success: false, error: "Invalid ID." }, { status: 400 });
    }

    const client = getSanityWriteClient();
    const [draft, published] = await Promise.all([
      client.fetch(
        `*[_id == $id && _type == "researchPaper"][0]{
          _id, title, "slug": slug.current, authors, year, summary,
          publishedAt, doi, sourceUrl, "pdfAssetId": pdf.asset->_id,
          "pdfUrl": pdf.asset->url
        }`,
        { id: `drafts.${id}` },
        { perspective: "raw" },
      ),
      client.fetch(
        `*[_id == $id && _type == "researchPaper"][0]{
          _id, title, "slug": slug.current, authors, year, summary,
          publishedAt, doi, sourceUrl, "pdfAssetId": pdf.asset->_id,
          "pdfUrl": pdf.asset->url
        }`,
        { id },
        { perspective: "raw" },
      ),
    ]);

    const publication = draft ?? published;
    if (!publication) {
      return NextResponse.json({ success: false, error: "Publication not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      publication: {
        ...publication,
        id,
        isPublished: Boolean(published),
        status: draft ? published ? "draft changes" : "draft" : "published",
      },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin publication fetch failed:", error);
    return NextResponse.json({ success: false, error: "Unable to load publication." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Context) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!validId(id)) {
      return NextResponse.json({ success: false, error: "Invalid ID." }, { status: 400 });
    }

    const input = await request.json();
    if (input?.action !== "unpublish") {
      return NextResponse.json({ success: false, error: "Unsupported action." }, { status: 400 });
    }

    const client = getSanityWriteClient();
    const [published, draft] = await Promise.all([
      client.fetch(`*[_id == $id && _type == "researchPaper"][0]`, { id }, { perspective: "raw" }),
      client.fetch(`*[_id == $id && _type == "researchPaper"][0]`, { id: `drafts.${id}` }, { perspective: "raw" }),
    ]);

    if (!published) {
      return NextResponse.json({ success: false, error: "Published publication not found." }, { status: 404 });
    }

    await client.transaction()
      .createOrReplace({ ...published, ...(draft ?? {}), _id: `drafts.${id}`, _type: "researchPaper" })
      .delete(id)
      .commit();

    return NextResponse.json({ success: true, status: "draft" });
  } catch (error) {
    console.error("Admin publication unpublish failed:", error);
    return NextResponse.json({ success: false, error: "Unable to unpublish publication." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!validId(id)) {
      return NextResponse.json({ success: false, error: "Invalid ID." }, { status: 400 });
    }

    const client = getSanityWriteClient();
    const [published, draft] = await Promise.all([
      client.getDocument(id),
      client.getDocument(`drafts.${id}`),
    ]);

    if (!published && !draft) {
      return NextResponse.json({ success: false, error: "Publication not found." }, { status: 404 });
    }

    const transaction = client.transaction();
    if (published) transaction.delete(id);
    if (draft) transaction.delete(`drafts.${id}`);
    await transaction.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin publication delete failed:", error);
    return NextResponse.json({ success: false, error: "Unable to delete publication." }, { status: 500 });
  }
                           }
    
