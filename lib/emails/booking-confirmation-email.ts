// Email de confirmation envoyé au client après la réservation d'un appel découverte.
// Style aligné sur lib/emails/contact-email.ts (même charte sombre + accent menthe).
// Bilingue : choix FR/EN via la locale passée en payload.

import type { Locale } from "@/i18n/routing"

type BookingConfirmationPayload = {
  clientName: string
  clientEmail: string
  // "vendredi 15 mai 2026" / "Friday, May 15, 2026" — déjà formaté dans la bonne locale + bon fuseau.
  dateLabel: string
  // "14:30 — 14:45 (Europe/Paris)" / "2:30 PM — 2:45 PM (Paris time)"
  timeLabel: string
  callType: "meet" | "phone"
  meetLink?: string
  phoneNumber?: string
  message?: string
  // Lien Google Calendar de l'event (htmlLink) pour ajout au cal client.
  eventLink: string
  /** Locale du client — détermine la langue de l'email. Par défaut FR. */
  locale?: Locale
}

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

type EmailCopy = {
  subjectPrefix: string
  htmlLang: string
  eyebrow: string
  title: string
  greeting: (firstName: string) => string
  dateLabel: string
  timeLabel: string
  meetLabel: string
  phoneLabel: string
  phoneSentence: (phone: string) => string
  yourMessage: string
  addToCalendar: string
  remindersNote: string
  cantMakeIt: string
  signoff: string
  signature: string
  footer: string
  // Plain text
  textHeader: string
  textGreeting: (firstName: string) => string
  textDate: string
  textTime: string
  textMode: string
  textMeetLink: string
  textPhoneLine: (phone: string) => string
  textMessage: string
  textAddLine: string
  textRemindersNote: string
  textCantMakeIt: string
}

const COPY: Record<Locale, EmailCopy> = {
  fr: {
    subjectPrefix: "Appel découverte confirmé",
    htmlLang: "fr",
    eyebrow: "Rendez-vous confirmé",
    title: "Appel découverte &mdash; 15 min",
    greeting: (firstName) =>
      `Salut ${firstName}, c'est confirmé&nbsp;! Je vous appelle&nbsp;:`,
    dateLabel: "Date",
    timeLabel: "Horaire",
    meetLabel: "Google Meet",
    phoneLabel: "Téléphone",
    phoneSentence: (phone) => `Je vous appelle au <strong>${phone}</strong>`,
    yourMessage: "Votre message",
    addToCalendar: "Ajouter à mon calendrier",
    remindersNote:
      "Vous avez reçu en parallèle l'invitation Google Calendar avec un rappel automatique 1h avant.",
    cantMakeIt:
      "Un empêchement&nbsp;? Répondez simplement à cet email, on trouvera un autre créneau.",
    signoff: "À très vite,",
    signature: "Léo",
    footer: "leohengebaert.fr &mdash; Développeur web freelance",
    textHeader: "Appel découverte confirmé",
    textGreeting: (firstName) => `Salut ${firstName}, c'est confirmé !`,
    textDate: "Date",
    textTime: "Horaire",
    textMode: "Mode",
    textMeetLink: "Lien Meet",
    textPhoneLine: (phone) => `Je vous appelle au : ${phone}`,
    textMessage: "Votre message",
    textAddLine: "Ajouter à mon calendrier",
    textRemindersNote:
      "Vous avez reçu en parallèle l'invitation Google Calendar avec un rappel automatique 1h avant.",
    textCantMakeIt:
      "Un empêchement ? Répondez simplement à cet email, on trouvera un autre créneau.",
  },
  en: {
    subjectPrefix: "Discovery call confirmed",
    htmlLang: "en",
    eyebrow: "Meeting confirmed",
    title: "Discovery call &mdash; 15 min",
    greeting: (firstName) =>
      `Hi ${firstName}, you're booked in&nbsp;! Here are the details&nbsp;:`,
    dateLabel: "Date",
    timeLabel: "Time",
    meetLabel: "Google Meet",
    phoneLabel: "Phone",
    phoneSentence: (phone) => `I'll call you at <strong>${phone}</strong>`,
    yourMessage: "Your message",
    addToCalendar: "Add to my calendar",
    remindersNote:
      "You'll also receive the official Google Calendar invite with an automatic reminder 1 hour before.",
    cantMakeIt:
      "Something came up&nbsp;? Just reply to this email and we'll find another slot.",
    signoff: "Talk soon,",
    signature: "Léo",
    footer: "leohengebaert.fr &mdash; Freelance web developer",
    textHeader: "Discovery call confirmed",
    textGreeting: (firstName) => `Hi ${firstName}, you're booked in!`,
    textDate: "Date",
    textTime: "Time",
    textMode: "Mode",
    textMeetLink: "Meet link",
    textPhoneLine: (phone) => `I'll call you at: ${phone}`,
    textMessage: "Your message",
    textAddLine: "Add to my calendar",
    textRemindersNote:
      "You'll also receive the official Google Calendar invite with an automatic reminder 1 hour before.",
    textCantMakeIt:
      "Something came up? Just reply to this email and we'll find another slot.",
  },
}

