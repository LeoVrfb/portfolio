#!/usr/bin/env node
// gsc-verify-site.mjs — Vérifie un service account comme propriétaire DNS
// d'un domaine, ce qui lui donne automatiquement accès à la propriété GSC
// `sc-domain:<domain>` correspondante (et à toutes les sous-URL prefix).
//
// Usage : node scripts/gsc-verify-site.mjs <domain> [--no-dns-add]
//
// Workflow :
//   1. Demande à Site Verification API un token DNS_TXT pour <domain>
//   2. Ajoute automatiquement le TXT record via Vercel CLI (si DNS chez Vercel)
//   3. Attend la propagation DNS (jusqu'à 90s)
//   4. Appelle webResource.insert pour valider l'ownership
//   5. Liste les sites GSC accessibles pour confirmer

import { readFileSync } from "node:fs";
import { createSign } from "node:crypto";
import { spawnSync } from "node:child_process";
import { resolveTxt } from "node:dns/promises";

const KEY_PATH = "/Users/leohengebaert/app/Notes-Central/mot de passe et identifiant/gsc-service-account.json";
const SCOPES = [
  "https://www.googleapis.com/auth/siteverification",
  "https://www.googleapis.com/auth/webmasters",
].join(" ");

function base64UrlEncode(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function loadKey() {
  return JSON.parse(readFileSync(KEY_PATH, "utf8"));
}

async function getAccessToken(key) {
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: key.client_email,
    scope: SCOPES,
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };
  const headerB64 = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claimB64 = base64UrlEncode(JSON.stringify(claim));
  const signingInput = `${headerB64}.${claimB64}`;
  const sign = createSign("RSA-SHA256");
  sign.update(signingInput);
  const sigB64 = base64UrlEncode(sign.sign(key.private_key));
  const jwt = `${signingInput}.${sigB64}`;

  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!r.ok) throw new Error(`Token endpoint ${r.status}: ${await r.text()}`);
  const data = await r.json();
  return data.access_token;
}

async function getDnsToken(token, domain) {
  const r = await fetch("https://www.googleapis.com/siteVerification/v1/token", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      verificationMethod: "DNS_TXT",
      site: { type: "INET_DOMAIN", identifier: domain },
    }),
  });
  if (!r.ok) throw new Error(`getToken ${r.status}: ${await r.text()}`);
  return (await r.json()).token;
}

function vercelDnsAdd(domain, txtValue) {
  console.log(`\n=== Ajout du TXT record via Vercel CLI ===`);
  console.log(`vercel dns add ${domain} @ TXT "${txtValue.slice(0, 30)}..."`);
  const result = spawnSync("vercel", ["dns", "add", domain, "@", "TXT", txtValue], {
    encoding: "utf8",
    stdio: ["inherit", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const stderr = result.stderr || "";
    if (stderr.includes("already exists") || stderr.includes("Conflict")) {
      console.log("(record TXT déjà présent, on continue)");
      return;
    }
    throw new Error(`vercel dns add a échoué: ${stderr}`);
  }
  console.log(result.stdout.trim());
}

async function waitForTxtPropagation(domain, expectedValue, timeoutSec = 120) {
  console.log(`\n=== Attente de la propagation DNS (max ${timeoutSec}s) ===`);
  const start = Date.now();
  while ((Date.now() - start) / 1000 < timeoutSec) {
    try {
      const records = await resolveTxt(domain);
      const flat = records.map((arr) => arr.join(""));
      const found = flat.find((v) => v === expectedValue);
      if (found) {
        console.log(`✓ TXT propagé après ${Math.round((Date.now() - start) / 1000)}s`);
        return;
      }
    } catch {
      // pas encore de TXT — on continue
    }
    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error(`TXT record toujours absent après ${timeoutSec}s — vérifie le DNS Vercel`);
}

async function verifyOwnership(token, domain) {
  console.log(`\n=== Vérification de l'ownership via Site Verification API ===`);
  const r = await fetch(
    "https://www.googleapis.com/siteVerification/v1/webResource?verificationMethod=DNS_TXT",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ site: { type: "INET_DOMAIN", identifier: domain } }),
    }
  );
  if (!r.ok) throw new Error(`verify ${r.status}: ${await r.text()}`);
  return r.json();
}

async function listSites(token) {
  const r = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error(`listSites ${r.status}: ${await r.text()}`);
  return (await r.json()).siteEntry || [];
}

async function main() {
  const domain = process.argv[2];
  const skipDnsAdd = process.argv.includes("--no-dns-add");
  if (!domain) {
    console.error("Usage : node scripts/gsc-verify-site.mjs <domain> [--no-dns-add]");
    console.error("Exemple : node scripts/gsc-verify-site.mjs leohengebaert.fr");
    process.exit(1);
  }

  console.log(`=== Vérification ownership pour ${domain} ===`);
  const key = loadKey();
  console.log(`Service account: ${key.client_email}`);

  const token = await getAccessToken(key);
  console.log(`✓ Access token obtenu (scopes: siteverification + webmasters)`);

  console.log(`\n=== Demande d'un token DNS TXT à Site Verification API ===`);
  const txtValue = await getDnsToken(token, domain);
  console.log(`Token reçu : ${txtValue}`);

  if (!skipDnsAdd) {
    vercelDnsAdd(domain, txtValue);
    await waitForTxtPropagation(domain, txtValue, 120);
  } else {
    console.log("\n(--no-dns-add : ajoute le TXT manuellement, puis relance le script)");
    console.log(`  Domain : ${domain}`);
    console.log(`  Type   : TXT`);
    console.log(`  Value  : ${txtValue}`);
    process.exit(0);
  }

  const result = await verifyOwnership(token, domain);
  console.log(`✓ Ownership vérifié pour ${result.id}`);
  console.log(`  Owners: ${(result.owners || []).join(", ")}`);

  console.log(`\n=== Sites GSC maintenant accessibles ===`);
  const sites = await listSites(token);
  if (sites.length === 0) {
    console.log("(aucun site — la propagation GSC peut prendre quelques minutes)");
  } else {
    for (const s of sites) {
      console.log(`  ${s.permissionLevel.padEnd(20)} ${s.siteUrl}`);
    }
  }

  console.log(`\nNext step : node scripts/gsc-test.mjs https://${domain}/services`);
}

main().catch((e) => {
  console.error("\nERROR:", e.message);
  process.exit(1);
});
