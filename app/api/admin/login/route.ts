import { NextResponse } from "next/server";
import { createAdminSession, isSameOriginRequest, verifyAdminPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request not allowed." }, { status: 403 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Unsupported content type." }, { status: 415 });
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 2048) {
      return NextResponse.json({ error: "Invalid request." }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const password =
    body && typeof body === "object" && "password" in body && typeof body.password === "string"
      ? body.password
      : "";

  if (!password || password.length > 1024) {
    return NextResponse.json({ error: "Enter your admin password." }, { status: 400 });
  }

  const ip = request.headers.get("x-real-ip")?.slice(0, 100) || "unknown";
  let result;
  try {
    result = verifyAdminPassword(password, ip);
  } catch (error) {
    console.error("Admin authentication is not configured.", error);
    return NextResponse.json({ error: "Admin login is not configured yet." }, { status: 503 });
  }

  if (!result.ok) {
    return NextResponse.json(
      { error: result.limited ? "Too many attempts. Please wait 15 minutes." : "Incorrect password." },
      {
        status: result.limited ? 429 : 401,
        headers: result.limited ? { "Retry-After": "900" } : undefined,
      },
    );
  }

  try {
    await createAdminSession();
  } catch (error) {
    console.error("Could not create admin session.", error);
    return NextResponse.json({ error: "Unable to start a secure session." }, { status: 503 });
  }

  return NextResponse.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
