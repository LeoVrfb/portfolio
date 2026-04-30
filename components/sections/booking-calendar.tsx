"use client"

import { useCallback, useEffect, useState } from "react"
import { fr } from "date-fns/locale"
import {
  Calendar as CalendarIcon,
  Phone,
  Video,
  Loader2,
  Check,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"

import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { BOOKING_CONFIG } from "@/lib/booking-config"

// Slot tel que renvoyé par /api/availability.
type Slot = {
  startISO: string
  endISO: string
  label: string
}

type BookingResult = {
  startISO: string
  endISO: string
  htmlLink: string
  meetLink?: string
  callType: "meet" | "phone"
  phoneNumber?: string
  clientName: string
  clientEmail: string
}

type FormData = {
  name: string
  email: string
  callType: "meet" | "phone"
  phoneNumber: string
  message: string
}

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  callType: "meet",
  phoneNumber: "",
  message: "",
}

type BookingSource = "essentiel" | "standard" | "premium" | "discovery"

type BookingCalendarProps = {
  /** Couleur d'accent de la formule courante (ex: service.color). */
  accentColor?: string
  /** Page d'origine de la demande — sert au tracking dans Google Calendar. */
  source?: BookingSource
  /** Mode compact : pas de header, pas de wrapper section (utilisé dans une modale). */
  compact?: boolean
}

