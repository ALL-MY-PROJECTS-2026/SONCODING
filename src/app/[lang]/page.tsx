import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, UserCheck, Rocket, HeartHandshake, type LucideIcon } from "lucide-react";
import { Container } from "@/components/Container";
import { CountUp } from "@/components/CountUp";
import { CTA } from "@/components/CTA";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

const whyIcons: LucideIcon[] = [UserCheck, Rocket, HeartHandshake];

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.home;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
        <div className="animate-float-glow pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-300/40 blur-3xl" />
        <div className="animate-float-glow pointer-events-none absolute top-40 -left-10 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl [animation-delay:-4s]" />
        <Container className="relative py-24 sm:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {t.badge}
            </span>
            <h1 className="mt-6 whitespace-pre-line text-[2rem] font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {t.heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:mt-6 sm:text-lg">
              {t.heroDesc}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/${locale}/contact`}
                className="rounded-full bg-blue-600 px-7 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {t.heroPrimary}
              </Link>
              <Link
                href={`/${locale}/services`}
                className="rounded-full border border-slate-300 bg-white px-7 py-3 text-center text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400"
              >
                {t.heroSecondary}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 py-16">
        <Container>
          <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {t.stats.map((s, i) => (
              <div key={s.label} className={`reveal reveal-${(i % 3) + 1} text-center`}>
                <dt className="text-3xl font-bold tracking-tight text-blue-600 sm:text-4xl">
                  <CountUp value={s.value} />
                </dt>
                <dd className="mt-2 text-sm text-slate-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Pillars */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="reveal mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {t.pillarsTitle}
            </h2>
            <p className="mt-4 text-slate-600">{t.pillarsDesc}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Link
              href={`/${locale}/education`}
              className="reveal group rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100"
            >
              <div className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                01
              </div>
              <h3 className="mt-3 text-xl font-bold text-slate-900">
                {t.eduCardTitle}
              </h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                {t.eduCardDesc}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                {dict.common.learnMore}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              href={`/${locale}/services`}
              className="reveal group rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100"
            >
              <div className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                02
              </div>
              <h3 className="mt-3 text-xl font-bold text-slate-900">
                {t.devCardTitle}
              </h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                {t.devCardDesc}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                {dict.common.learnMore}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Why */}
      <section className="border-t border-slate-200 bg-slate-50 py-20 sm:py-24">
        <Container>
          <h2 className="reveal text-center text-3xl font-bold tracking-tight text-slate-900">
            {t.whyTitle}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {t.why.map((w, i) => {
              const Icon = whyIcons[i] ?? UserCheck;
              return (
                <div
                  key={i}
                  className={`reveal reveal-${(i % 3) + 1} rounded-2xl bg-white p-7 shadow-sm transition-shadow hover:shadow-md`}
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {w.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-slate-600">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <CTA locale={locale} dict={dict} />
    </>
  );
}
