
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/lib/client";
import { RESEARCH_PAPERS_QUERY } from "@/sanity/lib/queries";

type ResearchPaper = {
  _id: string;
  title: string;
  slug: string;
  year: number;
  summary: string;
  authors: string[];
};

export default async function ResearchPreview() {
  const t = await getTranslations("researchPreview");

  let preview: ResearchPaper[] = [];

  try {
    const papers = await client.fetch<ResearchPaper[]>(
      RESEARCH_PAPERS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    preview = papers.slice(0, 2);
  } catch (error) {
    console.error("Unable to load research preview:", error);
  }

  if (preview.length === 0) return null;

  return (
    <section className="py-14 md:py-21">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <div className="mb-9">
          <h2 className="mb-2 font-display text-[32px] text-indigo-deep">
            {t("heading")}
          </h2>

          <p className="max-w-lg text-[15px] text-ink/60">
            {t("subhead")}
          </p>
        </div>

        <div className="flex flex-col divide-y divide-line">
          {preview.map((paper) => (
            <article key={paper._id} className="py-6">
              <div className="mb-2 text-[13px] text-ink/50">
                {paper.authors?.join(", ")} · {paper.year}
              </div>

              <h3 className="mb-1.5 font-display text-[19px] text-indigo-deep">
                {paper.title}
              </h3>

              <p className="text-[14.5px] text-ink/60">
                {paper.summary}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-9 flex justify-center">
          <Link
            href="/bincike"
            className="rounded-[3px] border border-indigo/25 px-6 py-3 text-[14.5px] font-medium text-indigo hover:bg-indigo-tint"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
