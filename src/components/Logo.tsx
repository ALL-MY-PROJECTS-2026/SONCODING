"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

// Localized wordmark: Korean shows 포켓코딩, English shows POCKET_CODING.
const BRAND: Record<Locale, string> = { ko: "포켓코딩", en: "POCKET_CODING" };

// Simple panda face — white face with black ears, eye-patches and nose,
// sitting on the blue brand tile.
function PandaMark() {
  return (
    <svg viewBox="0 0 44 44" className="h-6 w-6" aria-hidden="true">
      <circle cx="13" cy="14" r="6.5" fill="#111827" />
      <circle cx="31" cy="14" r="6.5" fill="#111827" />
      <circle cx="22" cy="24" r="14" fill="#ffffff" />
      <ellipse cx="16.5" cy="23" rx="3.6" ry="4.6" fill="#111827" />
      <ellipse cx="27.5" cy="23" rx="3.6" ry="4.6" fill="#111827" />
      <circle cx="16.7" cy="24" r="1.2" fill="#ffffff" />
      <circle cx="27.3" cy="24" r="1.2" fill="#ffffff" />
      <ellipse cx="22" cy="30" rx="2.6" ry="1.9" fill="#111827" />
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
        <PandaMark />
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
