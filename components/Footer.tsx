import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import {
  CONTACT_EMAIL,
  BUSINESS_EMAIL,
  OFFICES,
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

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/game-da-mu" },
  { label: "Videos", href: "/bidiyo" },
  { label: "Blog", href: "/blog" },
  { label: "Research", href: "/bincike" },
  { label: "Contact Us", href: "/tuntube" },
];

const socials = [
  { label: "Facebook", href: SOCIAL_LINKS.facebook, Icon: FacebookIcon },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, Icon: LinkedInIcon },
  { label: "Instagram", href: SOCIAL_LINKS.instagram, Icon: InstagramIcon },
  { label: "X (Twitter)", href: SOCIAL_LINKS.twitter, Icon: TwitterIcon },
  { label: "YouTube", href: SOCIAL_LINKS.youtube, Icon: YouTubeIcon },
  { label: "GitHub", href: SOCIAL_LINKS.github, Icon: GitHubIcon },
];

export default function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-indigo-deep text-[13.5px] text-paper/55">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1.2fr]">
          {/* About */}
          <div>
            <div className="mb-3 font-display text-[18px] font-semibold text-paper">
              TechInHausa
            </div>
            <p className="max-w-xs text-paper/60">
              TechInHausa brings technology and AI education to Hausa speakers
              worldwide. We teach programming, artificial intelligence, and
              modern tech in a clear, accessible way in Hausa.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-[12.5px] font-semibold uppercase tracking-wide text-gold-soft">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold-soft">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit Us */}
          <div>
            <h3 className="mb-4 text-[12.5px] font-semibold uppercase tracking-wide text-gold-soft">
              Visit Us
            </h3>
            <div className="flex flex-col gap-4">
              {OFFICES.map((office) => (
                <div key={office.name} className="flex gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
                  <div>
                    <div className="font-medium text-paper/80">
                      {office.name}
                    </div>
                    <div className="text-paper/55">{office.address}</div>
                  </div>
                </div>
              ))}
              <a
                href={`mailto:${BUSINESS_EMAIL}`}
                className="flex items-center gap-2 hover:text-gold-soft"
              >
                <Mail className="h-4 w-4" />
                {BUSINESS_EMAIL}
              </a>
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-paper/10 pt-6">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex items-center gap-2 hover:text-gold-soft"
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-paper/10 pt-6">
          <div>
            © {new Date().getFullYear()} Malamiromba Ltd. All rights reserved.
          </div>
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-gold-soft">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}
