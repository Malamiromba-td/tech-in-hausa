
import { defineField, defineType } from "sanity";

export const researchPaperType = defineType({
  name: "researchPaper",
  title: "Research Publications",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Research Title",
      type: "string",
      validation: (Rule) => Rule.required().max(200),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "authors",
      title: "Authors",
      description: "Add each author in publication order.",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "year",
      title: "Publication Year",
      type: "number",
      validation: (Rule) =>
        Rule.required().integer().min(1900).max(2100),
    }),

    defineField({
      name: "summary",
      title: "Abstract / Summary",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required().max(3000),
    }),

    defineField({
      name: "pdf",
      title: "Research PDF",
      type: "file",
      description: "Upload the full paper as a PDF.",
      options: {
        accept: "application/pdf",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "publishedAt",
      title: "Publication Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: "doi",
      title: "DOI (Optional)",
      type: "string",
    }),

    defineField({
      name: "sourceUrl",
      title: "External Publication URL (Optional)",
      type: "url",
    }),
  ],

  preview: {
    select: {
      title: "title",
      year: "year",
      authors: "authors",
    },
    prepare({ title, year, authors }) {
      return {
        title,
        subtitle: `${year ?? ""} · ${
          Array.isArray(authors) ? authors.join(", ") : ""
        }`,
      };
    },
  },
});
