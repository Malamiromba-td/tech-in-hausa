
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Archive,
  Check,
  LoaderCircle,
  Mail,
  MailOpen,
  RefreshCw,
} from "lucide-react";

type MessageStatus = "new" | "read" | "archived";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  created_at: string;
};

type Filter = "all" | MessageStatus;

const filters: { label: string; value: Filter }[] = [
  { label: "All messages", value: "all" },
  { label: "New", value: "new" },
  { label: "Read", value: "read" },
  { label: "Archived", value: "archived" },
];

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function ContactMessagesInbox() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/contact-messages", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Could not load contact messages."
        );
      }

      if (!Array.isArray(data.messages)) {
        throw new Error("The server returned an invalid message list.");
      }

      setMessages(data.messages as ContactMessage[]);

      setSelectedId((current) => {
        if (
          current !== null &&
          data.messages.some(
            (message: ContactMessage) => message.id === current
          )
        ) {
          return current;
        }

        return data.messages[0]?.id ?? null;
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading messages."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  const filteredMessages = useMemo(
    () =>
      messages.filter(
        (message) => filter === "all" || message.status === filter
      ),
    [messages, filter]
  );

  const selectedMessage =
    messages.find((message) => message.id === selectedId) ?? null;

  const newCount = messages.filter(
    (message) => message.status === "new"
  ).length;

  async function updateStatus(status: MessageStatus) {
    if (!selectedMessage || updating) return;

    setUpdating(true);
    setError("");

    try {
      const response = await fetch("/api/admin/contact-messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedMessage.id,
          status,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Could not update message status.");
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === selectedMessage.id
            ? { ...message, status }
            : message
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the message."
      );
    } finally {
      setUpdating(false);
    }
  }

  function statusStyle(status: MessageStatus) {
    switch (status) {
      case "new":
        return "bg-indigo/10 text-indigo-deep";
      case "read":
        return "bg-gold-soft text-ink";
      case "archived":
        return "bg-paper-tint text-ink/60";
    }
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-8 text-ink sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-ink/70 transition hover:text-indigo-deep"
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
              Contact messages
            </h1>
            <p className="mt-2 text-sm text-ink/70">
              Review and manage messages sent through your website.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadMessages()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium transition hover:border-indigo/40 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-sm text-ink/60">Total messages</p>
            <p className="mt-2 text-2xl font-semibold">{messages.length}</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-sm text-ink/60">New messages</p>
            <p className="mt-2 text-2xl font-semibold text-indigo-deep">
              {newCount}
            </p>
          </div>
          <div className="col-span-2 rounded-2xl border border-line bg-white p-4 sm:col-span-1">
            <p className="text-sm text-ink/60">Archived</p>
            <p className="mt-2 text-2xl font-semibold">
              {messages.filter((message) => message.status === "archived").length}
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

        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === item.value
                  ? "bg-indigo-deep text-white"
                  : "border border-line bg-white text-ink/70 hover:border-indigo/40"
              }`}
            >
              {item.label}
              {item.value === "new" && newCount > 0 ? ` (${newCount})` : ""}
            </button>
          ))}
        </div>

        <div className="mt-4 grid min-h-[420px] overflow-hidden rounded-2xl border border-line bg-white lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.5fr)]">
          <section className="border-b border-line lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h2 className="text-sm font-semibold">Inbox</h2>
              <span className="text-xs text-ink/60">
                {filteredMessages.length} shown
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 p-10 text-sm text-ink/60">
                <LoaderCircle size={18} className="animate-spin" />
                Loading messages…
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Mail size={28} className="mx-auto text-ink/30" />
                <p className="mt-3 text-sm font-medium">No messages here</p>
                <p className="mt-1 text-xs text-ink/60">
                  Messages matching this filter will appear here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {filteredMessages.map((message) => (
                  <li key={message.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(message.id)}
                      className={`w-full px-4 py-4 text-left transition hover:bg-paper-tint/60 ${
                        selectedId === message.id
                          ? "bg-indigo/5 ring-1 ring-inset ring-indigo/20"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate text-sm font-semibold">
                          {message.name}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium capitalize ${statusStyle(
                            message.status
                          )}`}
                        >
                          {message.status}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm text-ink/80">
                        {message.subject}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink/60">
                        {message.message}
                      </p>
                      <p className="mt-2 text-[11px] text-ink/50">
                        {formatDate(message.created_at)}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="min-w-0">
            {!selectedMessage ? (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center p-8 text-center">
                <MailOpen size={32} className="text-ink/30" />
                <h2 className="mt-3 font-display text-xl text-indigo-deep">
                  Select a message
                </h2>
                <p className="mt-2 max-w-sm text-sm text-ink/60">
                  Choose a message from the inbox to read its full contents.
                </p>
              </div>
            ) : (
              <article className="p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyle(
                        selectedMessage.status
                      )}`}
                    >
                      {selectedMessage.status}
                    </span>
                    <h2 className="mt-3 break-words font-display text-2xl text-indigo-deep">
                      {selectedMessage.subject}
                    </h2>
                  </div>
                  <span className="text-xs text-ink/50">
                    #{selectedMessage.id}
                  </span>
                </div>

                <div className="mt-5 rounded-xl bg-paper-tint/70 p-4">
                  <p className="break-words text-sm font-semibold">
                    {selectedMessage.name}
                  </p>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="mt-1 inline-block break-all text-sm text-indigo underline decoration-gold underline-offset-4"
                  >
                    {selectedMessage.email}
                  </a>
                  <p className="mt-2 text-xs text-ink/60">
                    Received {formatDate(selectedMessage.created_at)}
                  </p>
                </div>

                <div className="my-6 whitespace-pre-wrap break-words text-sm leading-7 text-ink">
                  {selectedMessage.message}
                </div>

                <div className="flex flex-wrap gap-2 border-t border-line pt-5">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                      `Re: ${selectedMessage.subject}`
                    )}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-deep px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    <Mail size={16} />
                    Reply by email
                  </a>

                  {selectedMessage.status !== "read" && (
                    <button
                      type="button"
                      onClick={() => void updateStatus("read")}
                      disabled={updating}
                      className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium transition hover:border-indigo/40 disabled:opacity-60"
                    >
                      <Check size={16} />
                      Mark as read
                    </button>
                  )}

                  {selectedMessage.status !== "archived" ? (
                    <button
                      type="button"
                      onClick={() => void updateStatus("archived")}
                      disabled={updating}
                      className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium transition hover:border-indigo/40 disabled:opacity-60"
                    >
                      <Archive size={16} />
                      Archive
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void updateStatus("new")}
                      disabled={updating}
                      className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium transition hover:border-indigo/40 disabled:opacity-60"
                    >
                      <Mail size={16} />
                      Restore to new
                    </button>
                  )}
                </div>

                {updating && (
                  <p className="mt-3 flex items-center gap-2 text-xs text-ink/60">
                    <LoaderCircle size={14} className="animate-spin" />
                    Saving status…
                  </p>
                )}
              </article>
            )}
          </section>
        </div>
      </div>
    </main>
  );
    }
    
