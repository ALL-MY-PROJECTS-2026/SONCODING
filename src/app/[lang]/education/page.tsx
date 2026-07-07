import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { CTA } from "@/components/CTA";
import { courses } from "@/lib/content";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  return { title: getDictionary(locale).education.title };
}

export default async function EducationPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.education;

  return (
    <>
      <PageHeader eyebrow={t.title} title={t.subtitle} lead={t.lead} />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <Link
                key={course.slug}
                href={`/${locale}/education/${course.slug}`}
                className={`reveal reveal-${(i % 3) + 1} group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100`}
              >
                <div className="flex flex-wrap gap-1.5">
                  {course.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  {course.title[locale]}
                </h2>
                <p className="mt-2 flex-1 leading-relaxed text-slate-600">
                  {course.summary[locale]}
                </p>
                <dl className="mt-5 space-y-1 border-t border-slate-100 pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-400">{t.durationLabel}</dt>
                    <dd className="font-medium text-slate-700">
                      {course.duration[locale]}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">{t.levelLabel}</dt>
                    <dd className="font-medium text-slate-700">
                      {course.level[locale]}
                    </dd>
                  </div>
                </dl>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                  {dict.common.learnMore}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CTA locale={locale} dict={dict} />
    </>
  );
}
