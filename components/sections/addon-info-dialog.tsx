"use client"

import { Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Addon, DetailContent } from "@/lib/services"

// Parsing minimaliste **mot** → segments en couleur d'accent.
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md sm:max-w-lg lg:max-w-2xl max-h-[85vh] overflow-y-auto p-5 sm:p-6 lg:p-7 bg-background border-white/12 ring-0"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-accent leading-tight pr-8">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-white/75 leading-relaxed">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {priceLabel && (
          <div className="inline-flex items-center self-start px-2.5 py-1 rounded-full bg-accent/12 border border-accent/25 text-xs font-bold text-accent -mt-2">
            {priceLabel}
          </div>
        )}

        {content && <DetailContentRender content={content} />}
      </DialogContent>
    </Dialog>
  )
}

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
