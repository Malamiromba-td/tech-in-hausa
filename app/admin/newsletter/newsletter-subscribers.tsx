
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  LoaderCircle,
  RefreshCw,
  Users,
} from "lucide-react";

type Subscriber = {
  id: number;
  email: string;
  subscribed_at: string;
};

type SubscriberResponse = {
  success: boolean;
  active_count: number;
  returned_count: number;
  limit: number;
  subscribers: Subscriber[];
  message?: string;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function csvCell(value: string | number) {
  let safe = String(value);

  // Prevent spreadsheet formula injection.
  if (/^[\s\u0000-\u001f]*[=+\-@]/.test(safe)) {
    safe = `'${safe}`;
  }

  return `"${safe.replace(/"/g, '""')}"`;
}

export default function NewsletterSubscribers() {
  const [data, setData] = useState<SubscriberResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSubscribers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/newsletter-subscribers", {
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Could not load newsletter subscribers."
        );
      }

      if (!Array.isArray(result.subscribers)) {
        throw new Error("The server returned an invalid subscriber list.");
      }

      setData(result as SubscriberResponse);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading subscribers."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubscribers();
  }, [loadSubscribers]);

  {/*function downloadCsv() {
    if (!data?.subscribers.length) return;

    const rows = [
      ["Email", "Subscribed At"],
      ...data.subscribers.map((subscriber) => [
        subscriber.email,
        subscriber.subscribed_at,
      ]),
    ];

    const csv =
      "\uFEFF" +
      rows.map((row) => row.map(csvCell).join(",")).join("\r\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "techinhausa-newsletter-subscribers.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }*/}


  async function downloadCsv() {
    try {
      setError("");

      const response = await fetch("/api/admin/newsletter-export", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(
          result?.message || "Could not download newsletter subscribers."
        );
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = "techinhausa-newsletter-subscribers.csv";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      // Revoke after the browser has had time to start the download.
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not download newsletter subscribers."
      );
    }
  }




  return (
    <main className="min-h-screen bg-paper px-4 py-8 text-ink sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
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
              Newsletter subscribers
            </h1>
            <p className="mt-2 text-sm text-ink/70">
              View active subscribers and download their details.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void loadSubscribers()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-medium hover:border-indigo/40 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={downloadCsv}
              disabled={!data?.subscribers.length || loading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-deep px-3 py-2.5 text-sm font-medium text-white hover:bg-indigo disabled:opacity-50"
            >
              <Download size={16} />
              Download CSV
            </button>
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8efd8] text-[#825d16]">
              <Users size={24} />
            </span>
            <div>
              <p className="text-sm text-ink/60">Active subscribers</p>
              <p className="mt-1 text-3xl font-semibold text-indigo-deep">
                {loading ? "—" : (data?.active_count ?? 0).toLocaleString()}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-ink/60">
            The list below contains up to {data?.limit ?? 500} of the latest
            active subscribers. The CSV button exports the rows currently
            returned by this list, not necessarily every subscriber.
          </p>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-5">
            <h2 className="font-semibold text-indigo-deep">Active subscriber list</h2>
            <span className="text-xs text-ink/60">
              {loading ? "Loading…" : `${data?.returned_count ?? 0} shown`}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-ink/60">
              <LoaderCircle size={18} className="animate-spin" />
              Loading subscribers…
            </div>
          ) : error ? (
            <p className="p-8 text-sm text-ink/60">
              Subscribers could not be loaded. Try refreshing.
            </p>
          ) : !data?.subscribers.length ? (
            <div className="p-10 text-center">
              <Users size={28} className="mx-auto text-ink/30" />
              <p className="mt-3 text-sm font-medium">No active subscribers yet</p>
              <p className="mt-1 text-xs text-ink/60">
                New newsletter signups will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {data.subscribers.map((subscriber) => (
                <li
                  key={subscriber.id}
                  className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                >
                  <span className="break-all text-sm font-medium">
                    {subscriber.email}
                  </span>
                  <span className="text-xs text-ink/60">
                    Subscribed {formatDate(subscriber.subscribed_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
        }
               
