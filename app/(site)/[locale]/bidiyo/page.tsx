
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getLatestVideos, type Video } from "@/lib/youtube";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const CHANNEL_URL = "https://youtube.com/@malam_iromba";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "pages.bidiyo",
  });

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/bidiyo" },
    openGraph: {
      title: `${t("title")} — TechInHausa`,
      description: t("description"),
      url: "/bidiyo",
    },
  };
}

function formatDate(date: string, locale: string): string {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat(
    locale === "ha" ? "ha-NG" : "en-US",
    { day: "numeric", month: "short", year: "numeric" }
  ).format(parsed);
}

export default async function BidiyoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations("pages.bidiyo");
  const videos: Video[] = await getLatestVideos(15);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("heading"),
    itemListElement: videos.map((video, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnail || undefined,
        uploadDate: video.publishedAt || undefined,
        contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
      },
    })),
  };

  const jsonLdString = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <>
      {videos.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
      )}

      <Nav />

      <main className="min-h-screen bg-paper">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-line">
          {/*<div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-gold-soft/30 blur-3xl" />*/}

          <div className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo">
                TechInHausa
              </span>
            </div>

            <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
              <div className="max-w-2xl">
                <h1 className="font-display text-4xl leading-tight text-indigo-deep md:text-6xl">
                  {t("heading")}
                </h1>

                <p className="mt-5 max-w-xl text-base leading-7 text-ink/65 md:text-lg">
                  {t("description")}
                </p>
              </div>

              <a
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-3 rounded border border-indigo/20 bg-paper px-5 py-3 text-sm font-semibold text-indigo-deep transition hover:border-indigo hover:bg-indigo-deep hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
                </svg>
                {locale === "ha" ? "Duba duk bidiyo" : "View all videos"}
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 text-sm text-ink/55">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gold" />
                {locale === "ha" ? "Sabbin darussa" : "Latest lessons"}
              </span>
              <span>
                {videos.length}{" "}
                {locale === "ha" ? "bidiyo da aka nuna" : "videos available"}
              </span>
            </div>
          </div>
        </section>

        {/* Video library */}
        <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                {locale === "ha" ? "Koyi a Hausa" : "Learn in Hausa"}
              </p>
              <h2 className="font-display text-2xl text-indigo-deep md:text-3xl">
                {locale === "ha" ? "Sabbin bidiyoyi" : "Latest videos"}
              </h2>
            </div>
          </div>

          {videos.length > 0 ? (
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video: Video, index: number) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch ${video.title} on YouTube`}
                  className="group min-w-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo"
                >
                  <div className="relative mb-4 aspect-video overflow-hidden rounded bg-indigo-deep">
                    {video.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={video.thumbnail}
                        alt=""
                        loading={index < 3 ? "eager" : "lazy"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo to-indigo-deep">
                        <span className="font-display text-4xl text-paper/40">
                          TH
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors group-hover:bg-ink/25">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-paper/70 bg-paper/95 text-indigo-deep shadow-lg transition duration-300 group-hover:scale-110">
                        <svg
                          viewBox="0 0 12 14"
                          className="ml-1 h-5 w-5"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M0 0L12 7L0 14Z" />
                        </svg>
                      </span>
                    </div>

                    {video.duration && (
                      <span className="absolute bottom-3 right-3 rounded-sm bg-ink/85 px-2 py-1 text-xs text-paper">
                        {video.duration}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-ink/50">
                    <span className="font-semibold text-gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-5 bg-line" />
                    <span>{formatDate(video.publishedAt, locale)}</span>
                  </div>

                  <h3 className="mt-3 text-base font-semibold leading-snug text-ink transition-colors group-hover:text-indigo md:text-lg">
                    {video.title}
                  </h3>

                  {video.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/60">
                      {video.description}
                    </p>
                  )}

                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-deep">
                    {locale === "ha" ? "Kalli bidiyo" : "Watch video"}
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                      →
                    </span>
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded border border-line bg-paper-tint px-6 py-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo/10 text-indigo-deep">
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m10 9 5 3-5 3z" />
                </svg>
              </div>

              <h2 className="font-display text-2xl text-indigo-deep">
                {locale === "ha"
                  ? "Ba a iya loda bidiyoyi ba"
                  : "Videos are temporarily unavailable"}
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/60">
                {locale === "ha"
                  ? "Ka ziyarci tasharmu ta YouTube domin duba sabbin darussa."
                  : "Visit our YouTube channel to watch the latest lessons while we reconnect to the video feed."}
              </p>

              <a
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded bg-indigo-deep px-5 py-3 text-sm font-semibold text-paper transition hover:bg-indigo"
              >
                {locale === "ha"
                  ? "Ziyarci tashar YouTube"
                  : "Visit YouTube channel"}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          )}

          <div className="mt-16 border-t border-line pt-8 text-center">
            <p className="text-sm leading-6 text-ink/60">
              {locale === "ha"
                ? "Ana ƙara sabbin darussa a tasharmu ta YouTube."
                : "New lessons are published on our YouTube channel."}
            </p>
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-deep underline decoration-gold underline-offset-4 hover:text-indigo"
            >
              @malam_iromba
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
                  }
                      

/*import { getTranslations, setRequestLocale } from "next-intl/server";
import { getLatestVideos, type Video } from "@/lib/youtube";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const gradients = [
  ["#2C3E6B", "#1A2340"],
  ["#D4A03C", "#B5822B"],
  ["#3E527F", "#2C3E6B"],
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.bidiyo" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/bidiyo" },
    openGraph: {
      title: `${t("title")} — TechInHausa`,
      description: t("description"),
      url: "/bidiyo",
    },
  };
}

export default async function BidiyoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.bidiyo");
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
            {t("heading")}
          </h1>
          <p className="mb-11 max-w-lg text-[15px] text-ink/60">
            {t("description")}
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
*/
