import type { Locale } from "@/i18n/routing";
import { SITE_URL, localizedUrl } from "@/lib/seo/site";
import type { ServiceDetail } from "@/lib/services";

/**
 * Helpers JSON-LD (Schema.org) pour le portfolio Léo.
 *
 * Convention : chaque schema racine a un `@id` stable basé sur l'URL canonique
 * de l'entité, ce qui permet aux schemas par page de référencer la `Person`
 * ou la `Organization` racine via `{ "@id": "https://leohengebaert.fr/#person" }`.
 *
 * Les schemas sont rendus dans le HTML via le composant `<JsonLd>` :
 * `<script type="application/ld+json">…</script>`.
 *
 * Validation : tester chaque page sur https://search.google.com/test/rich-results
 * avant de pousser en prod (cf. playbook seo-pro/01-schema-org-etendu.md).
 */

// IDs canoniques des entités globales — référencables depuis n'importe quelle page.
const PERSON_ID = `${SITE_URL}/#person` as const;
const WEBSITE_ID = `${SITE_URL}/#website` as const;
const SERVICE_BUSINESS_ID = `${SITE_URL}/#business` as const;

type SchemaObject = Record<string, unknown>;

// ─────────────────────────────────────────────────────────────────────────────
// Person — Léo (auteur, créateur, freelance)
// ─────────────────────────────────────────────────────────────────────────────

export function personSchema(locale: Locale): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Léo Hengebaert",
    givenName: "Léo",
    familyName: "Hengebaert",
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    email: "contact@leohengebaert.fr",
    jobTitle:
      locale === "fr"
        ? "Développeur front-end freelance"
        : "Freelance front-end developer",
    description:
      locale === "fr"
        ? "Développeur Next.js freelance basé à Paris, ex-Artefact. Crée des sites web sur mesure pour PME, artisans et artistes."
        : "Freelance Next.js developer based in Paris, ex-Artefact. Builds custom websites for SMBs, craftspeople and artists.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Paris",
      addressRegion: "Île-de-France",
      addressCountry: "FR",
    },
    nationality: { "@type": "Country", name: "France" },
    knowsLanguage: ["fr", "en"],
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Vercel",
      "SEO",
      "Web performance",
      "Web accessibility",
      "Stripe integration",
      "Sanity CMS",
    ],
    sameAs: [
      "https://linkedin.com/in/leo-hengebaert",
      "https://github.com/LeoVrfb",
      "https://instagram.com/leohengebaert",
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// WebSite — racine du site avec SearchAction
// ─────────────────────────────────────────────────────────────────────────────

export function websiteSchema(locale: Locale): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "Léo Hengebaert",
    description:
      locale === "fr"
        ? "Portfolio et offre de création de sites web Next.js sur mesure."
        : "Portfolio and custom Next.js website creation services.",
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
    publisher: { "@id": PERSON_ID },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ProfessionalService — l'activité freelance (services + tarifs)
// ─────────────────────────────────────────────────────────────────────────────

export function professionalServiceSchema(locale: Locale): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": SERVICE_BUSINESS_ID,
    name: "Léo Hengebaert — Développeur Next.js freelance",
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    description:
      locale === "fr"
        ? "Création de sites web sur mesure (Next.js, React) pour PME, artisans et artistes. 3 formules packagées : Essentiel 590€, Standard 990€, Premium 1890€."
        : "Custom Next.js websites for SMBs, craftspeople and artists. Three packaged plans: Essential €590, Standard €990, Premium €1890.",
    priceRange: "€590 - €1890",
    currenciesAccepted: "EUR",
    paymentAccepted:
      locale === "fr" ? "Virement bancaire, Stripe" : "Bank transfer, Stripe",
    areaServed: [
      { "@type": "Country", name: "France" },
      { "@type": "AdministrativeArea", name: "Île-de-France" },
      { "@type": "City", name: "Paris" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Paris",
      addressRegion: "Île-de-France",
      addressCountry: "FR",
    },
    founder: { "@id": PERSON_ID },
    provider: { "@id": PERSON_ID },
    serviceType:
      locale === "fr" ? "Création de site web sur mesure" : "Custom website development",
    sameAs: [
      "https://linkedin.com/in/leo-hengebaert",
      "https://github.com/LeoVrfb",
      "https://instagram.com/leohengebaert",
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BreadcrumbList — fil d'Ariane (page projet, page service)
// ─────────────────────────────────────────────────────────────────────────────

export type BreadcrumbItem = {
  name: string;
  /** Pathname canonique sans préfixe locale (ex. `/projets/bnp-paribas-elearning`). */
  pathname: string;
};

export function breadcrumbSchema(items: BreadcrumbItem[], locale: Locale): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: localizedUrl(item.pathname, locale),
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQPage — page services
// ─────────────────────────────────────────────────────────────────────────────

export type FaqItem = { question: string; answer: string };

export function faqPageSchema(items: FaqItem[]): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Nettoie le markup rich des messages next-intl pour produire du texte brut
 * compatible avec les schemas JSON-LD.
 *
 * Retire les balises `<accent>...</accent>`, `<projets>...</projets>`,
 * `<bold>`, `<lavender>`, etc. en gardant le contenu textuel.
 */
export function cleanRichText(text: string): string {
  return text
    .replace(/<\/?[a-zA-Z][^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Service — fiche d'une formule (Essentiel, Standard, Premium)
// ─────────────────────────────────────────────────────────────────────────────

export function serviceOfferSchema(
  service: ServiceDetail,
  locale: Locale,
): SchemaObject {
  const url = localizedUrl(`/services/${service.slug}`, locale);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: `${service.nom} — ${
      locale === "fr" ? "Création de site web Next.js" : "Next.js website development"
    }`,
    description: service.description,
    serviceType:
      locale === "fr" ? "Création de site web sur mesure" : "Custom website development",
    provider: { "@id": PERSON_ID },
    areaServed: { "@type": "Country", name: "France" },
    url,
    offers: {
      "@type": "Offer",
      price: service.prixBase,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url,
      validFrom: "2026-01-01",
      priceSpecification: {
        "@type": "PriceSpecification",
        price: service.prixBase,
        priceCurrency: "EUR",
        valueAddedTaxIncluded: false,
      },
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CreativeWork — fiche d'un projet (étude de cas)
// ─────────────────────────────────────────────────────────────────────────────

export type CreativeWorkInput = {
  slug: string;
  name: string;
  description: string;
  client: string;
  dateCreated: string;
  imageUrl?: string;
  externalUrl?: string;
};

export function creativeWorkSchema(
  projet: CreativeWorkInput,
  locale: Locale,
): SchemaObject {
  const url = localizedUrl(`/projets/${projet.slug}`, locale);
  const schema: SchemaObject = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#creativework`,
    name: projet.name,
    description: projet.description,
    url,
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
    creator: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    dateCreated: projet.dateCreated,
    about:
      locale === "fr"
        ? `Projet réalisé pour ${projet.client}.`
        : `Project delivered for ${projet.client}.`,
  };

  if (projet.imageUrl) {
    schema.image = projet.imageUrl;
  }
  if (projet.externalUrl) {
    schema.sameAs = [projet.externalUrl];
  }

  return schema;
}
