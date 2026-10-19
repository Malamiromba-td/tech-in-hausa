"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = {
  en: "EN",
  ha: "HA",
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center overflow-hidden rounded-[3px] border border-line text-[13px]">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => router.replace(pathname, { locale: loc })}
          aria-current={locale === loc}
          className={`px-2.5 py-1.5 font-medium transition-colors ${
            locale === loc
              ? "bg-indigo text-paper"
              : "text-ink/60 hover:bg-paper-tint"
          }`}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
