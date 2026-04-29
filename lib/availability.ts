// Calcul des créneaux disponibles pour une date donnée.
// Combine la config (jours/heures travaillés) avec les events Google Calendar
// pour retourner les slots libres.

import { addMinutes, isBefore, isEqual, parseISO } from "date-fns"
import { fromZonedTime, toZonedTime } from "date-fns-tz"
import { BOOKING_CONFIG } from "./booking-config"
import { listBusyEvents, type BusyEvent } from "./google-calendar"

export type Slot = {
  // ISO UTC du début du slot — ce qu'on renvoie au front et au create event.
  startISO: string
  endISO: string
  // Heure formatée pour l'affichage (HH:mm en Europe/Paris).
  label: string
}

// Vérifie qu'une date YYYY-MM-DD est dans la fenêtre de réservation autorisée.
export function isDateInBookingWindow(dateStr: string, now: Date = new Date()): boolean {
  // On compare en jour calendaire dans le fuseau Europe/Paris (sinon décalage minuit).
  const today = toZonedTime(now, BOOKING_CONFIG.timezone)
  const todayStr = formatDateYMD(today)

  if (dateStr < todayStr) return false

  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + BOOKING_CONFIG.bookingWindowDays)
  const maxStr = formatDateYMD(maxDate)
  return dateStr <= maxStr
}

// Renvoie YYYY-MM-DD à partir d'une Date (en lisant les composants tels quels — pas de conversion TZ).
function formatDateYMD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

// Vérifie qu'une date YYYY-MM-DD tombe sur un jour travaillé (Lun-Ven dans la config).
export function isWorkingDay(dateStr: string): boolean {
  // On parse la date à midi UTC pour éviter les problèmes de décalage.
  const d = parseISO(`${dateStr}T12:00:00Z`)
  return BOOKING_CONFIG.workingDays.includes(
    d.getUTCDay() as (typeof BOOKING_CONFIG.workingDays)[number]
  )
}

// Génère tous les slots théoriques d'une journée (avant filtrage des occupations).
function generateDaySlots(dateStr: string): Slot[] {
  const { workingHours, slotDurationMin, timezone } = BOOKING_CONFIG
  const [startH, startM] = workingHours.start.split(":").map(Number)
  const [endH, endM] = workingHours.end.split(":").map(Number)

  // On construit le start/end de la plage en heure locale Paris, puis on convertit en UTC.
  const dayStartLocal = new Date(`${dateStr}T${pad(startH)}:${pad(startM)}:00`)
  const dayEndLocal = new Date(`${dateStr}T${pad(endH)}:${pad(endM)}:00`)
  const dayStartUTC = fromZonedTime(dayStartLocal, timezone)
  const dayEndUTC = fromZonedTime(dayEndLocal, timezone)

  const slots: Slot[] = []
  let cursor = dayStartUTC
  while (true) {
    const slotEnd = addMinutes(cursor, slotDurationMin)
    if (slotEnd.getTime() > dayEndUTC.getTime()) break

    slots.push({
      startISO: cursor.toISOString(),
      endISO: slotEnd.toISOString(),
      label: formatTimeInZone(cursor, timezone),
    })
    cursor = slotEnd
  }

  return slots
}

function pad(n: number): string {
  return String(n).padStart(2, "0")
}

// Formate une Date en HH:mm dans le fuseau donné.
function formatTimeInZone(date: Date, timezone: string): string {
  const fmt = new Intl.DateTimeFormat("fr-FR", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  return fmt.format(date)
}

// Vérifie si un slot [start, end[ chevauche un event occupé.
function overlapsBusy(slotStart: Date, slotEnd: Date, busy: BusyEvent[]): boolean {
  return busy.some((b) => {
    // Chevauchement classique : start < busy.end ET end > busy.start
    return isBefore(slotStart, b.end) && isBefore(b.start, slotEnd)
  })
}

// Filtre les slots qui sont trop proches de maintenant (préavis minimum).
function isAfterMinNotice(slotStart: Date, now: Date): boolean {
  const minStart = addMinutes(now, BOOKING_CONFIG.minNoticeMin)
  return isBefore(minStart, slotStart) || isEqual(minStart, slotStart)
}

// Point d'entrée principal : retourne les slots libres pour une date YYYY-MM-DD.
export async function getAvailableSlots(dateStr: string, now: Date = new Date()): Promise<Slot[]> {
  if (!isDateInBookingWindow(dateStr, now)) return []
  if (!isWorkingDay(dateStr)) return []

  const allSlots = generateDaySlots(dateStr)
  if (allSlots.length === 0) return []

  // Fenêtre de fetch = du 1er slot au dernier slot de la journée.
  const timeMin = allSlots[0].startISO
  const timeMax = allSlots[allSlots.length - 1].endISO

  const busy = await listBusyEvents(timeMin, timeMax)

  return allSlots.filter((slot) => {
    const start = parseISO(slot.startISO)
    const end = parseISO(slot.endISO)
    if (!isAfterMinNotice(start, now)) return false
    if (overlapsBusy(start, end, busy)) return false
    return true
  })
}

// Vérifie si un slot précis (startISO/endISO) est encore libre.
// Utilisé côté server avant de créer l'event (anti race condition / anti slot expiré).
export async function isSlotStillAvailable(
  startISO: string,
  endISO: string,
  now: Date = new Date()
): Promise<boolean> {
  const start = parseISO(startISO)
  const end = parseISO(endISO)

  if (!isAfterMinNotice(start, now)) return false

  // Vérifie que start/end correspondent bien à un slot théorique du jour
  // (sécurité : empêche un client de bidouiller le payload pour réserver hors horaires).
  const dateStr = toYMDInZone(start, BOOKING_CONFIG.timezone)
  if (!isWorkingDay(dateStr)) return false
  if (!isDateInBookingWindow(dateStr, now)) return false

  const allSlots = generateDaySlots(dateStr)
  const matches = allSlots.some((s) => s.startISO === startISO && s.endISO === endISO)
  if (!matches) return false

  const busy = await listBusyEvents(startISO, endISO)
  return !overlapsBusy(start, end, busy)
}

// Renvoie YYYY-MM-DD pour une Date donnée, dans un fuseau donné.
function toYMDInZone(date: Date, timezone: string): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  return fmt.format(date)
}
