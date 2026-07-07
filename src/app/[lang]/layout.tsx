import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getDictionary, isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <>
      <a href="#main" className="skip-link">
        {lang === "en" ? "Skip to content" : "본문 바로가기"}
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <Header locale={lang} nav={dict.nav} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer locale={lang} dict={dict} />
    </>
  );
}
