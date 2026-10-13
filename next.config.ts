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
};

export default withNextIntl(nextConfig);
