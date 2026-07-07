import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "./Container";
import type { Dictionary, Locale } from "@/lib/i18n";

export function CTA({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="group relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-center sm:px-16 sm:py-16">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {dict.home.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              {dict.home.ctaDesc}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              {dict.common.contactCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
