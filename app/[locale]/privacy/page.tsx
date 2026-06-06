import { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import type { Locale } from "@/i18n/routing"
import { getAlternates } from "@/lib/seo/alternates"

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
  return {
    title: meta.title,
    description: meta.description,
    alternates: getAlternates("/privacy", locale as Locale),
  }
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
      "Cette politique décrit comment leohengebaert.fr collecte et utilise les données personnelles fournies via les formulaires du site (contact, demande de devis, prise de rendez-vous).",
    lastUpdated: "Dernière mise à jour : 28 mai 2026",
    sections: [
      {
        heading: "Données collectées",
        bullets: [
          "Formulaire de contact / devis : nom, email, message, formule sélectionnée. Reçus par email via Resend.",
          "Prise de rendez-vous : nom, email et, si tu choisis un appel téléphonique, numéro de téléphone. Utilisés pour créer l'événement dans mon Google Calendar et t'envoyer un email de confirmation.",
          "Aucune navigation ni cookie analytique n'est suivi. Le seul cookie déposé est NEXT_LOCALE qui mémorise la langue choisie (FR ou EN).",
        ],
      },
      {
        heading: "Utilisation",
        bullets: [
          "Répondre à ta demande et organiser l'appel.",
          "Aucune revente, aucune diffusion à un tiers en dehors des outils techniques nécessaires : Resend (envoi d'email) et Google Calendar (planification du rendez-vous).",
        ],
      },
      {
        heading: "Conservation",
        bullets: [
          "Les emails restent dans ma boîte tant qu'il y a un échange actif, puis sont archivés.",
          "Les événements Google Calendar sont conservés tant que le rendez-vous n'est pas annulé.",
        ],
      },
      {
        heading: "Tes droits",
        paragraphs: [
          "Conformément au RGPD, tu peux à tout moment demander l'accès, la rectification ou la suppression de tes données en m'écrivant à hello@leohengebaert.fr.",
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
      "This policy describes how leohengebaert.fr collects and uses personal data submitted through the site's forms (contact, quote requests, booking).",
    lastUpdated: "Last updated: May 28, 2026",
    sections: [
      {
        heading: "Data collected",
        bullets: [
          "Contact / quote form: name, email, message, selected plan. Received by email via Resend.",
          "Booking: name, email, and — if you choose a phone call — phone number. Used to create the event in my Google Calendar and send you a confirmation email.",
          "No analytics or tracking cookies. The only cookie set is NEXT_LOCALE, which remembers your chosen language (FR or EN).",
        ],
      },
      {
        heading: "Use",
        bullets: [
          "To reply to your request and organise the call.",
          "No resale, no sharing with third parties beyond the technical tools required: Resend (email delivery) and Google Calendar (scheduling).",
        ],
      },
      {
        heading: "Retention",
        bullets: [
          "Emails stay in my inbox while we're actively in touch, then get archived.",
          "Google Calendar events are kept until the appointment is cancelled.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "Under GDPR, you can request access, correction or deletion of your data at any time by writing to hello@leohengebaert.fr.",
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

        <p className="mt-12 text-xs text-white/40 font-mono">{copy.lastUpdated}</p>
      </article>
    </div>
  )
}
