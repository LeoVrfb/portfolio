import { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import type { Locale } from "@/i18n/routing"
import { buildPageMetadata } from "@/lib/seo/metadata"

const METADATA_BY_LOCALE: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Politique de confidentialité — Léo Hengebaert",
    description:
      "Données collectées via les formulaires du site (contact, devis, prise de rendez-vous) et comment elles sont traitées.",
  },
  en: {
    title: "Privacy policy — Léo Hengebaert",
    description:
      "Data collected through the site's forms (contact, quotes, bookings) and how it is processed.",
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const meta = METADATA_BY_LOCALE[locale as Locale] ?? METADATA_BY_LOCALE.fr
  return buildPageMetadata({
    title: meta.title,
    description: meta.description,
    pathname: "/privacy",
    locale: locale as Locale,
  })
}

type Section = {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
}

type Copy = {
  title: string
  intro: string
  lastUpdated: string
  sections: Section[]
}

// Contenu juridique stable, structuré en dur par locale. Pas de namespace
// next-intl pour éviter d'éparpiller un texte qui se modifie rarement.
const COPY: Record<Locale, Copy> = {
  fr: {
    title: "Politique de confidentialité",
    intro:
      "Cette politique décrit comment leohengebaert.fr collecte et utilise les données personnelles fournies via les formulaires du site (contact, demande de devis, prise de rendez-vous) ainsi que les outils de mesure d'audience.",
    lastUpdated: "Dernière mise à jour : 7 juin 2026",
    sections: [
      {
        heading: "Données collectées via les formulaires",
        bullets: [
          "Formulaire de contact / devis : nom, email, message, formule sélectionnée. Reçus par email via Resend.",
          "Prise de rendez-vous : nom, email et, si tu choisis un appel téléphonique, numéro de téléphone. Utilisés pour créer l'événement dans mon Google Calendar et t'envoyer un email de confirmation.",
        ],
      },
      {
        heading: "Mesure d'audience et publicité",
        paragraphs: [
          "Le site utilise Google Analytics 4 (mesure d'audience) et Meta Pixel (Facebook Pixel) pour comprendre comment les visiteurs naviguent et personnaliser les publicités sur Facebook et Instagram.",
          "Ces outils déposent des cookies (`_ga`, `_ga_*`, `_fbp`) avec une durée de vie maximale de 13 mois. Tu peux à tout moment refuser leur utilisation via le bandeau cookie en bas de page (bouton « Refuser ») — ton choix est mémorisé pendant 1 an.",
          "Les données collectées sont anonymisées et agrégées. Aucune donnée personnelle identifiable n'est partagée avec ces tiers (Google et Meta).",
        ],
      },
      {
        heading: "Cookies déposés",
        bullets: [
          "`NEXT_LOCALE` : mémorise la langue choisie (FR ou EN). Cookie technique fonctionnel, exempt de consentement.",
          "`cookie_consent` : mémorise ton choix d'accepter ou refuser les trackers (1 an).",
          "`_ga`, `_ga_*` : Google Analytics 4 — uniquement si tracking accepté.",
          "`_fbp` : Meta Pixel — uniquement si tracking accepté.",
        ],
      },
      {
        heading: "Utilisation",
        bullets: [
          "Répondre à ta demande et organiser l'appel.",
          "Mesurer l'audience du site et améliorer son contenu (Google Analytics 4).",
          "Personnaliser les publicités sur Facebook et Instagram (Meta Pixel).",
          "Aucune revente. Diffusion uniquement aux tiers nécessaires : Resend (email), Google Calendar (planification), Google Analytics, Meta.",
        ],
      },
      {
        heading: "Conservation",
        bullets: [
          "Emails dans ma boîte tant qu'il y a un échange actif, puis archivés.",
          "Événements Google Calendar : conservés tant que le rendez-vous n'est pas annulé.",
          "Données Google Analytics : 14 mois maximum (paramétrage par défaut GA4).",
          "Données Meta Pixel : 90 jours pour les événements de conversion.",
        ],
      },
      {
        heading: "Tes droits",
        paragraphs: [
          "Conformément au RGPD, tu peux à tout moment demander l'accès, la rectification ou la suppression de tes données en m'écrivant à hello@leohengebaert.fr.",
          "Tu peux aussi désactiver Google Analytics et Meta Pixel via le bandeau cookie en bas de page, ou en installant les modules navigateur officiels (Google Analytics Opt-out, Facebook Container).",
        ],
      },
      {
        heading: "Responsable",
        paragraphs: [
          "Léo Hengebaert — hello@leohengebaert.fr — Paris, France.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    intro:
      "This policy describes how leohengebaert.fr collects and uses personal data submitted through the site's forms (contact, quote requests, booking) and through audience measurement tools.",
    lastUpdated: "Last updated: June 7, 2026",
    sections: [
      {
        heading: "Data collected through forms",
        bullets: [
          "Contact / quote form: name, email, message, selected plan. Received by email via Resend.",
          "Booking: name, email, and — if you choose a phone call — phone number. Used to create the event in my Google Calendar and send you a confirmation email.",
        ],
      },
      {
        heading: "Audience measurement and advertising",
        paragraphs: [
          "The site uses Google Analytics 4 (audience measurement) and Meta Pixel (Facebook Pixel) to understand how visitors navigate and personalize advertising on Facebook and Instagram.",
          "These tools set cookies (`_ga`, `_ga_*`, `_fbp`) with a maximum lifespan of 13 months. You can refuse their use at any time via the cookie banner at the bottom of the page (\"Decline\" button) — your choice is remembered for 1 year.",
          "Data collected is anonymized and aggregated. No personally identifiable information is shared with these third parties (Google and Meta).",
        ],
      },
      {
        heading: "Cookies set",
        bullets: [
          "`NEXT_LOCALE`: remembers your chosen language (FR or EN). Technical functional cookie, exempt from consent.",
          "`cookie_consent`: remembers your choice to accept or decline trackers (1 year).",
          "`_ga`, `_ga_*`: Google Analytics 4 — only if tracking accepted.",
          "`_fbp`: Meta Pixel — only if tracking accepted.",
        ],
      },
      {
        heading: "Use",
        bullets: [
          "To reply to your request and organise the call.",
          "To measure site audience and improve its content (Google Analytics 4).",
          "To personalize advertising on Facebook and Instagram (Meta Pixel).",
          "No resale. Sharing only with required third parties: Resend (email), Google Calendar (scheduling), Google Analytics, Meta.",
        ],
      },
      {
        heading: "Retention",
        bullets: [
          "Emails stay in my inbox while we're actively in touch, then get archived.",
          "Google Calendar events: kept until the appointment is cancelled.",
          "Google Analytics data: 14 months maximum (GA4 default).",
          "Meta Pixel data: 90 days for conversion events.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "Under GDPR, you can request access, correction or deletion of your data at any time by writing to hello@leohengebaert.fr.",
          "You can also disable Google Analytics and Meta Pixel via the cookie banner at the bottom of the page, or by installing the official browser modules (Google Analytics Opt-out, Facebook Container).",
        ],
      },
      {
        heading: "Controller",
        paragraphs: [
          "Léo Hengebaert — hello@leohengebaert.fr — Paris, France.",
        ],
      },
    ],
  },
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const copy = COPY[locale as Locale] ?? COPY.fr

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6">
      <article className="max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-6">
          {copy.title}
        </h1>
        <p className="text-base text-white/75 leading-relaxed mb-10">{copy.intro}</p>

        <div className="space-y-10">
          {copy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold text-white mb-3">{section.heading}</h2>
              {section.paragraphs?.map((p, i) => (
                <p key={i} className="text-sm text-white/75 leading-relaxed mb-3">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="space-y-2">
                  {section.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="text-sm text-white/75 leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-white/35"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <p className="mt-12 text-xs text-white/55 font-mono">{copy.lastUpdated}</p>
      </article>
    </div>
  )
}
