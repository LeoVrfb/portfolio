// Email du questionnaire design (page privée /brief).
// Génère un récap HTML lisible + une version texte + un bloc machine-readable
// (YAML-ish) que Léo peut copier-coller directement dans une IA pour générer la
// direction design / compléter le devis.

export type BriefEmailPayload = {
  nom: string
  email: string
  formule?: string
  clientToken?: string
  // Inspiration
  sitesAimes?: string
  sitesPasAimes?: string
  // Ambiance
  theme?: string // "clair" | "sombre" | "a-voir"
  adjectifs?: string[]
  sobreExpressif?: number // 0 (sobre) → 100 (expressif)
  classiqueModerne?: number // 0 (classique) → 100 (moderne)
  // Typo
  typoId?: string
  typoLabel?: string
  // Palette
  couleursPreferees?: string[]
  couleurCustom?: string
  coolorsInput?: string
  // Structure
  logo?: string // "oui" | "non" | "a-creer"
  structureNotes?: string
  // Libre
  notes?: string
}

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const themeLabel = (t?: string) =>
  t === "clair"
    ? "Thème clair"
    : t === "sombre"
      ? "Thème sombre"
      : t === "a-voir"
        ? "À voir ensemble"
        : "Non précisé"

const logoLabel = (l?: string) =>
  l === "oui"
    ? "A déjà un logo"
    : l === "non"
      ? "Pas de logo"
      : l === "a-creer"
        ? "Logo à créer"
        : "Non précisé"

const sliderLabel = (v: number | undefined, left: string, right: string) => {
  if (v === undefined) return "Non précisé"
  if (v <= 25) return `Plutôt ${left} (${v}/100)`
  if (v >= 75) return `Plutôt ${right} (${v}/100)`
  return `Équilibré (${v}/100, ${left} ↔ ${right})`
}

