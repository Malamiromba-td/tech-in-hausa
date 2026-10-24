
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth";
import NewPostForm from "./new-post-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Blog Post | TechInHausa Admin",
  robots: { index: false, follow: false },
};

export default async function NewBlogPostPage() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }

  return <NewPostForm />;
}
