import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Redirections SEO permanentes (308) — anciens URLs en cache chez Google/Bing.
  //
  // Inventaire des URLs legacy reconstruit depuis Search Console + l'ancien
  // sitemap (git). L'ancien site utilisait :
  //   - les DEUX locales préfixées (/fr/* ET /en/*) ; la nouvelle i18n met le FR
  //     à la racine (as-needed) et garde /en/*.
  //   - une structure projets en /work/<slug-court> ; désormais /projets/<slug>.
  //   - des slugs services descriptifs (site-vitrine…) ; désormais des paliers.
  //
  // Règle d'or : UN SEUL saut par URL. Next.js applique la 1re règle qui matche,
  // donc les règles SPÉCIFIQUES sont placées AVANT les catch-all (sinon
  // /fr/about → /about → /a-propos = 2 redirections chaînées, pénalisé SEO).
  async redirects() {
    return [
      // ───────── Slugs racine (locale par défaut FR, sans préfixe) ─────────
      { source: "/about", destination: "/a-propos", permanent: true },
      { source: "/projects", destination: "/projets", permanent: true },
      { source: "/projects/:slug*", destination: "/projets/:slug*", permanent: true },
      // Ancienne structure projets /work/* → /projets/* (slugs renommés)
      { source: "/work", destination: "/projets", permanent: true },
      { source: "/work/argedis", destination: "/projets/argedis-totalenergies", permanent: true },
      { source: "/work/sweetime", destination: "/projets/sweetime-adp-extime", permanent: true },
      // Projet retiré du portfolio (site client autonome) → liste des projets
      { source: "/work/hurepoix-nettoyage", destination: "/projets", permanent: true },
      // Anciennes pages services → page services unique
      { source: "/devis", destination: "/services", permanent: true },
      { source: "/services/devis", destination: "/services", permanent: true },
      { source: "/servicesWordpress", destination: "/services", permanent: true },
      { source: "/services/site-vitrine", destination: "/services", permanent: true },
      { source: "/services/site-ecommerce", destination: "/services", permanent: true },
      { source: "/services/site-landing-page", destination: "/services", permanent: true },

      // ───────── Équivalents anglais (préfixe /en conservé) ─────────
      { source: "/en/about", destination: "/en/a-propos", permanent: true },
      { source: "/en/projects", destination: "/en/projets", permanent: true },
      { source: "/en/projects/:slug*", destination: "/en/projets/:slug*", permanent: true },
      { source: "/en/work", destination: "/en/projets", permanent: true },
      { source: "/en/work/argedis", destination: "/en/projets/argedis-totalenergies", permanent: true },
      { source: "/en/work/sweetime", destination: "/en/projets/sweetime-adp-extime", permanent: true },
      { source: "/en/work/hurepoix-nettoyage", destination: "/en/projets", permanent: true },
      { source: "/en/devis", destination: "/en/services", permanent: true },
      { source: "/en/services/devis", destination: "/en/services", permanent: true },
      { source: "/en/servicesWordpress", destination: "/en/services", permanent: true },
      { source: "/en/services/site-vitrine", destination: "/en/services", permanent: true },
      { source: "/en/services/site-ecommerce", destination: "/en/services", permanent: true },
      { source: "/en/services/site-landing-page", destination: "/en/services", permanent: true },

      // ───────── Ancien préfixe /fr/* → racine (1 saut grâce à l'ordre) ─────────
      // Règles spécifiques d'abord (slugs renommés), puis le catch-all générique.
      { source: "/fr", destination: "/", permanent: true },
      { source: "/fr/about", destination: "/a-propos", permanent: true },
      { source: "/fr/work", destination: "/projets", permanent: true },
      { source: "/fr/work/argedis", destination: "/projets/argedis-totalenergies", permanent: true },
      { source: "/fr/work/sweetime", destination: "/projets/sweetime-adp-extime", permanent: true },
      { source: "/fr/work/hurepoix-nettoyage", destination: "/projets", permanent: true },
      { source: "/fr/devis", destination: "/services", permanent: true },
      { source: "/fr/servicesWordpress", destination: "/services", permanent: true },
      { source: "/fr/services/site-vitrine", destination: "/services", permanent: true },
      { source: "/fr/services/site-ecommerce", destination: "/services", permanent: true },
      { source: "/fr/services/site-landing-page", destination: "/services", permanent: true },
      // Catch-all : tout autre /fr/X → /X (slugs identiques, donc 1 seul saut)
      { source: "/fr/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
