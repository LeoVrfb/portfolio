import type { MetadataRoute } from "next";
import { projets } from "@/lib/projets";
import { services } from "@/lib/services";
import { LOCALES, localizedUrl } from "@/lib/seo/site";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

type RouteConfig = {
  /** Chemin canonique sans préfixe locale, commence toujours par `/`. */
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
};

const STATIC_ROUTES: RouteConfig[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/projets", priority: 0.9, changeFrequency: "weekly" },
  { path: "/a-propos", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

const SERVICES_ROUTES: RouteConfig[] = services.map((service) => ({
  path: `/services/${service.slug}`,
  priority: 0.8,
  changeFrequency: "monthly",
}));

const PROJETS_ROUTES: RouteConfig[] = projets.map((projet) => ({
  path: `/projets/${projet.slug}`,
  priority: 0.7,
  changeFrequency: "monthly" as ChangeFrequency,
}));
// Note : `/projets/kalypso` est volontairement omis du sitemap. La page existe
// mais reste `noindex` tant qu'elle n'est pas finalisée (orpheline, pas dans
// `lib/projets.ts`, pas traduite EN). À rouvrir en Phase 4 du chantier SEO Pro.

function buildEntry(route: RouteConfig, lastModified: Date): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = localizedUrl(route.path, locale);
  }

  return {
    url: localizedUrl(route.path, "fr"),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: {
      languages,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const allRoutes = [...STATIC_ROUTES, ...SERVICES_ROUTES, ...PROJETS_ROUTES];
  return allRoutes.map((route) => buildEntry(route, lastModified));
}
