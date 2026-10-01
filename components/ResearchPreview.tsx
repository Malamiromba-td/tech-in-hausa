import Link from "next/link";
import { papers } from "@/lib/research";

export default function ResearchPreview() {
  const preview = papers.slice(0, 2);

  if (preview.length === 0) return null;

  return (
    <section className="py-14 md:py-21">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <div className="mb-9">
          <h2 className="mb-2 font-display text-[32px] text-indigo-deep">
            Bincike
          </h2>
          <p className="max-w-lg text-[15px] text-ink/60">
            Bincike da takardun ilimi da suka fito daga aikin TechInHausa.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-line">
          {preview.map((p) => (
            <div key={p.slug} className="py-6">
              <div className="mb-2 text-[13px] text-ink/50">
                {p.authors} · {p.year}
              </div>
              <h3 className="mb-1.5 font-display text-[19px] text-indigo-deep">
                {p.title}
              </h3>
              <p className="text-[14.5px] text-ink/60">{p.summary}</p>
            </div>
          ))}
        </div>

        <div className="mt-9 flex justify-center">
          <Link
            href="/bincike"
            className="rounded-[3px] border border-indigo/25 px-6 py-3 text-[14.5px] font-medium text-indigo hover:bg-indigo-tint"
          >
            Duba Duk Bincike
          </Link>
        </div>
      </div>
    </section>
  );
}
