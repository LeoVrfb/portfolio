import { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import type { Locale } from "@/i18n/routing"
import { buildPageMetadata } from "@/lib/seo/metadata"

const METADATA_BY_LOCALE: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Conditions d'utilisation — Léo Hengebaert",
    description:
      "Conditions d'utilisation du site leohengebaert.fr — portfolio et services de Léo Hengebaert, développeur freelance.",
  },
  en: {
    title: "Terms of use — Léo Hengebaert",
    description:
      "Terms of use of leohengebaert.fr — portfolio and services of Léo Hengebaert, freelance developer.",
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
    pathname: "/terms",
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

const COPY: Record<Locale, Copy> = {
  fr: {
    title: "Conditions d'utilisation",
    intro:
      "Le site leohengebaert.fr présente le portfolio et les services de Léo Hengebaert, développeur freelance basé à Paris. Il permet de découvrir ses projets, de demander un devis et de réserver un appel.",
    lastUpdated: "Dernière mise à jour : 28 mai 2026",
    sections: [
      {
        heading: "Accès au site",
        paragraphs: [
          "Le site est librement accessible 24h/24. Léo Hengebaert se réserve le droit de l'interrompre temporairement pour maintenance ou évolution, sans préavis.",
        ],
      },
      {
        heading: "Propriété intellectuelle",
        bullets: [
          "Les textes, images, animations et code de l'interface restent la propriété de Léo Hengebaert.",
          "Les marques, logos et contenus des projets clients présentés restent la propriété de leurs détenteurs respectifs — leur affichage relève du droit de reproduction accordé dans le cadre des missions.",
          "Toute reproduction ou réutilisation sans autorisation écrite est interdite.",
        ],
      },
      {
        heading: "Devis et réservations",
        bullets: [
          "Les estimations affichées par le configurateur des pages services sont indicatives. Un devis personnalisé est envoyé après échange.",
          "La réservation d'un appel découverte est gratuite et sans engagement.",
          "Une fois un devis signé, les modalités de paiement et de livraison sont précisées par contrat séparé.",
        ],
      },
      {
        heading: "Limitation de responsabilité",
        bullets: [
          "Le site est fourni « tel quel ». Aucune garantie d'absence d'erreurs ou d'interruptions.",
          "L'utilisation des informations fournies via le site (estimations, conseils, références) se fait sous la responsabilité de l'utilisateur.",
        ],
      },
      {
        heading: "Droit applicable",
        paragraphs: [
          "Les présentes conditions sont régies par le droit français. Tout litige relèvera de la compétence des tribunaux de Paris.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          "Léo Hengebaert — hello@leohengebaert.fr — Paris, France.",
        ],
      },
    ],
  },
  en: {
    title: "Terms of use",
    intro:
      "leohengebaert.fr is the portfolio and services site of Léo Hengebaert, a freelance developer based in Paris. It lets you browse projects, request a quote and book a call.",
    lastUpdated: "Last updated: May 28, 2026",
    sections: [
      {
        heading: "Access",
        paragraphs: [
          "The site is freely accessible 24/7. Léo Hengebaert reserves the right to interrupt it temporarily for maintenance or updates without prior notice.",
        ],
      },
      {
        heading: "Intellectual property",
        bullets: [
          "Texts, images, animations and interface code remain the property of Léo Hengebaert.",
          "Client brands, logos and project content remain the property of their respective owners — their display falls under the reproduction rights granted during the engagements.",
          "Any reproduction or reuse without written permission is prohibited.",
        ],
      },
      {
        heading: "Quotes and bookings",
        bullets: [
          "Estimates shown by the service configurator are indicative. A personalised quote is sent after a call.",
          "Booking a discovery call is free with no commitment.",
          "Once a quote is signed, payment and delivery terms are specified in a separate contract.",
        ],
      },
      {
        heading: "Limitation of liability",
        bullets: [
          "The site is provided \"as is\". No guarantee of being error-free or uninterrupted.",
          "Use of the information provided through the site (estimates, advice, references) is at the user's own risk.",
        ],
      },
      {
        heading: "Applicable law",
        paragraphs: [
          "These terms are governed by French law. Any dispute falls under the jurisdiction of the courts of Paris.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          "Léo Hengebaert — hello@leohengebaert.fr — Paris, France.",
        ],
      },
    ],
  },
}

export default async function TermsPage({
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
