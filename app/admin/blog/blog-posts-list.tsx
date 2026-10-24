
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  FileText,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  EyeOff,
} from "lucide-react";

type BlogPost = {
  id: string;
  _id: string;
  _updatedAt?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  publishedAt?: string;
  author?: string | null;
  status: "draft" | "draft changes" | "published";
  isPublished: boolean;
  hasDraft: boolean;
};

export default function BlogPostsList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [unpublishingId, setUnpublishingId] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/blog", {
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Could not load blog posts.");
      }

      if (!Array.isArray(data.posts)) {
        throw new Error("The server returned an invalid post list.");
      }

      setPosts(data.posts as BlogPost[]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load blog posts.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  async function unpublishPost(post: BlogPost) {
    const confirmed = window.confirm(
      `Unpublish "${post.title || "Untitled post"}"?\n\n` +
        "It will be removed from the public blog and kept as a draft. " +
        "You can edit it and publish it again later.",
    );

    if (!confirmed) return;

    setActionError("");
    setUnpublishingId(post.id);

    try {
      const response = await fetch(
        `/api/admin/blog/${encodeURIComponent(post.id)}/unpublish`,
        {
          method: "POST",
          cache: "no-store",
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Could not unpublish this post.");
      }

      await loadPosts();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Could not unpublish this post.",
      );
    } finally {
      setUnpublishingId(null);
    }
  }

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesSearch =
        !term ||
        post.title?.toLowerCase().includes(term) ||
        post.author?.toLowerCase().includes(term) ||
        post.slug?.toLowerCase().includes(term);

      const matchesFilter =
        filter === "all" ||
        (filter === "published" && post.isPublished) ||
        (filter === "draft" && !post.isPublished);

      return matchesSearch && matchesFilter;
    });
  }, [posts, search, filter]);

  const publishedCount = posts.filter((post) => post.isPublished).length;
  const draftCount = posts.filter((post) => !post.isPublished).length;

  function formatDate(value?: string) {
    if (!value) return "Not dated";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not dated";

    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
    }).format(date);
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-8 text-ink sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-indigo-deep"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="mt-7 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo">
              TechInHausa admin
            </p>
            <h1 className="mt-2 font-display text-3xl text-indigo-deep sm:text-4xl">
              Blog management
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink/70">
              Manage your articles and prepare new technology and AI lessons
              for your readers.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void loadPosts()}
              disabled={loading || unpublishingId !== null}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-medium hover:border-indigo/40 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-deep px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo"
            >
              <Plus size={17} />
              New post
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-sm text-ink/60">All articles</p>
            <p className="mt-2 text-2xl font-semibold text-indigo-deep">
              {loading ? "—" : posts.length}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-sm text-ink/60">Published</p>
            <p className="mt-2 text-2xl font-semibold">
              {loading ? "—" : publishedCount}
            </p>
          </div>
          <div className="col-span-2 rounded-2xl border border-line bg-white p-4 sm:col-span-1">
            <p className="text-sm text-ink/60">Drafts</p>
            <p className="mt-2 text-2xl font-semibold">
              {loading ? "—" : draftCount}
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        {actionError && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {actionError}
          </div>
        )}

        <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search titles, authors, or slugs"
                className="w-full rounded-xl border border-line bg-paper px-10 py-2.5 text-sm outline-none focus:border-indigo"
                aria-label="Search blog posts"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: "All", value: "all" },
                { label: "Published", value: "published" },
                { label: "Drafts", value: "draft" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                    filter === item.value
                      ? "bg-indigo-deep text-white"
                      : "border border-line text-ink/70 hover:border-indigo/40"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-ink/60">
              <LoaderCircle size={18} className="animate-spin" />
              Loading articles…
            </div>
          ) : error ? (
            <p className="p-8 text-sm text-ink/60">
              The articles could not be loaded. Try refreshing.
            </p>
          ) : filteredPosts.length === 0 ? (
            <div className="p-10 text-center">
              <FileText size={30} className="mx-auto text-ink/30" />
              <h2 className="mt-3 font-display text-xl text-indigo-deep">
                No articles found
              </h2>
              <p className="mt-2 text-sm text-ink/60">
                Try another search or create your first post.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {filteredPosts.map((post) => (
                <li
                  key={post.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          post.isPublished
                            ? "bg-green-50 text-green-800"
                            : "bg-gold-soft text-ink"
                        }`}
                      >
                        {post.status}
                      </span>
                      {post.author && (
                        <span className="text-xs text-ink/55">
                          by {post.author}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-2 break-words font-semibold text-indigo-deep">
                      {post.title || "Untitled post"}
                    </h2>

                    {post.excerpt && (
                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-ink/65">
                        {post.excerpt}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-ink/50">
                      Updated {formatDate(post._updatedAt)}
                      {post.slug ? ` · /blog/${post.slug}` : ""}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-center">
                    <Link
                      href={`/admin/blog/${encodeURIComponent(post.id)}/edit`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-medium transition hover:border-indigo/40"
                    >
                      Edit post
                      <ArrowUpRight size={15} />
                    </Link>

                    {post.isPublished && (
                      <button
                        type="button"
                        onClick={() => void unpublishPost(post)}
                        disabled={unpublishingId !== null}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {unpublishingId === post.id ? (
                          <LoaderCircle size={15} className="animate-spin" />
                        ) : (
                          <EyeOff size={15} />
                        )}
                        {unpublishingId === post.id
                          ? "Unpublishing…"
                          : "Unpublish"}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
  }

/*"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  FileText,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

type BlogPost = {
  id: string;
  _id: string;
  _updatedAt?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  publishedAt?: string;
  author?: string | null;
  status: "draft" | "draft changes" | "published";
  isPublished: boolean;
  hasDraft: boolean;
};

export default function BlogPostsList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/blog", {
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Could not load blog posts.");
      }

      if (!Array.isArray(data.posts)) {
        throw new Error("The server returned an invalid post list.");
      }

      setPosts(data.posts as BlogPost[]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load blog posts.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesSearch =
        !term ||
        post.title?.toLowerCase().includes(term) ||
        post.author?.toLowerCase().includes(term) ||
        post.slug?.toLowerCase().includes(term);

      const matchesFilter =
        filter === "all" ||
        (filter === "published" && post.isPublished) ||
        (filter === "draft" && !post.isPublished);

      return matchesSearch && matchesFilter;
    });
  }, [posts, search, filter]);

  const publishedCount = posts.filter((post) => post.isPublished).length;
  const draftCount = posts.filter((post) => !post.isPublished).length;

  function formatDate(value?: string) {
    if (!value) return "Not dated";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not dated";

    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
    }).format(date);
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-8 text-ink sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-indigo-deep"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="mt-7 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo">
              TechInHausa admin
            </p>
            <h1 className="mt-2 font-display text-3xl text-indigo-deep sm:text-4xl">
              Blog management
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink/70">
              Manage your articles and prepare new technology and AI lessons
              for your readers.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void loadPosts()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-medium hover:border-indigo/40 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-deep px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo"
            >
              <Plus size={17} />
              New post
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-sm text-ink/60">All articles</p>
            <p className="mt-2 text-2xl font-semibold text-indigo-deep">
              {loading ? "—" : posts.length}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-sm text-ink/60">Published</p>
            <p className="mt-2 text-2xl font-semibold">
              {loading ? "—" : publishedCount}
            </p>
          </div>
          <div className="col-span-2 rounded-2xl border border-line bg-white p-4 sm:col-span-1">
            <p className="text-sm text-ink/60">Drafts</p>
            <p className="mt-2 text-2xl font-semibold">
              {loading ? "—" : draftCount}
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search titles, authors, or slugs"
                className="w-full rounded-xl border border-line bg-paper px-10 py-2.5 text-sm outline-none focus:border-indigo"
                aria-label="Search blog posts"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: "All", value: "all" },
                { label: "Published", value: "published" },
                { label: "Drafts", value: "draft" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                    filter === item.value
                      ? "bg-indigo-deep text-white"
                      : "border border-line text-ink/70 hover:border-indigo/40"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-ink/60">
              <LoaderCircle size={18} className="animate-spin" />
              Loading articles…
            </div>
          ) : error ? (
            <p className="p-8 text-sm text-ink/60">
              The articles could not be loaded. Try refreshing.
            </p>
          ) : filteredPosts.length === 0 ? (
            <div className="p-10 text-center">
              <FileText size={30} className="mx-auto text-ink/30" />
              <h2 className="mt-3 font-display text-xl text-indigo-deep">
                No articles found
              </h2>
              <p className="mt-2 text-sm text-ink/60">
                Try another search or create your first post.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {filteredPosts.map((post) => (
                <li
                  key={post.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          post.isPublished
                            ? "bg-green-50 text-green-800"
                            : "bg-gold-soft text-ink"
                        }`}
                      >
                        {post.status}
                      </span>
                      {post.author && (
                        <span className="text-xs text-ink/55">
                          by {post.author}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-2 break-words font-semibold text-indigo-deep">
                      {post.title || "Untitled post"}
                    </h2>

                    {post.excerpt && (
                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-ink/65">
                        {post.excerpt}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-ink/50">
                      Updated {formatDate(post._updatedAt)}
                      {post.slug ? ` · /blog/${post.slug}` : ""}
                    </p>
                  </div>

                  <Link
                    href={`/admin/blog/${encodeURIComponent(post.id)}/edit`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-line px-3 py-2 text-sm font-medium transition hover:border-indigo/40 sm:self-center"
                  >
                    Edit post
                    <ArrowUpRight size={15} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
                        }
          
*/
