import { defineQuery } from "next-sanity";

export const ALL_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "author": author->name
  }
`);

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    body,
    mainImage,
    "author": author->name
  }
`);

export const RESEARCH_PAPERS_QUERY = defineQuery(`
  *[
    _type == "researchPaper" &&
    defined(slug.current) &&
    !(_id in path("drafts.**"))
  ] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    year,
    summary,
    authors,
    publishedAt,
    doi,
    sourceUrl,
    "pdfUrl": pdf.asset->url
  }
`);
