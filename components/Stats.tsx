const stats = [
  { num: "200+", label: "Hours of Content" },
  { num: "3M+", label: "Impressions" },
  { num: "300K+", label: "Audience Reach" },
  { num: "60K+", label: "Community Members" },
  { num: "5K+", label: "Newsletter Subscribers" },
];

export default function Stats() {
  return (
    <div className="border-t border-paper/10 bg-indigo">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-5 px-5 py-6.5 md:px-8">
        {stats.map((s) => (
          <div key={s.label} className="text-paper">
            <div className="font-display text-[25px] text-gold-soft">
              {s.num}
            </div>
            <div className="mt-0.5 text-[12.5px] text-paper/65">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
