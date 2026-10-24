import { redirect } from "next/navigation";
import Link from "next/link";
import { hasAdminSession } from "@/lib/admin-auth";
import AdminLogoutButton from "./ui/admin-logout-button";
import { Inbox, Users, ShieldCheck,Newspaper, BookOpen, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin dashboard | TechInHausa", robots: { index: false, follow: false } };
function ComingSoonBadge() { 
  return (  
    "Coming soon"
  ); 
}

export default async function AdminDashboardPage() {
  if (!(await hasAdminSession())) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-white/10 bg-indigo-deep text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <a href="/admin" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-gold-soft">
              {/* <ShieldCheck size={24} />*/}
              <img src="/TECHINHAUSA NEW LOGO PNG.png" alt="TECHINHAUSA NEW LOGO" aria-hidden="true" className="w-8 shrink-0 object-contain md:h-8.5 md:w-8.5" />
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
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo">
        Overview
      </p>

      <h1 className="mt-2 font-display text-3xl font-semibold text-indigo-deep sm:text-4xl">
        Admin dashboard
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
        Manage articles, publications and research, contact messages, and
        newsletter subscribers from one secure workspace.
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Blog management */}
      <Link
        href="/admin/blog"
        className="group rounded-2xl border border-line bg-white p-5 transition hover:border-indigo/40 hover:shadow-md sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-tint text-indigo-deep">
            <Newspaper size={22} />
          </span>

          <ArrowUpRight
            size={18}
            className="text-ink/50 transition group-hover:text-indigo-deep"
          />
        </div>

        <h2 className="mt-5 font-display text-xl font-semibold text-indigo-deep">
          Blog Management
        </h2>

        <p className="mt-2 text-sm leading-6 text-ink/70">
          Create articles, upload cover images, edit drafts, publish posts,
          and manage existing content.
        </p>

        <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-deep px-4 py-2.5 text-sm font-medium text-white transition group-hover:bg-indigo">
          Manage blog
          <ArrowUpRight size={16} />
        </span>
      </Link>

      {/* Publications and research */}
      <Link
        href="/admin/publications"
        className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f8efd8] text-[#825d16]">
            <BookOpen size={22} />
          </span>
        </div>

        <h2 className="mt-5 font-display text-xl font-semibold text-indigo-deep">
          Publications &amp; Research
        </h2>

        <p className="mt-2 text-sm leading-6 text-ink/70">
          Publish and manage research papers, reports, educational
          studies, abstracts, references, and downloadable documents
          through Sanity.
        </p>

        <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-deep px-4 py-2.5 text-sm font-medium text-white transition group-hover:bg-indigo">
          Manage publication and research
          <ArrowUpRight size={16} />
        </span>
     </Link>

      {/* Contact messages */}
      <Link
        href="/admin/messages"
        className="group rounded-2xl border border-line bg-white p-5 transition hover:border-indigo/40 hover:shadow-md sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-tint text-indigo-deep">
            <Inbox size={22} />
          </span>

          <ArrowUpRight
            size={18}
            className="text-ink/50 transition group-hover:text-indigo-deep"
          />
        </div>

        <h2 className="mt-5 font-display text-xl font-semibold text-indigo-deep">
          Contact Messages
        </h2>

        <p className="mt-2 text-sm leading-6 text-ink/70">
          Read enquiries from visitors, search submissions, and manage
          message statuses.
        </p>

        <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-deep px-4 py-2.5 text-sm font-medium text-white transition group-hover:bg-indigo">
          View messages
          <ArrowUpRight size={16} />
        </span>
      </Link>

      {/* Newsletter subscribers */}
      <Link
        href="/admin/newsletter"
        className="group rounded-2xl border border-line bg-white p-5 transition hover:border-indigo/40 hover:shadow-md sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f8efd8] text-[#825d16]">
            <Users size={22} />
          </span>

          <ArrowUpRight
            size={18}
            className="text-ink/50 transition group-hover:text-indigo-deep"
          />
        </div>

        <h2 className="mt-5 font-display text-xl font-semibold text-indigo-deep">
          Newsletter Subscribers
        </h2>

        <p className="mt-2 text-sm leading-6 text-ink/70">
          Review subscriber records and download a CSV export.
        </p>

        <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-deep px-4 py-2.5 text-sm font-medium text-white transition group-hover:bg-indigo">
          Manage subscribers
          <ArrowUpRight size={16} />
        </span>
      </Link>
    </div>

    {/* Authentication status */}
    <section className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-tint text-indigo-deep">
          <ShieldCheck size={21} />
        </span>

        <div>
          <h2 className="font-display text-xl font-semibold text-indigo-deep">
            Authentication enabled
          </h2>

          <p className="mt-1 text-sm leading-6 text-ink/70">
            This dashboard checks a signed, expiring HTTP-only session on
            the server. Administrative pages and protected operations
            require authentication.
          </p>

          <a
            href="/api/admin/session"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo hover:underline"
          >
            Check session endpoint
            <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </section>
  </div>
  

      { /* <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
            </p>*/}
            {/* contact message*/}
            
      {/*<Link
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
            </p>*/}
{/* newsletter management*/}
      {/* <Link
  href="/admin/newsletter"
  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-deep px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo"
>
  Manage subscribers
  <ArrowUpRight size={16} />
</Link>
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
*/}
