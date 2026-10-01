/**
 * This route embeds Sanity Studio directly inside the Next.js app at
 * /studio — this IS the content admin dashboard. Nothing custom to
 * build: the editing UI (forms, image uploads, drafts, publish
 * button, revision history) is generated from the schema in
 * sanity/schemaTypes/.
 *
 * The actual Studio is loaded client-side only (see StudioClient) —
 * it can't run during server rendering.
 */
import StudioClient from "@/components/StudioClient";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <StudioClient />;
}
