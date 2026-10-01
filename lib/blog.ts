/**
 * lib/blog.ts
 * ---------------------------------
 * Reads blog posts from Sanity. Content is edited at /studio — the
 * embedded admin dashboard — not in code. New posts (and edits to
 * existing ones) appear here automatically, no deploy needed.
 *
 * Setup needed once: NEXT_PUBLIC_SANITY_PROJECT_ID and
 * NEXT_PUBLIC_SANITY_DATASET in env vars (see sanity/env.ts).
 * Until those are set, this falls back to sample posts so the site
 * still renders instead of crashing.
 */
import { client } from "@/sanity/lib/client";
import { ALL_POSTS_QUERY, POST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { projectId } from "@/sanity/env";
import type { PortableTextBlock } from "sanity";

export type BlogPostSummary = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
};

export type BlogPost = BlogPostSummary & {
  body: PortableTextBlock[];
};

const FALLBACK_POSTS: BlogPost[] = [
  {
    slug: "me-yasa-ai",
    title: "Me Ya Sa Ya Kamata Ka Koyi AI a Yau?",
    description:
      "Dalilan da ya sa koyon fasahar Artificial Intelligence ya zama muhimmi ga kowa a yau.",
    date: "2026-07-14",
    author: "Ibrahim Zubairu",
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Wannan misali ne na labarin blog — ana nuna shi ne saboda Sanity ba a saita shi ba tukuna. Da zarar an saita NEXT_PUBLIC_SANITY_PROJECT_ID, labaran gaske za su bayyana a maimakon wannan.",
          },
        ],
      },
    ] as unknown as PortableTextBlock[],
  },
];

export async function getAllPosts(): Promise<BlogPostSummary[]> {
  if (!projectId) {
    return FALLBACK_POSTS.map(({ body: _body, ...rest }) => rest);
  }

  try {
    const posts = await client.fetch(ALL_POSTS_QUERY);
    return posts.map(
      (p: {
        slug: string;
        title: string;
        excerpt: string;
        publishedAt: string;
        author: string | null;
      }) => ({
        slug: p.slug,
        title: p.title,
        description: p.excerpt,
        date: p.publishedAt,
        author: p.author ?? "TechInHausa",
      })
    );
  } catch {
    return FALLBACK_POSTS.map(({ body: _body, ...rest }) => rest);
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!projectId) {
    return FALLBACK_POSTS.find((p) => p.slug === slug) ?? null;
  }

  try {
    const post = await client.fetch(POST_BY_SLUG_QUERY, { slug });
    if (!post) return null;

    return {
      slug: post.slug,
      title: post.title,
      description: post.excerpt,
      date: post.publishedAt,
      author: post.author ?? "TechInHausa",
      body: post.body ?? [],
    };
  } catch {
    return FALLBACK_POSTS.find((p) => p.slug === slug) ?? null;
  }
}
