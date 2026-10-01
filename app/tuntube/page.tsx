import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Mail, MapPin, Clock } from "lucide-react";
import {
  BUSINESS_EMAIL,
  OFFICES,
  WORKING_HOURS,
  SOCIAL_LINKS,
} from "@/lib/site";
import {
  YouTubeIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedInIcon,
  GitHubIcon,
} from "@/components/Icons/SocialIcons";

export const metadata = {
  title: "Tuntuɓe Mu",
  description: "Tuntuɓi ƙungiyar TechInHausa.",
  alternates: { canonical: "/tuntube" },
  openGraph: {
    title: "Tuntuɓe Mu | TechInHausa",
    description: "Tuntuɓi ƙungiyar TechInHausa.",
    url: "/tuntube",
  },
};

const socials = [
  { label: "Facebook", href: SOCIAL_LINKS.facebook, Icon: FacebookIcon },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, Icon: LinkedInIcon },
  { label: "Instagram", href: SOCIAL_LINKS.instagram, Icon: InstagramIcon },
  { label: "X (Twitter)", href: SOCIAL_LINKS.twitter, Icon: TwitterIcon },
  { label: "YouTube", href: SOCIAL_LINKS.youtube, Icon: YouTubeIcon },
  { label: "GitHub", href: SOCIAL_LINKS.github, Icon: GitHubIcon },
];

export default function TuntubePage() {
  return (
    <>
      <Nav />
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <h1 className="mb-2 font-display text-[36px] text-indigo-deep">
            Tuntuɓe Mu
          </h1>
          <p className="mb-12 max-w-lg text-[15px] text-ink/60">
            Da fatan za a aiko mana da tambaya, shawara, ko damar hadin gwiwa.
          </p>

          <div className="grid gap-14 md:grid-cols-2">
            {/* Contact details */}
            <div>
              <h2 className="mb-6 text-[13px] font-semibold uppercase tracking-wide text-indigo">
                Bayanan Tuntuɓar Mu
              </h2>

              <div className="flex flex-col gap-6">
                {OFFICES.map((office) => (
                  <div key={office.name} className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo" />
                    <div>
                      <div className="font-medium text-ink">{office.name}</div>
                      <div className="text-[14.5px] text-ink/60">
                        {office.address}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-indigo" />
                  <a
                    href={`mailto:${BUSINESS_EMAIL}`}
                    className="text-[14.5px] text-ink/70 hover:text-indigo"
                  >
                    {BUSINESS_EMAIL}
                  </a>
                </div>

                <div className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-indigo" />
                  <div className="text-[14.5px] text-ink/70">
                    {WORKING_HOURS.map((w) => (
                      <div key={w.days}>
                        {w.days}: {w.hours}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <h3 className="mb-3 mt-8 text-[13px] font-semibold uppercase tracking-wide text-indigo">
                Haɗa da Malamiromba
              </h3>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex items-center gap-2 text-[14.5px] text-ink/60 hover:text-indigo"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="mb-1 font-display text-[22px] text-indigo-deep">
                Aiko Mana Sako
              </h2>
              <p className="mb-6 text-[14.5px] text-ink/60">
                Za mu yi murna mu ji daga gare ku
              </p>

              {/* Wired up to a real form handler (e.g. an API route +
                  email service) once decided how submissions should be
                  delivered. */}
              <form className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Sunanka *"
                  required
                  className="rounded-[3px] border border-line bg-paper px-4 py-3.5 text-[14.5px] text-ink placeholder:text-ink/40"
                />
                <input
                  type="email"
                  placeholder="Imel *"
                  required
                  className="rounded-[3px] border border-line bg-paper px-4 py-3.5 text-[14.5px] text-ink placeholder:text-ink/40"
                />
                <input
                  type="text"
                  placeholder="Batun Sako *"
                  required
                  className="rounded-[3px] border border-line bg-paper px-4 py-3.5 text-[14.5px] text-ink placeholder:text-ink/40"
                />
                <textarea
                  placeholder="Sakonka *"
                  required
                  rows={5}
                  className="rounded-[3px] border border-line bg-paper px-4 py-3.5 text-[14.5px] text-ink placeholder:text-ink/40"
                />
                <label className="flex items-start gap-2.5 text-[13.5px] text-ink/60">
                  <input type="checkbox" required className="mt-0.5" />
                  Na yarda a tuntube ni game da wannan sako.
                </label>
                <button
                  type="submit"
                  className="mt-1 rounded-[3px] bg-indigo px-6 py-3.5 font-semibold text-paper"
                >
                  Aika Sako
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
