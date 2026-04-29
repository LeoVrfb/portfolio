// Email de confirmation envoyé au client après la réservation d'un appel découverte.
// Style aligné sur lib/emails/contact-email.ts (même charte sombre + accent menthe).

type BookingConfirmationPayload = {
  clientName: string
  clientEmail: string
  // "vendredi 15 mai 2026" — déjà formatté côté serveur dans le bon fuseau.
  dateLabel: string
  // "14:30 — 14:45 (Europe/Paris)"
  timeLabel: string
  callType: "meet" | "phone"
  meetLink?: string
  phoneNumber?: string
  message?: string
  // Lien Google Calendar de l'event (htmlLink) pour ajout au cal client.
  eventLink: string
}

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

export function renderBookingConfirmationEmail(p: BookingConfirmationPayload): {
  subject: string
  html: string
  text: string
} {
  const callTypeLabel = p.callType === "meet" ? "Google Meet" : "Téléphone"
  const subject = `Appel découverte confirmé — ${p.dateLabel}`

  const callDetailsHtml =
    p.callType === "meet" && p.meetLink
      ? `<a href="${escape(p.meetLink)}" style="color:#0e7c50;text-decoration:none;font-weight:600;">${escape(
          p.meetLink
        )}</a>`
      : p.callType === "phone" && p.phoneNumber
      ? `Je vous appelle au <strong>${escape(p.phoneNumber)}</strong>`
      : callTypeLabel

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:24px;background:#0d1411;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr>
        <td style="background:#0d1411;padding:24px 28px;">
          <p style="margin:0;color:#7adcb1;font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;">
            Rendez-vous confirmé
          </p>
          <h1 style="margin:6px 0 0 0;color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.02em;">
            Appel découverte &mdash; 15 min
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 28px;">
          <p style="margin:0 0 18px 0;color:#111827;font-size:15px;line-height:1.55;">
            Salut ${escape(p.clientName.split(" ")[0])}, c'est confirmé&nbsp;! Je vous appelle&nbsp;:
          </p>

          <table role="presentation" width="100%" style="border-collapse:collapse;background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;width:90px;">Date</td>
              <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;font-weight:600;">${escape(p.dateLabel)}</td>
            </tr>
            <tr>
              <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Horaire</td>
              <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;font-weight:600;">${escape(p.timeLabel)}</td>
            </tr>
            <tr>
              <td style="padding:14px 18px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">${escape(callTypeLabel)}</td>
              <td style="padding:14px 18px;color:#111827;font-size:14px;">${callDetailsHtml}</td>
            </tr>
          </table>

          ${
            p.message
              ? `<p style="margin:20px 0 8px 0;color:#6b7280;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Votre message</p>
                 <div style="padding:14px 16px;background:#f9fafb;border-left:3px solid #7adcb1;border-radius:6px;color:#111827;font-size:14px;line-height:1.55;white-space:pre-wrap;">${escape(p.message)}</div>`
              : ""
          }

          <div style="margin-top:24px;text-align:center;">
            <a href="${escape(p.eventLink)}" style="display:inline-block;padding:12px 24px;background:#0d1411;color:#7adcb1;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;">
              Ajouter à mon calendrier
            </a>
          </div>

          <p style="margin:24px 0 0 0;color:#6b7280;font-size:13px;line-height:1.55;">
            Vous avez reçu en parallèle l'invitation Google Calendar avec un rappel automatique 1h avant.
          </p>
          <p style="margin:8px 0 0 0;color:#6b7280;font-size:13px;line-height:1.55;">
            Un empêchement&nbsp;? Répondez simplement à cet email, on trouvera un autre créneau.
          </p>

          <div style="margin-top:24px;padding-top:18px;border-top:1px solid #f3f4f6;color:#6b7280;font-size:13px;line-height:1.55;">
            À très vite,<br/>
            <strong style="color:#111827;">Léo</strong>
          </div>
        </td>
      </tr>
    </table>
    <p style="text-align:center;color:#6b7280;font-size:11px;margin-top:14px;">
      leohengebaert.fr &mdash; Développeur web freelance
    </p>
  </body>
</html>`

  const text = [
    `Appel découverte confirmé`,
    ``,
    `Salut ${p.clientName.split(" ")[0]}, c'est confirmé !`,
    ``,
    `Date : ${p.dateLabel}`,
    `Horaire : ${p.timeLabel}`,
    `Mode : ${callTypeLabel}`,
    p.callType === "meet" && p.meetLink ? `Lien Meet : ${p.meetLink}` : null,
    p.callType === "phone" && p.phoneNumber ? `Je vous appelle au : ${p.phoneNumber}` : null,
    p.message ? `\nVotre message :\n${p.message}` : null,
    ``,
    `Ajouter à mon calendrier : ${p.eventLink}`,
    ``,
    `Vous avez reçu en parallèle l'invitation Google Calendar avec un rappel automatique 1h avant.`,
    `Un empêchement ? Répondez simplement à cet email, on trouvera un autre créneau.`,
    ``,
    `À très vite,`,
    `Léo`,
  ]
    .filter(Boolean)
    .join("\n")

  return { subject, html, text }
}
