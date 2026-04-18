import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Redirections SEO permanentes (308) — le site avait l'i18n /fr/* et /en/*
  // dans une version précédente. Google a encore ces URLs en cache, donc on les
  // renvoie vers leurs équivalents sans préfixe pour ne pas perdre l'autorité
  // SEO accumulée. À retirer le jour où on remet une vraie i18n.
  async redirects() {
    return [
      // Mapping anciens slugs anglais → nouveaux slugs français
      // (ordre important : ces règles passent avant les catch-all /fr et /en)
      { source: "/about", destination: "/a-propos", permanent: true },
      { source: "/projects", destination: "/projets", permanent: true },
      { source: "/projects/:slug*", destination: "/projets/:slug*", permanent: true },
      { source: "/fr/about", destination: "/a-propos", permanent: true },
      { source: "/en/about", destination: "/a-propos", permanent: true },
      { source: "/fr/projects", destination: "/projets", permanent: true },
      { source: "/en/projects", destination: "/projets", permanent: true },
      { source: "/fr/projects/:slug*", destination: "/projets/:slug*", permanent: true },
      { source: "/en/projects/:slug*", destination: "/projets/:slug*", permanent: true },
      // L'ancienne page /devis pointe désormais vers /services (configurateur de devis intégré)
      { source: "/devis", destination: "/services", permanent: true },
      { source: "/services/devis", destination: "/services", permanent: true },
      { source: "/fr/devis", destination: "/services", permanent: true },
      { source: "/en/devis", destination: "/services", permanent: true },
      // Catch-all : on retire le préfixe de langue pour tout le reste
      { source: "/fr", destination: "/", permanent: true },
      { source: "/en", destination: "/", permanent: true },
      { source: "/fr/:path*", destination: "/:path*", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
