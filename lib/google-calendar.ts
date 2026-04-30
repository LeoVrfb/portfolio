// Helpers Google Calendar — appels REST directs (pas de lib googleapis, trop lourd).
// Le refresh token (one-shot, généré via scripts/get-refresh-token.mjs) sert à obtenir
// un access token court (1h) à chaque appel. On ne stocke jamais l'access token,
// on le redemande à chaque appel server-side : c'est rapide et ça évite de gérer un cache.

const TOKEN_URL = "https://oauth2.googleapis.com/token"
const CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3"

type GoogleEnv = {
  clientId: string
  clientSecret: string
  refreshToken: string
  calendarId: string
}

function getEnv(): GoogleEnv {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
  const calendarId = process.env.GOOGLE_CALENDAR_ID ?? "primary"

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "[google-calendar] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN manquants. Voir documentation/produit/setup-booking.md."
    )
  }

  return { clientId, clientSecret, refreshToken, calendarId }
}

// Échange le refresh token contre un access token court.
async function getAccessToken(env: GoogleEnv): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.clientId,
      client_secret: env.clientSecret,
      refresh_token: env.refreshToken,
      grant_type: "refresh_token",
    }).toString(),
    cache: "no-store",
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`[google-calendar] échec récupération access_token : ${res.status} ${err}`)
  }

  const data = (await res.json()) as { access_token?: string }
  if (!data.access_token) {
    throw new Error("[google-calendar] access_token manquant dans la réponse")
  }
  return data.access_token
}

export type BusyEvent = {
  start: Date
  end: Date
}

// Liste les events occupés sur une fenêtre temporelle donnée (UTC).
// On ne récupère que start/end pour calculer les conflits — pas besoin du reste.
export async function listBusyEvents(timeMinISO: string, timeMaxISO: string): Promise<BusyEvent[]> {
  const env = getEnv()
  const accessToken = await getAccessToken(env)

  const url = new URL(`${CALENDAR_API_BASE}/calendars/${encodeURIComponent(env.calendarId)}/events`)
  url.searchParams.set("timeMin", timeMinISO)
  url.searchParams.set("timeMax", timeMaxISO)
  url.searchParams.set("singleEvents", "true")
  url.searchParams.set("orderBy", "startTime")
  url.searchParams.set("maxResults", "250")
  // On exclut explicitement les events où l'utilisateur a refusé : ne bloquent pas la dispo.
  url.searchParams.set("showDeleted", "false")

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`[google-calendar] échec listEvents : ${res.status} ${err}`)
  }

  const data = (await res.json()) as {
    items?: Array<{
      status?: string
      transparency?: string
      start?: { dateTime?: string; date?: string }
      end?: { dateTime?: string; date?: string }
    }>
  }

  const items = data.items ?? []
  return items
    .filter((ev) => {
      // status "cancelled" ne devrait pas remonter mais on filtre par sécurité.
      if (ev.status === "cancelled") return false
      // transparency "transparent" = "Disponible" dans Google Cal, on l'ignore.
      if (ev.transparency === "transparent") return false
      return true
    })
    .map((ev) => {
      // Events all-day n'ont que `date` (YYYY-MM-DD), les autres ont `dateTime`.
      const startStr = ev.start?.dateTime ?? ev.start?.date
      const endStr = ev.end?.dateTime ?? ev.end?.date
      if (!startStr || !endStr) return null
      return { start: new Date(startStr), end: new Date(endStr) }
    })
    .filter((v): v is BusyEvent => v !== null)
}

// Source d'où le client a réservé. Sert à savoir d'où vient la demande
// dans le titre de l'event Google Calendar (ex: "Réservation projet Standard").
// "discovery" (ou undefined) = appel découverte générique (page /services ou FAB hors page service).
export type BookingSource = "essentiel" | "standard" | "premium" | "discovery"

export type CreateBookingParams = {
  // Heure de début/fin du slot (UTC ISO).
  startISO: string
  endISO: string
  // Infos du client.
  clientName: string
  clientEmail: string
  // Type d'appel choisi.
  callType: "meet" | "phone"
  // Numéro requis si callType = "phone".
  phoneNumber?: string
  // Message optionnel saisi par le client.
  message?: string
  // Page d'origine de la demande (formule visitée ou découverte générique).
  source?: BookingSource
}

const SOURCE_LABEL: Record<BookingSource, string> = {
  essentiel: "Essentiel",
  standard: "Standard",
  premium: "Premium",
  discovery: "Découverte",
}

function buildSummary(clientName: string, source?: BookingSource): string {
  if (!source || source === "discovery") {
    return `Appel découverte — ${clientName}`
  }
  return `Réservation projet ${SOURCE_LABEL[source]} — ${clientName}`
}

export type CreatedBookingEvent = {
  id: string
  htmlLink: string
  meetLink?: string
}

// Crée l'event dans Google Calendar avec :
// - le client en attendee (Google envoie automatiquement l'invit + rappels)
// - un Google Meet généré automatiquement si callType = "meet" (conferenceData)
// - sendUpdates: "all" pour que Google notifie tout le monde (organisateur + invité)
export async function createBookingEvent(params: CreateBookingParams): Promise<CreatedBookingEvent> {
  const env = getEnv()
  const accessToken = await getAccessToken(env)

  const callTypeLabel = params.callType === "meet" ? "Google Meet" : "Téléphone"
  const summary = buildSummary(params.clientName, params.source)
  const sourceLine = params.source && params.source !== "discovery"
    ? `Origine : page formule ${SOURCE_LABEL[params.source]}`
    : `Origine : appel découverte (page /services ou FAB)`

  const descriptionLines: string[] = [
    `Appel découverte de 15 min réservé via leohengebaert.fr.`,
    ``,
    `Client : ${params.clientName}`,
    `Email : ${params.clientEmail}`,
    `Mode : ${callTypeLabel}`,
    sourceLine,
  ]
  if (params.callType === "phone" && params.phoneNumber) {
    descriptionLines.push(`Téléphone : ${params.phoneNumber}`)
  }
  if (params.message) {
    descriptionLines.push("", "Message :", params.message)
  }

  const body: Record<string, unknown> = {
    summary,
    description: descriptionLines.join("\n"),
    start: { dateTime: params.startISO, timeZone: "Europe/Paris" },
    end: { dateTime: params.endISO, timeZone: "Europe/Paris" },
    attendees: [{ email: params.clientEmail, displayName: params.clientName }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 60 },
        { method: "popup", minutes: 15 },
      ],
    },
  }

  // Google Meet auto-généré uniquement si visio choisie.
  if (params.callType === "meet") {
    body.conferenceData = {
      createRequest: {
        requestId: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    }
  }

  const url = new URL(`${CALENDAR_API_BASE}/calendars/${encodeURIComponent(env.calendarId)}/events`)
  // sendUpdates=all → Google envoie l'invit au client. conferenceDataVersion=1 obligatoire pour Meet.
  url.searchParams.set("sendUpdates", "all")
  url.searchParams.set("conferenceDataVersion", "1")

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`[google-calendar] échec createEvent : ${res.status} ${err}`)
  }

  const data = (await res.json()) as {
    id: string
    htmlLink: string
    hangoutLink?: string
    conferenceData?: { entryPoints?: Array<{ entryPointType?: string; uri?: string }> }
  }

  // Le lien Meet peut arriver soit dans hangoutLink soit dans conferenceData.entryPoints.
  const meetLink =
    data.hangoutLink ??
    data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri

  return {
    id: data.id,
    htmlLink: data.htmlLink,
    meetLink,
  }
}
