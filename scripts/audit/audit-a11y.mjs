#!/usr/bin/env node
// Audit a11y approfondi via axe-core + Puppeteer (60+ règles WCAG 2.1 AA + best-practice).
// Plus exhaustif que Lighthouse a11y (~30 règles).
//
// Usage :
//   node scripts/audit-a11y.mjs                          # audite leohengebaert.fr (default)
//   node scripts/audit-a11y.mjs https://example.com      # audite un autre domaine
//   node scripts/audit-a11y.mjs https://example.com /a /b  # audite des pages spécifiques
//
// Pré-requis (devDependencies) :
//   pnpm add -D puppeteer @axe-core/puppeteer
//
// Sur leohengebaert.fr, l'IntroOverlay détecte `navigator.webdriver === true`
// (toujours vrai sous puppeteer headless) et se skip immédiatement → pas
// d'attente de 4.2s avant que axe-core puisse scanner la home.
// Sortie : stdout récap + pages-violations.json (détail complet).

import puppeteer from "puppeteer";
import { AxePuppeteer } from "@axe-core/puppeteer";
import { writeFileSync } from "node:fs";

// ---------- args ----------
const args = process.argv.slice(2);
const baseUrl = args[0] || "https://leohengebaert.fr";
const customPaths = args.slice(1);

const DEFAULT_PATHS = [
  "/",
  "/services",
  "/services/standard",
  "/services/essentiel",
  "/services/premium",
  "/projets",
  "/projets/russian-with-julia",
  "/projets/bald-artiste",
  "/contact",
  "/a-propos",
];

const paths = customPaths.length > 0 ? customPaths : DEFAULT_PATHS;
const URLS = paths.map((p) => baseUrl.replace(/\/$/, "") + p);

// ---------- audit ----------
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
console.log(`\nAudit a11y axe-core sur ${URLS.length} pages — WCAG 2.1 AA + best-practice\n`);
console.log("=".repeat(80));

let totalViolations = 0;
const allFindings = {};
const detailedReport = [];

for (const url of URLS) {
  const page = await browser.newPage();
  // L'IntroOverlay sur leohengebaert.fr détecte `navigator.webdriver === true`
  // (toujours vrai sous puppeteer headless) et se skip immédiatement.
  // Aucun cookie à poser ici.

  try {
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
  } catch (e) {
    console.log(`  ${url}: erreur navigation (${e.message.slice(0, 80)})`);
    await page.close();
    continue;
  }

  const results = await new AxePuppeteer(page)
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    .analyze();

  const v = results.violations;
  totalViolations += v.length;
  const path = new URL(url).pathname || "/";
  console.log(`\n${path.padEnd(40)} : ${v.length} violation(s)`);

  detailedReport.push({
    url,
    violations: v.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map((n) => ({
        target: n.target,
        html: n.html,
        failureSummary: n.failureSummary,
      })),
    })),
  });

  for (const violation of v) {
    const key = violation.id;
    if (!allFindings[key]) {
      allFindings[key] = {
        impact: violation.impact,
        description: violation.description,
        helpUrl: violation.helpUrl,
        pages: [],
        nodes: 0,
      };
    }
    allFindings[key].pages.push(path);
    allFindings[key].nodes += violation.nodes.length;
    console.log(`    [${violation.impact}] ${violation.id}: ${violation.help} (${violation.nodes.length} elem)`);
  }

  await page.close();
}

await browser.close();

console.log("\n" + "=".repeat(80));
console.log(`TOTAL : ${totalViolations} violation(s) sur ${URLS.length} pages`);
console.log("=".repeat(80));

if (Object.keys(allFindings).length > 0) {
  console.log("\nRécap par règle (priorité décroissante) :");
  const sorted = Object.entries(allFindings).sort((a, b) => {
    const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
    return (order[a[1].impact] ?? 9) - (order[b[1].impact] ?? 9);
  });
  for (const [id, finding] of sorted) {
    console.log(`\n  [${finding.impact}] ${id}`);
    console.log(`    ${finding.description}`);
    console.log(`    Pages : ${[...new Set(finding.pages)].join(", ")}`);
    console.log(`    Total éléments : ${finding.nodes}`);
    console.log(`    Aide : ${finding.helpUrl}`);
  }
} else {
  console.log("\n✓ Aucune violation détectée. Score axe-core PARFAIT.");
}

// Sortie JSON détaillée pour archivage / parsing
const outFile = "audit-a11y-results.json";
writeFileSync(
  outFile,
  JSON.stringify(
    {
      timestamp: new Date().toISOString(),
      baseUrl,
      totalViolations,
      summary: allFindings,
      details: detailedReport,
    },
    null,
    2,
  ),
);
console.log(`\nDétails sauvegardés dans ./${outFile}`);

process.exit(totalViolations === 0 ? 0 : 1);
