import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { papers } from "@/lib/research";

export const metadata = {
  title: "Bincike",
  description: "Bincike da takardun ilimi game da fasaha da harshen Hausa.",
  alternates: { canonical: "/bincike" },
  openGraph: {
    title: "Bincike — TechInHausa",
    description: "Bincike da takardun ilimi game da fasaha da harshen Hausa.",
    url: "/bincike",
  },
};

export default function BincikePage() {
  return (
    <>
      <Nav />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h1 className="mb-2 font-display text-[36px] text-indigo-deep">
            Bincike
          </h1>
          <p className="mb-12 text-[15px] text-ink/60">
            Bincike da takardun ilimi da suka fito daga aikin TechInHausa, da
            kuma nazari kan koyar da fasaha a harshen gida.
          </p>

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
                  Karanta Cikakke (PDF)
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
