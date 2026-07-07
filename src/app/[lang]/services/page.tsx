import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { CTA } from "@/components/CTA";
import { ServiceIcon } from "@/components/Icons";
import { services } from "@/lib/content";
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
            {services.map((s) => (
              <div
                key={s.icon}
                className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6"
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

      {/* Process */}
      <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.processTitle}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {t.process.map((p) => (
              <div key={p.step} className="relative rounded-2xl bg-white p-6 shadow-sm">
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
