// Helper to build a fully-translated ServiceDetail from:
//  - structural data (slugs, prices, IDs) in lib/services.ts
//  - textual content from the "servicesData" next-intl namespace
//
// Usage (server component):
//   const t = await getTranslations({ locale, namespace: "servicesData" })
//   const service = getServiceContent(slug, t)
//
// The `services` array in lib/services.ts is kept as-is (French strings)
// so that contact-form.tsx (a forbidden file) continues to work without changes.

import type { ServiceDetail, Addon, AddonSubOption, AddonSubOptionChoice, DetailContent } from "@/lib/services"
import { services } from "@/lib/services"

// ── Raw types (mirroring what t.raw() returns from servicesData JSON) ─────────

type RawChoice = { label: string; detail?: string }
type RawSubOption = { label: string; helper?: string; choices: Record<string, RawChoice> }
type RawAddon = {
  label: string
  description: string
  detail?: DetailContent
  subOptions?: Record<string, RawSubOption>
}
type RawServiceData = {
  nom: string
  delai: string
  description: string
  tagline: string
  hook?: { pasDe: string; description: string; metaphor: string }
  audiences: string[]
  promesse: string
  benefices: { text: string }[]
  antiAlternative?: unknown
  pourquoi: string[]
  inclus: unknown[]
  addons: Record<string, RawAddon>
}

// ── Main helper ───────────────────────────────────────────────────────────────

export function getServiceContent(
  slug: string,
  // t is the next-intl translator bound to "servicesData" namespace
  // It must expose a `.raw(key)` method (available on server getTranslations)
  t: { raw: (key: string) => unknown }
): ServiceDetail | undefined {
  const structural = services.find((s) => s.slug === slug)
  if (!structural) return undefined

  const data = t.raw(slug) as RawServiceData

  const addons: Addon[] = structural.addons.map((structuralAddon): Addon => {
    const addonData = data.addons?.[structuralAddon.id] as RawAddon | undefined

    if (!addonData) {
      // Fallback: return structural addon as-is (French strings still visible)
      return structuralAddon
    }

    const subOptions: AddonSubOption[] | undefined = structuralAddon.subOptions?.map(
      (structuralSub): AddonSubOption => {
        const subData = addonData.subOptions?.[structuralSub.id]

        const choices: AddonSubOptionChoice[] = structuralSub.choices.map(
          (structuralChoice): AddonSubOptionChoice => {
            const choiceData = subData?.choices?.[structuralChoice.id]
            return {
              ...structuralChoice,
              label: choiceData?.label ?? structuralChoice.label,
              detail: choiceData?.detail ?? structuralChoice.detail,
            }
          }
        )

        return {
          ...structuralSub,
          label: subData?.label ?? structuralSub.label,
          helper: subData?.helper ?? structuralSub.helper,
          choices,
        }
      }
    )

    return {
      ...structuralAddon,
      label: addonData.label,
      description: addonData.description,
      detail: addonData.detail,
      subOptions,
    }
  })

  return {
    ...structural,
    nom: data.nom,
    delai: data.delai,
    description: data.description,
    tagline: data.tagline,
    hook: data.hook,
    audiences: data.audiences,
    promesse: data.promesse,
    benefices: data.benefices,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    antiAlternative: data.antiAlternative as any,
    pourquoi: data.pourquoi,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inclus: data.inclus as any,
    addons,
  }
}
