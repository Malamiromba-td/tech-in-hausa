import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description: "Labarai da rubuce-rubuce game da fasaha, AI, da ilimi.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — TechInHausa",
    description: "Labarai da rubuce-rubuce game da fasaha, AI, da ilimi.",
    url: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <Nav />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h1 className="mb-2 font-display text-[36px] text-indigo-deep">
            Blog
          </h1>
          <p className="mb-12 text-[15px] text-ink/60">
            Rubuce-rubuce game da fasaha, AI, da ci gaban dijital — a
            harshen Hausa.
          </p>

          <div className="flex flex-col divide-y divide-line">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group py-7"
              >
                <div className="mb-2 text-[13px] text-ink/50">
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {post.author}
                </div>
                <h2 className="mb-2 font-display text-[22px] text-indigo-deep group-hover:text-indigo">
                  {post.title}
                </h2>
                <p className="text-[15px] text-ink/65">{post.description}</p>
              </Link>
            ))}

            {posts.length === 0 && (
              <p className="py-10 text-ink/50">
                Babu labarai tukuna. Bincike zai fito nan da wallafa na
                farko.
              </p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
