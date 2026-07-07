import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, Phone, MapPin, Clock, type LucideIcon } from "lucide-react";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/config/site";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  return { title: getDictionary(locale).contact.title };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.contact;

  const info: {
    label: string;
    value: string;
    href?: string;
    icon: LucideIcon;
  }[] = [
    { label: t.emailLabel, value: site.email, href: `mailto:${site.email}`, icon: Mail },
    { label: t.phoneLabel, value: site.phone, href: `tel:${site.phone}`, icon: Phone },
    { label: t.addressLabel, value: site.address[locale], icon: MapPin },
    { label: t.hoursLabel, value: site.hours[locale], icon: Clock },
  ];

  return (
    <>
      <PageHeader eyebrow={t.title} title={t.subtitle} lead={t.lead} />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            {/* Info */}
            <aside>
              <h2 className="text-lg font-bold text-slate-900">{t.infoTitle}</h2>
              <dl className="mt-6 space-y-5">
                {info.map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label} className="flex gap-3.5">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          {row.label}
                        </dt>
                        <dd className="mt-0.5 break-words text-slate-800">
                          {row.href ? (
                            <a
                              href={row.href}
                              className="font-medium text-blue-600 hover:underline"
                            >
                              {row.value}
                            </a>
                          ) : (
                            row.value
                          )}
                        </dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </aside>

            {/* Form */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <ContactForm form={t.form} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
