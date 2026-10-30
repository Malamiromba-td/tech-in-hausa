import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // English is the real, canonical content. Hausa is a translation
  // layer on top of it — this is the reverse of how the site
  // started (content written in Hausa first).
  locales: ["en", "ha"],
  defaultLocale: "en",

  // "as-needed" means the default locale (en) has no URL prefix —
  // techinhausa.org/bidiyo is English, techinhausa.org/ha/bidiyo is
  // Hausa. Only non-default locales get prefixed.
  localePrefix: "as-needed",

  pathnames: {
    "/": "/",
    "/bidiyo": {
      en: "/videos",
      ha: "/videos",
    },
    "/blog": "/blog",
    "/bincike": {
      en: "/research",
      ha: "/research",
    },
    "/game-da-mu": {
      en: "/about",
      ha: "/about",
    },
    "/tuntube": {
      en: "/contact",
      ha: "/contact",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
