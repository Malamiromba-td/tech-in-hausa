
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, LoaderCircle, Plus, RefreshCw, Search, Trash2, Upload, EyeOff } from "lucide-react";

type Publication = {
  id: string;
  title?: string;
  slug?: string;
  authors?: string[];
  year?: number;
  summary?: string;
  doi?: string;
  sourceUrl?: string;
  pdfAssetId?: string;
  pdfUrl?: string;
  isPublished: boolean;
  status: string;
};

type FormState = {
  id: string;
  title: string;
  slug: string;
  authors: string;
  year: string;
  summary: string;
  doi: string;
  sourceUrl: string;
  pdfAssetId: string;
  pdfUrl: string;
};

const EMPTY: FormState = {
  id: "", title: "", slug: "", authors: "", year: String(new Date().getFullYear()),
  summary: "", doi: "", sourceUrl: "", pdfAssetId: "", pdfUrl: "",
};

export default function PublicationsManager() {
  const [items, setItems] = useState<Publication[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/publications", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not load publications.");
      setItems(data.publications);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load publications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadItems(); }, [loadItems]);

  function startNew() {
    setForm(EMPTY);
    setEditing(false);
    setShowForm(true);
    setError("");
    setNotice("");
  }

  async function startEdit(id: string) {
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/publications/${encodeURIComponent(id)}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not load publication.");
      const p = data.publication;
      setForm({
        id: p.id,
        title: p.title ?? "",
        slug: p.slug ?? "",
        authors: (p.authors ?? []).join(", "),
        year: String(p.year ?? ""),
        summary: p.summary ?? "",
        doi: p.doi ?? "",
        sourceUrl: p.sourceUrl ?? "",
        pdfAssetId: p.pdfAssetId ?? "",
        pdfUrl: p.pdfUrl ?? "",
      });
      setEditing(true);
      setShowForm(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load publication.");
    }
  }

  function slugify(value: string) {
    return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      .trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 96);
  }

  async function uploadPdf(file?: File) {
    if (!file) return;
    setError("");
    if (file.type !== "application/pdf" || file.size > 20 * 1024 * 1024 || file.size === 0) {
      setError("Choose a PDF file smaller than 20 MB.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/publications/upload-pdf", {
        method: "POST", body: formData, cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "PDF upload failed.");
      setForm((old) => ({ ...old, pdfAssetId: data.asset.id, pdfUrl: data.asset.url }));
      setNotice("PDF uploaded. Save the publication to attach it.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function save(status: "draft" | "published") {
    setError("");
    setNotice("");

    if (!form.title.trim() || !form.summary.trim() || !form.authors.trim() || !form.year) {
      setError("Title, authors, year, and abstract are required.");
      return;
    }
    if (status === "published" && !form.pdfAssetId) {
      setError("Upload a PDF before publishing.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editing ? { id: form.id } : {}),
          title: form.title.trim(),
          slug: slugify(form.slug || form.title),
          authors: form.authors.split(",").map((a) => a.trim()).filter(Boolean),
          year: Number(form.year),
          summary: form.summary.trim(),
          doi: form.doi.trim(),
          sourceUrl: form.sourceUrl.trim(),
          pdfAssetId: form.pdfAssetId || undefined,
          status,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not save publication.");

      setNotice(status === "published" ? "Publication published successfully." : "Draft saved successfully.");
      setShowForm(false);
      setForm(EMPTY);
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save publication.");
    } finally {
      setSaving(false);
    }
  }

  async function unpublish(item: Publication) {
    if (!window.confirm(`Unpublish "${item.title}"? It will remain as a draft.`)) return;
    setBusyId(item.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/publications/${encodeURIComponent(item.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unpublish" }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Unpublish failed.");
      setNotice("Publication moved to drafts.");
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unpublish failed.");
    } finally {
      setBusyId("");
    }
  }

  async function remove(item: Publication) {
    if (!window.confirm(`Permanently delete "${item.title}" and its publication record? This cannot be undone.`)) return;
    setBusyId(item.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/publications/${encodeURIComponent(item.id)}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Delete failed.");
      setNotice("Publication deleted.");
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusyId("");
    }
  }

  const filtered = items.filter((item) =>
    `${item.title ?? ""} ${item.authors?.join(" ") ?? ""} ${item.slug ?? ""}`.toLowerCase().includes(search.toLowerCase()),
  );
  const inputClass = "mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo";

  return (
    <main className="min-h-screen bg-paper px-4 py-8 text-ink sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-indigo-deep">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo">TechInHausa admin</p>
            <h1 className="mt-2 font-display text-3xl text-indigo-deep">Publications & Research</h1>
            <p className="mt-2 text-sm text-ink/65">Create, edit, publish, and manage research papers.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => void loadItems()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button onClick={startNew} className="inline-flex items-center gap-2 rounded-xl bg-indigo-deep px-4 py-2.5 text-sm font-medium text-white">
              <Plus size={17} /> New publication
            </button>
          </div>
        </div>

        {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
        {notice && <p role="status" className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{notice}</p>}

        {showForm && (
          <section className="mt-6 space-y-5 rounded-2xl border border-line bg-white p-5 sm:p-7">
            <h2 className="font-display text-2xl text-indigo-deep">{editing ? "Edit publication" : "Create publication"}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">Title
                <input className={inputClass} maxLength={200} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} />
              </label>
              <label className="text-sm font-semibold">Slug
                <input className={inputClass} maxLength={96} value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} />
              </label>
              <label className="text-sm font-semibold">Authors (comma-separated)
                <input className={inputClass} value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })} placeholder="Author One, Author Two" />
              </label>
              <label className="text-sm font-semibold">Publication year
                <input className={inputClass} type="number" min={1900} max={2100} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
              </label>
              <label className="text-sm font-semibold">DOI (optional)
                <input className={inputClass} value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })} placeholder="10.xxxx/xxxxx" />
              </label>
              <label className="text-sm font-semibold">External URL (optional)
                <input className={inputClass} type="url" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} placeholder="https://..." />
              </label>
            </div>

            <label className="block text-sm font-semibold">Abstract / summary
              <textarea className={inputClass} rows={5} maxLength={3000} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
              <span className="mt-1 block text-xs font-normal text-ink/50">{form.summary.length}/3000 characters</span>
            </label>

            <div className="rounded-xl border border-dashed border-line p-4">
              <p className="text-sm font-semibold">Full paper PDF</p>
              {form.pdfUrl ? (
                <p className="mt-2 break-all text-sm text-ink/70">
                  Current file: <a className="text-indigo underline" href={form.pdfUrl} target="_blank" rel="noreferrer">View PDF</a>
                </p>
              ) : <p className="mt-2 text-sm text-ink/55">No PDF uploaded yet. A PDF is required to publish.</p>}
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm">
                {uploading ? <LoaderCircle size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? "Uploading PDF…" : form.pdfUrl ? "Replace PDF" : "Upload PDF"}
                <input className="sr-only" type="file" accept="application/pdf,.pdf" disabled={uploading} onChange={(e) => { void uploadPdf(e.target.files?.[0]); e.currentTarget.value = ""; }} />
              </label>
              <p className="mt-2 text-xs text-ink/50">PDF only, maximum 20 MB.</p>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-line pt-4">
              <button onClick={() => { setShowForm(false); setError(""); }} disabled={saving || uploading} className="rounded-xl border border-line px-4 py-2.5 text-sm">Cancel</button>
              <button onClick={() => void save("draft")} disabled={saving || uploading} className="rounded-xl border border-line px-4 py-2.5 text-sm font-medium disabled:opacity-50">
                {saving ? "Saving…" : "Save draft"}
              </button>
              <button onClick={() => void save("published")} disabled={saving || uploading} className="rounded-xl bg-indigo-deep px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">
                {saving ? "Saving…" : "Publish"}
              </button>
            </div>
          </section>
        )}

        <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
          <div className="border-b border-line p-4">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
              <input className="w-full rounded-xl border border-line bg-paper py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, author, or slug" aria-label="Search publications" />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 p-10 text-sm text-ink/60"><LoaderCircle size={18} className="animate-spin" /> Loading publications…</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center"><FileText size={30} className="mx-auto text-ink/30" /><p className="mt-3 text-sm text-ink/60">No publications found.</p></div>
          ) : (
            <ul className="divide-y divide-line">
              {filtered.map((item) => (
                <li key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${item.isPublished ? "bg-green-50 text-green-800" : "bg-gold-soft text-ink"}`}>{item.status}</span>
                    <h3 className="mt-2 break-words font-semibold text-indigo-deep">{item.title || "Untitled publication"}</h3>
                    <p className="mt-1 text-sm text-ink/60">{item.authors?.join(", ")} · {item.year}</p>
                    {item.pdfUrl && <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-indigo underline">Open PDF</a>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => void startEdit(item.id)} disabled={busyId === item.id} className="rounded-xl border border-line px-3 py-2 text-sm">Edit</button>
                    {item.isPublished && <button onClick={() => void unpublish(item)} disabled={busyId === item.id} className="inline-flex items-center gap-1 rounded-xl border border-line px-3 py-2 text-sm"><EyeOff size={14} /> Unpublish</button>}
                    <button onClick={() => void remove(item)} disabled={busyId === item.id} className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-700"><Trash2 size={14} /> Delete</button>
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
        
