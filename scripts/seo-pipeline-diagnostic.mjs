#!/usr/bin/env node
// seo-pipeline-diagnostic.mjs — Diagnostic SEO complet d'un site sur GSC + Bing.
//
// Pour chaque URL du sitemap :
//   - Google : URL Inspection API → statut indexation, dernière crawl date, problèmes
//   - Bing  : GetUrlInfo API → indexed, fetch errors, last crawl
//   - Sortie JSON + tableau récap en console
//
// Pré-requis :
//   - Service account GSC verified DNS (cf. gsc-verify-site.mjs)
//   - BING_API_KEY en env var (lue depuis api-keys.md ou export shell)
//
// Usage : node scripts/seo-pipeline-diagnostic.mjs [domain]

import { readFileSync, writeFileSync } from "node:fs";
import { createSign } from "node:crypto";

const DOMAIN = process.argv[2] || "https://leohengebaert.fr";
const KEY_PATH = "/Users/leohengebaert/app/Notes-Central/mot de passe et identifiant/gsc-service-account.json";
const BING_API_KEY = process.env.BING_API_KEY || "b577842a7b434316be6da57fa5b0bc6d";
const SCOPES = "https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/siteverification";

function b64u(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getGscToken() {
  const key = JSON.parse(readFileSync(KEY_PATH, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const claim = { iss: key.client_email, scope: SCOPES, aud: "https://oauth2.googleapis.com/token", exp: now + 3600, iat: now };
  const h = b64u(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const c = b64u(JSON.stringify(claim));
  const sign = createSign("RSA-SHA256");
  sign.update(`${h}.${c}`);
  const jwt = `${h}.${c}.${b64u(sign.sign(key.private_key))}`;
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
  });
  if (!r.ok) throw new Error(`GSC token: ${r.status}`);
  return (await r.json()).access_token;
}

async function fetchSitemap(domain) {
  const r = await fetch(`${domain}/sitemap.xml`);
  if (!r.ok) throw new Error(`sitemap ${r.status}`);
  const xml = await r.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function gscInspect(token, siteUrl, url) {
  const r = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: url, siteUrl, languageCode: "fr-FR" }),
  });
  if (!r.ok) {
    return { error: `${r.status} ${(await r.text()).slice(0, 100)}` };
  }
  const data = await r.json();
  const idx = data?.inspectionResult?.indexStatusResult || {};
  return {
    verdict: idx.verdict,
    coverageState: idx.coverageState,
    indexingState: idx.indexingState,
    lastCrawlTime: idx.lastCrawlTime,
    pageFetchState: idx.pageFetchState,
    googleCanonical: idx.googleCanonical,
    userCanonical: idx.userCanonical,
    sitemap: idx.sitemap,
    referringUrls: (idx.referringUrls || []).length,
  };
}

async function gscSubmitSitemap(token, siteUrl, sitemapUrl) {
  const r = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
  );
  return { status: r.status, body: r.status === 204 ? "OK" : await r.text() };
}

// Convertit le format Bing /Date(1764900579000)/ en ISO string
function bingDateToIso(s) {
  if (!s) return null;
  const m = String(s).match(/(\d+)/);
  if (!m) return null;
  return new Date(Number(m[1])).toISOString().slice(0, 10);
}

async function bingGetUrlInfo(siteUrl, url) {
  const params = new URLSearchParams({ siteUrl, url, apikey: BING_API_KEY });
  const r = await fetch(
    `https://ssl.bing.com/webmaster/api.svc/json/GetUrlInfo?${params.toString()}`
  );
  if (!r.ok) {
    return { error: `${r.status}` };
  }
  const data = await r.json();
  const info = data.d || {};
  return {
    crawledDate: bingDateToIso(info.LastCrawledDate),
    discoveredDate: bingDateToIso(info.DiscoveryDate),
    documentSize: info.DocumentSize,
    // Bing convention : HttpStatus=0 means "no HTTP error" (fetched OK).
    // Any other value = the actual HTTP error code (404, 503…).
    httpStatus: info.HttpStatus === 0 ? "OK" : info.HttpStatus,
    isPage: info.IsPage,
    totalChildUrlCount: info.TotalChildUrlCount,
  };
}

