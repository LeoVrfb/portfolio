"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Send, Check, Palette, Type, Heart, LayoutGrid, User } from "lucide-react"
import {
  FONT_PAIRINGS,
  ADJECTIFS,
  getFormuleMeta,
  type Formule,
} from "../_data"
import { TypoSelector } from "./typo-selector"
import { PalettePicker } from "./palette-picker"

type ThemePref = "clair" | "sombre" | "a-voir"
type LogoPref = "oui" | "non" | "a-creer"

type BriefQuestionnaireProps = {
  formule?: Formule
  clientToken?: string
}

type State = {
  nom: string
  email: string
  sitesAimes: string
  sitesPasAimes: string
  theme: ThemePref | null
  adjectifs: string[]
  sobreExpressif: number
  classiqueModerne: number
  typoId: string | null
  selectedSwatches: string[]
  customColor: string
  coolorsInput: string
  logo: LogoPref | null
  structureNotes: string
  notes: string
}

const initialState: State = {
  nom: "",
  email: "",
  sitesAimes: "",
  sitesPasAimes: "",
  theme: null,
  adjectifs: [],
  sobreExpressif: 50,
  classiqueModerne: 50,
  typoId: null,
  selectedSwatches: [],
  customColor: "",
  coolorsInput: "",
  logo: null,
  structureNotes: "",
  notes: "",
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/4 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-accent/50 focus:bg-white/6 transition-colors"

const LOGO_OPTIONS: { id: LogoPref; label: string }[] = [
  { id: "oui", label: "Oui, j'en ai un" },
  { id: "non", label: "Non, et je veux le garder simple" },
  { id: "a-creer", label: "Non, à créer" },
]

function Section({
  icon: Icon,
  index,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType
  index: number
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">
      <div className="flex items-start gap-3 mb-5">
        <span className="shrink-0 w-9 h-9 rounded-xl bg-accent/12 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-accent" />
        </span>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
            <span className="text-accent/70 mr-1.5">{index}.</span>
            {title}
          </h2>
          {subtitle && <p className="text-sm text-white/55 mt-1 leading-relaxed">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

export function BriefQuestionnaire({ formule, clientToken }: BriefQuestionnaireProps) {
  const [data, setData] = useState<State>(initialState)
  const [isPending, setIsPending] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const meta = getFormuleMeta(formule)
  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setData((d) => ({ ...d, [key]: value }))

  const toggleAdjectif = (a: string) =>
    setData((d) => ({
      ...d,
      adjectifs: d.adjectifs.includes(a)
        ? d.adjectifs.filter((x) => x !== a)
        : [...d.adjectifs, a],
    }))

  const toggleSwatch = (name: string) =>
    setData((d) => ({
      ...d,
      selectedSwatches: d.selectedSwatches.includes(name)
        ? d.selectedSwatches.filter((x) => x !== name)
        : [...d.selectedSwatches, name],
    }))

  const isValid = data.nom.trim() && data.email.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || isPending) return

    const typoLabel = FONT_PAIRINGS.find((f) => f.id === data.typoId)?.name

    setIsPending(true)
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: data.nom,
          email: data.email,
          formule: formule ? meta.label : undefined,
          clientToken,
          sitesAimes: data.sitesAimes || undefined,
          sitesPasAimes: data.sitesPasAimes || undefined,
          theme: data.theme || undefined,
          adjectifs: data.adjectifs,
          sobreExpressif: data.sobreExpressif,
          classiqueModerne: data.classiqueModerne,
          typoId: data.typoId || undefined,
          typoLabel,
          couleursPreferees: data.selectedSwatches,
          couleurCustom: data.customColor || undefined,
          coolorsInput: data.coolorsInput || undefined,
          logo: data.logo || undefined,
          structureNotes: data.structureNotes || undefined,
          notes: data.notes || undefined,
        }),
      })
      const result = await res.json()
      if (result.success) {
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        toast.error(result.message ?? "Une erreur est survenue.")
      }
    } catch {
      toast.error("Connexion impossible. Réessayez dans un instant.")
    } finally {
      setIsPending(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6">
          <Check className="w-7 h-7 text-accent" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">Merci, c'est envoyé&nbsp;!</h1>
        <p className="text-white/65 leading-relaxed">
          J'ai bien reçu votre brief design. Je reviens vers vous rapidement avec une
          première direction visuelle. Si besoin, je vous proposerai un court appel
          pour caler les derniers détails (notamment les couleurs).
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* En-tête */}
      <header className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent mb-2">
          Brief design{formule ? ` · Formule ${meta.label}` : ""}
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight mb-3">
          Parlons de votre univers visuel
        </h1>
        <p className="text-white/65 leading-relaxed">{meta.intro}</p>
        <p className="text-sm text-white/45 leading-relaxed mt-3 border-l-2 border-accent/40 pl-3">
          {meta.processNote}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 1. Inspiration */}
        <Section
          icon={Heart}
          index={1}
          title="Vos inspirations"
          subtitle="Des sites, marques ou ambiances que vous trouvez réussis (ou ratés). Mettez les URLs et dites pourquoi."
        >
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.18em] mb-1.5 block">
                Sites / marques que vous aimez
              </label>
              <textarea
                value={data.sitesAimes}
                onChange={(e) => set("sitesAimes", e.target.value)}
                rows={3}
                placeholder="Ex : apple.com — j'aime l'épure et l'espace. stripe.com — les couleurs."
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.18em] mb-1.5 block">
                Sites que vous n'aimez pas{" "}
                <span className="text-white/35 normal-case tracking-normal">(facultatif)</span>
              </label>
              <textarea
                value={data.sitesPasAimes}
                onChange={(e) => set("sitesPasAimes", e.target.value)}
                rows={2}
                placeholder="Ce que vous voulez éviter à tout prix."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </Section>

        {/* 2. Ambiance */}
        <Section
          icon={Palette}
          index={2}
          title="L'ambiance générale"
          subtitle="Quelques mots et curseurs pour cerner le ton."
        >
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-white/80 mb-2.5">
                Quels mots décrivent l'image que vous voulez renvoyer&nbsp;?
              </p>
              <div className="flex flex-wrap gap-2">
                {ADJECTIFS.map((a) => {
                  const selected = data.adjectifs.includes(a)
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAdjectif(a)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors cursor-pointer ${
                        selected
                          ? "bg-accent text-background border-accent font-semibold"
                          : "border-white/15 text-white/70 hover:text-white hover:border-white/30"
                      }`}
                    >
                      {a}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <SliderRow
                label="Style global"
                left="Sobre"
                right="Expressif"
                value={data.sobreExpressif}
                onChange={(v) => set("sobreExpressif", v)}
              />
              <SliderRow
                label="Époque"
                left="Classique"
                right="Moderne"
                value={data.classiqueModerne}
                onChange={(v) => set("classiqueModerne", v)}
              />
            </div>
          </div>
        </Section>

        {/* 3. Typo */}
        <Section
          icon={Type}
          index={3}
          title="La typographie"
          subtitle="Cliquez sur les polices : vous les voyez appliquées en direct. Choisissez celle qui vous parle le plus."
        >
          <TypoSelector value={data.typoId} onChange={(id) => set("typoId", id)} />
        </Section>

        {/* 4. Palette */}
        <Section
          icon={Palette}
          index={4}
          title="Les couleurs"
          subtitle="Pas besoin d'être expert : donnez-moi une direction, on affinera ensemble."
        >
          <PalettePicker
            theme={data.theme}
            onThemeChange={(t) => set("theme", t)}
            selectedSwatches={data.selectedSwatches}
            onToggleSwatch={toggleSwatch}
            customColor={data.customColor}
            onCustomColor={(hex) => set("customColor", hex)}
            coolorsInput={data.coolorsInput}
            onCoolorsInput={(v) => set("coolorsInput", v)}
          />
        </Section>

        {/* 5. Structure / logo */}
        <Section
          icon={LayoutGrid}
          index={5}
          title="Logo & contenu"
          subtitle="Quelques infos pratiques pour la suite."
        >
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-white/80 mb-2.5">Avez-vous un logo&nbsp;?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {LOGO_OPTIONS.map((o) => {
                  const selected = data.logo === o.id
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => set("logo", o.id)}
                      className={`text-left rounded-xl border p-3.5 text-sm font-medium transition-colors cursor-pointer ${
                        selected
                          ? "border-accent bg-accent/10 text-white"
                          : "border-white/12 bg-white/3 text-white/70 hover:border-white/25"
                      }`}
                    >
                      {o.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.18em] mb-1.5 block">
                Pages / sections souhaitées, idées de contenu{" "}
                <span className="text-white/35 normal-case tracking-normal">(facultatif)</span>
              </label>
              <textarea
                value={data.structureNotes}
                onChange={(e) => set("structureNotes", e.target.value)}
                rows={3}
                placeholder="Ex : accueil, services, galerie photos, à propos, contact…"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </Section>

        {/* 6. Coordonnées + notes */}
        <Section
          icon={User}
          index={6}
          title="Vos coordonnées"
          subtitle="Pour que je sache qui vous êtes et puisse revenir vers vous."
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.18em] mb-1.5 block">
                  Nom <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  value={data.nom}
                  onChange={(e) => set("nom", e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.18em] mb-1.5 block">
                  Email <span className="text-accent">*</span>
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.18em] mb-1.5 block">
                Autre chose à me dire&nbsp;?{" "}
                <span className="text-white/35 normal-case tracking-normal">(facultatif)</span>
              </label>
              <textarea
                value={data.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </Section>

        <button
          type="submit"
          disabled={!isValid || isPending}
          className="w-full flex items-center justify-center gap-2 py-4 px-5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer enabled:hover:opacity-90"
          style={{ background: "var(--accent)", color: "var(--background)" }}
        >
          {isPending ? (
            "Envoi en cours…"
          ) : (
            <>
              <Send className="w-4 h-4" />
              Envoyer mon brief
            </>
          )}
        </button>
        {!isValid && (
          <p className="text-xs text-white/40 text-center">
            Renseignez au minimum votre nom et votre email pour envoyer.
          </p>
        )}
      </form>
    </div>
  )
}

function SliderRow({
  label,
  left,
  right,
  value,
  onChange,
}: {
  label: string
  left: string
  right: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-white/55 uppercase tracking-[0.12em] mb-1.5">{label}</p>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent cursor-pointer"
      />
      <div className="flex justify-between text-xs text-white/50 mt-1">
        <span className={value <= 40 ? "text-white font-medium" : ""}>{left}</span>
        <span className={value >= 60 ? "text-white font-medium" : ""}>{right}</span>
      </div>
    </div>
  )
}
