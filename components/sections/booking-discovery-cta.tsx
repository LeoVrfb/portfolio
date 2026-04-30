"use client"

import { useState } from "react"
import { ArrowRight, Calendar, X } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BookingCalendar } from "@/components/sections/booking-calendar"
import { Calendar as CalendarIcon, Phone, Video } from "lucide-react"

type BookingSource = "essentiel" | "standard" | "premium" | "discovery"

type CommonProps = {
  /** Source de la demande (sert au tracking dans Google Calendar). */
  source?: BookingSource
  /** Titre du dialog modal. */
  dialogTitle?: string
  /** Sous-titre du dialog modal. */
  dialogDescription?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Modale partagée — extraite pour éviter la duplication entre Card et Button.
// ─────────────────────────────────────────────────────────────────────────────
function BookingModal({
  open,
  onOpenChange,
  source,
  title,
  description,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  source: BookingSource
  title: string
  description: string
}) {
  const accentColor = "var(--accent)"
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-background border-white/12 ring-0"
      >
        <div
          className="sticky top-0 z-10 px-5 sm:px-7 pt-6 sm:pt-7 pb-4 border-b backdrop-blur-md bg-background/95"
          style={{ borderColor: `color-mix(in oklab, ${accentColor} 18%, transparent)` }}
        >
          {/* Croix de fermeture custom — au-dessus du header sticky */}
          <DialogClose
            render={
              <button
                type="button"
                aria-label="Fermer"
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
              />
            }
          >
            <X className="w-4 h-4" />
          </DialogClose>

          <DialogHeader>
            <span
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] mb-2"
              style={{ color: accentColor }}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Appel découverte · 15 min · offert
            </span>
            <DialogTitle className="text-white text-xl sm:text-2xl font-black tracking-tight pr-12">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm text-white/65 leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-white/55">
            <span className="inline-flex items-center gap-1.5">
              <Video className="w-3 h-3" />
              Google Meet
            </span>
            <span className="text-white/25">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              ou par téléphone
            </span>
            <span className="text-white/25">·</span>
            <span>Lun–Ven · 12h–20h</span>
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-6 sm:pb-7 pt-4">
          <BookingCalendar accentColor={accentColor} source={source} compact />
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Variante 1 — Grande card (utilisée entre les formules et la FAQ)
// ─────────────────────────────────────────────────────────────────────────────
export function BookingDiscoveryCard({
  source = "discovery",
  dialogTitle = "Réservons un appel",
  dialogDescription = "15 minutes pour faire connaissance et comprendre votre projet. Sans engagement, sans pression.",
}: CommonProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex flex-col h-full w-full text-left p-5 sm:p-6 rounded-2xl border border-accent/30 bg-accent/4 hover:border-accent/55 hover:bg-accent/8 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
            <Calendar size={16} className="text-accent" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
            Vous voulez d&apos;abord discuter&nbsp;?
          </p>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug mb-2">
          Réservez un appel gratuit de 15 minutes
        </h3>
        <p className="text-sm text-white/70 leading-relaxed mb-5 flex-1">
          On fait connaissance, je comprends votre projet, et je vous dis exactement ce qui correspond à votre situation. Sans engagement.
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-black text-xs font-bold transition-all group-hover:gap-2.5">
            Réserver un appel
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="text-[10px] text-white/45 italic">
            Selon mes prochaines disponibilités
          </span>
        </div>
      </button>
      <BookingModal
        open={open}
        onOpenChange={setOpen}
        source={source}
        title={dialogTitle}
        description={dialogDescription}
      />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Variante 2 — CTA final compact (bouton arrondi accent)
// ─────────────────────────────────────────────────────────────────────────────
export function BookingDiscoveryButton({
  source = "discovery",
  dialogTitle = "Réservons un appel",
  dialogDescription = "15 minutes pour vous orienter vers la formule qui colle à votre projet.",
  label = "Réserver un appel 15 min",
}: CommonProps & { label?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-black text-sm font-bold rounded-full hover:bg-accent/90 transition-colors cursor-pointer"
      >
        <Calendar size={15} />
        {label}
        <ArrowRight size={15} />
      </button>
      <BookingModal
        open={open}
        onOpenChange={setOpen}
        source={source}
        title={dialogTitle}
        description={dialogDescription}
      />
    </>
  )
}
