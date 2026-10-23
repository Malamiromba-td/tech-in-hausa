
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth";
import NewsletterSubscribers from "./newsletter-subscribers";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Newsletter Subscribers | TechInHausa Admin",
  robots: { index: false, follow: false },
};

export default async function NewsletterPage() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }

  return <NewsletterSubscribers />;
}
