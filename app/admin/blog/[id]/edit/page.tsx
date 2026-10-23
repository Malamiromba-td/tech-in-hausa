
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth";
import NewPostForm from "../../../new/new-post-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Blog Post | TechInHausa Admin",
  robots: { index: false, follow: false },
};

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }

  const { id } = await params;

  return <NewPostForm postId={id} />;
}
