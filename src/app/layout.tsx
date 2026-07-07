import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Logo wordmark / mono — JetBrains Mono for a crisp terminal feel.
const brandMono = JetBrains_Mono({
  variable: "--font-mono-brand",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoKR = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline.ko}`,
    template: `%s | ${site.name}`,
  },
  description: site.tagline.ko,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${brandMono.variable} ${notoKR.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
