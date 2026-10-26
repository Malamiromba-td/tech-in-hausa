
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { hasAdminSession } from "@/lib/admin-auth";
import { getSanityWriteClient } from "@/sanity/lib/server-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function validId(id: string) {
  return /^[a-zA-Z0-9_-]{1,128}$/.test(id);
}

const FIELDS = `{
  _id, _updatedAt, title, "slug": slug.current,
  authors, year, summary, publishedAt, doi, sourceUrl,
  "pdfAssetId": pdf.asset->_id,
  "pdfUrl": pdf.asset->url
}`;

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = getSanityWriteClient();
    const docs = await client.fetch(
      `*[_type == "researchPaper" && !(_id in path("versions.**"))] | order(_updatedAt desc) ${FIELDS}`,
      {},
      { perspective: "raw" },
    );

    const grouped = new Map<string, Record<string, unknown>>();

    for (const doc of docs) {
      const isDraft = String(doc._id).startsWith("drafts.");
      const id = isDraft ? String(doc._id).slice(7) : String(doc._id);
      const current = grouped.get(id);

      if (!current || isDraft) {
        grouped.set(id, {
          ...doc,
          id,
          isPublished: isDraft ? Boolean(current?.isPublished) : true,
          status: isDraft
            ? current?.isPublished ? "draft changes" : "draft"
            : "published",
        });
      }
    }

    return NextResponse.json(
      { success: true, publications: [...grouped.values()] },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Admin publications list failed:", error);
    return NextResponse.json({ success: false, error: "Unable to load publications." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const input = await request.json();

    const title = typeof input.title === "string" ? input.title.trim() : "";
    const slug = slugify(typeof input.slug === "string" && input.slug.trim() ? input.slug : title);
    const summary = typeof input.summary === "string" ? input.summary.trim() : "";
    const authors = Array.isArray(input.authors)
      ? input.authors.filter((a: unknown): a is string => typeof a === "string").map((a: string) => a.trim()).filter(Boolean)
      : [];
    const year = Number(input.year);
    const status = input.status;
    const doi = typeof input.doi === "string" ? input.doi.trim() : "";
    const sourceUrl = typeof input.sourceUrl === "string" ? input.sourceUrl.trim() : "";
    const pdfAssetId = typeof input.pdfAssetId === "string" ? input.pdfAssetId : "";

    if (!title || title.length > 200 || !slug || slug.length > 96) {
      return NextResponse.json({ success: false, error: "Enter a title and valid slug (maximum 200 and 96 characters)." }, { status: 400 });
    }
    if (!summary || summary.length > 3000) {
      return NextResponse.json({ success: false, error: "Abstract is required and must be 3,000 characters or fewer." }, { status: 400 });
    }
    if (!authors.length || authors.some((a: string) => a.length > 120)) {
      return NextResponse.json({ success: false, error: "Enter at least one valid author." }, { status: 400 });
    }
    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      return NextResponse.json({ success: false, error: "Enter a valid publication year." }, { status: 400 });
    }
    if (status !== "draft" && status !== "published") {
      return NextResponse.json({ success: false, error: "Status must be draft or published." }, { status: 400 });
    }
    if (status === "published" && !pdfAssetId) {
      return NextResponse.json({ success: false, error: "Upload a PDF before publishing." }, { status: 400 });
    }
    if (doi.length > 200) {
      return NextResponse.json({ success: false, error: "DOI is too long." }, { status: 400 });
    }
    if (sourceUrl) {
      try {
        const url = new URL(sourceUrl);
        if (!["https:", "http:"].includes(url.protocol)) throw new Error();
      } catch {
        return NextResponse.json({ success: false, error: "Enter a valid external URL." }, { status: 400 });
      }
    }

    const suppliedId = typeof input.id === "string" ? input.id.trim() : "";
    if (suppliedId && !validId(suppliedId)) {
      return NextResponse.json({ success: false, error: "Invalid publication ID." }, { status: 400 });
    }

    const client = getSanityWriteClient();
    const id = suppliedId || randomUUID();
    const draftId = `drafts.${id}`;

    const [published, draft] = await Promise.all([
      client.fetch(`*[_id == $id && _type == "researchPaper"][0]`, { id }, { perspective: "raw" }),
      client.fetch(`*[_id == $id && _type == "researchPaper"][0]`, { id: draftId }, { perspective: "raw" }),
    ]);

    if (suppliedId && !published && !draft) {
      return NextResponse.json({ success: false, error: "Publication not found." }, { status: 404 });
    }

    const slugTaken = await client.fetch(
      `count(*[_type == "researchPaper" && slug.current == $slug && !(_id in [$id, $draftId])]) > 0`,
      { slug, id, draftId },
      { perspective: "raw" },
    );

    if (slugTaken) {
      return NextResponse.json({ success: false, error: "That slug is already in use." }, { status: 409 });
    }

    if (pdfAssetId) {
      const asset = await client.getDocument(pdfAssetId);
      if (!asset || asset._type !== "sanity.fileAsset") {
        return NextResponse.json({ success: false, error: "The selected PDF asset was not found." }, { status: 400 });
      }
    }

    const previous = draft ?? published;
    const document = {
      _type: "researchPaper",
      _id: id,
      title,
      slug: { _type: "slug", current: slug },
      authors,
      year,
      summary,
      ...(doi ? { doi } : {}),
      ...(sourceUrl ? { sourceUrl } : {}),
      ...(pdfAssetId
        ? { pdf: { _type: "file", asset: { _type: "reference", _ref: pdfAssetId } } }
        : previous?.pdf ? { pdf: previous.pdf } : {}),
      publishedAt: previous?.publishedAt ?? new Date().toISOString(),
    };

    if (status === "draft") {
      await client.createOrReplace({ ...document, _id: draftId });
      return NextResponse.json({ success: true, id, status: published ? "draft changes" : "draft" });
    }

    const transaction = client.transaction().createOrReplace(document);
    if (draft) transaction.delete(draftId);
    await transaction.commit();

    return NextResponse.json({ success: true, id, status: "published" });
  } catch (error) {
    console.error("Admin publication save failed:", error);
    return NextResponse.json({ success: false, error: "Unable to save publication." }, { status: 500 });
  }
          }
      
