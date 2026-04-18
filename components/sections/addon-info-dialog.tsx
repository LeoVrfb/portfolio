"use client"

import { Dialog } from "@base-ui/react/dialog"
import { X } from "lucide-react"
import type { Addon } from "@/lib/services"

type AddonInfoDialogProps = {
  addon: Addon | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatPrice(addon: Addon): string {
  if (addon.prix === null) return "Sur devis"
  if (addon.subOptions && addon.subOptions.length > 0) return `À partir de ${addon.prix} €`
  return `+${addon.prix} €`
}

// Découpe le détail en paragraphes propres pour le rendre plus lisible.
// Heuristique simple : on coupe sur ". " quand la phrase suivante commence par
// "Inclus " ou "Au-delà " ou "Pour " ou un mot-clé qui démarre un nouveau bloc.
function splitDetail(detail: string): string[] {
  const sentences = detail.split(/(?<=\.) (?=[A-ZÀ-Ý])/)
  if (sentences.length <= 2) return [detail]
  const blocks: string[] = []
  let current = ""
  for (const s of sentences) {
    const isNewBlock = /^(Inclus|Au-delà|Pour|Volume|Sans panier|Avec panier|Sanity|Cas particulier|Non disponible|Compter)\b/.test(s)
    if (isNewBlock && current) {
      blocks.push(current.trim())
      current = s
    } else {
      current = current ? `${current} ${s}` : s
    }
  }
  if (current) blocks.push(current.trim())
  return blocks
}

export function AddonInfoDialog({ addon, open, onOpenChange }: AddonInfoDialogProps) {
  if (!addon) return null
  const blocks = addon.detail ? splitDetail(addon.detail) : []

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-starting-style:opacity-0 data-ending-style:opacity-0 transition-opacity duration-200" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/12 bg-background p-5 sm:p-6 shadow-2xl data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:scale-95 data-ending-style:scale-95 transition-all duration-200 max-h-[85vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-3 mb-1">
            <Dialog.Title className="text-lg font-black text-accent leading-tight">
              {addon.label}
            </Dialog.Title>
            <Dialog.Close
              aria-label="Fermer"
              className="shrink-0 -mt-1 -mr-1 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <Dialog.Description className="text-sm text-white/75 leading-relaxed mb-4">
            {addon.description}
          </Dialog.Description>

          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent/12 border border-accent/25 text-xs font-bold text-accent mb-5">
            {formatPrice(addon)}
          </div>

          {blocks.length > 0 && (
            <div className="space-y-3 border-t border-white/8 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/55">
                En détail
              </p>
              {blocks.map((block, i) => (
                <p key={i} className="text-sm text-white/85 leading-relaxed">
                  {block}
                </p>
              ))}
            </div>
          )}

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
