/**
 * sanity/env.ts
 * ---------------------------------
 * Setup needed once, in .env.local (or Vercel env vars):
 *
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxx   (from sanity.io/manage)
 *   NEXT_PUBLIC_SANITY_DATASET=production
 *
 * Get a free project ID by running `npx sanity init` in this folder,
 * or creating one at https://www.sanity.io/manage — takes under a
 * minute, no credit card needed.
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    // Sanity isn't configured yet — lib/blog.ts falls back to sample
    // posts in this case, so warn instead of failing the build.
    console.warn(errorMessage);
    return "" as T;
  }
  return v;
}
