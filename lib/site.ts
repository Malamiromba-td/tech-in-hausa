/**
 * lib/site.ts
 * ---------------------------------
 * Single source of truth for site-wide SEO values. Update SITE_URL
 * once the final domain is confirmed — every page's metadata,
 * sitemap, robots.txt, and structured data reads from here.
 */
export const SITE_URL = "https://www.techinhausa.org";
export const SITE_NAME = "TechInHausa";
export const SITE_DESCRIPTION =
  "TechInHausa brings technology and AI education to Hausa speakers worldwide — programming, artificial intelligence, and modern tech taught clearly, in Hausa.";
export const TWITTER_HANDLE = "@techinHausa";

// Real contact + social links — the earlier partials/footer.php file
// turned out to be outdated; this reflects the actual live footer
// (rendered output) across the site, which is authoritative.
export const CONTACT_EMAIL = "techinhausa@malamiromba.com";
export const BUSINESS_EMAIL = "ibrahim@Malamiromba.com";

export const OFFICES = [
  {
    name: "Kano Office",
    address: "421 J & G Estate, opp. Salbas fuel station, Gaida Quarters, Kano, Nigeria",
  },
  {
    name: "Lagos Office",
    address: "78/80 Asubiaro Estate, Ikosi-Ketu, Lagos, Nigeria",
  },
];

export const WORKING_HOURS = [
  { days: "Mon – Fri", hours: "9:00 – 18:00" },
  { days: "Saturday", hours: "10:00 – 14:00" },
];

// Real handles from the live site — no Telegram (that was only in the
// older footer.php partial), LinkedIn added.
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/share/14Y2xAW4kXc/",
  linkedin: "https://www.linkedin.com/in/ibrahimbaba",
  instagram: "https://www.instagram.com/Malamiromba",
  twitter: "https://x.com/Malamiromba",
  youtube: "https://youtube.com/@Malamiromba",
  github: "https://github.com/ibbaba",
};
