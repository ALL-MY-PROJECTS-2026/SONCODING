"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export function PortfolioGrid({
  projects,
  locale,
  allLabel,
}: {
  projects: Project[];
  locale: Locale;
  allLabel: string;
}) {
  // Unique categories, keyed by the English label so ko/en stay in sync.
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of projects) {
      if (!seen.has(p.category.en)) seen.set(p.category.en, p.category[locale]);
    }
    return Array.from(seen, ([key, label]) => ({ key, label }));
  }, [projects, locale]);

  const [active, setActive] = useState<string>("all");
  const filtered = projects.filter(
    (p) => active === "all" || p.category.en === active,
  );

  const chip = (key: string, label: string) => (
    <button
      key={key}
      type="button"
      onClick={() => setActive(key)}
      aria-pressed={active === key}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        active === key
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {chip("all", allLabel)}
        {categories.map((c) => chip(c.key, c.label))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((p) => (
          <article
            key={p.title.en}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200"
          >
            <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-slate-900 to-blue-800">
              <div className="bg-grid absolute inset-0 opacity-30" />
              <span className="relative text-xs font-semibold uppercase tracking-widest text-blue-200">
                {p.category[locale]}
              </span>
            </div>
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-900">
                {p.title[locale]}
              </h2>
              <p className="mt-2 leading-relaxed text-slate-600">
                {p.desc[locale]}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
