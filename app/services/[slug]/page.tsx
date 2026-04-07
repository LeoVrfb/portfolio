import { notFound } from "next/navigation"
import { Metadata } from "next"
import { services, getService } from "@/lib/services"
import { ServiceConfigurator } from "@/components/sections/service-configurator"

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}
  return {
    title: `Formule ${service.nom} — Léo Hengebaert`,
    description: service.description,
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  return <ServiceConfigurator service={service} />
}
