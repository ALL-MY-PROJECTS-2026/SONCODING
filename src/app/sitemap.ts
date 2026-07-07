import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { courses } from "@/lib/content";

const base = "https://all-my-projects-2026.github.io/SONCODING";
const routes = ["", "about", "education", "services", "portfolio", "contact"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const r of routes) {
      entries.push({
        url: `${base}/${locale}${r ? `/${r}` : ""}/`,
        changeFrequency: "monthly",
        priority: r === "" ? 1 : 0.7,
      });
    }
    for (const c of courses) {
      entries.push({
        url: `${base}/${locale}/education/${c.slug}/`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }
  return entries;
}
