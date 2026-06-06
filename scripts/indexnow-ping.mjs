#!/usr/bin/env node
/**
 * IndexNow ping — informe Bing, Yandex, Naver, Seznam (et indirectement
 * ChatGPT Search via Bing) qu'une ou plusieurs URLs ont changé.
 *
 * Usage :
 *   node scripts/indexnow-ping.mjs                     # ping toutes les URLs du sitemap
 *   node scripts/indexnow-ping.mjs https://leohengebaert.fr/services /projets
 *
 * Pourquoi IndexNow :
 * - Indexation quasi-immédiate sur Bing (vs jours/semaines pour le crawl naturel)
 * - ChatGPT Search utilise principalement Bing → indexation rapide = visibilité IA
 * - Standard ouvert (Microsoft, Yandex, Naver, Seznam)
 * - Une seule API, pas de comptes multiples à gérer
 *
 * Doc : https://www.indexnow.org/documentation
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const HOST = "leohengebaert.fr";
const KEY = "09e174eb1cb244ce8e14ae9111e2c96c";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";

/**
 * Si aucune URL n'est passée en argument, on ping toutes les URLs du sitemap.
 * Implémentation simple : on parse le sitemap.xml en regex (pas besoin d'un
 * vrai parser XML pour cette tâche).
 */
async function getUrlsFromSitemap() {
  const sitemapUrl = `https://${HOST}/sitemap.xml`;
  const res = await fetch(sitemapUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch sitemap: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();
  // Extrait toutes les balises <loc>...</loc> (chaque URL).
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  // Dedup : un même URL peut apparaître plusieurs fois dans le sitemap (FR + EN cross-refs).
  const urls = [...new Set(matches.map((m) => m[1]))];
  return urls;
}

function normalizeUrls(args) {
  return args.map((arg) => {
    if (arg.startsWith("http://") || arg.startsWith("https://")) return arg;
    if (arg.startsWith("/")) return `https://${HOST}${arg}`;
    return `https://${HOST}/${arg}`;
  });
}

async function main() {
  const args = process.argv.slice(2);
  const urls = args.length > 0 ? normalizeUrls(args) : await getUrlsFromSitemap();

  if (urls.length === 0) {
    console.error("No URLs to ping.");
    process.exit(1);
  }

  console.log(`IndexNow ping — ${urls.length} URL(s) → ${HOST}`);
  console.log(`Key location: ${KEY_LOCATION}`);

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  if (res.status === 200 || res.status === 202) {
    console.log(`OK (HTTP ${res.status}) — ${urls.length} URL(s) submitted.`);
    return;
  }

  const text = await res.text();
  console.error(`FAILED (HTTP ${res.status}): ${text}`);
  console.error("Body sent:", JSON.stringify(body, null, 2));
  process.exit(1);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
