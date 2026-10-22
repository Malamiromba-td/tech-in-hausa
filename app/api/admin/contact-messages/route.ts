
import { NextRequest, NextResponse } from "next/server";
import {
  hasAdminSession,
  isSameOriginRequest,
} from "@/lib/admin-auth";

const API_URL =
  "https://api.techinhausa.org/admin-contact-messages.php";

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { success: false, message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

async function forwardResponse(response: Response) {
  const data = await response.json().catch(() => null);

  if (!data || typeof data !== "object") {
    return jsonError("Invalid response from the backend.", 502);
  }

  return NextResponse.json(data, {
    status: response.status,
    headers: { "Cache-Control": "no-store" },
  });
}

// Fetch contact messages for authenticated administrators.
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

    if (response.status === 401) {
  return jsonError("PHP backend rejected the API token.", 502);
    }

    return await forwardResponse(response);
  } catch {
    return jsonError("Could not load contact messages.", 502);
  }
}

// Update a contact message's status.
export async function PATCH(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return jsonError("Invalid request origin.", 403);
    }

    if (!(await hasAdminSession())) {
      return jsonError("Unauthorized.", 401);
    }

    const token = process.env.TECHINHAUSA_ADMIN_API_TOKEN;

    if (!token) {
      console.error("Admin API token is not configured.");
      return jsonError("Admin API is not configured.", 500);
    }

    const body = await request.json().catch(() => null);

    if (
      !body ||
      !Number.isSafeInteger(body.id) ||
      body.id < 1 ||
      !["new", "read", "archived"].includes(body.status)
    ) {
      return jsonError("Invalid message ID or status.", 422);
    }

    const response = await fetch(API_URL, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id: body.id,
        status: body.status,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    return await forwardResponse(response);
  } catch {
    return jsonError("Could not update the contact message.", 502);
  }
        }
