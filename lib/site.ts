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
  "TechInHausa brings technology and AI education to Hausa speakers worldwide, programming, artificial intelligence, and modern tech taught clearly, in Hausa.";
export const TWITTER_HANDLE = "@techinHausa";

// Real contact + social links, pulled from the existing site's footer.
export const CONTACT_EMAIL = "info@techinhausa.com.ng";
export const CONTACT_PHONE = "+2348000000000"; // placeholder in the old site too — confirm real number
export const BUSINESS_EMAIL = "ibrahim@Malamiromba.com";

export const OFFICES = [
  {
    name: "Kano Office",
    address:
      "11B Hawan Dawaki Layout, Off Buk Newsite, Gwarzo Road, Kano, Nigeria",
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

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/share/14Y2xAW4kXc/",
  linkedin: "https://www.linkedin.com/in/ibrahimbaba",
  instagram: "https://www.instagram.com/Malamiromba",
  twitter: "https://x.com/Malamiromba",
  youtube: "https://youtube.com/@Malamiromba",
  github: "https://github.com/ibbaba",
};

// export const SOCIAL_LINKS = {
//   youtube: "https://www.youtube.com/@techinHausa",
//   facebook: "https://www.facebook.com/techinHausa",
//   instagram: "https://www.instagram.com/techinHausa",
//   twitter: "https://twitter.com/techinHausa",
//   telegram: "https://t.me/techinHausa",
//   github: "https://github.com/techinHausa",
// };
