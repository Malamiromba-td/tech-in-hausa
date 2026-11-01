"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";

const NAV_HEIGHT = "h-[76px]"; // keep the nav row and spacer in sync

export default function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    { href: "/videos", label: t("videos") },
    { href: "/blog", label: t("blog") },
    { href: "/research", label: t("research") },
    { href: "/about", label: t("about") },
  ];

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  // Close the menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ctaActive = isActive("/contact");

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper">
        <div
          className={`mx-auto flex ${NAV_HEIGHT} max-w-6xl items-center justify-between px-5 md:px-8`}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 font-display text-[18px] font-semibold text-indigo-deep md:text-[19px]"
          >
            <Image
              src="/logo.png"
              alt=""
              width={34}
              height={34}
              priority
              className="h-8 w-8 shrink-0 object-contain md:h-[34px] md:w-[34px]"
            />
            TechInHausa
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 text-[14.5px] md:flex">
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative py-2 transition-colors duration-300 ${
                    active ? "text-indigo" : "text-ink/75 hover:text-indigo"
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
              href="/contact"
              aria-current={ctaActive ? "page" : undefined}
              className={`rounded-[3px] px-5 py-2.5 font-medium text-paper transition-colors ${
                ctaActive ? "bg-indigo-deep" : "bg-indigo hover:bg-indigo-deep"
              }`}
            >
              {t("cta")}
            </Link>

            <LocaleSwitcher />
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-3 md:hidden">
            <LocaleSwitcher />
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
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

        {/* Mobile dropdown: animates open and closed */}
        <div
          id="mobile-menu"
          aria-hidden={!open}
          className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out md:hidden ${
            open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-1 border-t border-line px-5 pb-5 pt-2">
              {links.map((l) => {
                const active = isActive(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-[3px] px-3 py-3 text-[15px] transition-colors ${
                      active
                        ? "bg-paper-tint text-indigo"
                        : "text-ink/80 active:bg-paper-tint"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}

              <Link
                href="/contact"
                aria-current={ctaActive ? "page" : undefined}
                className={`mt-2 rounded-[3px] px-4 py-3 text-center font-medium text-paper transition-colors ${
                  ctaActive ? "bg-indigo-deep" : "bg-indigo hover:bg-indigo-deep"
                }`}
              >
                {t("cta")}
              </Link>
            </div>
          </div>
        </div>
      </nav>
