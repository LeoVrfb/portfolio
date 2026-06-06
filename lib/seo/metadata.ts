import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { getAlternates } from "@/lib/seo/alternates";
import { localizedUrl } from "@/lib/seo/site";

/**
 * Helper unifié pour construire l'objet `Metadata` d'une page.
 *
 * Pourquoi ce helper :
 * - Next.js ne fait **pas** de deep merge sur `alternates`, `openGraph`,
 *   `twitter` ou `robots` : si une page enfant définit l'un d'eux, l'objet du
 *   layout est entièrement écrasé. Donc chaque page doit explicitement
 *   reconstituer ces champs avec ses propres URL/titre/description, sinon
 *   Open Graph et Twitter Cards utiliseront le titre/description de la home
 *   sur toutes les pages partagées (ex. /services, /projets/bald-artiste).
 * - Centraliser ici garantit qu'on n'oublie pas un champ sur une page (alt
 *   languages, og:url, og:locale, twitter card type, etc.).
 *
 * Convention :
 * - `pathname` est la route sans préfixe locale (ex. `/services/standard`).
 * - `image` peut être un chemin relatif (`/og-services.png`) ou absolu.
 *   Si non fourni, Next.js fallback automatiquement sur `app/opengraph-image.tsx`
 *   et `app/twitter-image.tsx` racine (image globale du portfolio).
 */

const OG_LOCALE_MAP: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_US",
};

const OG_LOCALE_ALTERNATES: Record<Locale, Locale[]> = {
  fr: ["en"],
  en: ["fr"],
};

export type PageMetadataInput = {
  /** Titre brut de la page (sans suffixe `— Léo Hengebaert`, géré par le titleTemplate du layout). */
  title: string;
  /** Description courte 130-160 chars, optimisée SEO + accroche. */
  description: string;
  /** Pathname sans préfixe locale, ex. `/services` ou `/projets/bald-artiste`. */
  pathname: string;
  locale: Locale;
  /** Image OG/Twitter (relatif ou absolu). Défaut : héritage automatique de `app/opengraph-image.tsx`. */
  image?: string;
  /** Type Open Graph. Défaut `website`, mais `article` pour pages projet/blog. */
  ogType?: "website" | "article";
  /** Mots-clés ciblés pour cette page. Optionnel — pas tous les moteurs en font cas. */
  keywords?: string[];
  /** Si vrai, page non indexée (Kalypso, drafts). */
  noindex?: boolean;
};

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const {
    title,
    description,
    pathname,
    locale,
    image,
    ogType = "website",
    keywords,
    noindex = false,
  } = input;

  const url = localizedUrl(pathname, locale);

  const ogImages = image ? [{ url: image }] : undefined;

  const metadata: Metadata = {
    title,
    description,
    alternates: getAlternates(pathname, locale),
    openGraph: {
      title,
      description,
      url,
      siteName: "Léo Hengebaert",
      locale: OG_LOCALE_MAP[locale],
      alternateLocale: OG_LOCALE_ALTERNATES[locale].map((l) => OG_LOCALE_MAP[l]),
      type: ogType,
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };

  if (keywords && keywords.length > 0) {
    metadata.keywords = keywords;
  }

  if (noindex) {
    metadata.robots = {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    };
  }

  return metadata;
}
