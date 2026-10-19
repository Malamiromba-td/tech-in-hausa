import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Use these instead of next/link and next/navigation anywhere a link
// or route change needs to stay on the current locale automatically.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
