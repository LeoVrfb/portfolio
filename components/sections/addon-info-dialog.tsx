"use client"

import { Dialog } from "@base-ui/react/dialog"
import { X, Check } from "lucide-react"
import type { Addon, DetailContent } from "@/lib/services"

// ─── Helper : parsing **mot** → spans avec accent (vert) ────────────────────
// Format minimaliste : "Texte avec **mots clés** dedans"
// Les segments encadrés par ** ** sont rendus en couleur d'accent.
function renderRichText(text: string, accentClassName = "text-accent font-semibold"): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={i} className={accentClassName}>
          {part.slice(2, -2)}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

// ─── Sous-composants ─────────────────────────────────────────────────────────

function DetailSectionBlock({
  title,
  intro,
  bullets,
  badge,
  variant = "default",
}: {
  title?: string
  intro?: string
  bullets?: { text: string; badge?: string }[]
  badge?: string
  variant?: "default" | "accent"
}) {
  const containerClass =
    variant === "accent"
      ? "rounded-xl border border-accent/25 bg-accent/8 p-3.5"
      : "rounded-xl border border-white/10 bg-white/3 p-3.5"

  return (
    <div className={containerClass}>
      {title && (
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-white">
            {title}
          </p>
          {badge && (
            <span className="shrink-0 px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-[10px] font-bold text-accent">
              {badge}
            </span>
          )}
        </div>
      )}
      {intro && (
        <p className="text-xs text-white/75 leading-relaxed mb-2">
          {renderRichText(intro)}
        </p>
      )}
      {bullets && bullets.length > 0 && (
        <ul className="space-y-1.5">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-white/85 leading-relaxed">
              <Check className="w-3 h-3 text-accent shrink-0 mt-0.5" />
              <span className="flex-1">{renderRichText(bullet.text)}</span>
              {bullet.badge && (
                <span className="shrink-0 px-1.5 py-0.5 rounded bg-white/8 text-[10px] font-bold text-white/85">
                  {bullet.badge}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DetailContentRender({ content }: { content: DetailContent }) {
  return (
    <div className="space-y-3">
      {content.intro && (
        <p className="text-sm text-white/85 leading-relaxed">
          {renderRichText(content.intro)}
        </p>
      )}
      {content.sections && content.sections.length > 0 && (
        <div className="space-y-2.5">
          {content.sections.map((section, i) => (
            <DetailSectionBlock
              key={i}
              title={section.title}
              intro={section.intro}
              bullets={section.bullets}
              badge={section.badge}
              variant={section.variant}
            />
          ))}
        </div>
      )}
      {content.note && (
        <p className="text-[11px] text-white/55 leading-relaxed italic border-l-2 border-white/15 pl-3">
          {renderRichText(content.note)}
        </p>
      )}
    </div>
  )
}

// ─── Dialog générique ────────────────────────────────────────────────────────
// Utilisé pour afficher les détails d'un addon OU d'un item "inclus".
// Pour un addon : on passe `priceLabel`. Pour un inclus : on omet `priceLabel`.

type InfoDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  priceLabel?: string
  content?: DetailContent
}

export function InfoDialog({
  open,
  onOpenChange,
  title,
  description,
  priceLabel,
  content,
}: InfoDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-starting-style:opacity-0 data-ending-style:opacity-0 transition-opacity duration-200" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md sm:max-w-lg lg:max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/12 bg-background p-5 sm:p-6 lg:p-7 shadow-2xl data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:scale-95 data-ending-style:scale-95 transition-all duration-200 max-h-[85vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-3 mb-1">
            <Dialog.Title className="text-lg font-black text-accent leading-tight">
              {title}
            </Dialog.Title>
            <Dialog.Close
              aria-label="Fermer"
              className="shrink-0 -mt-1 -mr-1 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          {description && (
            <Dialog.Description className="text-sm text-white/75 leading-relaxed mb-4">
              {description}
            </Dialog.Description>
          )}

          {priceLabel && (
            <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent/12 border border-accent/25 text-xs font-bold text-accent mb-4">
              {priceLabel}
            </div>
          )}

          {content && <DetailContentRender content={content} />}

          <div className="mt-6 flex justify-end">
            <Dialog.Close className="px-4 py-2 rounded-lg text-sm font-semibold text-white/80 bg-white/6 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
              Fermer
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// ─── Wrapper rétrocompatible pour les addons ─────────────────────────────────

function formatAddonPrice(addon: Addon): string {
  if (addon.prix === null) return "Sur devis"
  if (addon.subOptions && addon.subOptions.length > 0) return `À partir de ${addon.prix} €`
  return `+${addon.prix} €`
}

type AddonInfoDialogProps = {
  addon: Addon | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddonInfoDialog({ addon, open, onOpenChange }: AddonInfoDialogProps) {
  if (!addon) return null
  return (
    <InfoDialog
      open={open}
      onOpenChange={onOpenChange}
      title={addon.label}
      description={addon.description}
      priceLabel={formatAddonPrice(addon)}
      content={addon.detail}
    />
  )
}
