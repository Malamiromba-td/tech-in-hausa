import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllPosts } from "@/lib/blog";

export default async function BlogPreview() {
  const t = await getTranslations("blogPreview");
  const posts = (await getAllPosts()).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="bg-paper-tint py-14 md:py-21">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[32px] text-indigo-deep">
            {t("heading")}
          </h2>
          <p className="max-w-[340px] text-[15px] text-ink/60">
            {t("subhead")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <div className="mb-2 text-[13px] text-ink/50">
                {new Date(post.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <h3 className="mb-2 font-display text-[19px] leading-snug text-indigo-deep group-hover:text-indigo">
                {post.title}
              </h3>
              <p className="line-clamp-2 text-[14px] text-ink/60">
                {post.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-11 flex justify-center">
          <Link
            href="/blog"
            className="rounded-[3px] border border-indigo/25 px-6 py-3 text-[14.5px] font-medium text-indigo hover:bg-paper"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
