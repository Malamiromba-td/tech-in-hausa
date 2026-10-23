
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { JSONContent } from "@tiptap/core";
import RichTextEditor from "../rich-text-editor";
import { tiptapToPortableText } from "@/sanity/lib/portable-text";

const EMPTY_DOCUMENT: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export default function NewPostForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState<JSONContent>(EMPTY_DOCUMENT);
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function makeSlug(value: string) {
    return value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function savePost(status: "draft" | "published") {
    setError("");
    setNotice("");

    if (!title.trim() || !excerpt.trim()) {
      setError("Please enter a title and an excerpt.");
      return;
    }

    if (excerpt.trim().length > 200) {
      setError("Your excerpt must be 200 characters or fewer.");
      return;
    }

    if (!makeSlug(slug || title)) {
      setError("Please enter a valid post slug.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug || makeSlug(title),
          excerpt: excerpt.trim(),
          authorName: authorName.trim(),
          body: tiptapToPortableText(
            body as Parameters<typeof tiptapToPortableText>[0],
          ),
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to save this post.");
      }

      setNotice(
        status === "published"
          ? "Your post has been published."
          : "Your draft has been saved.",
      );

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            TechInHausa Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Write a blog post
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Create an article for your Hausa technology and AI audience.
          </p>
        </div>

        <Link
          href="/admin/blog"
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to posts
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          {notice}
        </div>
      )}

      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
        <div>
          <label
            htmlFor="post-title"
            className="text-sm font-semibold text-slate-800"
          >
            Post title
          </label>
          <input
            id="post-title"
            className={inputClass}
            value={title}
            maxLength={200}
            onChange={(event) => {
              const value = event.target.value;
              setTitle(value);
              if (!slugEdited) setSlug(makeSlug(value));
            }}
            placeholder="e.g. Fahimtar Artificial Intelligence"
            required
          />
        </div>

        <div>
          <label
            htmlFor="post-slug"
            className="text-sm font-semibold text-slate-800"
          >
            URL slug
          </label>
          <input
            id="post-slug"
            className={inputClass}
            value={slug}
            onChange={(event) => {
              setSlugEdited(true);
              setSlug(makeSlug(event.target.value));
            }}
            placeholder="fahimtar-artificial-intelligence"
          />
          <p className="mt-2 text-xs text-slate-500">
            Used in your article URL. Keep it short and descriptive.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="post-excerpt"
              className="text-sm font-semibold text-slate-800"
            >
              Excerpt
            </label>
            <span className="text-xs text-slate-500">
              {excerpt.length}/200
            </span>
          </div>
          <textarea
            id="post-excerpt"
            className={inputClass}
            value={excerpt}
            maxLength={200}
            rows={3}
            onChange={(event) => setExcerpt(event.target.value)}
            placeholder="Briefly describe what readers will learn..."
            required
          />
        </div>

        <div>
          <label
            htmlFor="post-author"
            className="text-sm font-semibold text-slate-800"
          >
            Author name
          </label>
          <input
            id="post-author"
            className={inputClass}
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            placeholder="Enter an existing Sanity author name"
          />
          <p className="mt-2 text-xs text-slate-500">
            Leave blank to retain an existing author when editing. For a new
            post, the author must already exist in Sanity.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Article content
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Write your article and use the toolbar to format it.
          </p>
        </div>

        <RichTextEditor initialContent={EMPTY_DOCUMENT} onChange={setBody} />
      </section>

      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6">
        <button
          type="button"
          disabled={saving}
          onClick={() => savePost("draft")}
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save draft"}
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={() => savePost("published")}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Publish post"}
        </button>
      </div>
    </main>
  );
      }
          
