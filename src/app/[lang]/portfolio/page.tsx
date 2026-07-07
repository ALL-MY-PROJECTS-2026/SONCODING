import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { PortfolioGrid } from "@/components/PortfolioGrid";
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
          <PortfolioGrid projects={projects} locale={locale} allLabel={t.allLabel} />
        </Container>
      </section>

      <CTA locale={locale} dict={dict} />
    </>
  );
}
