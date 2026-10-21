
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (error?.code === "23505") {
      return NextResponse.json({
        message: "This email is already subscribed.",
      });
    }

    if (error) {
      console.error("Newsletter database error:", error.message);
      return NextResponse.json(
        { message: "Subscription failed. Please try again." },
        { status: 500 }
      );
    }

    // Notify the site owner after the email is saved.
    try {
      const { error: mailError } = await resend.emails.send({
        from: process.env.NEWSLETTER_FROM_EMAIL!,
        to: [process.env.NEWSLETTER_NOTIFY_EMAIL!],
        subject: "New newsletter subscriber",
        text: `A new subscriber joined your newsletter.\n\nEmail: ${email}`,
      });

      if (mailError) {
        console.error("Newsletter notification failed:", mailError);
      }
    } catch (mailError) {
      // The subscription remains saved even if notification fails.
      console.error("Newsletter notification error:", mailError);
    }

    return NextResponse.json({
      message: "Thanks for subscribing!",
    });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
      }
