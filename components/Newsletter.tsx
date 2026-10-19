import { useTranslations } from "next-intl";

export default function Newsletter() {
  const t = useTranslations("newsletter");

  return (
    <section className="bg-indigo-deep">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-10 px-5 md:px-8 py-14 md:py-19">
        <h2 className="max-w-sm font-display text-[27px] text-paper">
          {t("heading")}
        </h2>
        <div className="flex max-w-[420px] flex-1 flex-col gap-2">
          <div className="flex gap-2.5">
            <input
              type="email"
              placeholder={t("placeholder")}
              className="flex-1 rounded-[3px] border border-paper/25 bg-paper/[0.08] px-4 py-3.5 text-[14.5px] text-paper placeholder:text-paper/45"
            />
            <button className="rounded-[3px] bg-gold px-5.5 font-semibold text-indigo-deep">
              {t("subscribe")}
            </button>
          </div>
          <p className="text-[12px] text-paper/50">{t("consent")}</p>
        </div>
      </div>
    </section>
  );
}
