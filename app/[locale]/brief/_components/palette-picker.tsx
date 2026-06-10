"use client"

import { ExternalLink, Check } from "lucide-react"
import { ACCENT_SWATCHES } from "../_data"

type ThemePref = "clair" | "sombre" | "a-voir"

type PalettePickerProps = {
  theme: ThemePref | null
  onThemeChange: (t: ThemePref) => void
  selectedSwatches: string[]
  onToggleSwatch: (name: string) => void
  customColor: string
  onCustomColor: (hex: string) => void
  coolorsInput: string
  onCoolorsInput: (v: string) => void
}

const THEMES: { id: ThemePref; label: string; desc: string }[] = [
  { id: "clair", label: "Plutôt clair", desc: "Fond clair, lumineux" },
  { id: "sombre", label: "Plutôt sombre", desc: "Fond foncé, premium" },
  { id: "a-voir", label: "À voir ensemble", desc: "Je ne sais pas encore" },
]

export function PalettePicker({
  theme,
  onThemeChange,
  selectedSwatches,
  onToggleSwatch,
  customColor,
  onCustomColor,
  coolorsInput,
  onCoolorsInput,
}: PalettePickerProps) {
  const accent =
    customColor ||
    ACCENT_SWATCHES.find((s) => s.name === selectedSwatches[0])?.hex ||
    "#7adcb1"

  const previewIsLight = theme === "clair"

  return (
    <div className="space-y-6">
      {/* Thème clair / sombre */}
      <div>
        <p className="text-sm font-semibold text-white/80 mb-2.5">
          Vous imaginez votre site plutôt&nbsp;?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {THEMES.map((t) => {
            const selected = theme === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onThemeChange(t.id)}
                className={`text-left rounded-xl border p-3.5 transition-colors cursor-pointer ${
                  selected
                    ? "border-accent bg-accent/10"
                    : "border-white/12 bg-white/3 hover:border-white/25"
                }`}
              >
                <span className="block text-sm font-semibold text-white">{t.label}</span>
                <span className="block text-xs text-white/50 mt-0.5">{t.desc}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Couleurs préférées */}
      <div>
        <p className="text-sm font-semibold text-white/80 mb-1">
          Des couleurs que vous affectionnez&nbsp;?
        </p>
        <p className="text-xs text-white/45 mb-2.5">
          Cliquez sur celles qui vous parlent (plusieurs possibles, ou aucune).
        </p>
        <div className="flex flex-wrap gap-2">
          {ACCENT_SWATCHES.map((s) => {
            const selected = selectedSwatches.includes(s.name)
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => onToggleSwatch(s.name)}
                className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border text-sm transition-colors cursor-pointer ${
                  selected
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/12 text-white/65 hover:border-white/25"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full ring-1 ring-white/20 flex items-center justify-center"
                  style={{ background: s.hex }}
                >
                  {selected && <Check className="w-2.5 h-2.5 text-white drop-shadow" />}
                </span>
                {s.name}
              </button>
            )
          })}
        </div>

        {/* Couleur libre */}
        <div className="flex items-center gap-3 mt-3">
          <label className="flex items-center gap-2 text-sm text-white/65 cursor-pointer">
            <input
              type="color"
              value={customColor || "#7adcb1"}
              onChange={(e) => onCustomColor(e.target.value)}
              className="w-9 h-9 rounded-lg border border-white/15 bg-transparent cursor-pointer p-0.5"
            />
            Une couleur précise en tête&nbsp;?
          </label>
          {customColor && (
            <button
              type="button"
              onClick={() => onCustomColor("")}
              className="text-xs text-white/40 hover:text-white/70 underline cursor-pointer"
            >
              effacer
            </button>
          )}
        </div>
      </div>

      {/* coolors.co */}
      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
        <p className="text-sm text-white/75 leading-relaxed mb-3">
          Envie d'aller plus loin&nbsp;? Composez une palette complète sur{" "}
          <a
            href="https://coolors.co/generate"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-semibold inline-flex items-center gap-1 hover:underline"
          >
            coolors.co <ExternalLink className="w-3 h-3" />
          </a>{" "}
          puis collez le lien ou les codes ci-dessous. Si vous n'y arrivez pas, pas
          de souci&nbsp;: on la fera ensemble lors d'un appel.
        </p>
        <input
          type="text"
          value={coolorsInput}
          onChange={(e) => onCoolorsInput(e.target.value)}
          placeholder="https://coolors.co/…  ou  #0d1512, #7adcb1, #f9fbfb"
          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/4 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-accent/50 focus:bg-white/6 transition-colors"
        />
      </div>

      {/* Aperçu live */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 mb-2">
          Aperçu
        </p>
        <div
          className="rounded-2xl border border-white/12 overflow-hidden"
          style={{
            background: previewIsLight ? "#f7f7f5" : "#0e1614",
            color: previewIsLight ? "#1a1a1a" : "#f4f7f6",
          }}
        >
          <div className="p-6 sm:p-8">
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: accent }}
            >
              Votre marque
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">
              Un aperçu de l'ambiance
            </h3>
            <p
              className="text-sm leading-relaxed mb-5 max-w-md"
              style={{ color: previewIsLight ? "#555" : "#aab4b1" }}
            >
              Le fond, le texte et la couleur d'accent ci-dessous donnent le ton
              général. C'est une simulation, pas le design final.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: accent, color: previewIsLight ? "#fff" : "#0e1614" }}
              >
                Bouton principal
              </span>
              <span
                className="px-4 py-2 rounded-lg text-sm font-medium border"
                style={{ borderColor: accent, color: accent }}
              >
                Bouton secondaire
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
