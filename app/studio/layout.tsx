/**
 * Sanity Studio is locale-agnostic (an internal admin tool, not
 * public-facing content), so it lives outside app/(site)/[locale]/
 * and needs its own root layout — Next.js requires exactly one
 * <html>/<body> per route tree, and this route isn't part of the
 * localized site's tree.
 */
export default function StudioRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
