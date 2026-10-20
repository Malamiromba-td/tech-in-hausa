"use client";

import { usePathname } from "@/i18n/navigation";

export default function PageTransition({
children,
}: {
children: React.ReactNode;
}) {
const pathname = usePathname();

return ( <div key={pathname} className="page-transition">
{children} </div>
);
}
