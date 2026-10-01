"use client";

import dynamic from "next/dynamic";
import config from "@/sanity.config";

// Sanity Studio is a heavy, fully client-side app (relies on browser
// APIs and hooks that don't work during server rendering). Loading it
// with ssr:false ensures it only ever runs in the browser.
const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  { ssr: false },
);

export default function StudioClient() {
  return <NextStudio config={config} />;
}
