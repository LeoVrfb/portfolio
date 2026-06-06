import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Suspense } from "react"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { services } from "@/lib/services"
import { getServiceContent } from "@/lib/services-content"
import { ServiceConfigurator } from "@/components/sections/service-configurator"
import { getAlternates } from "@/lib/seo/alternates"
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
  return {
    title: `${service.nom} — Léo Hengebaert`,
    description: service.description,
    alternates: getAlternates(`/services/${slug}`, locale as Locale),
  }
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

  return (
    <Suspense fallback={null}>
      <ServiceConfigurator service={service} />
    </Suspense>
  )
}
