import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Redirections SEO permanentes (308) — anciens URLs en cache chez Google.
  // Note : les catch-all /fr/:path* → /:path* du passé i18n ONT ÉTÉ RETIRÉS
  // car ils entreraient en conflit avec la nouvelle i18n /en/*.
  // Le /fr historique pointait vers la version française unique du site.
  async redirects() {
    return [
      // Anciens slugs anglais → nouveaux slugs français
      { source: "/about", destination: "/a-propos", permanent: true },
      { source: "/projects", destination: "/projets", permanent: true },
      { source: "/projects/:slug*", destination: "/projets/:slug*", permanent: true },
      // Équivalents avec préfixe /en pour conserver le SEO sur la nouvelle i18n
      { source: "/en/about", destination: "/en/a-propos", permanent: true },
      { source: "/en/projects", destination: "/en/projets", permanent: true },
      { source: "/en/projects/:slug*", destination: "/en/projets/:slug*", permanent: true },
      // L'ancienne page /devis pointe désormais vers /services
      { source: "/devis", destination: "/services", permanent: true },
      { source: "/services/devis", destination: "/services", permanent: true },
      { source: "/en/devis", destination: "/en/services", permanent: true },
      { source: "/en/services/devis", destination: "/en/services", permanent: true },
      // Catch-all : on retire le préfixe /fr/* historique (mais on garde /en/*
      // qui est maintenant géré par next-intl)
      { source: "/fr", destination: "/", permanent: true },
      { source: "/fr/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
