type ContactEmailPayload = {
  nom: string
  email: string
  telephone?: string
  formule?: string
  activite?: string
  message: string
  addons?: string[]
  totalEstime?: string
}

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

export function renderContactEmail(p: ContactEmailPayload): { subject: string; html: string; text: string } {
  const formuleLabel = p.formule || "Non précisée"
  const subject = `Nouvelle demande${p.formule ? ` — ${p.formule}` : ""} — ${p.nom}`

  const addonsHtml =
    p.addons && p.addons.length > 0
      ? `<ul style="margin:0;padding-left:18px;color:#1f2937;">${p.addons
          .map((a) => `<li style="margin:2px 0;">${escape(a)}</li>`)
          .join("")}</ul>`
      : `<span style="color:#6b7280;font-style:italic;">Aucune option (formule de base)</span>`

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:24px;background:#0d1411;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr>
        <td style="background:#0d1411;padding:24px 28px;">
          <p style="margin:0;color:#7adcb1;font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;">
            Nouvelle demande
          </p>
          <h1 style="margin:6px 0 0 0;color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.02em;">
            Formule ${escape(formuleLabel)}${p.totalEstime ? ` &mdash; ${escape(p.totalEstime)}` : ""}
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 28px;">
          <table role="presentation" width="100%" style="border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;width:120px;">Nom</td>
              <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:14px;font-weight:600;">${escape(p.nom)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Email</td>
              <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:14px;">
                <a href="mailto:${escape(p.email)}" style="color:#0e7c50;text-decoration:none;">${escape(p.email)}</a>
              </td>
            </tr>
            ${
              p.telephone
                ? `<tr>
                    <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Téléphone</td>
                    <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:14px;">
                      <a href="tel:${escape(p.telephone)}" style="color:#0e7c50;text-decoration:none;">${escape(p.telephone)}</a>
                    </td>
                  </tr>`
                : ""
            }
            ${
              p.activite
                ? `<tr>
                    <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Activité</td>
                    <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:14px;">${escape(p.activite)}</td>
                  </tr>`
                : ""
            }
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Formule</td>
              <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:14px;font-weight:600;">${escape(formuleLabel)}</td>
            </tr>
            ${
              p.totalEstime
                ? `<tr>
                    <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Total estimé</td>
                    <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#0e7c50;font-size:16px;font-weight:800;">${escape(p.totalEstime)}</td>
                  </tr>`
                : ""
            }
          </table>

          <p style="margin:20px 0 8px 0;color:#6b7280;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Options sélectionnées</p>
          ${addonsHtml}

          <p style="margin:20px 0 8px 0;color:#6b7280;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Message</p>
          <div style="padding:14px 16px;background:#f9fafb;border-left:3px solid #7adcb1;border-radius:6px;color:#111827;font-size:14px;line-height:1.55;white-space:pre-wrap;">${escape(p.message)}</div>

          <div style="margin-top:24px;padding-top:18px;border-top:1px solid #f3f4f6;text-align:center;">
            <a href="mailto:${escape(p.email)}?subject=${encodeURIComponent(`Re: ${subject}`)}" style="display:inline-block;padding:11px 22px;background:#0d1411;color:#7adcb1;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;">
              Répondre à ${escape(p.nom.split(" ")[0])}
            </a>
          </div>
        </td>
      </tr>
    </table>
    <p style="text-align:center;color:#6b7280;font-size:11px;margin-top:14px;">
      Envoyé via le formulaire de contact de leohengebaert.fr
    </p>
  </body>
</html>`

  const text = [
    `Nouvelle demande${p.formule ? ` - ${p.formule}` : ""}`,
    "",
    `Nom : ${p.nom}`,
    `Email : ${p.email}`,
    p.telephone ? `Téléphone : ${p.telephone}` : null,
    p.activite ? `Activité : ${p.activite}` : null,
    `Formule : ${formuleLabel}`,
    p.totalEstime ? `Total estimé : ${p.totalEstime}` : null,
    "",
    "Options sélectionnées :",
    p.addons && p.addons.length > 0 ? p.addons.map((a) => `- ${a}`).join("\n") : "(aucune, formule de base)",
    "",
    "Message :",
    p.message,
  ]
    .filter(Boolean)
    .join("\n")

  return { subject, html, text }
}
