
import { useTranslations } from "next-intl";

const terms = [
  { ha: "Kirkirariyar Basira", en: "Artificial Intelligence" },
  { ha: "Giza-Gizan Sadarwa", en: "Internet" },
  { ha: "Kutitiran Bayana", en: "Data" },
  { ha: "Fasahar Dijital", en: "Digital Technology" },
  { ha: "Zubin Kirkirah", en: "Coding / Tech" },
  { ha: "Duniyar Dijital", en: "Digital World" },
];

const GLOSSARY_URL =
  "https://docs.google.com/spreadsheets/d/1snF9OwvT0J784OkEpmG2ohMo_Doj5qEXEsGJ8KxFXdM/edit?gid=0#gid=0";

export default function Glossary() {
  const translate = useTranslations("glossary");

  return (
    <section className="py-12 md:py-17.5">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <h2 className="mb-7.5 font-display text-[26px] text-indigo-deep">
          {translate("heading")}
        </h2>

        <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-3">
          {terms.map((term) => (
            <div key={term.ha} className="bg-paper px-6 py-5">
              <div className="font-display text-[17px] italic text-indigo">
                {term.ha}
              </div>
              <div className="mt-0.5 text-[13px] text-ink/55">
                {term.en}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href={GLOSSARY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-indigo px-6 py-3 text-sm font-medium text-indigo transition-colors hover:bg-indigo hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo"
          >
            See More
            {/*<span className="ml-2" aria-hidden="true">
              ↗
            </span>*/}
          </a>
        </div>
      </div>
    </section>
  );
}