async function bingSubmitUrlBatch(siteUrl, urls) {
  const params = new URLSearchParams({ apikey: BING_API_KEY });
  const r = await fetch(
    `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?${params.toString()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteUrl, urlList: urls }),
    }
  );
  return { status: r.status, body: await r.text() };
}

async function main() {
  console.log(`=== Diagnostic SEO pipeline : ${DOMAIN} ===\n`);

  const urls = await fetchSitemap(DOMAIN);
  console.log(`Sitemap : ${urls.length} URLs\n`);

  console.log("→ Récupération token GSC...");
  const gscToken = await getGscToken();
  const gscSiteUrl = `sc-domain:${new URL(DOMAIN).hostname}`;
  const bingSiteUrl = `${DOMAIN}/`;

  console.log("→ Re-soumission du sitemap à GSC...");
  const sitemapSubmit = await gscSubmitSitemap(gscToken, gscSiteUrl, `${DOMAIN}/sitemap.xml`);
  console.log(`  GSC sitemap submit: ${sitemapSubmit.status} ${sitemapSubmit.body || ""}`);

  console.log("→ Re-soumission batch URLs à Bing...");
  const bingSubmit = await bingSubmitUrlBatch(bingSiteUrl, urls);
  console.log(`  Bing batch submit: ${bingSubmit.status}`);

  console.log("\n→ Inspection page par page (Google + Bing en parallèle)...\n");

  const results = [];
  // Process in serial to avoid rate limit (GSC URL Inspection : 600/day, ~6/min)
  for (const url of urls) {
    process.stdout.write(`  ${url.replace(DOMAIN, "")}... `);
    const [gsc, bing] = await Promise.all([
      gscInspect(gscToken, gscSiteUrl, url),
      bingGetUrlInfo(bingSiteUrl, url),
    ]);
    results.push({ url, google: gsc, bing });
    const gv = gsc.verdict || "ERR";
    const bs = bing.httpStatus || "ERR";
    console.log(`google=${gv} bing-http=${bs}`);
  }

  // Save full results
  const outPath = `/tmp/seo-diagnostic-${new URL(DOMAIN).hostname}.json`;
  writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nFull JSON: ${outPath}\n`);

  // Console summary table
  console.log("=== Récap Google ===");
  console.log("Verdict       | Pages | Coverage states");
  console.log("-".repeat(70));
  const byVerdict = {};
  for (const r of results) {
    const v = r.google.verdict || "ERROR";
    const c = r.google.coverageState || "-";
    const key = `${v} | ${c}`;
    byVerdict[key] = (byVerdict[key] || 0) + 1;
  }
  for (const [k, count] of Object.entries(byVerdict)) {
    const [v, c] = k.split(" | ");
    console.log(`${v.padEnd(13)} | ${String(count).padEnd(5)} | ${c}`);
  }

  console.log("\n=== Récap Bing ===");
  console.log("HTTP | Pages | Indexed | Discovered date oldest");
  console.log("-".repeat(70));
  const byHttp = {};
  for (const r of results) {
    const h = r.bing.httpStatus || "ERROR";
    byHttp[h] = (byHttp[h] || 0) + 1;
  }
  for (const [h, count] of Object.entries(byHttp)) {
    console.log(`${String(h).padEnd(5)}| ${count}`);
  }

  console.log("\n=== Pages avec problèmes (Google) ===");
  for (const r of results) {
    const g = r.google;
    if (g.verdict !== "PASS") {
      console.log(`  ${r.url.replace(DOMAIN, "")}`);
      console.log(`    verdict     : ${g.verdict}`);
      console.log(`    coverage    : ${g.coverageState}`);
      console.log(`    pageFetch   : ${g.pageFetchState}`);
      console.log(`    googleCanon : ${g.googleCanonical || "(none)"}`);
      console.log(`    userCanon   : ${g.userCanonical || "(none)"}`);
      console.log(`    lastCrawl   : ${g.lastCrawlTime || "(never)"}`);
    }
  }
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