export function BookingCalendar({
  accentColor = "var(--accent)",
  source,
  compact = false,
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [slots, setSlots] = useState<Slot[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)

  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null)

  const fetchSlots = useCallback(async (dateStr: string, signal?: AbortSignal) => {
    setIsLoadingSlots(true)
    setSlotsError(null)
    try {
      const res = await fetch(`/api/availability?date=${dateStr}`, { signal })
      const data = (await res.json()) as { success: boolean; slots: Slot[]; message?: string }
      if (!data.success) {
        setSlots([])
        setSlotsError(data.message ?? "Impossible de récupérer les disponibilités.")
        return
      }
      setSlots(data.slots)
    } catch (err) {
      if ((err as Error).name === "AbortError") return
      setSlots([])
      setSlotsError("Impossible de récupérer les disponibilités.")
    } finally {
      setIsLoadingSlots(false)
    }
  }, [])

  // Recharge les slots à chaque changement de date (avec abort pour éviter les race).
  useEffect(() => {
    if (!selectedDate) return
    const controller = new AbortController()
    fetchSlots(toYMD(selectedDate), controller.signal)
    return () => controller.abort()
  }, [selectedDate, fetchSlots])

  // Range de dates autorisées pour le DayPicker.
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + BOOKING_CONFIG.bookingWindowDays)

  // Jours non-travaillés = tous ceux qui ne sont pas dans workingDays.
  const disabledDays: number[] = []
  for (let i = 0; i < 7; i++) {
    if (!BOOKING_CONFIG.workingDays.includes(i as (typeof BOOKING_CONFIG.workingDays)[number])) {
      disabledDays.push(i)
    }
  }

  // Soumet la réservation au backend.
  const handleSubmitBooking = async (formData: FormData) => {
    if (!selectedSlot) return null

    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startISO: selectedSlot.startISO,
        endISO: selectedSlot.endISO,
        name: formData.name,
        email: formData.email,
        callType: formData.callType,
        phoneNumber: formData.callType === "phone" ? formData.phoneNumber : undefined,
        message: formData.message || undefined,
        source,
      }),
    })

    const data = (await res.json()) as {
      success: boolean
      message?: string
      event?: { id: string; htmlLink: string; meetLink?: string }
    }

    if (!data.success || !data.event) {
      // Cas spécial 409 : slot pris entre temps → on refresh la liste.
      if (res.status === 409 && selectedDate) {
        toast.error(data.message ?? "Ce créneau vient d'être pris.")
        setSelectedSlot(null)
        fetchSlots(toYMD(selectedDate))
        return null
      }
      toast.error(data.message ?? "Impossible de créer la réservation.")
      return null
    }

    return {
      startISO: selectedSlot.startISO,
      endISO: selectedSlot.endISO,
      htmlLink: data.event.htmlLink,
      meetLink: data.event.meetLink,
      callType: formData.callType,
      phoneNumber: formData.phoneNumber,
      clientName: formData.name,
      clientEmail: formData.email,
    } satisfies BookingResult
  }

  const calendarContent = (
    <div
      className={
        compact
          ? "w-full rounded-2xl border bg-white/2 overflow-hidden"
          : "max-w-2xl mx-auto rounded-2xl border bg-white/2 overflow-hidden"
      }
      style={{
        borderColor: `color-mix(in oklab, ${accentColor} 18%, transparent)`,
        background: `linear-gradient(135deg, color-mix(in oklab, ${accentColor} 5%, transparent), transparent)`,
      }}
    >
        {/* Calendar — pleine largeur, cellules généreuses pour le clic mobile + desktop */}
        <div
          className="p-4 sm:p-6 border-b"
          style={{ borderColor: `color-mix(in oklab, ${accentColor} 14%, transparent)` }}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={fr}
            weekStartsOn={1}
            showOutsideDays={false}
            disabled={[{ before: today }, { after: maxDate }, { dayOfWeek: disabledDays }]}
            className="bg-transparent p-0 w-full [--cell-size:--spacing(11)] sm:[--cell-size:--spacing(12)]"
            classNames={{ root: "w-full" }}
          />
        </div>

        {/* Slots — grille responsive en dessous */}
        <div className="p-4 sm:p-6 min-h-[180px] flex flex-col">
          {!selectedDate ? (
            <EmptyState
              icon={<CalendarIcon className="w-5 h-5" style={{ color: accentColor }} />}
              title="Choisissez une date"
              description="Sélectionnez un jour dans le calendrier pour voir les créneaux disponibles."
            />
          ) : isLoadingSlots ? (
            <LoadingState accentColor={accentColor} />
          ) : slotsError ? (
            <ErrorState message={slotsError} accentColor={accentColor} />
          ) : slots.length === 0 ? (
            <EmptyState
              icon={<AlertCircle className="w-5 h-5" style={{ color: accentColor }} />}
              title="Aucun créneau disponible"
              description="Tout est pris ce jour-là. Choisissez une autre date dans le calendrier."
            />
          ) : (
            <SlotsList
              slots={slots}
              selectedDate={selectedDate}
              accentColor={accentColor}
              onSelect={setSelectedSlot}
            />
          )}
        </div>
      </div>
  )

  const dialogs = (
    <>
      {/* Dialog formulaire — ouvert quand un slot est cliqué */}
      <BookingFormDialog
        open={selectedSlot !== null}
        onClose={() => setSelectedSlot(null)}
        slot={selectedSlot}
        accentColor={accentColor}
        onSubmit={async (formData) => {
          const result = await handleSubmitBooking(formData)
          if (result) {
            setSelectedSlot(null)
            // Petit délai pour que la 1re modale ait le temps de se fermer avant d'ouvrir la 2e.
            setTimeout(() => setBookingResult(result), 150)
          }
        }}
      />

      {/* Dialog confirmation — ouvert après succès */}
      <BookingConfirmationDialog
        result={bookingResult}
        accentColor={accentColor}
        onClose={() => {
          setBookingResult(null)
          // Reset complet : la date et les slots sont rechargés à la prochaine sélection.
          setSelectedDate(undefined)
          setSlots([])
        }}
      />
    </>
  )

  // Mode compact : pas de section, pas de header — juste le calendrier + dialogs.
  // Utilisé dans une modale (BookingDialog).
  if (compact) {
    return (
      <>
        {calendarContent}
        {dialogs}
      </>
    )
  }

  // Mode plein : section autonome avec header (utilisé sur les pages /services/[slug]).
  return (
    <section id="booking" className="scroll-mt-24 py-16 sm:py-20">
      <div className="text-center mb-8 sm:mb-10">
        <span
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] mb-3"
          style={{ color: accentColor }}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          Appel découverte · 15 min · offert
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
          On en parle <span style={{ color: accentColor }}>de vive voix</span> ?
        </h2>
        <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto leading-relaxed">
          15 minutes pour comprendre votre projet, répondre à vos questions et voir si on peut
          travailler ensemble. Aucun engagement.
        </p>
        <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/55">
          <span className="inline-flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5" />
            Google Meet
          </span>
          <span className="text-white/25">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            ou par téléphone
          </span>
          <span className="text-white/25">·</span>
          <span>Lun–Ven · 12h–20h</span>
        </div>
      </div>

      {calendarContent}
      {dialogs}
    </section>
  )
}

// ─── Sous-composants : états de la colonne droite ──────────────────────────

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
      <div className="w-11 h-11 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-white mb-1.5">{title}</h3>
      <p className="text-xs text-white/55 max-w-[260px] leading-relaxed">{description}</p>
    </div>
  )
}

function LoadingState({ accentColor }: { accentColor: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin" style={{ color: accentColor }} />
      <p className="text-xs text-white/50 mt-3">Chargement des créneaux…</p>
    </div>
  )
}

function ErrorState({ message, accentColor }: { message: string; accentColor: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
      <AlertCircle className="w-6 h-6 mb-3" style={{ color: accentColor }} />
      <p className="text-sm text-white/75 max-w-[280px]">{message}</p>
    </div>
  )
}

