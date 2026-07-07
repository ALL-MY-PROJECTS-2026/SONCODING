"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

// Localized wordmark: Korean shows 손코딩, English shows SONCODING.
const BRAND: Record<Locale, string> = { ko: "손코딩", en: "SONCODING" };

export function Logo({
  locale,
  animated = false,
  className = "",
}: {
  locale: Locale;
  animated?: boolean;
  className?: string;
}) {
  const full = BRAND[locale];
  const [text, setText] = useState(full);

  // Type the wordmark out like a terminal (header only). Full text renders
  // server-side / without JS, and reduced-motion skips the animation.
  useEffect(() => {
    if (!animated) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setText("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setText(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 105);
    return () => clearInterval(id);
  }, [animated, full]);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 44 44"
          className="h-5 w-5"
          fill="none"
          stroke="#ffffff"
          strokeWidth={3.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 15 L23 22 L15 29" />
          <path d="M26 28 L34 28" />
        </svg>
      </span>
      <span className="inline-flex items-center font-mono text-lg font-semibold tracking-tight text-current">
        <span>{text}</span>
        <span
          aria-hidden="true"
          className="caret ml-[3px] inline-block h-[1.05em] w-[3px] bg-current"
        />
      </span>
      <span className="sr-only">{BRAND[locale]}</span>
    </span>
  );
}
