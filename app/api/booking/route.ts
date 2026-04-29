import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { isSlotStillAvailable } from "@/lib/availability"
import { createBookingEvent } from "@/lib/google-calendar"
import { renderBookingConfirmationEmail } from "@/lib/emails/booking-confirmation-email"

// Endpoint POST /api/booking
// Crée un event Google Calendar (avec Meet auto si besoin), envoie un email
// de confirmation au client via Resend, et notifie Google Calendar qui envoie
// l'invitation officielle (sendUpdates: "all" côté createBookingEvent).

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const BookingSchema = z
  .object({
    startISO: z.string().datetime({ message: "startISO invalide" }),
    endISO: z.string().datetime({ message: "endISO invalide" }),
    name: z
      .string()
      .trim()
      .min(2, "Nom trop court")
      .max(80, "Nom trop long"),
    email: z.string().trim().toLowerCase().email("Email invalide"),
    callType: z.enum(["meet", "phone"]),
    phoneNumber: z
      .string()
      .trim()
      .max(30, "Numéro trop long")
      .optional(),
    message: z
      .string()
      .trim()
      .max(1000, "Message trop long")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.callType === "phone") {
        return Boolean(data.phoneNumber && data.phoneNumber.length >= 6)
      }
      return true
    },
    { message: "Numéro requis pour un appel téléphonique", path: ["phoneNumber"] }
  )

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const parsed = BookingSchema.safeParse(json)

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]
      return NextResponse.json(
        { success: false, message: firstIssue?.message ?? "Données invalides." },
        { status: 400 }
      )
    }

    const { startISO, endISO, name, email, callType, phoneNumber, message } = parsed.data

    // Anti race condition : un visiteur a peut-être réservé le même slot entre-temps.
    const stillAvailable = await isSlotStillAvailable(startISO, endISO)
    if (!stillAvailable) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Ce créneau vient d'être pris ou n'est plus disponible. Choisissez-en un autre.",
        },
        { status: 409 }
      )
    }

    // Crée l'event Google Calendar + envoie l'invitation au client.
    const event = await createBookingEvent({
      startISO,
      endISO,
      clientName: name,
      clientEmail: email,
      callType,
      phoneNumber,
      message,
    })

    // Email custom Resend par-dessus l'invit Google (branding propre).
    await sendConfirmationEmail({
      clientName: name,
      clientEmail: email,
      startISO,
      endISO,
      callType,
      phoneNumber,
      message,
      meetLink: event.meetLink,
      eventLink: event.htmlLink,
    })

    return NextResponse.json({
      success: true,
      message: "Rendez-vous confirmé.",
      event: {
        id: event.id,
        htmlLink: event.htmlLink,
        meetLink: event.meetLink,
      },
    })
  } catch (err) {
    console.error("[booking] error:", err)
    return NextResponse.json(
      { success: false, message: "Impossible de créer la réservation pour le moment." },
      { status: 500 }
    )
  }
}

type SendConfirmationParams = {
  clientName: string
  clientEmail: string
  startISO: string
  endISO: string
  callType: "meet" | "phone"
  phoneNumber?: string
  message?: string
  meetLink?: string
  eventLink: string
}

// Email Resend en plus de l'invit Google (en mode dev sans clé : log only).
async function sendConfirmationEmail(params: SendConfirmationParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL

  const dateLabel = formatDateLabel(params.startISO)
  const timeLabel = formatTimeRange(params.startISO, params.endISO)

  if (!apiKey || !from) {
    console.warn(
      "[booking] RESEND_API_KEY / CONTACT_FROM_EMAIL non configurés — email de confirmation non envoyé."
    )
    console.log("[booking] Confirmation prévue pour:", { ...params, dateLabel, timeLabel })
    return
  }

  const { subject, html, text } = renderBookingConfirmationEmail({
    clientName: params.clientName,
    clientEmail: params.clientEmail,
    dateLabel,
    timeLabel,
    callType: params.callType,
    meetLink: params.meetLink,
    phoneNumber: params.phoneNumber,
    message: params.message,
    eventLink: params.eventLink,
  })

  const resend = new Resend(apiKey)
  const result = await resend.emails.send({
    from,
    to: params.clientEmail,
    replyTo: process.env.CONTACT_TO_EMAIL,
    subject,
    html,
    text,
  })

  if (result.error) {
    // On loggue mais on ne bloque pas la réservation : l'event Google est déjà créé,
    // l'invit Google native est partie, donc le rdv est valide même sans le mail Resend.
    console.error("[booking] Resend error:", result.error)
  }
}

const TZ = "Europe/Paris"

// "vendredi 15 mai 2026" — formaté en français dans le fuseau Paris.
function formatDateLabel(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso))
}

// "14:30 — 14:45 (Europe/Paris)"
function formatTimeRange(startISO: string, endISO: string): string {
  const fmt = new Intl.DateTimeFormat("fr-FR", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  return `${fmt.format(new Date(startISO))} — ${fmt.format(new Date(endISO))} (heure de Paris)`
}