function SlotsList({
  slots,
  selectedDate,
  accentColor,
  onSelect,
}: {
  slots: Slot[]
  selectedDate: Date
  accentColor: string
  onSelect: (slot: Slot) => void
}) {
  return (
    <>
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45 mb-4">
        {formatDateLong(selectedDate)} · {slots.length} créneaux
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.startISO}
            type="button"
            onClick={() => onSelect(slot)}
            className="group relative px-3 py-2.5 rounded-lg border text-sm font-semibold text-white/85 hover:text-white transition-all cursor-pointer"
            style={{
              borderColor: `color-mix(in oklab, ${accentColor} 20%, transparent)`,
              background: `color-mix(in oklab, ${accentColor} 4%, transparent)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accentColor
              e.currentTarget.style.background = `color-mix(in oklab, ${accentColor} 12%, transparent)`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `color-mix(in oklab, ${accentColor} 20%, transparent)`
              e.currentTarget.style.background = `color-mix(in oklab, ${accentColor} 4%, transparent)`
            }}
          >
            {slot.label}
          </button>
        ))}
      </div>
    </>
  )
}

// ─── Dialog : formulaire de réservation ─────────────────────────────────────

function BookingFormDialog({
  open,
  onClose,
  slot,
  accentColor,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  slot: Slot | null
  accentColor: string
  onSubmit: (data: FormData) => Promise<void>
}) {
  const [data, setData] = useState<FormData>(INITIAL_FORM)
  const [isPending, setIsPending] = useState(false)

  // Reset à la fermeture (sans useEffect, via callback open).
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setTimeout(() => {
        setData(INITIAL_FORM)
        setIsPending(false)
      }, 200)
      onClose()
    }
  }

  const isValid =
    data.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) &&
    (data.callType === "meet" || data.phoneNumber.trim().length >= 6)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || isPending) return
    setIsPending(true)
    try {
      await onSubmit(data)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg p-0 overflow-hidden bg-[#0d1411] border-white/10">
        <div
          className="px-6 pt-6 pb-5 border-b"
          style={{ borderColor: `color-mix(in oklab, ${accentColor} 18%, transparent)` }}
        >
          <DialogHeader>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2"
              style={{ color: accentColor }}
            >
              Confirmer le créneau
            </p>
            <DialogTitle className="text-white text-xl font-black tracking-tight">
              {slot ? formatSlotHeading(slot) : ""}
            </DialogTitle>
            <DialogDescription className="text-white/55 text-sm mt-1">
              Appel découverte de 15 min, sans engagement.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="booking-name" className="text-white/85 text-xs font-semibold">
              Votre nom
            </Label>
            <Input
              id="booking-name"
              required
              minLength={2}
              maxLength={80}
              value={data.name}
              onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
              placeholder="Léo Martin"
              className="bg-white/4 border-white/10 text-white placeholder:text-white/30 focus-visible:border-white/30"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="booking-email" className="text-white/85 text-xs font-semibold">
              Email
            </Label>
            <Input
              id="booking-email"
              type="email"
              required
              value={data.email}
              onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
              placeholder="vous@exemple.com"
              className="bg-white/4 border-white/10 text-white placeholder:text-white/30 focus-visible:border-white/30"
            />
            <p className="text-[11px] text-white/40 mt-1">
              L&apos;invitation Google Calendar sera envoyée à cette adresse.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-white/85 text-xs font-semibold">Comment préférez-vous échanger ?</Label>
            <RadioGroup
              value={data.callType}
              onValueChange={(value) =>
                setData((d) => ({ ...d, callType: value as "meet" | "phone" }))
              }
              className="grid grid-cols-2 gap-2"
            >
              <CallTypeOption
                value="meet"
                checked={data.callType === "meet"}
                accentColor={accentColor}
                icon={<Video className="w-4 h-4" />}
                label="Google Meet"
                hint="Lien généré automatiquement"
              />
              <CallTypeOption
                value="phone"
                checked={data.callType === "phone"}
                accentColor={accentColor}
                icon={<Phone className="w-4 h-4" />}
                label="Téléphone"
                hint="Je vous appelle"
              />
            </RadioGroup>
          </div>

          {data.callType === "phone" && (
            <div className="space-y-1.5">
              <Label htmlFor="booking-phone" className="text-white/85 text-xs font-semibold">
                Votre numéro
              </Label>
              <Input
                id="booking-phone"
                type="tel"
                required
                value={data.phoneNumber}
                onChange={(e) => setData((d) => ({ ...d, phoneNumber: e.target.value }))}
                placeholder="06 12 34 56 78"
                className="bg-white/4 border-white/10 text-white placeholder:text-white/30 focus-visible:border-white/30"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="booking-message" className="text-white/85 text-xs font-semibold">
              Message <span className="text-white/40 font-normal">(optionnel)</span>
            </Label>
            <Textarea
              id="booking-message"
              maxLength={1000}
              rows={3}
              value={data.message}
              onChange={(e) => setData((d) => ({ ...d, message: e.target.value }))}
              placeholder="Quelques mots sur votre projet pour gagner du temps…"
              className="bg-white/4 border-white/10 text-white placeholder:text-white/30 focus-visible:border-white/30 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || isPending}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{ background: accentColor, color: "var(--background)" }}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Réservation en cours…
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Confirmer le rendez-vous
              </>
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CallTypeOption({
  value,
  checked,
  accentColor,
  icon,
  label,
  hint,
}: {
  value: string
  checked: boolean
  accentColor: string
  icon: React.ReactNode
  label: string
  hint: string
}) {
  return (
    <Label
      htmlFor={`booking-call-${value}`}
      className="relative flex flex-col items-start gap-1 px-3 py-2.5 rounded-lg border cursor-pointer transition-all"
      style={{
        borderColor: checked
          ? accentColor
          : `color-mix(in oklab, ${accentColor} 12%, transparent)`,
        background: checked
          ? `color-mix(in oklab, ${accentColor} 12%, transparent)`
          : "transparent",
      }}
    >
      <RadioGroupItem id={`booking-call-${value}`} value={value} className="sr-only" />
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <span style={{ color: checked ? accentColor : "rgba(255,255,255,0.55)" }}>{icon}</span>
        {label}
      </div>
      <span className="text-[11px] text-white/45">{hint}</span>
    </Label>
  )
}

// ─── Dialog : confirmation après réservation ──────────────────────────────

function BookingConfirmationDialog({
  result,
  accentColor,
  onClose,
}: {
  result: BookingResult | null
  accentColor: string
  onClose: () => void
}) {
  const handleOpenChange = (next: boolean) => {
    if (!next) onClose()
  }

  if (!result) return null

  return (
    <Dialog open={result !== null} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-[#0d1411] border-white/10">
        <div
          className="px-6 pt-7 pb-5 text-center border-b"
          style={{ borderColor: `color-mix(in oklab, ${accentColor} 18%, transparent)` }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: `color-mix(in oklab, ${accentColor} 18%, transparent)`,
              border: `1px solid color-mix(in oklab, ${accentColor} 35%, transparent)`,
            }}
          >
            <Check className="w-5 h-5" style={{ color: accentColor }} />
          </div>
          <DialogHeader className="items-center">
            <DialogTitle className="text-white text-xl font-black tracking-tight">
              Rendez-vous confirmé
            </DialogTitle>
            <DialogDescription className="text-white/55 text-sm mt-1.5">
              Je vous attends le <strong className="text-white/85">{formatDateLongFromISO(result.startISO)}</strong> à{" "}
              <strong className="text-white/85">{formatTimeFromISO(result.startISO)}</strong>.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-white/70">
              {result.callType === "meet" ? (
                <>
                  <Video className="w-4 h-4" style={{ color: accentColor }} />
                  <span>Google Meet — lien dans l&apos;invitation</span>
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" style={{ color: accentColor }} />
                  <span>Je vous appelle au {result.phoneNumber}</span>
                </>
              )}
            </div>
            <div className="flex items-start gap-2 text-white/55 text-xs leading-relaxed">
              <CalendarIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                Vous allez recevoir l&apos;invitation Google Calendar à{" "}
                <span className="text-white/75">{result.clientEmail}</span> ainsi qu&apos;un email
                de confirmation de ma part.
              </span>
            </div>
          </div>

          <a
            href={result.htmlLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 cursor-pointer"
            style={{ background: accentColor, color: "var(--background)" }}
          >
            Ajouter à mon calendrier
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full text-xs text-white/50 hover:text-white/80 transition-colors cursor-pointer py-1"
          >
            Fermer
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Helpers de formatage (côté client, fuseau Europe/Paris implicite) ────

function toYMD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function formatDateLong(d: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d)
}

function formatDateLongFromISO(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: BOOKING_CONFIG.timezone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(iso))
}

function formatTimeFromISO(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: BOOKING_CONFIG.timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso))
}

function formatSlotHeading(slot: Slot): string {
  const date = formatDateLongFromISO(slot.startISO)
  const start = formatTimeFromISO(slot.startISO)
  const end = formatTimeFromISO(slot.endISO)
  return `${capitalize(date)} · ${start}–${end}`
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
