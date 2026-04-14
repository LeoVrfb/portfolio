"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, useInView, AnimatePresence } from "motion/react"
import { Check, ArrowLeft, ArrowRight, Clock, ChevronDown, Info, MessageCircle, Star, Shield, Zap, X } from "lucide-react"
import type { ServiceDetail } from "@/lib/services"

const WHY_TRUST = [
  { icon: MessageCircle, label: "Réponse sous 24h", detail: "Je réponds à chaque demande" },
  { icon: Shield, label: "Devis gratuit", detail: "Sans engagement de votre part" },
  { icon: Zap, label: "Partout en France", detail: "100% remote, visio ou email" },
  { icon: Star, label: "Code sur mesure", detail: "Zéro template, zéro WordPress" },
]

const ease = [0.16, 1, 0.3, 1] as const

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

export function ServiceConfigurator({ service }: { service: ServiceDetail }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Restaure l'état depuis l'URL quand on revient depuis /contact
  const initialAddonIds = searchParams.get("addonIds")?.split(",").filter(Boolean) ?? []
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set(initialAddonIds))
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null)

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    // Ferme l'info si on déselectionne
    setExpandedInfo(null)
  }

  const toggleInfo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedInfo((prev) => (prev === id ? null : id))
  }

  const total = service.prixBase + Array.from(selectedAddons).reduce((acc, id) => {
    const addon = service.addons.find((a) => a.id === id)
    return acc + (addon?.prix ?? 0)
  }, 0)

  const hasDevisAddon = Array.from(selectedAddons).some(
    (id) => service.addons.find((a) => a.id === id)?.prix === null
  )

  const selectedAddonObjects = Array.from(selectedAddons)
    .map((id) => service.addons.find((a) => a.id === id))
    .filter(Boolean) as NonNullable<ReturnType<typeof service.addons.find>>[]

  const handleStartProject = () => {
    const params = new URLSearchParams()
    params.set("formule", service.nom)
    params.set("slug", service.slug)
    params.set("total", hasDevisAddon ? "devis" : String(total))
    const ids = Array.from(selectedAddons)
    if (ids.length > 0) params.set("addonIds", ids.join(","))
    router.push(`/contact?${params.toString()}`)
  }

  return (
    <div className="pt-28 pb-24 layout-container">
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
      <div className="mb-2 max-w-2xl">
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
            className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-4"
            style={{ color: service.color }}
          >
            {service.nom}
          </h1>
        </FadeUp>

        <FadeUp delay={0.14}>
          <p className="text-base text-white/80 leading-relaxed mb-4">
            {service.description}
          </p>
        </FadeUp>

        {/* Délai badge */}
        <FadeUp delay={0.18}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/4 text-sm text-white/85">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span>Délai estimé : <strong className="text-white">{service.delai}</strong></span>
          </div>
        </FadeUp>

        {/* Pourquoi — carte centrée */}
        <FadeUp delay={0.23}>
          <div className="mt-6 p-5 rounded-xl border border-white/8 bg-white/2 max-w-xl mx-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-3 text-center">
              Cette formule est faite pour vous si…
            </p>
            <ul className="space-y-2">
              {service.pourquoi.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/85">
                  <ArrowRight className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </FadeUp>
      </div>

      {/* Scroll hint */}
      <FadeUp delay={0.35}>
        <div className="flex flex-col items-center gap-1.5 py-7 text-white/55">
          <span className="text-[10px] tracking-[0.3em] uppercase font-semibold">Ce qui est inclus</span>
          <ChevronDown size={14} className="animate-bounce" />
        </div>
      </FadeUp>

      {/* ── MAIN GRID ── */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">

        {/* Left : inclus + options dans un container */}
        <div>
          {/* Container partagé inclus + options */}
          <div className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden mb-8">
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/6">

              {/* Ce qui est inclus */}
              <div className="p-5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.35em] text-white mb-4">
                  Ce qui est inclus
                </h2>
                <StaggerList>
                  <ul className="space-y-0">
                    {service.inclus.map((item, i) => (
                      <StaggerItem key={i} index={i}>
                        <li className="flex items-start gap-2.5 py-2 border-b border-white/5 last:border-0">
                          <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-accent leading-snug">{item.titre}</p>
                            {item.detail && (
                              <p className="text-xs text-white/55 mt-0.5 leading-relaxed">{item.detail}</p>
                            )}
                          </div>
                        </li>
                      </StaggerItem>
                    ))}
                    {/* Options sélectionnées ajoutées dynamiquement */}
                    <AnimatePresence>
                      {selectedAddonObjects.map((addon) => (
                        <motion.li
                          key={`selected-${addon.id}`}
                          initial={{ opacity: 0, y: -6, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease }}
                          className="flex items-start gap-2.5 py-2 border-b border-white/5 last:border-0 overflow-hidden"
                        >
                          <Check
                            className="w-3.5 h-3.5 shrink-0 mt-0.5"
                            style={{ color: service.color }}
                          />
                          <div>
                            <p
                              className="text-sm font-semibold leading-snug"
                              style={{ color: service.color }}
                            >
                              {addon.label}
                            </p>
                            <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{addon.description}</p>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </StaggerList>
              </div>

              {/* Options supplémentaires */}
              <div className="p-5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.35em] text-white mb-1">
                  Options supplémentaires
                </h2>
                <p className="text-[11px] text-white/40 mb-4">
                  Cochez pour personnaliser votre devis.
                </p>
                <StaggerList>
                  <div className="space-y-1">
                    {service.addons.map((addon, i) => {
                      const selected = selectedAddons.has(addon.id)
                      const infoOpen = expandedInfo === addon.id
                      return (
                        <StaggerItem key={addon.id} index={i}>
                          <div
                            className={`rounded-lg border transition-all duration-150 ${
                              selected
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
                                    onClick={(e) => toggleInfo(addon.id, e)}
                                    className={`p-0.5 rounded transition-colors cursor-pointer ${
                                      infoOpen ? "text-accent" : "text-white/30 hover:text-white/70"
                                    }`}
                                    title="En savoir plus"
                                  >
                                    {infoOpen ? <X className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                                  </button>
                                )}
                                <span className={`text-xs font-bold transition-colors ${
                                  selected ? "text-accent" : "text-white/50"
                                }`}>
                                  {addon.prix !== null ? `+${addon.prix} €` : "Devis"}
                                </span>
                              </div>
                            </div>
                            {/* Panneau info */}
                            <AnimatePresence>
                              {infoOpen && addon.detail && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.22, ease }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-3 pb-3 pt-1 border-t border-white/6">
                                    <p className="text-xs text-white/75 leading-relaxed">{addon.detail}</p>
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
                <p className="text-[10px] text-white/40 mt-0.5">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — devis sticky */}
        <div className="lg:sticky lg:top-28 self-start">
          <div className="rounded-2xl border border-white/10 bg-white/4 p-6 space-y-5">
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
                {selectedAddonObjects.map((addon) => (
                  <motion.div
                    key={addon.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-sm py-0.5">
                      <span className="text-white/75 truncate flex-1 mr-2 text-xs">+ {addon.label}</span>
                      <span className="font-bold text-accent shrink-0 text-xs">
                        {addon.prix !== null ? `+${addon.prix} €` : "Devis"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t border-white/8 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white/90">Total estimé</span>
                <span className="text-2xl font-black text-accent">
                  {hasDevisAddon ? `${total} €+` : `${total} €`}
                </span>
              </div>
              <p className="text-[10px] text-white/40 mt-1">
                Hors taxes · Paiement en 2× (acompte + livraison)
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/60">
              <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
              Délai : <span className="text-white/90 font-medium">{service.delai}</span>
            </div>

            <button
              onClick={handleStartProject}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm cursor-pointer transition-all hover:opacity-90"
              style={{ background: "var(--accent)", color: "var(--background)" }}
            >
              Démarrer ce projet
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-white/40 text-center">
              Réponse sous 24h · Devis gratuit sans engagement
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
