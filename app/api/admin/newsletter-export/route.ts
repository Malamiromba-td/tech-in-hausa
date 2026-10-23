
import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const API_URL =
  "https://api.techinhausa.org/admin-newsletter-export.php";

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { success: false, message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

export async function GET() {
  try {
    // Only authenticated admins may download subscriber data.
    if (!(await hasAdminSession())) {
      return jsonError("Unauthorized.", 401);
    }

    const token = process.env.TECHINHAUSA_ADMIN_API_TOKEN;

    if (!token) {
      console.error("Admin API token is not configured.");
      return jsonError("Admin API is not configured.", 500);
    }

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/csv",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      // Do not expose backend responses or secrets to the browser.
      console.error(
        `Newsletter export backend returned HTTP ${response.status}.`
      );

      return jsonError(
        response.status === 401
          ? "Backend authentication failed."
          : "Could not export newsletter subscribers.",
        response.status === 401 ? 502 : 502
      );
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.toLowerCase().includes("text/csv")) {
      console.error("Newsletter export backend returned an unexpected content type.");
      return jsonError("Invalid CSV response from backend.", 502);
    }

    if (!response.body) {
      return jsonError("The CSV export was empty.", 502);
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="techinhausa-newsletter-subscribers.csv"',
        "Cache-Control": "private, no-store, no-cache, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    console.error("Newsletter export request failed.");
    return jsonError("Could not export newsletter subscribers.", 502);
  }
      }
      
