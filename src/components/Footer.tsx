import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { site } from "@/config/site";
import type { Dictionary, Locale } from "@/lib/i18n";

export function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const links = [
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/education`, label: dict.nav.education },
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/portfolio`, label: dict.nav.portfolio },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-slate-300">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="font-semibold text-white">
              <Logo locale={locale} />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              {dict.footer.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              {dict.footer.quickLinks}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-400 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              {dict.footer.contact}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-white">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone}`} className="hover:text-white">
                  {site.phone}
                </a>
              </li>
              <li>{site.address[locale]}</li>
              <li>{site.hours[locale]}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-xs text-slate-500">
          © {`${site.name}. ${dict.footer.rights}`}
        </div>
      </Container>
    </footer>
  );
}
