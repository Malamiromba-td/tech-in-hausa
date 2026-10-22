import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const authenticated = await hasAdminSession();
  return NextResponse.json(
    { authenticated },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
