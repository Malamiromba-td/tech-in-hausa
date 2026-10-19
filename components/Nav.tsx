"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Nav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    { href: "/bidiyo", label: t("videos") },
    { href: "/blog", label: t("blog") },
    { href: "/bincike", label: t("research") },
    { href: "/game-da-mu", label: t("about") },
  ];

  return (
    <nav className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-[18px] font-semibold text-indigo-deep md:text-[19px]"
          onClick={() => setOpen(false)}
        >
          <svg viewBox="0 0 26 26" className="h-6 w-6 shrink-0 md:h-6.5 md:w-6.5" fill="none">
            <path
              d="M13 1L24 13L13 25L2 13L13 1Z"
              stroke="var(--color-gold)"
              strokeWidth="1.6"
            />
            <path d="M13 7L19 13L13 19L7 13L13 7Z" fill="var(--color-indigo)" />
          </svg>
          TechInHausa
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 text-[14.5px] md:flex">
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
      {open && (
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
      )}
    </nav>
  );
}
