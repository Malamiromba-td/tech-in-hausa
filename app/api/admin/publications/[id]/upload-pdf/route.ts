
import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getSanityWriteClient } from "@/sanity/lib/server-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 20 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "Select a PDF file." }, { status: 400 });
    }

    if (file.size === 0 || file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: "PDF must be smaller than 20 MB." }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ success: false, error: "Only PDF files are accepted." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.length < 5 || bytes.toString("ascii", 0, 5) !== "%PDF-") {
      return NextResponse.json({ success: false, error: "The selected file is not a valid PDF." }, { status: 400 });
    }

    const client = getSanityWriteClient();
    const asset = await client.assets.upload("file", bytes, {
      filename: file.name.replace(/[^\w.-]/g, "_").slice(-100) || "publication.pdf",
      contentType: "application/pdf",
    });

    return NextResponse.json({
      success: true,
      asset: { id: asset._id, url: asset.url },
    });
  } catch (error) {
    console.error("Publication PDF upload failed:", error);
    return NextResponse.json({ success: false, error: "Unable to upload PDF." }, { status: 500 });
  }
}
