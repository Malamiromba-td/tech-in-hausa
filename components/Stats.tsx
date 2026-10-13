import { useTranslations } from "next-intl";

export default function Stats() {
  const t = useTranslations("stats");

  const stats = [
    { num: "200+", label: t("hours") },
    { num: "3M+", label: t("impressions") },
    { num: "300K+", label: t("reach") },
    { num: "60K+", label: t("community") },
    { num: "5K+", label: t("subscribers") },
  ];

  return (
    <div className="border-t border-paper/10 bg-indigo">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-5 px-5 py-6.5 md:px-8">
        {stats.map((s) => (
          <div key={s.label} className="text-paper">
            <div className="font-display text-[25px] text-gold-soft">
              {s.num}
            </div>
            <div className="mt-0.5 text-[12.5px] text-paper/65">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
