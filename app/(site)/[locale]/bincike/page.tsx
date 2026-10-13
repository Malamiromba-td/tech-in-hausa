import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { papers } from "@/lib/research";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.bincike" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/bincike" },
    openGraph: {
      title: `${t("title")} — TechInHausa`,
      description: t("description"),
      url: "/bincike",
    },
  };
}

export default async function BincikePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.bincike");

  return (
    <>
      <Nav />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h1 className="mb-2 font-display text-[36px] text-indigo-deep">
            {t("heading")}
          </h1>
          <p className="mb-12 text-[15px] text-ink/60">{t("subhead")}</p>

          <div className="flex flex-col divide-y divide-line">
            {papers.map((p) => (
              <div key={p.slug} className="py-7">
                <div className="mb-2 text-[13px] text-ink/50">
                  {p.authors} · {p.year}
                </div>
                <h2 className="mb-2 font-display text-[21px] text-indigo-deep">
                  {p.title}
                </h2>
                <p className="mb-3 text-[15px] text-ink/65">{p.summary}</p>
                <a
                  href={p.pdfUrl}
                  className="text-[13.5px] font-medium text-indigo hover:underline"
                >
                  {t("readFull")}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
