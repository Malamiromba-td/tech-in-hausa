import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { OFFICES } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.gameDaMu" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/game-da-mu" },
    openGraph: {
      title: `${t("title")} — TechInHausa`,
      description: t("description"),
      url: "/game-da-mu",
    },
  };
}

type TimelineItem = { year: string; title: string; subtitle: string; body: string };
type Pillar = { name: string; body: string };
type Value = { name: string; body: string };

export default async function GameDaMuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.gameDaMu");
  const m = await getTranslations("mission");
  const f = await getTranslations("founder");
  const tf = useTranslations("footer");

  const timeline = t.raw("timeline") as TimelineItem[];
  const pillars = t.raw("pillars") as Pillar[];
  const values = t.raw("values") as Value[];

  const stats = [
    { num: "10", label: t("statVideos") },
    { num: "276", label: t("statPosts") },
    { num: "3", label: t("statPapers") },
    { num: "8", label: t("statSubscribers") },
  ];

  return (
    <>
      <Nav />

      {/* Our Story */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          {/* <div className="mb-3.5 text-[14.5px] font-medium text-indigo">
            {t("ourStoryLabel")}
          </div>*/}
          <h1 className="mb-5 font-display text-[32px] leading-tight text-indigo-deep md:text-[42px]">
            {t("heading")}
          </h1>
          <p className="mb-10 text-[16px] leading-relaxed text-ink/75">
            {tf("description")}
          </p>

          <div className="grid grid-cols-2 gap-6 border-y border-line py-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-[28px] text-indigo-deep">
                  {s.num}
                </div>
                <div className="mt-0.5 text-[13px] text-ink/55">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Background */}
      <section className="bg-indigo-tint py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          {/* <div className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-indigo">
            {t("backgroundLabel")}
          </div>*/}
          <h2 className="mb-2 font-display text-[28px] text-indigo-deep">
            {t("backgroundHeading")}
          </h2>
          <p className="mb-6 text-[15px] text-ink/60">{t("backgroundSubhead")}</p>
          <div className="flex flex-col gap-4 text-[15.5px] leading-relaxed text-ink/75">
            <p>{t("backgroundP1")}</p>
            <p>{t("backgroundP2")}</p>
            <p>{t("backgroundP3")}</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          {/*<div className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-indigo">
            {t("purposeLabel")}
          </div>*/}
          <h2 className="mb-8 font-display text-[28px] text-indigo-deep">
            {t("purposeHeading")}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-[13px] font-medium text-indigo">
                {m("missionLabel")}
              </div>
              <h3 className="mb-2.5 font-display text-[20px] text-indigo-deep">
                {m("missionHeading")}
              </h3>
              <p className="text-[15px] text-ink/65">{m("missionBody")}</p>
            </div>
            <div>
              <div className="mb-2 text-[13px] font-medium text-indigo">
                {m("visionLabel")}
              </div>
              <h3 className="mb-2.5 font-display text-[20px] text-indigo-deep">
                {m("visionHeading")}
              </h3>
              <p className="text-[15px] text-ink/65">{m("visionBody")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-indigo-tint py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          {/*<div className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-indigo">
            {t("timelineLabel")}
          </div>*/}
          <h2 className="mb-2 font-display text-[28px] text-indigo-deep">
            {t("timelineHeading")}
          </h2>
          <p className="mb-9 text-[15px] text-ink/60">{t("timelineSubhead")}</p>

          <div className="flex flex-col divide-y divide-line">
            {timeline.map((item) => (
              <div key={item.year} className="grid gap-2 py-7 sm:grid-cols-[100px_1fr]">
                <div className="font-display text-[22px] text-gold">
                  {item.year}
                </div>
                <div>
                  <h3 className="mb-0.5 font-display text-[19px] text-indigo-deep">
                    {item.title}
                  </h3>
                  <div className="mb-2.5 text-[13px] text-ink/50">
                    {item.subtitle}
                  </div>
                  <p className="text-[14.5px] leading-relaxed text-ink/70">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          {/*<div className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-indigo">
            {t("structureLabel")}
          </div>*/}
          <h2 className="mb-2 font-display text-[28px] text-indigo-deep">
            {t("structureHeading")}
          </h2>
          <p className="mb-9 text-[15px] text-ink/60">{t("structureSubhead")}</p>

          <div className="grid gap-6 sm:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.name} className="rounded-md border border-line p-5">
                <h3 className="mb-2 font-display text-[18px] text-indigo-deep">
                  {p.name}
                </h3>
                <p className="text-[14.5px] text-ink/65">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-indigo-tint py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <div className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-indigo">
            {f("eyebrow")}
          </div>
          <h2 className="mb-5 font-display text-[26px] text-indigo-deep">
            {f("heading")}
          </h2>
          <div className="flex flex-col gap-4 text-[15.5px] leading-relaxed text-ink/75">
            <p>{f("p1")}</p>
            <p>{f("p2")}</p>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          {/*<div className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-indigo">
            {t("locationsLabel")}
          </div>*/}
          <h2 className="mb-2 font-display text-[28px] text-indigo-deep">
            {t("locationsHeading")}
          </h2>
          <p className="mb-9 text-[15px] text-ink/60">{t("locationsSubhead")}</p>

          <div className="grid gap-6 sm:grid-cols-2">
            {OFFICES.map((office) => (
              <div key={office.name}>
                <h3 className="mb-1.5 font-display text-[18px] text-indigo-deep">
                  {office.name}
                </h3>
                <p className="text-[14.5px] text-ink/65">{office.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-indigo-tint py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          {/*<div className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-indigo">
            {t("principlesLabel")}
          </div>*/}
          <h2 className="mb-2 font-display text-[28px] text-indigo-deep">
            {t("principlesHeading")}
          </h2>
          <p className="mb-9 text-[15px] text-ink/60">{t("principlesSubhead")}</p>

          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.name}>
                <h3 className="mb-1.5 font-display text-[18px] text-indigo-deep">
                  {v.name}
                </h3>
                <p className="text-[14.5px] text-ink/65">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-deep py-16 text-center text-paper md:py-20">
        <div className="mx-auto max-w-xl px-5 md:px-8">
          <h2 className="mb-3 font-display text-[28px]">{t("ctaHeading")}</h2>
          <p className="mb-8 text-[15px] text-paper/70">{t("ctaBody")}</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/bidiyo"
              className="rounded-[3px] bg-gold px-6 py-3.5 font-semibold text-indigo-deep"
            >
              {t("ctaWatch")}
            </Link>
            <Link
              href="/tuntube"
              className="rounded-[3px] border border-paper/35 px-6 py-3.5 font-medium text-paper"
            >
              {t("ctaContact")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
