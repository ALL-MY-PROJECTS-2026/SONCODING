"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const BASE = "https://all-my-projects-2026.github.io/SONCODING";

// Emit <link rel="alternate" hreflang> tags for the ko/en counterparts of the
// current page so search engines connect the two language versions.
export function AlternateLinks() {
  const pathname = usePathname();

  useEffect(() => {
    const rest = pathname.replace(/^\/(ko|en)/, "");
    const koHref = `${BASE}/ko${rest}`;
    const enHref = `${BASE}/en${rest}`;
    const defs = [
      { lang: "ko", href: koHref },
      { lang: "en", href: enHref },
      { lang: "x-default", href: koHref },
    ];

    const created = defs.map(({ lang, href }) => {
      const el = document.createElement("link");
      el.rel = "alternate";
      el.hreflang = lang;
      el.href = href;
      document.head.appendChild(el);
      return el;
    });

    return () => created.forEach((el) => el.remove());
  }, [pathname]);

  return null;
}
