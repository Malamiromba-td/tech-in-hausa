import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
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
} from "@/components/icons/SocialIcons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.tuntube" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/contact" },
    openGraph: {
      title: `${t("title")} — TechInHausa`,
      description: t("description"),
      url: "/contact",
    },
  };
}

const socials = [
  { label: "Facebook", href: SOCIAL_LINKS.facebook, Icon: FacebookIcon },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, Icon: LinkedInIcon },
  { label: "Instagram", href: SOCIAL_LINKS.instagram, Icon: InstagramIcon },
  { label: "X (Twitter)", href: SOCIAL_LINKS.twitter, Icon: TwitterIcon },
  { label: "YouTube", href: SOCIAL_LINKS.youtube, Icon: YouTubeIcon },
  { label: "GitHub", href: SOCIAL_LINKS.github, Icon: GitHubIcon },
];

export default async function TuntubePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.tuntube");

  return (
    <>
      <Nav />
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <h1 className="mb-2 font-display text-[36px] text-indigo-deep">
            {t("heading")}
          </h1>
          <p className="mb-12 max-w-lg text-[15px] text-ink/60">
            {t("subhead")}
          </p>

          <div className="grid gap-14 md:grid-cols-2">
            {/* Contact details */}
            <div>
              <h2 className="mb-6 text-[13px] font-semibold uppercase tracking-wide text-indigo">
                {t("detailsHeading")}
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
                    <div className="mb-1 text-[12px] font-medium uppercase tracking-wide text-ink/50">
                      {t("workingHours")}
                    </div>
                    {WORKING_HOURS.map((w) => (
                      <div key={w.days}>
                        {w.days}: {w.hours}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <h3 className="mb-3 mt-8 text-[13px] font-semibold uppercase tracking-wide text-indigo">
                {t("connect")}
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
            <ContactForm /> 
     
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
