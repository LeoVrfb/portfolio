#!/usr/bin/env node
// gsc-test.mjs — Test rapide de l'API Google Search Console via service account.
// Usage : node scripts/gsc-test.mjs [url-a-inspecter]
// Ex : node scripts/gsc-test.mjs https://leohengebaert.fr/services
//
// Pré-requis :
//   - Service account JSON situé dans Notes-Central/mot de passe et identifiant/gsc-service-account.json
//   - Service account ajouté comme utilisateur dans la propriété GSC

import { readFileSync } from "node:fs";
import { createSign } from "node:crypto";

const KEY_PATH = "/Users/leohengebaert/app/Notes-Central/mot de passe et identifiant/gsc-service-account.json";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

function loadKey() {
  const raw = readFileSync(KEY_PATH, "utf8");
  return JSON.parse(raw);
}

function base64UrlEncode(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getAccessToken(key) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: key.client_email,
    scope: SCOPE,
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const claimB64 = base64UrlEncode(JSON.stringify(claim));
  const signingInput = `${headerB64}.${claimB64}`;

  const sign = createSign("RSA-SHA256");
  sign.update(signingInput);
  const signature = sign.sign(key.private_key);
  const sigB64 = base64UrlEncode(signature);

  const jwt = `${signingInput}.${sigB64}`;

  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Token endpoint returned ${r.status}: ${text}`);
  }
  const data = await r.json();
  return data.access_token;
}

async function listSites(token) {
  const r = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`List sites failed ${r.status}: ${text}`);
  }
  const data = await r.json();
  return data.siteEntry || [];
}

async function inspectUrl(token, siteUrl, inspectionUrl) {
  const r = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inspectionUrl,
      siteUrl,
      languageCode: "fr-FR",
    }),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Inspect failed ${r.status}: ${text}`);
  }
  return r.json();
}

async function main() {
  const inspectionUrl = process.argv[2];
  console.log("=== Loading service account key ===");
  const key = loadKey();
  console.log(`Service account: ${key.client_email}`);
  console.log(`Project: ${key.project_id}`);

  console.log("\n=== Getting OAuth2 access token ===");
  const token = await getAccessToken(key);
  console.log(`Token acquired (length ${token.length}, ${token.slice(0, 20)}...)`);

  console.log("\n=== Listing accessible sites ===");
  const sites = await listSites(token);
  if (sites.length === 0) {
    console.log("(no sites — add the service account to your GSC properties first)");
  } else {
    for (const s of sites) {
      console.log(`  ${s.permissionLevel.padEnd(20)} ${s.siteUrl}`);
    }
  }

  if (!inspectionUrl) {
    console.log("\n(pas d'URL passée en argument — skip URL inspection)");
    return;
  }

  // Determine siteUrl: use the deepest matching property
  const matched = sites
    .filter((s) => inspectionUrl.startsWith(s.siteUrl) || s.siteUrl.startsWith("sc-domain:"))
    .sort((a, b) => b.siteUrl.length - a.siteUrl.length)[0];

  if (!matched) {
    console.log(`\nNo accessible GSC property matches ${inspectionUrl}`);
    return;
  }

  console.log(`\n=== URL Inspection: ${inspectionUrl} ===`);
  console.log(`Using property: ${matched.siteUrl}`);
  const result = await inspectUrl(token, matched.siteUrl, inspectionUrl);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
