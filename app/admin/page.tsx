import { redirect } from "next/navigation";
import Link from "next/link";
import { hasAdminSession } from "@/lib/admin-auth";
import AdminLogoutButton from "./ui/admin-logout-button";
import { Inbox, Users, ShieldCheck, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin dashboard | TechInHausa", robots: { index: false, follow: false } };

export default async function AdminDashboardPage() {
  if (!(await hasAdminSession())) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-white/10 bg-indigo-deep text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <a href="/admin" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-gold-soft">
              <ShieldCheck size={24} />
            </span>
            <span>
              <span className="block font-display text-xl font-semibold">TechInHausa</span>
              <span className="block text-xs text-white/65">Administration</span>
            </span>
          </a>
          <AdminLogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo">Overview</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-indigo-deep sm:text-4xl">Admin dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
            Your secure workspace for contact messages and newsletter subscribers.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-tint text-indigo-deep">
              <Inbox size={22} />
            </span>
            <h2 className="mt-5 font-display text-xl font-semibold text-indigo-deep">Contact messages</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              View submissions, search messages, and manage their status.
            </p>
            <p className="mt-4 rounded-lg bg-paper-tint px-3 py-2 text-xs text-ink/65">
              Backend connection is the next implementation phase.
            </p>
            {/* contact message*/}
            
<Link
  href="/admin/messages"
  className="group block rounded-2xl border border-line bg-white p-6 transition hover:border-indigo/40"
>
  <div className="flex items-start justify-between gap-4">
    <div>
      <div className="flex items-center gap-2 text-indigo-deep">
        <Inbox size={20} />
        <h2 className="font-semibold">Contact Messages</h2>
      </div>
      <p className="mt-2 text-sm text-ink/70">
        Read enquiries from visitors and manage message statuses.
      </p>
    </div>
    <ArrowUpRight
      size={18}
      className="shrink-0 text-ink/50 transition group-hover:text-indigo-deep"
    />
  </div>
</Link>
            
          </section>

          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f8efd8] text-[#825d16]">
              <Users size={22} />
            </span>
            <h2 className="mt-5 font-display text-xl font-semibold text-indigo-deep">Newsletter subscribers</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              Review active subscribers and download a CSV export.
            </p>
            <p className="mt-4 rounded-lg bg-paper-tint px-3 py-2 text-xs text-ink/65">
              Subscriber data is not loaded or exposed on this page yet.
            </p>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-tint text-indigo-deep">
              <ShieldCheck size={21} />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-indigo-deep">Authentication enabled</h2>
              <p className="mt-1 text-sm leading-6 text-ink/70">
                This dashboard checks a signed, expiring HTTP-only session on the server. Contact and newsletter operations will be added only after protected PHP API endpoints are ready.
              </p>
              <a href="/api/admin/session" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo hover:underline">
                Check session endpoint <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
