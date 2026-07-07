import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck, Wrench, HeartHandshake, type LucideIcon } from "lucide-react";
import { Container } from "@/components/Container";
import { Aurora } from "@/components/Aurora";
import { CountUp } from "@/components/CountUp";
import { CTA } from "@/components/CTA";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

const valueIcons: LucideIcon[] = [ShieldCheck, Wrench, HeartHandshake];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  return { title: getDictionary(locale).about.title };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.about;

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
        <Aurora className="opacity-70" />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
        <Container className="relative py-16 sm:py-24">
          <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {t.title}
          </span>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            {t.subtitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            {t.lead}
          </p>
        </Container>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 md:grid-cols-[1fr_2fr]">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {t.missionTitle}
            </h2>
            <p className="text-lg leading-relaxed text-slate-600">
              {t.missionDesc}
            </p>
          </div>
        </Container>
      </section>

      {/* Numbers */}
      <section className="border-t border-slate-200 py-14">
        <Container>
          <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {dict.home.stats.map((s) => (
              <div key={s.label} className="reveal text-center">
                <dt className="text-3xl font-bold tracking-tight text-blue-600 sm:text-4xl">
                  <CountUp value={s.value} />
                </dt>
                <dd className="mt-2 text-sm text-slate-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Values */}
      <section className="border-t border-slate-200 py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.valuesTitle}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {t.values.map((v, i) => {
              const Icon = valueIcons[i] ?? ShieldCheck;
              return (
                <div
                  key={v.title}
                  className="rounded-2xl border border-slate-200 bg-white p-7"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {v.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-slate-600">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* History */}
      <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.historyTitle}
          </h2>
          <ol className="mt-8 space-y-6 border-l-2 border-slate-200 pl-6">
            {t.history.map((h) => (
              <li key={h.year} className="relative">
                <span className="absolute -left-[31px] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-blue-600 bg-white" />
                <div className="text-sm font-bold text-blue-600">{h.year}</div>
                <p className="mt-1 text-slate-700">{h.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CTA locale={locale} dict={dict} />
    </>
  );
}
