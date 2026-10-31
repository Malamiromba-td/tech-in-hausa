
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { client } from "@/sanity/lib/client";
import { RESEARCH_PAPERS_QUERY } from "@/sanity/lib/queries";

type ResearchPaper = {
  _id: string;
  title: string;
  slug: string;
  year: number;
  summary: string;
  authors: string[];
  publishedAt?: string;
  doi?: string;
  sourceUrl?: string;
  pdfUrl?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "pages.bincike",
  });

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/research" },
    openGraph: {
      title: `${t("title")} — TechInHausa`,
      description: t("description"),
      url: "/research",
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

  let papers: ResearchPaper[] = [];

  try {
    papers = await client.fetch<ResearchPaper[]>(
      RESEARCH_PAPERS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
  } catch (error) {
    console.error("Unable to load research publications:", error);
  }

  return (
    <>
      <Nav />

      <main className="min-h-[60vh] py-16">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h1 className="mb-2 font-display text-[36px] text-indigo-deep">
            {t("heading")}
          </h1>

          <p className="mb-12 text-[15px] text-ink/60">
            {t("subhead")}
          </p>

          {papers.length === 0 ? (
            <div className="rounded-xl border border-line p-8">
              <h2 className="mb-2 font-display text-xl text-indigo-deep">
                {locale === "ha"
                  ? "Babu wallafe-wallafe a yanzu"
                  : "No publications available yet"}
              </h2>
              <p className="text-sm text-ink/60">
                {locale === "ha"
                  ? "Za a nuna wallafe-wallafen da aka wallafa a nan."
                  : "Published research and publications will appear here."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-line">
              {papers.map((paper) => (
                <article key={paper._id} className="py-7">
                  <p className="mb-2 text-[13px] text-ink/50">
                    {paper.authors?.join(", ")} · {paper.year}
                  </p>

                  <h2 className="mb-2 font-display text-[21px] text-indigo-deep">
                    {paper.title}
                  </h2>

                  <p className="mb-4 whitespace-pre-line text-[15px] leading-7 text-ink/65">
                    {paper.summary}
                  </p>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] font-medium">
                    {paper.pdfUrl && (
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo hover:underline"
                      >
                        {t("readFull")}
                      </a>
                    )}

                    {paper.sourceUrl && (
                      <a
                        href={paper.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo hover:underline"
                      >
                        {locale === "ha"
                          ? "Duba asalin wallafar"
                          : "View original publication"}
                      </a>
                    )}

                    {paper.doi && (
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo hover:underline"
                      >
                        DOI
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}


/*import { getTranslations, setRequestLocale } from "next-intl/server";
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
*/
