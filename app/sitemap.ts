import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";

function localizedUrl(path: string, locale: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}

function alternates(path: string) {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, localizedUrl(path, locale)])
  );
}

type SitemapPath = { path: string; priority: number; lastModified?: Date };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//  const staticPaths: SitemapPath[] = [
//    { path: "", priority: 1.0 },
//    { path: "/bidiyo", priority: 0.8 },
//    { path: "/blog", priority: 0.8 },
//    { path: "/bincike", priority: 0.6 },
//    { path: "/game-da-mu", priority: 0.6 },
//    { path: "/tuntube", priority: 0.4 },
//  ];
  const staticPaths: SitemapPath[] = [
  { path: "", priority: 1.0 },
  { path: "/videos", priority: 0.8 },
  { path: "/blog", priority: 0.8 },
  { path: "/research", priority: 0.6 },
  { path: "/about", priority: 0.6 },
  { path: "/contact", priority: 0.4 },
];

  const posts = await getAllPosts();
  const blogPaths = posts.map((post) => ({
    path: `/blog/${post.slug}`,
    priority: 0.7,
    lastModified: new Date(post.date),
  }));

  const allPaths = [...staticPaths, ...blogPaths];

  // One sitemap entry per locale per page, each cross-linked to its
  // translations via the languages field.
  return allPaths.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(page.path, locale),
      lastModified: page.lastModified ?? new Date(),
      priority: page.priority,
      alternates: { languages: alternates(page.path) },
    }))
  );
}
