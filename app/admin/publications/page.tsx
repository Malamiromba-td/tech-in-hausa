
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth";
import PublicationsManager from "./publications-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Publications Management | TechInHausa Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPublicationsPage() {
  if (!(await hasAdminSession())) redirect("/admin/login");
  return <PublicationsManager />;
}
