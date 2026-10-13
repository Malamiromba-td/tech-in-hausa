import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function About() {
  const t = useTranslations("about");

  return (
    <section className="bg-indigo-tint">
      <div className="mx-auto grid max-w-6xl items-center gap-15 px-5 md:px-8 py-14 md:py-22 md:grid-cols-[0.85fr_1.15fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-indigo-deep">
          <svg viewBox="0 0 300 375" className="absolute inset-0">
            <rect width="300" height="375" fill="var(--color-indigo-deep)" />
            <g opacity="0.9">
              <path
                d="M150 40 L230 120 L150 200 L70 120 Z"
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth="1.4"
              />
              <path
                d="M150 90 L190 130 L150 170 L110 130 Z"
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth="1.4"
              />
              <circle cx="150" cy="130" r="5" fill="var(--color-gold)" />
              <path
                d="M60 260 L150 350 L240 260"
                fill="none"
                stroke="var(--color-gold-soft)"
                strokeWidth="1"
                opacity="0.6"
              />
              <path
                d="M60 300 L150 375 L240 300"
                fill="none"
                stroke="var(--color-gold-soft)"
                strokeWidth="1"
                opacity="0.4"
              />
            </g>
          </svg>
        </div>
        <div>
          <div className="mb-3.5 text-[14.5px] font-medium text-indigo">
            {t("eyebrow")}
          </div>
          <h2 className="mb-4.5 max-w-lg font-display text-[30px] leading-tight text-indigo-deep">
            {t("heading")}
          </h2>
          <p className="mb-3.5 max-w-lg text-[15.5px] text-ink/70">
            {t("body")}
          </p>
          <Link
            href="/game-da-mu"
            className="mt-2.5 inline-block border-b-[1.5px] border-gold pb-0.5 text-[14.5px] font-semibold text-indigo"
          >
            {t("readMore")}
          </Link>
        </div>
      </div>
    </section>
  );
}
