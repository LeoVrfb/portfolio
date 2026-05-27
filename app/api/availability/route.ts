import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAvailableSlots } from "@/lib/availability"

// Endpoint GET /api/availability?date=YYYY-MM-DD
// Retourne la liste des créneaux libres pour la date demandée.
// Pas de cache : la dispo doit refléter le calendrier en temps réel.
//
// Note i18n : on ne retourne PAS de `message` dans les réponses d'erreur.
// Le client (booking-calendar.tsx) affiche son propre message via
// `t("loadError")` quand le champ est absent. Cela évite d'avoir à propager
// la locale jusque dans l'API juste pour traduire un message d'erreur.

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const QuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export async function GET(req: NextRequest) {
  try {
    const dateParam = req.nextUrl.searchParams.get("date")
    const parsed = QuerySchema.safeParse({ date: dateParam })

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, slots: [] },
        { status: 400 }
      )
    }

    const slots = await getAvailableSlots(parsed.data.date)

    return NextResponse.json({ success: true, slots })
  } catch (err) {
    console.error("[availability] error:", err)
    return NextResponse.json(
      { success: false, slots: [] },
      { status: 500 }
    )
  }
}
