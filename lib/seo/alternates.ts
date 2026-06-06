import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { LOCALES, localizedUrl } from "@/lib/seo/site";

/**
 * Génère un objet `alternates` Metadata correct pour une page donnée.
 *
 * - `canonical` : URL absolue de la page **dans la locale courante** (évite que
 *   toutes les sous-pages héritent du canonical de la home — bug initial).
 * - `languages.<locale>` : URL absolue de la page équivalente dans chaque locale.
 * - `languages.x-default` : convention SEO pour Google → on pointe sur la
 *   version FR (locale par défaut du site).
 *
 * Convention : `pathname` est le chemin canonique sans préfixe locale,
 * commençant par `/` (ex. `/`, `/services`, `/projets/bnp-paribas-elearning`).
 * Les slugs sont identiques en FR et EN (cf. AGENTS.md).
 */
export function getAlternates(
  pathname: string,
  locale: Locale,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = localizedUrl(pathname, l);
  }
  languages["x-default"] = localizedUrl(pathname, "fr");

  return {
    canonical: localizedUrl(pathname, locale),
    languages,
  };
}
