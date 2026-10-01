export default function Hero() {
  return (
    <header className="relative overflow-hidden bg-indigo-deep text-paper">
      <svg
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMaxYMax slice"
      >
        <defs>
          <pattern
            id="adire"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M25 2 L48 25 L25 48 L2 25 Z"
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth="1"
            />
            <circle cx="25" cy="25" r="3" fill="var(--color-gold)" />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#adire)" />
      </svg>

      <div className="relative mx-auto grid max-w-6xl items-end gap-10 px-5 pb-16 pt-16 md:gap-12 md:px-8 md:pb-24 md:pt-28 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="mb-5 text-[13.5px] font-medium text-gold-soft md:text-[14.5px]">
            Ƙungiyar Ilimin Fasaha · Founded by Ibrahim Zubairu
          </div>
          <h1 className="max-w-xl font-display text-[32px] font-medium leading-[1.12] text-paper sm:text-[38px] md:text-[60px] md:leading-[1.08]">
            Fasaha, cikin <em className="text-gold-soft not-italic italic">harshen</em> mutane.
          </h1>
          <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-paper/80 md:mt-6 md:text-[17px]">
            Technology and AI education, taught entirely in Hausa. Free
            lessons, real skills, built for learners who&apos;ve been left
            out of the digital economy until now.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-3.5 md:mt-10">
            <a
              href="/bidiyo"
              className="rounded-[3px] bg-gold px-6.5 py-3.5 text-center font-semibold text-indigo-deep"
            >
              Kalli Bidiyo
            </a>
            <a
              href="/game-da-mu"
              className="rounded-[3px] border border-paper/35 px-6.5 py-3.5 text-center font-medium text-paper"
            >
              Game da Malamiromba
            </a>
          </div>
        </div>
        <div className="hidden font-display text-[15px] italic leading-loose text-gold-soft/85 md:block md:justify-self-end md:text-right">
          Kirkirariyar Basira
          <br />
          Giza-Gizan Sadarwa
          <br />
          Fasahar Dijital
          <br />
          Zubin Kirkirah
        </div>
      </div>
    </header>
  );
}
