"use client"

import { FONT_PAIRINGS } from "../_data"

type TypoSelectorProps = {
  value: string | null
  onChange: (id: string) => void
  /** Exemple de texte adapté à l'activité du client (titre du mockup). */
  sampleHeading?: string
  sampleBody?: string
}

export function TypoSelector({
  value,
  onChange,
  sampleHeading = "Votre titre accrocheur",
  sampleBody = "Un paragraphe d'exemple pour voir le rendu du texte courant : c'est la police que liront vos visiteurs au quotidien, sur toutes vos pages.",
}: TypoSelectorProps) {
  const active = FONT_PAIRINGS.find((f) => f.id === value) ?? null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FONT_PAIRINGS.map((f) => {
          const selected = f.id === value
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onChange(f.id)}
              style={{ fontFamily: f.headingVar }}
              className={`px-3.5 py-1.5 text-sm rounded-full border transition-colors cursor-pointer ${
                selected
                  ? "bg-accent text-background border-accent font-semibold"
                  : "border-white/15 text-white/70 hover:text-white hover:border-white/30"
              }`}
            >
              {f.name}
            </button>
          )
        })}
      </div>

      {active && (
        <div className="rounded-2xl border border-white/12 bg-white/4 p-6 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent mb-4">
            {active.vibe}
          </p>
          <h3
            className="text-3xl sm:text-4xl font-bold leading-tight text-white mb-3"
            style={{ fontFamily: active.headingVar }}
          >
            {sampleHeading}
          </h3>
          <p
            className="text-base leading-relaxed text-white/70 max-w-prose"
            style={{ fontFamily: active.bodyVar }}
          >
            {sampleBody}
          </p>
        </div>
      )}

      {!active && (
        <p className="text-sm text-white/45 italic">
          Cliquez sur une police pour la voir appliquée en direct.
        </p>
      )}
    </div>
  )
}
