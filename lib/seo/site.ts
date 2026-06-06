import type { Locale } from "@/i18n/routing";

export const SITE_URL = "https://leohengebaert.fr";

export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALES = ["fr", "en"] as const satisfies readonly Locale[];

/**
 * URL absolue d'une page pour une locale donnée.
 * - Locale par défaut (fr) : pas de préfixe (/, /projets, /services, ...)
 * - Autre locale : préfixe (/en, /en/projets, ...)
 *
 * `pathname` doit toujours commencer par `/` et représenter le chemin "canonique"
 * (sans préfixe de locale). Les slugs sont identiques en FR et EN par convention
 * (cf. AGENTS.md du portfolio).
 */
export function localizedUrl(pathname: string, locale: Locale): string {
  const cleanPath = pathname === "/" ? "" : pathname;
  if (locale === DEFAULT_LOCALE) {
    return `${SITE_URL}${cleanPath || "/"}`;
  }
  return `${SITE_URL}/${locale}${cleanPath}`;
}
