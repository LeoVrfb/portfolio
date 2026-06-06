/**
 * Détection User-Agent côté serveur pour identifier les crawlers/bots.
 *
 * Usage : on désactive certains effets visuels lourds (intro overlay, animations
 * coûteuses) quand un bot indexe la page, pour ne pas pénaliser le LCP perçu
 * par les crawlers JS (Googlebot rendu, OAI-SearchBot, ChatGPT-User, etc.).
 *
 * Heuristique simple à base de regex sur les fragments les plus discriminants.
 * Liste alignée sur `app/robots.ts` + suffixes génériques (`bot`, `crawler`,
 * `spider`, `crawl`).
 */

const BOT_PATTERN =
  /bot|crawl|spider|slurp|lighthouse|chrome-lighthouse|pagespeed|facebookexternalhit|gptbot|oai-searchbot|chatgpt-user|claude-web|claudebot|anthropic-ai|perplexitybot|google-extended|ccbot|applebot|cohere|diffbot|bytespider|duckduckbot|yandex|baidu|bingbot/i;

export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return BOT_PATTERN.test(userAgent);
}
