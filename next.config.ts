import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Sanity Studio is a large, self-contained client app. Excluding it
  // from Next's RSC bundling avoids conflicts between its internal
  // dependencies (e.g. swr) and Next's react-server module resolution.
  serverExternalPackages: ["sanity", "next-sanity", "@sanity/vision"],

  // Sanity's UI components (Box, Flex, etc.) are built with
  // styled-components, composing styled components on top of each
  // other. Without this compiler flag, styled-components can't
  // reliably filter its own layout props (flexGrow, flexBasis, etc.)
  // before they reach the DOM, which is what was causing the
  // "React does not recognize the X prop" warnings.
  compiler: {
    styledComponents: true,
  },
  async redirects() {
    return [
      { source: "/bidiyo", destination: "/videos", permanent: true },
      { source: "/ha/bidiyo", destination: "/ha/videos", permanent: true },

      { source: "/bincike", destination: "/research", permanent: true },
      { source: "/ha/bincike", destination: "/ha/research", permanent: true },

      { source: "/game-da-mu", destination: "/about", permanent: true },
      { source: "/ha/game-da-mu", destination: "/ha/about", permanent: true },

      { source: "/tuntube", destination: "/contact", permanent: true },
      { source: "/ha/tuntube", destination: "/ha/contact", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
