"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Every route change lands at the very top of the page. No mid-page drops. */
export function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}