export function renderBriefEmail(p: BriefEmailPayload): {
  subject: string
  html: string
  text: string
} {
  const formuleLabel = p.formule || "Non précisée"
  const subject = `Brief design${p.formule ? ` — ${p.formule}` : ""} — ${p.nom}`

  const adjectifs =
    p.adjectifs && p.adjectifs.length > 0 ? p.adjectifs.join(", ") : "—"
  const couleurs =
    p.couleursPreferees && p.couleursPreferees.length > 0
      ? p.couleursPreferees.join(", ")
      : "—"

  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;width:170px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:14px;white-space:pre-wrap;">${value}</td>
    </tr>`

  const block = (title: string, content: string) =>
    `<p style="margin:22px 0 8px 0;color:#0e7c50;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">${title}</p>${content}`

  // Bloc machine-readable pour repasser à l'IA.
  const yaml = [
    "--- brief design ---",
    `formule: ${formuleLabel}`,
    p.clientToken ? `client_token: ${p.clientToken}` : null,
    `contact: ${p.nom} <${p.email}>`,
    `theme: ${p.theme || "non precise"}`,
    `adjectifs: [${(p.adjectifs || []).join(", ")}]`,
    `axe_sobre_expressif: ${p.sobreExpressif ?? "n/a"}/100`,
    `axe_classique_moderne: ${p.classiqueModerne ?? "n/a"}/100`,
    `typo_preferee: ${p.typoLabel || p.typoId || "non precise"}`,
    `couleurs_preferees: [${(p.couleursPreferees || []).join(", ")}]`,
    p.couleurCustom ? `couleur_custom: ${p.couleurCustom}` : null,
    p.coolorsInput ? `palette_coolors: ${p.coolorsInput}` : null,
    `logo: ${p.logo || "non precise"}`,
    "sites_aimes: |",
    `  ${(p.sitesAimes || "—").replace(/\n/g, "\n  ")}`,
    "sites_pas_aimes: |",
    `  ${(p.sitesPasAimes || "—").replace(/\n/g, "\n  ")}`,
    "structure_notes: |",
    `  ${(p.structureNotes || "—").replace(/\n/g, "\n  ")}`,
    "notes: |",
    `  ${(p.notes || "—").replace(/\n/g, "\n  ")}`,
    "--- fin brief ---",
  ]
    .filter(Boolean)
    .join("\n")

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:24px;background:#0d1411;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr>
        <td style="background:#0d1411;padding:24px 28px;">
          <p style="margin:0;color:#7adcb1;font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;">
            Brief design reçu
          </p>
          <h1 style="margin:6px 0 0 0;color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.02em;">
            ${escape(p.nom)} &mdash; Formule ${escape(formuleLabel)}
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 28px;">
          <table role="presentation" width="100%" style="border-collapse:collapse;">
            ${row("Contact", `<a href="mailto:${escape(p.email)}" style="color:#0e7c50;text-decoration:none;">${escape(p.email)}</a>`)}
            ${row("Formule", escape(formuleLabel))}
            ${p.clientToken ? row("Token client", escape(p.clientToken)) : ""}
          </table>

          ${block(
            "Ambiance",
            `<table role="presentation" width="100%" style="border-collapse:collapse;">
              ${row("Thème", escape(themeLabel(p.theme)))}
              ${row("Adjectifs", escape(adjectifs))}
              ${row("Sobre ↔ Expressif", escape(sliderLabel(p.sobreExpressif, "sobre", "expressif")))}
              ${row("Classique ↔ Moderne", escape(sliderLabel(p.classiqueModerne, "classique", "moderne")))}
            </table>`
          )}

          ${block(
            "Typographie & couleurs",
            `<table role="presentation" width="100%" style="border-collapse:collapse;">
              ${row("Typo préférée", escape(p.typoLabel || p.typoId || "—"))}
              ${row("Couleurs préférées", escape(couleurs))}
              ${p.couleurCustom ? row("Couleur personnalisée", `<span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${escape(p.couleurCustom)};vertical-align:middle;margin-right:6px;"></span>${escape(p.couleurCustom)}`) : ""}
              ${p.coolorsInput ? row("Palette coolors.co", escape(p.coolorsInput)) : ""}
              ${row("Logo", escape(logoLabel(p.logo)))}
            </table>`
          )}

          ${block(
            "Inspiration",
            `<p style="margin:0 0 4px 0;color:#6b7280;font-size:12px;font-weight:600;">Sites aimés</p>
             <div style="padding:12px 14px;background:#f9fafb;border-left:3px solid #7adcb1;border-radius:6px;color:#111827;font-size:14px;line-height:1.5;white-space:pre-wrap;margin-bottom:10px;">${escape(p.sitesAimes || "—")}</div>
             <p style="margin:0 0 4px 0;color:#6b7280;font-size:12px;font-weight:600;">Sites pas aimés</p>
             <div style="padding:12px 14px;background:#f9fafb;border-left:3px solid #e5e7eb;border-radius:6px;color:#111827;font-size:14px;line-height:1.5;white-space:pre-wrap;">${escape(p.sitesPasAimes || "—")}</div>`
          )}

          ${
            p.structureNotes || p.notes
              ? block(
                  "Structure & notes",
                  `${p.structureNotes ? `<div style="padding:12px 14px;background:#f9fafb;border-radius:6px;color:#111827;font-size:14px;line-height:1.5;white-space:pre-wrap;margin-bottom:10px;">${escape(p.structureNotes)}</div>` : ""}
                   ${p.notes ? `<div style="padding:12px 14px;background:#f9fafb;border-radius:6px;color:#111827;font-size:14px;line-height:1.5;white-space:pre-wrap;">${escape(p.notes)}</div>` : ""}`
                )
              : ""
          }

          <p style="margin:24px 0 8px 0;color:#6b7280;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">À copier dans l'IA</p>
          <pre style="margin:0;padding:14px 16px;background:#0d1411;color:#7adcb1;border-radius:8px;font-size:12px;line-height:1.5;white-space:pre-wrap;overflow-x:auto;">${escape(yaml)}</pre>

          <div style="margin-top:24px;padding-top:18px;border-top:1px solid #f3f4f6;text-align:center;">
            <a href="mailto:${escape(p.email)}?subject=${encodeURIComponent(`Re: ${subject}`)}" style="display:inline-block;padding:11px 22px;background:#0d1411;color:#7adcb1;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;">
              Répondre à ${escape(p.nom.split(" ")[0])}
            </a>
          </div>
        </td>
      </tr>
    </table>
    <p style="text-align:center;color:#6b7280;font-size:11px;margin-top:14px;">
      Envoyé via le questionnaire design privé de leohengebaert.fr
    </p>
  </body>
</html>`

  const text = [
    `Brief design${p.formule ? ` - ${p.formule}` : ""}`,
    "",
    `Contact : ${p.nom} <${p.email}>`,
    `Formule : ${formuleLabel}`,
    p.clientToken ? `Token client : ${p.clientToken}` : null,
    "",
    "AMBIANCE",
    `- Thème : ${themeLabel(p.theme)}`,
    `- Adjectifs : ${adjectifs}`,
    `- Sobre/Expressif : ${sliderLabel(p.sobreExpressif, "sobre", "expressif")}`,
    `- Classique/Moderne : ${sliderLabel(p.classiqueModerne, "classique", "moderne")}`,
    "",
    "TYPO & COULEURS",
    `- Typo préférée : ${p.typoLabel || p.typoId || "—"}`,
    `- Couleurs préférées : ${couleurs}`,
    p.couleurCustom ? `- Couleur personnalisée : ${p.couleurCustom}` : null,
    p.coolorsInput ? `- Palette coolors.co : ${p.coolorsInput}` : null,
    `- Logo : ${logoLabel(p.logo)}`,
    "",
    "INSPIRATION",
    `Sites aimés :\n${p.sitesAimes || "—"}`,
    "",
    `Sites pas aimés :\n${p.sitesPasAimes || "—"}`,
    "",
    p.structureNotes ? `STRUCTURE\n${p.structureNotes}` : null,
    p.notes ? `NOTES\n${p.notes}` : null,
    "",
    yaml,
  ]
    .filter((l) => l !== null)
    .join("\n")

  return { subject, html, text }
}
