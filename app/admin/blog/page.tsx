
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth";
import BlogPostsList from "./blog-posts-list";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog Management | TechInHausa Admin",
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }

  return <BlogPostsList />;
}
