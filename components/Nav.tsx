"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useState } from "react";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    { href: "/bidiyo", label: t("videos") },
    { href: "/blog", label: t("blog") },
    { href: "/bincike", label: t("research") },
    { href: "/game-da-mu", label: t("about") },
  ];

  const isActive = (href: string) => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

  return (
    <nav className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-[18px] font-semibold text-indigo-deep md:text-[19px]"
          onClick={() => setOpen(false)}
        >
          {/*<svg viewBox="0 0 26 26" className="h-6 w-6 shrink-0 md:h-6.5 md:w-6.5" fill="none">
            <path
              d="M13 1L24 13L13 25L2 13L13 1Z"
              stroke="var(--color-gold)"
              strokeWidth="1.6"
            />
            <path d="M13 7L19 13L13 19L7 13L13 7Z" fill="var(--color-indigo)" />
          </svg>*/}
          <img src="/TECHINHAUSA NEW LOGO 1.jpg" alt="TECHINHAUSA NEW LOGO" aria-hidden="true" className="h-6 w-6 shrink-0 object-contain md:h-6.5 md:w-6.5" />
          TechInHausa
        </Link>

        {/* Desktop links */}
        {/*  <div className="hidden items-center gap-8 text-[14.5px] md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="opacity-75 hover:opacity-100">
              {l.label}
            </Link>
          ))}
          <Link
            href="/tuntube"
            className="rounded-[3px] bg-indigo px-5 py-2.5 font-medium text-paper"
          >
            {t("cta")}
          </Link>
          <LocaleSwitcher />
        </div>*/}

        {/* <div className="hidden items-center gap-8 text-[14.5px] md:flex">
  {links.map((l) => {
    const active = isActive(l.href);

    return (
      <Link
        key={l.href}
        href={l.href}
        aria-current={active ? "page" : undefined}
        className={`transition-colors ${
          active
            ? "font-semibold text-indigo"
            : "text-ink/75 hover:text-indigo"
        }`}
      >
        {l.label}
      </Link>
    );
  })}*/}

            {/* new */}
            <div className="hidden items-center gap-8 text-[14.5px] md:flex">
  {links.map((l) => {
    const active = isActive(l.href);

    return (
      <Link
        key={l.href}
        href={l.href}
        aria-current={active ? "page" : undefined}
        className={`group relative py-2 transition-colors duration-300 ${
          active
            ? "font-semibold text-indigo"
            : "text-ink/75 hover:text-indigo"
        }`}
      >
        {l.label}

        <span
          className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[var(--color-gold)] transition-transform duration-300 ease-out ${
            active
              ? "scale-x-100"
              : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </Link>
    );
  })}
                
  <Link
    href="/tuntube"
    aria-current={isActive("/tuntube") ? "page" : undefined}
    className={`rounded-[3px] px-5 py-2.5 font-medium transition-colors ${
      isActive("/tuntube")
        ? "bg-indigo-deep text-paper"
        : "bg-indigo text-paper hover:bg-indigo-deep"
    }`}
  >
    {t("cta")}
  </Link>

  <LocaleSwitcher />
</div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-3 md:hidden">
          <LocaleSwitcher />
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
              {open ? (
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="var(--color-indigo-deep)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  <path d="M4 7H20" stroke="var(--color-indigo-deep)" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M4 12H20" stroke="var(--color-indigo-deep)" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M4 17H20" stroke="var(--color-indigo-deep)" strokeWidth="1.8" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {/*{open && (
        <div className="flex flex-col gap-1 border-t border-line px-5 pb-5 pt-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-[3px] px-2 py-3 text-[15px] text-ink/80 active:bg-paper-tint"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/tuntube"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-[3px] bg-indigo px-4 py-3 text-center font-medium text-paper"
          >
            {t("cta")}
          </Link>
        </div>
      )}*/}

      {open && (
  <div className="animate-menu-enter flex animate-in fade-in slide-in-from-top-2
    flex-col gap-1 border-t border-line px-5 pb-5 pt-2
    duration-200 md:hidden">
    {links.map((l) => {
      const active = isActive(l.href);

      return (
        <Link
          key={l.href}
          href={l.href}
          onClick={() => setOpen(false)}
          aria-current={active ? "page" : undefined}
          className={`rounded-[3px] border-l-2 px-3 py-3 text-[15px] transition-colors ${
            active
              ? "border-indigo bg-paper-tint font-semibold text-indigo"
              : "border-transparent text-ink/80 active:bg-paper-tint"
          }`}
        >
          {l.label}
        </Link>
      );
    })}

    <Link
      href="/tuntube"
      onClick={() => setOpen(false)}
      aria-current={isActive("/tuntube") ? "page" : undefined}
      className={`mt-2 rounded-[3px] px-4 py-3 text-center font-medium text-paper ${
        isActive("/tuntube")
          ? "bg-indigo-deep"
          : "bg-indigo hover:bg-indigo-deep"
      }`}
    >
      {t("cta")}
    </Link>
  </div>
)}
    </nav>
  );
}
