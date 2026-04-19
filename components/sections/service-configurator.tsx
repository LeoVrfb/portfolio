"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, useInView, AnimatePresence } from "motion/react"
import { Check, ArrowLeft, ArrowRight, Clock, ChevronDown, Info, MessageCircle, Star, Shield, Zap, AlertCircle, Plus, Minus, XCircle } from "lucide-react"
import type { Addon, AddonSubOption, ServiceDetail, ServiceInclus } from "@/lib/services"
import { AddonInfoDialog, InfoDialog } from "@/components/sections/addon-info-dialog"

// Parse minimaliste **mot** → <strong className="text-accent">. Utilisé dans le pitch.
function renderRichText(text: string, accentClassName = "text-accent font-bold"): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className={accentClassName}>
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}

const WHY_TRUST = [
  { icon: MessageCircle, label: "Réponse sous 24h", detail: "Je réponds à chaque demande" },
  { icon: Shield, label: "Devis gratuit", detail: "Sans engagement de votre part" },
  { icon: Zap, label: "Partout en France", detail: "100% remote, visio ou email" },
  { icon: Star, label: "Code sur mesure", detail: "Zéro template, zéro no-code" },
]

const ease = [0.16, 1, 0.3, 1] as const

type SubChoices = Record<string, Record<string, string>>  // addonId -> subOptionId -> choiceId

function parseSubChoicesFromUrl(raw: string | null): SubChoices {
  const result: SubChoices = {}
  if (!raw) return result
  raw.split(",").filter(Boolean).forEach((entry) => {
    const [key, value] = entry.split(":")
    const [addonId, subId] = key?.split(".") ?? []
    if (addonId && subId && value) {
      if (!result[addonId]) result[addonId] = {}
      result[addonId][subId] = value
    }
  })
  return result
}

function serializeSubChoices(choices: SubChoices, selectedAddonIds: string[]): string {
  const entries: string[] = []
  for (const addonId of selectedAddonIds) {
    const subs = choices[addonId]
    if (!subs) continue
    for (const [subId, choiceId] of Object.entries(subs)) {
      entries.push(`${addonId}.${subId}:${choiceId}`)
    }
  }
  return entries.join(",")
}

function computeAddonPricing(addon: Addon, choices: Record<string, string> | undefined): { prix: number; isDevis: boolean } {
  if (addon.prix === null) return { prix: 0, isDevis: true }
  let total = addon.prix
  let isDevis = false
  if (addon.subOptions) {
    for (const sub of addon.subOptions) {
      const choiceId = choices?.[sub.id]
      if (!choiceId) continue
      const choice = sub.choices.find((c) => c.id === choiceId)
      if (!choice) continue
      if (choice.prixDelta === null) {
        isDevis = true
      } else {
        total += choice.prixDelta
      }
    }
  }
  return { prix: total, isDevis }
}

function isAddonIncomplete(addon: Addon, choices: Record<string, string> | undefined): boolean {
  if (!addon.subOptions) return false
  return addon.subOptions.some((sub) => sub.required && !choices?.[sub.id])
}

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.45, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerList({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <div ref={ref} className={className}>
      {inView && children}
    </div>
  )
}

