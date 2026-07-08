"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

// Wordmark is always the English "POCKET_CODING", regardless of the ko/en
// language toggle.
const BRAND: Record<Locale, string> = { ko: "POCKET_CODING", en: "POCKET_CODING" };

// Simple pocket mark — a shirt pocket outline (with a center flap notch)
// in white on the blue brand tile.
function PocketMark() {
  return (
    <svg
      viewBox="0 0 44 44"
      className="h-6 w-6"
      fill="none"
      stroke="#ffffff"
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 15 v15 a3 3 0 0 0 3 3 h14 a3 3 0 0 0 3 -3 v-15" />
      <path d="M12 15 h6 l4 5 l4 -5 h6" />
    </svg>
  );
}

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
    }, 200);
    return () => clearInterval(id);
  }, [animated, full]);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white"
        aria-hidden="true"
      >
        <PocketMark />
      </span>
      <span className="relative inline-flex items-center font-mono text-lg font-semibold tracking-tight text-current">
        {/* Sizer: reserves the full wordmark width so the typing animation
            can't reflow the header (keeps the right-side nav fixed). */}
        <span aria-hidden="true" className="invisible whitespace-pre">
          {full}
        </span>
        <span className="absolute inset-y-0 left-0 inline-flex items-center whitespace-pre">
          <span>{text}</span>
          <span
            aria-hidden="true"
            className="caret ml-[3px] inline-block h-[1.05em] w-[3px] bg-current"
          />
        </span>
      </span>
      <span className="sr-only">{BRAND[locale]}</span>
    </span>
  );
}
