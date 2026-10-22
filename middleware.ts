import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match everything except Next internals, static files, the Studio
  // (which is its own locale-agnostic admin app), and API-like routes.
  matcher: [
    "/((?!api|_next|_vercel|studio|admin|.*\\..*).*)",
  ],
};
