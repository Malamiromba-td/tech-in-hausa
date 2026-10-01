const terms = [
  { ha: "Kirkirariyar Basira", en: "Artificial Intelligence" },
  { ha: "Giza-Gizan Sadarwa", en: "Internet" },
  { ha: "Kutitiran Bayana", en: "Data" },
  { ha: "Fasahar Dijital", en: "Digital Technology" },
  { ha: "Zubin Kirkirah", en: "Coding / Tech" },
  { ha: "Duniyar Dijital", en: "Digital World" },
];

export default function Glossary() {
  return (
    <section className="py-12 md:py-17.5">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <h2 className="mb-7.5 font-display text-[26px] text-indigo-deep">
          Ƙamus na Fasaha
        </h2>
        <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-3">
          {terms.map((t) => (
            <div key={t.ha} className="bg-paper px-6 py-5">
              <div className="font-display text-[17px] italic text-indigo">
                {t.ha}
              </div>
              <div className="mt-0.5 text-[13px] text-ink/55">{t.en}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
