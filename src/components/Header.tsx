"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { locales, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n";

export function Header({
  locale,
  nav,
}: {
  locale: Locale;
  nav: Dictionary["nav"];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Shrink + shadow the header once the page is scrolled a little.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const items = [
    { href: `/${locale}`, label: nav.home },
    { href: `/${locale}/about`, label: nav.about },
    { href: `/${locale}/education`, label: nav.education },
    { href: `/${locale}/services`, label: nav.services },
    { href: `/${locale}/portfolio`, label: nav.portfolio },
    { href: `/${locale}/contact`, label: nav.contact },
  ];

  // Normalize the trailing slash added by `trailingSlash: true` before matching.
  const current = pathname.replace(/\/+$/, "") || "/";
  const isActive = (href: string) =>
    href === `/${locale}` ? current === href : current.startsWith(href);

  // Swap the leading locale segment to switch languages on the same page.
  const switchLocaleHref = (target: Locale) => {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/80 backdrop-blur transition-shadow duration-200 ${
        scrolled ? "border-slate-200 shadow-sm" : "border-slate-200/70"
      }`}
    >
      <Container>
        <div
          className={`flex items-center justify-between gap-4 transition-[height] duration-200 ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          <Link
            href={`/${locale}`}
            className="font-semibold tracking-tight text-slate-900"
            onClick={() => setOpen(false)}
          >
            <Logo locale={locale} animated />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Language switch */}
            <div className="hidden items-center rounded-full border border-slate-200 p-0.5 text-xs font-medium sm:flex">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={switchLocaleHref(l)}
                  className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
                    l === locale
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {l}
                </Link>
              ))}
            </div>

            <Link
              href={`/${locale}/contact`}
              className="hidden rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 md:inline-block"
            >
              {nav.contact}
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-md text-slate-700 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div className="menu-in border-t border-slate-200 bg-white md:hidden">
          <Container className="py-3">
            <nav className="flex flex-col">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              href={`/${locale}/contact`}
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-full bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {nav.contact}
            </Link>
            <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={switchLocaleHref(l)}
                  onClick={() => setOpen(false)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium uppercase ${
                    l === locale
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 text-slate-500"
                  }`}
                >
                  {l}
                </Link>
              ))}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
