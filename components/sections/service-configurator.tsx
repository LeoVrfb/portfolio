"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, ArrowLeft, ArrowRight, Clock, MessageCircle, Star, Shield, Zap } from "lucide-react"
import { toast } from "sonner"
import type { ServiceDetail } from "@/lib/services"

const WHY_TRUST = [
  { icon: MessageCircle, label: "Réponse sous 24h", detail: "Je réponds à chaque demande" },
  { icon: Shield, label: "Devis gratuit", detail: "Sans engagement de votre part" },
  { icon: Zap, label: "Partout en France", detail: "100% remote, visio ou email" },
  { icon: Star, label: "Code sur mesure", detail: "Zéro template, zéro WordPress" },
]

export function ServiceConfigurator({ service }: { service: ServiceDetail }) {
  const router = useRouter()
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())
  const [step, setStep] = useState<"config" | "form">("config")
  const [form, setForm] = useState({ nom: "", email: "", tel: "", activite: "", message: "" })
  const [isPending, setIsPending] = useState(false)

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const total = service.prixBase + Array.from(selectedAddons).reduce((acc, id) => {
    const addon = service.addons.find((a) => a.id === id)
    return acc + (addon?.prix ?? 0)
  }, 0)

  const hasDevisAddon = Array.from(selectedAddons).some(
    (id) => service.addons.find((a) => a.id === id)?.prix === null
  )

  const selectedAddonLabels = Array.from(selectedAddons)
    .map((id) => service.addons.find((a) => a.id === id)?.label)
    .filter(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.nom,
          email: form.email,
          activite: form.activite,
          formule: service.nom,
          addons: selectedAddonLabels,
          totalEstime: hasDevisAddon ? "Sur devis" : `${total} €`,
          message: form.message,
        }),
      })
      const result = await res.json()
      if (result.success) {
        toast.success("Demande envoyée ! Je reviens vers vous sous 24h.")
        router.push("/")
      } else {
        toast.error(result.message ?? "Une erreur est survenue.")
      }
    } catch {
      toast.error("Erreur réseau. Réessayez dans quelques instants.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="pt-32 pb-24 layout-container">
      {/* Back */}
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Retour aux formules
      </Link>

      <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-start">
        {/* Left */}
        <div>
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-accent">
                Formule
              </span>
              {service.highlighted && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  style={{ background: "var(--lavender)", color: "var(--background)" }}>
                  Le plus demandé
                </span>
              )}
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.95] mb-4">
              {service.nom}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              {service.description}
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Délai : {service.delai}</span>
            </div>
          </div>

          {/* Pourquoi */}
          <div className="mb-10">
            <h2 className="text-sm font-bold text-foreground mb-4">
              Cette formule est faite pour vous si…
            </h2>
            <ul className="space-y-2.5">
              {service.pourquoi.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Inclus — liste simple et lisible */}
          <div className="mb-10">
            <h2 className="text-sm font-bold text-foreground mb-5">
              Ce qui est inclus
            </h2>
            <ul className="divide-y divide-border">
              {service.inclus.map((item, i) => (
                <li key={i} className="flex items-start gap-3 py-3">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-snug">{item.titre}</p>
                    {item.detail && (
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.detail}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Add-ons */}
          <div className="mb-10">
            <h2 className="text-sm font-bold text-foreground mb-1">
              Options supplémentaires
            </h2>
            <p className="text-xs text-muted-foreground mb-5">
              Ajoutez ce dont vous avez besoin — le total se met à jour en temps réel.
            </p>
            <div className="space-y-2">
              {service.addons.map((addon) => {
                const selected = selectedAddons.has(addon.id)
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-150 cursor-pointer text-left group ${
                      selected
                        ? "border-accent/40 bg-accent/8"
                        : "border-border bg-card hover:bg-muted/50"
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all ${
                        selected ? "bg-accent border-accent" : "border-muted-foreground/30"
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-accent-foreground" />}
                    </div>

                    {/* Label + desc */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-tight">
                        {addon.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{addon.description}</p>
                    </div>

                    {/* Prix */}
                    <span className={`text-sm font-bold shrink-0 transition-colors ${
                      selected ? "text-accent" : "text-foreground/50"
                    }`}>
                      {addon.prix !== null ? `+${addon.prix} €` : "Sur devis"}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pourquoi me faire confiance */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-y border-border">
            {WHY_TRUST.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="text-center">
                <div className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <p className="text-xs font-semibold text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — sticky recap + CTA */}
        <div className="lg:sticky lg:top-32">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
            {/* Titre */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] mb-1">Votre devis</p>
              <p className="text-2xl font-black text-foreground">Formule {service.nom}</p>
            </div>

            {/* Ligne base */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Base — Formule {service.nom}</span>
                <span className="font-semibold text-foreground">{service.prixBase} €</span>
              </div>

              {/* Addons sélectionnés */}
              {Array.from(selectedAddons).map((id) => {
                const addon = service.addons.find((a) => a.id === id)
                if (!addon) return null
                return (
                  <div key={id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate flex-1 mr-2">+ {addon.label}</span>
                    <span className="font-semibold text-accent shrink-0">
                      {addon.prix !== null ? `+${addon.prix} €` : "Sur devis"}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Total estimé</span>
                <span className="text-xl font-black text-accent">
                  {hasDevisAddon ? `${total} € + devis` : `${total} €`}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Hors taxes · Paiement en 2× (acompte + livraison)
              </p>
            </div>

            {/* Délai */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              Délai estimé : {service.delai}
            </div>

            {/* CTA */}
            <button
              onClick={() => setStep("form")}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm cursor-pointer transition-all"
              style={{
                background: service.highlighted ? "var(--accent)" : "hsl(163 24% 54% / 0.15)",
                color: service.highlighted ? "var(--accent-foreground)" : "var(--accent)",
                border: service.highlighted ? "none" : "1px solid hsl(163 24% 54% / 0.3)",
              }}
            >
              Démarrer ce projet
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Form inline */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="mt-4 rounded-2xl border border-accent/30 bg-card p-6 space-y-4">
              <p className="text-sm font-bold text-foreground">Vos informations</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Nom *</label>
                  <input
                    required
                    value={form.nom}
                    onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                    placeholder="Votre nom"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="votre@email.com"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Votre activité</label>
                <input
                  value={form.activite}
                  onChange={(e) => setForm((f) => ({ ...f, activite: e.target.value }))}
                  placeholder="Ex: restaurant, artisan, consultant…"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Décrivez votre projet, vos délais, vos questions…"
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!form.nom || !form.email || isPending}
                className="w-full py-3 rounded-xl bg-accent text-accent-foreground text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity cursor-pointer"
              >
                {isPending ? "Envoi…" : "Envoyer ma demande"}
              </button>

              <p className="text-[10px] text-muted-foreground text-center">
                Réponse sous 24h · Devis gratuit sans engagement
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
