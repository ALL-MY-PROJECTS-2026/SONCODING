import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { CTA } from "@/components/CTA";
import { projects } from "@/lib/content";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  return { title: getDictionary(locale).portfolio.title };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.portfolio;

  return (
    <>
      <PageHeader eyebrow={t.title} title={t.subtitle} lead={t.lead} />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <article
                key={i}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-lg hover:shadow-slate-200"
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
        </Container>
      </section>

      <CTA locale={locale} dict={dict} />
    </>
  );
}
