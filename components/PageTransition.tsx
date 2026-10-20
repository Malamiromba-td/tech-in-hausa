
"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);

    const frame = requestAnimationFrame(() => {
      setVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div
      className={`page-transition ${
        visible ? "page-visible" : "page-hidden"
      }`}
    >
      {children}
    </div>
  );
}

/*"use client";

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
*/
