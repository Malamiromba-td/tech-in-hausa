
import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const API_URL =
  "https://api.techinhausa.org/admin-newsletter-subscribers.php";

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
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json().catch(() => null);

    if (!data || typeof data !== "object") {
      return jsonError("Invalid response from the backend.", 502);
    }

    if (!response.ok) {
      if (response.status === 401) {
        console.error("PHP newsletter endpoint rejected the API token.");
        return jsonError("Backend authentication failed.", 502);
      }

      return jsonError(
        typeof data.message === "string"
          ? data.message
          : "Could not load subscribers.",
        response.status >= 400 && response.status < 500
          ? response.status
          : 502
      );
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return jsonError("Could not load newsletter subscribers.", 502);
  }
  }
