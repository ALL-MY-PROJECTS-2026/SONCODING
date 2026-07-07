"use client";

import { useEffect, useRef, useState } from "react";

// Splits a stat string like "500+", "98%", "10+" into its numeric part and a
// trailing suffix so we can count the number up while keeping the suffix.
function parse(value: string): { target: number; suffix: string; prefix: string } {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  if (!match) return { target: 0, suffix: value, prefix: "" };
  return { prefix: match[1], target: Number(match[2]), suffix: match[3] };
}

export function CountUp({
  value,
  durationMs = 1400,
}: {
  value: string;
  durationMs?: number;
}) {
  const { target, suffix, prefix } = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  // Start at the final value so no-JS / SEO sees the real number.
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // keep the final value, no animation

    let raf = 0;
    let started = false;

    const run = (start: number) => (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(run(start));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            setDisplay(0);
            raf = requestAnimationFrame((now) => run(now)(now));
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, durationMs]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
