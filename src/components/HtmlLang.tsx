"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

// The root <html> is statically lang="ko"; sync it to the active locale so
// English pages are announced/indexed as English.
export function HtmlLang({ lang }: { lang: Locale }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
