import type { Locale } from "@/i18n/routing";
import type { Projet } from "@/lib/projets";
import { SITE_URL } from "@/lib/seo/site";
import { breadcrumbSchema, creativeWorkSchema } from "@/lib/seo/json-ld";

/**
 * Helper qui factorise les schemas JSON-LD page-spécifiques d'une fiche projet.
 *
 * Renvoie `BreadcrumbList` (Accueil → Projets → Projet) + `CreativeWork`
 * (auteur = Person globale, image, dateCreated, lien live si dispo).
 *
 * Utilisé par les 6 pages projets dédiées + le fallback `[slug]/page.tsx`
 * pour éviter de dupliquer la logique 7 fois.
 */
export function buildProjetSchemas(args: {
  projet: Projet;
  locale: Locale;
  /** Titre déjà résolu (traduit) — passé au breadcrumb et au CreativeWork. */
  titre: string;
  /** Description déjà résolue (traduite). */
  description: string;
}) {
  const { projet, locale, titre, description } = args;
  return [
    breadcrumbSchema(
      [
        { name: locale === "fr" ? "Accueil" : "Home", pathname: "/" },
        { name: locale === "fr" ? "Projets" : "Projects", pathname: "/projets" },
        { name: titre, pathname: `/projets/${projet.slug}` },
      ],
      locale,
    ),
    creativeWorkSchema(
      {
        slug: projet.slug,
        name: titre,
        description,
        client: projet.client,
        dateCreated: projet.date,
        imageUrl: `${SITE_URL}${projet.img}`,
        externalUrl: projet.url,
      },
      locale,
    ),
  ];
}
