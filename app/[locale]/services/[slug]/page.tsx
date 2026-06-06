import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Suspense } from "react"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { services } from "@/lib/services"
import { getServiceContent } from "@/lib/services-content"
import { ServiceConfigurator } from "@/components/sections/service-configurator"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { breadcrumbSchema, serviceOfferSchema } from "@/lib/seo/json-ld"
import { JsonLd } from "@/components/seo/json-ld"
import type { Locale } from "@/i18n/routing"

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: "servicesData" })
  const service = getServiceContent(slug, t)
  if (!service) return {}
  return buildPageMetadata({
    title: `${service.nom} — Création de site web Next.js`,
    description: service.description,
    pathname: `/services/${slug}`,
    locale: locale as Locale,
  })
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "servicesData" })
  const service = getServiceContent(slug, t)
  if (!service) notFound()

  // Schemas page : Service (formule + prix) + BreadcrumbList Accueil → Services → Formule.
  const pageSchemas = [
    serviceOfferSchema(service, locale as Locale),
    breadcrumbSchema(
      [
        { name: locale === "fr" ? "Accueil" : "Home", pathname: "/" },
        { name: locale === "fr" ? "Services" : "Services", pathname: "/services" },
        { name: service.nom, pathname: `/services/${slug}` },
      ],
      locale as Locale,
    ),
  ]

  return (
    <>
      <JsonLd data={pageSchemas} />
      <Suspense fallback={null}>
        <ServiceConfigurator service={service} />
      </Suspense>
    </>
  )
}
