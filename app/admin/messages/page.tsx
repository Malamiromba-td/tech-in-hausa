
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth";
import ContactMessagesInbox from "./contact-messages-inbox";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact Messages | TechInHausa Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ContactMessagesPage() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }

  return <ContactMessagesInbox />;
      }
