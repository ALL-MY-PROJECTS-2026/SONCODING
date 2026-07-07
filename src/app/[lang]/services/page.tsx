import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { CTA } from "@/components/CTA";
import { ServiceIcon } from "@/components/Icons";
import { services, techStack } from "@/lib/content";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  return { title: getDictionary(locale).services.title };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.services;

  return (
    <>
      <PageHeader eyebrow={t.title} title={t.subtitle} lead={t.lead} />

      {/* Offerings */}
      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.offerTitle}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {services.map((s, i) => (
              <div
                key={s.icon}
                className={`reveal reveal-${(i % 3) + 1} flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md`}
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <ServiceIcon icon={s.icon} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {s.title[locale]}
                  </h3>
                  <p className="mt-2 leading-relaxed text-slate-600">
                    {s.desc[locale]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Tech stack */}
      <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20">
        <Container>
          <div className="reveal">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {t.stackTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">{t.stackLead}</p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((group, i) => (
              <div
                key={group.label.en}
                className={`reveal reveal-${(i % 3) + 1} rounded-2xl border border-slate-200 bg-white p-6`}
              >
                <h3 className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {group.label[locale]}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-sm text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.processTitle}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {t.process.map((p, i) => (
              <div
                key={p.step}
                className={`reveal reveal-${(i % 3) + 1} relative rounded-2xl bg-white p-6 shadow-sm`}
              >
                <div className="text-3xl font-bold text-blue-600/30">
                  {p.step}
                </div>
                <h3 className="mt-3 text-lg font-bold text-slate-900">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTA locale={locale} dict={dict} />
    </>
  );
}
