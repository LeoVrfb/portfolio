import { projets } from "@/lib/projets";
import { services } from "@/lib/services";
import { LOCALES, SITE_URL, localizedUrl } from "@/lib/seo/site";

/**
 * `llms.txt` — convention émergente (https://llmstxt.org) pour aider les LLMs
 * à comprendre la structure et le contenu d'un site. Sert au même usage qu'une
 * sitemap.xml mais en markdown lisible, optimisé pour ChatGPT/Claude/Perplexity.
 *
 * On expose ici la cartographie complète FR + EN du portfolio, avec une
 * description courte par section pour donner du contexte aux modèles.
 */

export const dynamic = "force-static";

function buildLine(label: string, path: string, description: string): string {
  const lines: string[] = [];
  for (const locale of LOCALES) {
    const localizedLabel = locale === "fr" ? label : `${label} (EN)`;
    lines.push(`- [${localizedLabel}](${localizedUrl(path, locale)}): ${description}`);
  }
  return lines.join("\n");
}

function buildContent(): string {
  const sections: string[] = [];

  sections.push(`# Léo Hengebaert — Développeur Next.js freelance Paris`);
  sections.push("");
  sections.push(
    "> Portfolio et offre de création de sites web sur mesure. " +
      "Léo Hengebaert est développeur front-end freelance basé à Paris, " +
      "spécialisé Next.js / React, ex-Artefact (ex-clients : BNP Paribas, " +
      "TotalEnergies, Aéroports de Paris). Propose 3 formules packagées " +
      "(Essentiel 590€, Standard 990€, Premium 1890€) pour artisans, PME, " +
      "artistes et professions libérales. Site bilingue FR/EN.",
  );
  sections.push("");

  sections.push("## Pages principales");
  sections.push("");
  sections.push(
    buildLine(
      "Accueil",
      "/",
      "Présentation, parcours, projets phares, formules services, contact",
    ),
  );
  sections.push(
    buildLine(
      "Projets",
      "/projets",
      "Études de cas : missions agence (BNP, TotalEnergies, ADP) et freelance",
    ),
  );
  sections.push(
    buildLine(
      "Services",
      "/services",
      "Trois formules de création de site web Next.js sur mesure (Essentiel 590€, Standard 990€, Premium 1890€)",
    ),
  );
  sections.push(
    buildLine(
      "À propos",
      "/a-propos",
      "Parcours, stack technique, expériences chez Artefact, Artefact 3000, Qare",
    ),
  );
  sections.push(buildLine("Contact", "/contact", "Formulaire de contact + booking visio"));
  sections.push("");

  sections.push("## Formules services");
  sections.push("");
  for (const service of services) {
    sections.push(
      buildLine(
        `Formule ${service.nom}`,
        `/services/${service.slug}`,
        service.description,
      ),
    );
  }
  sections.push("");

  sections.push("## Études de cas projets");
  sections.push("");
  for (const projet of projets) {
    sections.push(
      buildLine(
        projet.titre,
        `/projets/${projet.slug}`,
        `${projet.client} — ${projet.description}`,
      ),
    );
  }
  sections.push("");

  sections.push("## Mentions légales");
  sections.push("");
  sections.push(buildLine("Confidentialité", "/privacy", "Politique RGPD"));
  sections.push(buildLine("Mentions légales", "/terms", "Mentions légales et CGU"));
  sections.push("");

  sections.push("## Contact direct");
  sections.push("");
  sections.push(`- Email : contact@leohengebaert.fr`);
  sections.push(`- Site : ${SITE_URL}`);
  sections.push("");

  return sections.join("\n");
}

export function GET() {
  return new Response(buildContent(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
