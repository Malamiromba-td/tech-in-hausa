
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getLatestVideos, type Video } from "@/lib/youtube";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PLXBKyxTE6bIg";

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
    alternates: {
      canonical: "/bidiyo",
    },
    openGraph: {
      title: `${t("title")} — TechInHausa`,
      description: t("description"),
      url: "/bidiyo",
    },
  };
}

function formatDate(date: string, locale: string): string {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat(
    locale === "ha" ? "ha-NG" : "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(parsed);
}

export default async function BidiyoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: "pages.bidiyo",
  });

  const videos: Video[] = await getLatestVideos(15);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("heading"),
    numberOfItems: videos.length,
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
        embedUrl: `https://www.youtube.com/embed/${video.id}`,
      },
    })),
  };

  const jsonLdString = JSON.stringify(jsonLd).replace(
    /</g,
    "\\u003c"
  );

  const isHausa = locale === "ha";

  return (
    <>
      {videos.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdString,
          }}
        />
      )}

      <Nav />

      <main className="min-h-screen bg-paper">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-line">
          <div className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
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
                href={PLAYLIST_URL}
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

                {isHausa
                  ? "Duba duk bidiyo"
                  : "View playlist"}

                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 text-sm text-ink/55">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gold" />
                {isHausa ? "Sabbin darussa" : "Latest lessons"}
              </span>

              <span>
                {videos.length}{" "}
                {isHausa
                  ? "bidiyo da aka nuna"
                  : "videos available"}
              </span>
            </div>
          </div>
        </section>

        {/* Video library */}
        <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                {isHausa ? "Koyi a Hausa" : "Learn in Hausa"}
              </p>

              <h2 className="font-display text-2xl text-indigo-deep md:text-3xl">
                {isHausa ? "Sabbin bidiyoyi" : "Playlist videos"}
              </h2>
            </div>
          </div>

          {videos.length > 0 ? (
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video, index) => (
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

                    <span>
                      {formatDate(video.publishedAt, locale)}
                    </span>
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
                    {isHausa ? "Kalli bidiyo" : "Watch video"}

                    <span
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    >
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
                {isHausa
                  ? "Ba a iya loda bidiyoyi ba"
                  : "Videos are temporarily unavailable"}
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/60">
                {isHausa
                  ? "Ka ziyarci jerin bidiyoyinmu na YouTube domin kallon darussan."
                  : "Visit our YouTube playlist to watch the lessons while we reconnect to the video feed."}
              </p>

              <a
                href={PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded bg-indigo-deep px-5 py-3 text-sm font-semibold text-paper transition hover:bg-indigo"
              >
                {isHausa
                  ? "Ziyarci jerin bidiyoyi"
                  : "Open YouTube playlist"}

                <span aria-hidden="true">↗</span>
              </a>
            </div>
          )}

          <div className="mt-16 border-t border-line pt-8 text-center">
            <p className="text-sm leading-6 text-ink/60">
              {isHausa
                ? "Ana ƙara sabbin darussa a jerin bidiyoyinmu na YouTube."
                : "Explore the lessons in our YouTube playlist."}
            </p>

            <a
              href={PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-deep underline decoration-gold underline-offset-4 hover:text-indigo"
            >
              {isHausa ? "Jerin bidiyoyi na TechInHausa" : "TechInHausa playlist"}

              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
      }
                
