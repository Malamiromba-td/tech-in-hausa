import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.blog" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/blog" },
    openGraph: {
      title: `${t("title")} — TechInHausa`,
      description: t("description"),
      url: "/blog",
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.blog");
  const posts = await getAllPosts();

  return (
    <>
      <Nav />
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h1 className="mb-2 font-display text-[36px] text-indigo-deep">
            {t("heading")}
          </h1>
          <p className="mb-12 text-[15px] text-ink/60">{t("description")}</p>

          <div className="flex flex-col divide-y divide-line">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group py-7"
              >
                <div className="mb-2 text-[13px] text-ink/50">
                  {new Date(post.date).toLocaleDateString(
                    locale === "ha" ? "ha" : "en-GB",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}{" "}
                  · {post.author}
                </div>
                <h2 className="mb-2 font-display text-[22px] text-indigo-deep group-hover:text-indigo">
                  {post.title}
                </h2>
                <p className="text-[15px] text-ink/65">{post.description}</p>
              </Link>
            ))}

            {posts.length === 0 && (
              <p className="py-10 text-ink/50">{t("empty")}</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
