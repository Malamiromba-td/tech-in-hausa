
import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getSanityWriteClient } from "@/sanity/lib/server-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
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

    const [published, draft] = await Promise.all([
      client.fetch(
        `*[_id == $id && _type == "post"][0]`,
        { id },
        { perspective: "raw" },
      ),
      client.fetch(
        `*[_id == $id && _type == "post"][0]`,
        { id: `drafts.${id}` },
        { perspective: "raw" },
      ),
    ]);

    if (!published) {
      return NextResponse.json(
        { success: false, error: "Published post not found." },
        { status: 404 },
      );
    }

    const draftDocument = {
      ...published,
      ...(draft ?? {}),
      _id: `drafts.${id}`,
      _type: "post",
    };

    const transaction = client.transaction().createOrReplace(draftDocument);

    transaction.delete(id);

    await transaction.commit();

    return NextResponse.json({
      success: true,
      status: "draft",
      id,
    });
  } catch (error) {
    console.error("Admin blog unpublish failed:", error);

    return NextResponse.json(
      { success: false, error: "Unable to unpublish this post." },
      { status: 500 },
    );
  }
}
  
