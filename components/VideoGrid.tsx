import Link from "next/link";
import { getLatestVideos, type Video } from "@/lib/youtube";

const gradients = [
  ["#2C3E6B", "#1A2340"],
  ["#D4A03C", "#B5822B"],
  ["#3E527F", "#2C3E6B"],
];

export default async function VideoGrid() {
  const videos = (await getLatestVideos(3)).slice(0, 3);

  return (
    <section className="py-14 md:py-21">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[32px] text-indigo-deep">
            Darussan da suka fi shahara
          </h2>
          <p className="max-w-[340px] text-[15px] text-ink/60">
            The most-watched lessons, taught in plain Hausa — from your
            first &quot;hello world&quot; to how large language models
            actually work.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
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
                  className="relative mb-3.5 aspect-[16/10] overflow-hidden rounded bg-cover bg-center"
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
                <h3 className="mb-1.5 text-[17px] font-medium leading-snug text-ink">
                  {v.title}
                </h3>
                <p className="line-clamp-2 text-[13.5px] text-ink/55">
                  {v.description}
                </p>
              </a>
            );
          })}
        </div>

        <div className="mt-11 flex justify-center">
          <Link
            href="/bidiyo"
            className="rounded-[3px] border border-indigo/25 px-6 py-3 text-[14.5px] font-medium text-indigo hover:bg-indigo-tint"
          >
            Duba Duk Bidiyo
          </Link>
        </div>
      </div>
    </section>
  );
}
