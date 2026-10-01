import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sanity Studio is a large, self-contained client app. Excluding it
  // from Next's RSC bundling avoids conflicts between its internal
  // dependencies (e.g. swr) and Next's react-server module resolution.
  serverExternalPackages: ["sanity", "next-sanity", "@sanity/vision"],
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
