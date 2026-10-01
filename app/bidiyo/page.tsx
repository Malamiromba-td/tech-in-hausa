import { getLatestVideos, type Video } from "@/lib/youtube";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const gradients = [
  ["#2C3E6B", "#1A2340"],
  ["#D4A03C", "#B5822B"],
  ["#3E527F", "#2C3E6B"],
];

export const metadata = {
  title: "Bidiyo",
  description: "Duk darussan bidiyo na TechInHausa, kai tsaye daga YouTube.",
  alternates: { canonical: "/bidiyo" },
  openGraph: {
    title: "Bidiyo — TechInHausa",
    description: "Duk darussan bidiyo na TechInHausa, kai tsaye daga YouTube.",
    url: "/bidiyo",
  },
};

export default async function BidiyoPage() {
  const videos = await getLatestVideos(24);

  // VideoObject structured data for each real (non-fallback) video —
  // helps individual lessons show up in Google's video rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: videos
      .filter((v) => !v.id.startsWith("fallback"))
      .map((v, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "VideoObject",
          name: v.title,
          description: v.description,
          thumbnailUrl: v.thumbnail,
          uploadDate: v.publishedAt,
          contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
        },
      })),
  };

  return (
    <>
      {jsonLd.itemListElement.length > 0 && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Nav />
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h1 className="mb-2 font-display text-[36px] text-indigo-deep">
            Bidiyo
          </h1>
          <p className="mb-11 max-w-lg text-[15px] text-ink/60">
            Duk darussan da muka wallafa a YouTube, tare da sabbin
            bidiyo da ke bayyana nan take.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {videos.map((v: Video, i: number) => {
              const [from, to] = gradients[i % gradients.length];
              return (
                <a
                  key={v.id}
                  href={
                    v.id.startsWith("fallback")
                      ? "#"
                      : `https://www.youtube.com/watch?v=${v.id}`
                  }
                  target={v.id.startsWith("fallback") ? undefined : "_blank"}
                  rel={v.id.startsWith("fallback") ? undefined : "noreferrer"}
                  className="group"
                >
                  <div
                    className="relative mb-3.5 aspect-[16/10] overflow-hidden rounded"
                    style={{
                      background: v.thumbnail
                        ? `url(${v.thumbnail}) center/cover`
                        : `linear-gradient(135deg, ${from}, ${to})`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors group-hover:bg-ink/10">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/95">
                        <svg
                          viewBox="0 0 12 14"
                          className="ml-0.5 h-3.5 w-3.5"
                          fill="var(--color-indigo-deep)"
                        >
                          <path d="M0 0L12 7L0 14Z" />
                        </svg>
                      </span>
                    </div>
                    {v.duration && (
                      <div className="absolute bottom-2.5 right-2.5 rounded-[2px] bg-ink/75 px-1.5 py-0.5 text-[11.5px] text-paper">
                        {v.duration}
                      </div>
                    )}
                  </div>
                  <h3 className="mb-1.5 text-[16px] font-medium leading-snug text-ink">
                    {v.title}
                  </h3>
                  <p className="line-clamp-2 text-[13.5px] text-ink/55">
                    {v.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
