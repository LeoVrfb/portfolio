import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { renderBriefEmail, type BriefEmailPayload } from "@/lib/emails/brief-email"

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BriefEmailPayload

    if (!body.nom || !body.email) {
      return NextResponse.json(
        { success: false, message: "Nom et email requis." },
        { status: 400 }
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    // BRIEF_TO_EMAIL optionnel : sinon on retombe sur la même boîte que le contact.
    const to = process.env.BRIEF_TO_EMAIL || process.env.CONTACT_TO_EMAIL
    const from = process.env.CONTACT_FROM_EMAIL

    if (!apiKey || !to || !from) {
      // Fallback dev : on log au lieu de planter, comme pour /api/contact.
      console.warn(
        "[brief] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL non configurés — email non envoyé."
      )
      console.log("[brief] Submission:", body)
      return NextResponse.json({ success: true, message: "Brief reçu (mode dev)." })
    }

    const { subject, html, text } = renderBriefEmail(body)

    const resend = new Resend(apiKey)
    const result = await resend.emails.send({
      from,
      to,
      replyTo: body.email,
      subject,
      html,
      text,
    })

    if (result.error) {
      console.error("[brief] Resend error:", result.error)
      return NextResponse.json(
        { success: false, message: "Impossible d'envoyer le brief pour le moment." },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true, message: "Brief envoyé." })
  } catch (err) {
    console.error("[brief] Unexpected error:", err)
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    )
  }
}
