import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

/**
 * Bots IA explicitement autorisés (doctrine SEO Pro 2026).
 *
 * Stratégie : on **autorise** explicitement les crawlers des principaux moteurs
 * IA pour maximiser la présence dans ChatGPT Search, Claude, Perplexity, Bing
 * Chat, Google AI Overviews. Le risque de "vol de contenu" est bien plus faible
 * que celui d'être absent des résultats IA en 2026+.
 *
 * Listes mises à jour depuis `digital-agency/references/seo/08-ai-search-geo.md`.
 */
const AI_BOTS_ALLOW: string[] = [
  // OpenAI / ChatGPT
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic / Claude
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  // Google AI (training opt-in pour AI Overviews)
  "Google-Extended",
  // Common Crawl (utilisé par beaucoup de modèles)
  "CCBot",
  // Apple
  "Applebot",
  "Applebot-Extended",
  // Mistral / Cohere / autres
  "Cohere-AI",
  "Diffbot",
  "FacebookBot",
];

const DISALLOW_PATHS: string[] = [
  // Routes API (contact, booking, availability) — pas de contenu indexable
  "/api/",
  // Page demo legacy jQuery — non maintenue, ne reflète pas le travail actuel
  "/demo",
  "/en/demo",
  // Anciens préfixes legacy (catch-all redirigé via next.config.ts mais on
  // explicite ici pour les crawlers qui ne suivent pas les redirections)
  "/fr/",
];

export default function robots(): MetadataRoute.Robots {
  const aiBotRules: MetadataRoute.Robots["rules"] = AI_BOTS_ALLOW.map((userAgent) => ({
    userAgent,
    allow: "/",
    disallow: DISALLOW_PATHS,
  }));

  return {
    rules: [
      // Règle par défaut pour tous les bots non listés (Googlebot, Bingbot, etc.)
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW_PATHS,
      },
      ...aiBotRules,
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