function StaggerItem({ children, index, className }: { children: React.ReactNode; index: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.32, ease, delay: 0.04 * index }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function IncludedItem({
  item,
  color,
  onOpenInfo,
}: {
  item: ServiceInclus
  color?: string
  onOpenInfo: () => void
}) {
  const accentColor = color ?? "var(--accent)"
  return (
    <li className="py-2 border-b border-white/5 last:border-0">
      <div className="flex items-start gap-2.5">
        <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accentColor }} />
        <p
          className="text-sm font-semibold leading-snug flex-1 min-w-0"
          style={{ color: accentColor }}
        >
          {item.titre}
        </p>
        {item.detail && (
          <button
            type="button"
            onClick={onOpenInfo}
            className="p-0.5 -mt-0.5 rounded text-white/70 hover:text-accent transition-colors cursor-pointer shrink-0"
            aria-label={`Voir le détail de ${item.titre}`}
            title="En savoir plus"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </li>
  )
}

function SubOptionPanel({
  addonId,
  sub,
  selectedChoiceId,
  onSelect,
  showError,
}: {
  addonId: string
  sub: AddonSubOption
  selectedChoiceId: string | undefined
  onSelect: (choiceId: string) => void
  showError: boolean
}) {
  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 mb-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-white/65">{sub.label}</p>
        {sub.helper && (
          <p className="text-[10px] text-white/65 italic">{sub.helper}</p>
        )}
      </div>

      {sub.type === "radio" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {sub.choices.map((choice) => {
            const selected = selectedChoiceId === choice.id
            const isDevis = choice.prixDelta === null
            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => onSelect(choice.id)}
                className={`text-left px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                  selected
                    ? "border-accent bg-accent/12"
                    : "border-white/10 bg-white/2 hover:border-white/25 hover:bg-white/4"
                }`}
                aria-pressed={selected}
                aria-label={`${sub.label} : ${choice.label}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-bold ${selected ? "text-accent" : "text-white"}`}>
                    {choice.label}
                  </span>
                  <span className={`text-[10px] font-bold shrink-0 ${selected ? "text-accent" : "text-white/55"}`}>
                    {isDevis ? "Devis" : choice.prixDelta === 0 ? "Inclus" : `+${choice.prixDelta} €`}
                  </span>
                </div>
                {choice.detail && (
                  <p className={`text-[10px] mt-0.5 leading-snug ${selected ? "text-white/75" : "text-white/45"}`}>
                    {choice.detail}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      ) : (
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${sub.choices.length}, minmax(0, 1fr))` }}
        >
          {sub.choices.map((choice) => {
            const selected = selectedChoiceId === choice.id
            const isDevis = choice.prixDelta === null
            const isIncluded = choice.prixDelta === 0
            const priceLabel = isDevis
              ? "devis"
              : isIncluded
                ? "inclus"
                : `+${choice.prixDelta}€`
            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => onSelect(choice.id)}
                className={`flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-lg border transition-all cursor-pointer min-w-0 ${
                  selected
                    ? "border-accent bg-accent text-background"
                    : "border-white/15 bg-white/4 text-white/85 hover:border-white/30 hover:bg-white/8"
                }`}
                aria-pressed={selected}
                title={choice.detail ?? undefined}
                aria-label={`${sub.label} : ${choice.label} (${priceLabel})`}
              >
                <span className="text-xs font-bold leading-none truncate w-full text-center">
                  {choice.label}
                </span>
                <span
                  className={`text-[9px] font-medium leading-none truncate w-full text-center ${
                    selected ? "text-background/75" : "text-white/45"
                  }`}
                >
                  {priceLabel}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {showError && sub.required && !selectedChoiceId && (
        <p className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-red-400" id={`error-${addonId}-${sub.id}`}>
          <AlertCircle className="w-3 h-3" />
          Sélectionnez {sub.label.toLowerCase()}
        </p>
      )}
    </div>
  )
}

export function ServiceConfigurator({ service }: { service: ServiceDetail }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialAddonIds = searchParams.get("addonIds")?.split(",").filter(Boolean) ?? []
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set(initialAddonIds))
  const [subChoices, setSubChoices] = useState<SubChoices>(() =>
    parseSubChoicesFromUrl(searchParams.get("subOptions"))
  )
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [infoDialogAddonId, setInfoDialogAddonId] = useState<string | null>(null)
  const [infoDialogInclusTitre, setInfoDialogInclusTitre] = useState<string | null>(null)
  const [showAllAddons, setShowAllAddons] = useState(false)

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        // Reset les choix de cet addon quand on le déselectionne
        setSubChoices((prevChoices) => {
          if (!prevChoices[id]) return prevChoices
          const { [id]: _removed, ...rest } = prevChoices
          return rest
        })
      } else {
        next.add(id)
      }
      return next
    })
  }

  const setSubChoice = (addonId: string, subId: string, choiceId: string) => {
    setSubChoices((prev) => ({
      ...prev,
      [addonId]: { ...(prev[addonId] ?? {}), [subId]: choiceId },
    }))
  }

  const openInfoDialog = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setInfoDialogAddonId(id)
  }

  const infoDialogAddon = infoDialogAddonId
    ? service.addons.find((a) => a.id === infoDialogAddonId) ?? null
    : null

  const infoDialogInclus = infoDialogInclusTitre
    ? service.inclus.find((item) => item.titre === infoDialogInclusTitre) ?? null
    : null

  const selectedAddonObjects = Array.from(selectedAddons)
    .map((id) => service.addons.find((a) => a.id === id))
    .filter((a): a is Addon => Boolean(a))

  // Aligne la hauteur visible des options sur la card "Ce qui est inclus"
  // Toujours afficher au moins les addons sélectionnés (sinon ils disparaissent)
  const initialVisibleCount = Math.max(service.inclus.length, selectedAddonObjects.length)
  const hiddenCount = Math.max(0, service.addons.length - initialVisibleCount)
  // Si seulement 1 addon est caché, on l'affiche direct (pas la peine d'un toggle)
  const shouldTruncate = hiddenCount > 1
  const visibleAddons = showAllAddons || !shouldTruncate
    ? service.addons
    : service.addons.slice(0, initialVisibleCount)

  const incompleteAddonIds = new Set(
    selectedAddonObjects
      .filter((addon) => isAddonIncomplete(addon, subChoices[addon.id]))
      .map((a) => a.id)
  )

  // Calcul total
  let total = service.prixBase
  let hasDevis = false
  for (const addon of selectedAddonObjects) {
    const { prix, isDevis } = computeAddonPricing(addon, subChoices[addon.id])
    total += prix
    if (isDevis) hasDevis = true
  }

  const canStart = incompleteAddonIds.size === 0

  const handleStartProject = () => {
    if (!canStart) {
      setSubmitAttempted(true)
      // Scroll vers le 1er addon incomplet
      const firstIncompleteId = selectedAddonObjects.find((a) => incompleteAddonIds.has(a.id))?.id
      if (firstIncompleteId) {
        const el = document.getElementById(`addon-${firstIncompleteId}`)
        el?.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }
    const params = new URLSearchParams()
    params.set("formule", service.nom)
    params.set("slug", service.slug)
    params.set("total", hasDevis ? "devis" : String(total))
    const ids = Array.from(selectedAddons)
    if (ids.length > 0) params.set("addonIds", ids.join(","))
    const subOptionsStr = serializeSubChoices(subChoices, ids)
    if (subOptionsStr) params.set("subOptions", subOptionsStr)
    router.push(`/contact?${params.toString()}`)
  }

  return (
    <div className="pt-28 pb-24 layout-container overflow-x-clip">
      {/* Back */}
      <FadeUp>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/70 transition-colors mb-10 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Retour aux formules
        </Link>
      </FadeUp>

      {/* ── HEADER ── */}
      <div className="mb-8 max-w-2xl">
        <FadeUp delay={0.04}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-accent">Formule</span>
            {service.highlighted && (
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                style={{ background: "var(--lavender)", color: "var(--background)" }}
              >
                Le plus demandé
              </span>
            )}
          </div>
        </FadeUp>

        <FadeUp delay={0.09}>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-3"
            style={{ color: service.color }}
          >
            {service.nom}
          </h1>
        </FadeUp>

        {/* Tagline (rôle psychologique) */}
        <FadeUp delay={0.12}>
          <p className="text-lg sm:text-xl font-semibold text-white/85 mb-4">
            {service.tagline}
          </p>
        </FadeUp>

        {/* Délai badge */}
        <FadeUp delay={0.14}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/4 text-sm text-white/85">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span>Délai estimé : <strong className="text-white">{service.delai}</strong></span>
          </div>
        </FadeUp>
      </div>

      {/* ── PITCH IMPACTANT ── */}
      <FadeUp delay={0.18}>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Audiences (chips) */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/65 mb-3">
              Vous êtes…
            </p>
            <div className="flex flex-wrap gap-2">
              {service.audiences.map((aud) => (
                <span
                  key={aud}
                  className="px-4 py-2 rounded-full border border-white/20 bg-white/6 text-sm font-semibold text-white shadow-sm"
                >
                  {aud}
                </span>
              ))}
            </div>
          </div>

          {/* Promesse */}
          <p className="text-2xl sm:text-3xl font-black tracking-tight leading-[1.15] text-white">
            {renderRichText(service.promesse, "text-accent font-black")}
            <span style={{ color: service.color }}>
              {" "}Cette formule est faite pour vous.
            </span>
          </p>

          {/* Bénéfices clés */}
          <div className="rounded-2xl border border-white/12 bg-white/3 p-5 sm:p-6">
            <ul className="space-y-3">
              {service.benefices.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-white leading-relaxed">
                  <Check className="w-4 h-4 shrink-0 mt-1" style={{ color: service.color }} />
                  <span className="flex-1">{renderRichText(b.text, "font-bold text-white")}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Anti-alternative (no-code, WordPress, agence cher) */}
          {service.antiAlternative && (
            <div className="rounded-xl border border-rose-400/25 bg-rose-400/5 p-4 sm:p-5 flex items-start gap-3">
              <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-rose-300 mb-1">
                  {service.antiAlternative.titre}
                </p>
                <p className="text-sm text-white/85 leading-relaxed">
                  {renderRichText(service.antiAlternative.description, "font-bold text-white")}
                </p>
              </div>
            </div>
          )}

          {/* Cette formule est faite pour vous si... */}
          <div className="rounded-2xl border border-white/10 bg-white/2 p-5 sm:p-6">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3"
              style={{ color: service.color }}
            >
              Vous vous y reconnaissez ?
            </p>
            <ul className="space-y-2">
              {service.pourquoi.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/85 leading-relaxed">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-1" style={{ color: service.color }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FadeUp>

      {/* Scroll hint + note estimation */}
      <FadeUp delay={0.35}>
        <div className="flex flex-col items-center gap-1.5 pt-10 pb-3 text-white/85">
          <span className="text-[10px] tracking-[0.3em] uppercase font-semibold">Estimez votre projet</span>
          <ChevronDown size={14} className="animate-bounce" />
        </div>
        <p className="text-[12px] italic text-white/75 text-center max-w-md mx-auto pb-7">
          Estimation gratuite, aucun paiement à cette étape. Vous recevez votre devis détaillé par email.
        </p>
      </FadeUp>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10 items-start">

        {/* Left : inclus + options */}
        <div className="min-w-0">
          <div className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/6">

              {/* Ce qui est inclus */}
              <div className="p-4 sm:p-5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.35em] text-white mb-4">
                  Ce qui est inclus
                </h2>
                <StaggerList>
                  <ul className="space-y-0">
                    {service.inclus.map((item, i) => (
                      <StaggerItem key={i} index={i}>
                        <IncludedItem
                          item={item}
                          color={service.color}
                          onOpenInfo={() => setInfoDialogInclusTitre(item.titre)}
                        />
                      </StaggerItem>
                    ))}
                  </ul>
                </StaggerList>
              </div>

              {/* Options supplémentaires */}
              <div className="p-4 sm:p-5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.35em] text-white mb-1">
                  Options supplémentaires
                </h2>
                <p className="text-[11px] text-white/65 mb-4">
                  Cochez pour personnaliser votre devis.
                </p>
                <StaggerList>
                  <div className="space-y-1">
                    {visibleAddons.map((addon, i) => {
                      const selected = selectedAddons.has(addon.id)
                      const incomplete = incompleteAddonIds.has(addon.id)
                      const showError = selected && incomplete && submitAttempted
                      const { prix: addonPrix, isDevis: addonIsDevis } = computeAddonPricing(
                        addon,
                        subChoices[addon.id]
                      )
                      const priceLabel = addon.prix === null
                        ? "Devis"
                        : addonIsDevis
                          ? `${addonPrix} €+`
                          : `+${addonPrix} €`
                      return (
                        <StaggerItem key={addon.id} index={i}>
                          <div
                            id={`addon-${addon.id}`}
                            className={`rounded-lg border transition-all duration-150 ${
                              showError
                                ? "border-red-400/60 bg-red-400/5"
                                : selected
                                  ? "border-accent/35 bg-accent/6"
                                  : "border-white/6 hover:border-white/14"
                            }`}
                          >
                            {/* Ligne principale */}
                            <div className="flex items-start gap-2.5 px-3 py-2">
                              <button
                                type="button"
                                onClick={() => toggleAddon(addon.id)}
                                className="flex items-start gap-2.5 flex-1 text-left cursor-pointer min-w-0"
                              >
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                    selected ? "bg-accent border-accent" : "border-white/30"
                                  }`}
                                >
                                  {selected && <Check className="w-2.5 h-2.5 text-background" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-accent leading-tight truncate">{addon.label}</p>
                                  <p className="text-xs text-white leading-snug mt-0.5">{addon.description}</p>
                                </div>
                              </button>
                              <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                                {addon.detail && (
                                  <button
                                    type="button"
                                    onClick={(e) => openInfoDialog(addon.id, e)}
                                    className="p-0.5 rounded text-white/70 hover:text-accent transition-colors cursor-pointer"
                                    title="En savoir plus"
                                    aria-label={`Plus d'infos sur ${addon.label}`}
                                  >
                                    <Info className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <span className={`text-xs font-bold transition-colors ${
                                  selected ? "text-accent" : "text-white"
                                }`}>
                                  {priceLabel}
                                </span>
                              </div>
                            </div>

                            {/* Sous-options dépliées si addon coché */}
                            <AnimatePresence>
                              {selected && addon.subOptions && addon.subOptions.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.22, ease }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-3 pb-3 pt-1 border-t border-white/6 space-y-3">
                                    {addon.subOptions.map((sub) => (
                                      <SubOptionPanel
                                        key={sub.id}
                                        addonId={addon.id}
                                        sub={sub}
                                        selectedChoiceId={subChoices[addon.id]?.[sub.id]}
                                        onSelect={(choiceId) => setSubChoice(addon.id, sub.id, choiceId)}
                                        showError={submitAttempted && selected}
                                      />
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                          </div>
                        </StaggerItem>
                      )
                    })}
                  </div>
                </StaggerList>
                {shouldTruncate && (
                  <button
                    type="button"
                    onClick={() => setShowAllAddons((v) => !v)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/2 hover:border-white/25 hover:bg-white/4 text-xs font-semibold text-white/75 hover:text-white transition-all cursor-pointer"
                    aria-expanded={showAllAddons}
                  >
                    {showAllAddons ? (
                      <>
                        <Minus className="w-3.5 h-3.5" />
                        Voir moins
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Voir plus ({hiddenCount} option{hiddenCount > 1 ? "s" : ""})
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* WHY_TRUST */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-7 border-t border-white/8">
            {WHY_TRUST.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="text-center">
                <div className="w-9 h-9 rounded-xl border border-white/10 bg-white/4 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <p className="text-xs font-semibold text-white">{label}</p>
                <p className="text-[10px] text-white/70 mt-0.5">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — devis sticky */}
        <div className="lg:sticky lg:top-28 self-start min-w-0">
          <div className="rounded-2xl border border-white/10 bg-white/4 p-5 sm:p-6 space-y-5">
            <div>
              <p className="text-[10px] text-accent uppercase tracking-[0.3em] mb-1">Votre devis estimé</p>
              <p className="text-xl font-black text-white">Formule {service.nom}</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">Base</span>
                <span className="font-bold text-white">{service.prixBase} €</span>
              </div>
              <AnimatePresence>
                {selectedAddonObjects.map((addon) => {
                  const { prix, isDevis } = computeAddonPricing(addon, subChoices[addon.id])
                  const incomplete = incompleteAddonIds.has(addon.id)
                  return (
                    <motion.div
                      key={addon.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center justify-between text-sm py-0.5 gap-2">
                        <span className="text-white/75 truncate flex-1 text-xs">+ {addon.label}</span>
                        <span className={`font-bold shrink-0 text-xs ${incomplete ? "text-red-400" : "text-accent"}`}>
                          {addon.prix === null
                            ? "Devis"
                            : incomplete
                              ? "—"
                              : isDevis
                                ? `${prix} €+`
                                : `+${prix} €`}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            <div className="border-t border-white/8 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white/90">Total estimé</span>
                <span className="text-2xl font-black text-accent">
                  {hasDevis ? `${total} €+` : `${total} €`}
                </span>
              </div>
              <p className="text-[11px] text-white/70 mt-1">
                Hors taxes · Paiement en 2× (acompte + livraison)
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/60">
              <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
              Délai : <span className="text-white/90 font-medium">{service.delai}</span>
            </div>

            {!canStart && submitAttempted && (
              <div className="flex items-start gap-1.5 px-3 py-2 rounded-lg bg-red-400/10 border border-red-400/30 text-[11px] text-red-300">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  {incompleteAddonIds.size === 1
                    ? "Une option attend votre sélection ci-dessus."
                    : `${incompleteAddonIds.size} options attendent votre sélection ci-dessus.`}
                </span>
              </div>
            )}

            <button
              onClick={handleStartProject}
              disabled={!canStart && submitAttempted}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm transition-all ${
                !canStart && submitAttempted
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:opacity-90"
              }`}
              style={{ background: "var(--accent)", color: "var(--background)" }}
            >
              Recevoir mon devis par email
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-white/75 text-center">
              Réponse sous 24h · Estimation gratuite, aucun paiement à cette étape
            </p>
          </div>
        </div>

      </div>

      <AddonInfoDialog
        addon={infoDialogAddon}
        open={infoDialogAddonId !== null}
        onOpenChange={(open) => !open && setInfoDialogAddonId(null)}
      />

      <InfoDialog
        open={infoDialogInclusTitre !== null}
        onOpenChange={(open) => !open && setInfoDialogInclusTitre(null)}
        title={infoDialogInclus?.titre ?? ""}
        priceLabel="Inclus dans la formule"
        content={infoDialogInclus?.detail}
      />
    </div>
  )
}
