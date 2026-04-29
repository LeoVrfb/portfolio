import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAvailableSlots } from "@/lib/availability"

// Endpoint GET /api/availability?date=YYYY-MM-DD
// Retourne la liste des créneaux libres pour la date demandée.
// Pas de cache : la dispo doit refléter le calendrier en temps réel.

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const QuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date attendu : YYYY-MM-DD"),
})

export async function GET(req: NextRequest) {
  try {
    const dateParam = req.nextUrl.searchParams.get("date")
    const parsed = QuerySchema.safeParse({ date: dateParam })

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Date invalide.", slots: [] },
        { status: 400 }
      )
    }

    const slots = await getAvailableSlots(parsed.data.date)

    return NextResponse.json({ success: true, slots })
  } catch (err) {
    console.error("[availability] error:", err)
    return NextResponse.json(
      {
        success: false,
        message: "Impossible de récupérer les disponibilités pour le moment.",
        slots: [],
      },
      { status: 500 }
    )
  }
}
