import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/Container";
import { courses, getCourse } from "@/lib/content";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    courses.map((course) => ({ lang, slug: course.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  const course = getCourse(slug);
  return { title: course ? course.title[locale] : getDictionary(locale).education.title };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const course = getCourse(slug);
  if (!course) notFound();

  const dict = getDictionary(locale);
  const t = dict.education;

  const meta = [
    { label: t.durationLabel, value: course.duration[locale] },
    { label: t.levelLabel, value: course.level[locale] },
    { label: t.formatLabel, value: course.format[locale] },
  ];

  const base = "https://all-my-projects-2026.github.io/SONCODING";
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.nav.home, item: `${base}/${locale}/` },
      { "@type": "ListItem", position: 2, name: dict.nav.education, item: `${base}/${locale}/education/` },
      { "@type": "ListItem", position: 3, name: course.title[locale] },
    ],
  };
  const courseLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title[locale],
    description: course.summary[locale],
    inLanguage: locale,
    provider: {
      "@type": "Organization",
      name: "SONCODING",
      url: `${base}/`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseLd) }}
      />
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <Container className="relative py-14 sm:py-20">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <li>
                <Link href={`/${locale}`} className="hover:text-slate-800">
                  {dict.nav.home}
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-300">/</li>
              <li>
                <Link href={`/${locale}/education`} className="hover:text-slate-800">
                  {dict.nav.education}
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-300">/</li>
              <li aria-current="page" className="font-medium text-slate-700">
                {course.title[locale]}
              </li>
            </ol>
          </nav>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {course.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {course.title[locale]}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            {course.summary[locale]}
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-12">
              {/* Curriculum */}
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t.curriculumTitle}
                </h2>
                <ol className="mt-5 space-y-3">
                  {course.curriculum[locale].map((item, i) => (
                    <li key={i} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="pt-0.5 text-slate-700">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Audience */}
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t.targetTitle}
                </h2>
                <ul className="mt-5 space-y-2">
                  {course.audience[locale].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <dl className="space-y-4">
                  {meta.map((m) => (
                    <div key={m.label}>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        {m.label}
                      </dt>
                      <dd className="mt-1 font-semibold text-slate-800">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <Link
                  href={`/${locale}/contact`}
                  className="mt-6 block rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  {dict.common.applyCourse}
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Related courses */}
      <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.relatedTitle}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {courses
              .filter((c) => c.slug !== course.slug)
              .slice(0, 3)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/${locale}/education/${c.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-3 font-bold text-slate-900">
                    {c.title[locale]}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                    {dict.common.learnMore}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
          </div>
        </Container>
      </section>
    </>
  );
}