export function renderBookingConfirmationEmail(p: BookingConfirmationPayload): {
  subject: string
  html: string
  text: string
} {
  const locale: Locale = p.locale ?? "fr"
  const c = COPY[locale]

  const callTypeLabel = p.callType === "meet" ? c.meetLabel : c.phoneLabel
  const subject = `${c.subjectPrefix} — ${p.dateLabel}`
  const firstName = escape(p.clientName.split(" ")[0])

  const callDetailsHtml =
    p.callType === "meet" && p.meetLink
      ? `<a href="${escape(p.meetLink)}" style="color:#0e7c50;text-decoration:none;font-weight:600;">${escape(
          p.meetLink
        )}</a>`
      : p.callType === "phone" && p.phoneNumber
      ? c.phoneSentence(escape(p.phoneNumber))
      : escape(callTypeLabel)

  const html = `<!doctype html>
<html lang="${c.htmlLang}">
  <body style="margin:0;padding:24px;background:#0d1411;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr>
        <td style="background:#0d1411;padding:24px 28px;">
          <p style="margin:0;color:#7adcb1;font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;">
            ${c.eyebrow}
          </p>
          <h1 style="margin:6px 0 0 0;color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.02em;">
            ${c.title}
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 28px;">
          <p style="margin:0 0 18px 0;color:#111827;font-size:15px;line-height:1.55;">
            ${c.greeting(firstName)}
          </p>

          <table role="presentation" width="100%" style="border-collapse:collapse;background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;width:90px;">${c.dateLabel}</td>
              <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;font-weight:600;">${escape(p.dateLabel)}</td>
            </tr>
            <tr>
              <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">${c.timeLabel}</td>
              <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;font-weight:600;">${escape(p.timeLabel)}</td>
            </tr>
            <tr>
              <td style="padding:14px 18px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">${escape(callTypeLabel)}</td>
              <td style="padding:14px 18px;color:#111827;font-size:14px;">${callDetailsHtml}</td>
            </tr>
          </table>

          ${
            p.message
              ? `<p style="margin:20px 0 8px 0;color:#6b7280;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">${c.yourMessage}</p>
                 <div style="padding:14px 16px;background:#f9fafb;border-left:3px solid #7adcb1;border-radius:6px;color:#111827;font-size:14px;line-height:1.55;white-space:pre-wrap;">${escape(p.message)}</div>`
              : ""
          }

          <div style="margin-top:24px;text-align:center;">
            <a href="${escape(p.eventLink)}" style="display:inline-block;padding:12px 24px;background:#0d1411;color:#7adcb1;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;">
              ${c.addToCalendar}
            </a>
          </div>

          <p style="margin:24px 0 0 0;color:#6b7280;font-size:13px;line-height:1.55;">
            ${c.remindersNote}
          </p>
          <p style="margin:8px 0 0 0;color:#6b7280;font-size:13px;line-height:1.55;">
            ${c.cantMakeIt}
          </p>

          <div style="margin-top:24px;padding-top:18px;border-top:1px solid #f3f4f6;color:#6b7280;font-size:13px;line-height:1.55;">
            ${c.signoff}<br/>
            <strong style="color:#111827;">${c.signature}</strong>
          </div>
        </td>
      </tr>
    </table>
    <p style="text-align:center;color:#6b7280;font-size:11px;margin-top:14px;">
      ${c.footer}
    </p>
  </body>
</html>`

  const text = [
    c.textHeader,
    ``,
    c.textGreeting(p.clientName.split(" ")[0]),
    ``,
    `${c.textDate} : ${p.dateLabel}`,
    `${c.textTime} : ${p.timeLabel}`,
    `${c.textMode} : ${callTypeLabel}`,
    p.callType === "meet" && p.meetLink ? `${c.textMeetLink} : ${p.meetLink}` : null,
    p.callType === "phone" && p.phoneNumber ? c.textPhoneLine(p.phoneNumber) : null,
    p.message ? `\n${c.textMessage} :\n${p.message}` : null,
    ``,
    `${c.textAddLine} : ${p.eventLink}`,
    ``,
    c.textRemindersNote,
    c.textCantMakeIt,
    ``,
    c.signoff,
    c.signature,
  ]
    .filter(Boolean)
    .join("\n")

  return { subject, html, text }
}
