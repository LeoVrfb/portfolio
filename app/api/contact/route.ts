import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { renderContactEmail } from "@/lib/emails/contact-email"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nom, email, telephone, activite, formule, message, addons, totalEstime } = body

    if (!nom || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Champs requis manquants." },
        { status: 400 }
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.CONTACT_TO_EMAIL
    const from = process.env.CONTACT_FROM_EMAIL

    if (!apiKey || !to || !from) {
      // Fallback dev : on log au lieu de planter, comme ça le formulaire reste utilisable en local sans config.
      console.warn(
        "[contact] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL non configurés — email non envoyé. Voir documentation/produit/setup-emails.md."
      )
      console.log("[contact] Submission:", {
        nom,
        email,
        telephone,
        activite,
        formule,
        message,
        addons,
        totalEstime,
      })
      return NextResponse.json({ success: true, message: "Message reçu (mode dev)." })
    }

    const { subject, html, text } = renderContactEmail({
      nom,
      email,
      telephone,
      formule,
      activite,
      message,
      addons,
      totalEstime,
    })

    const resend = new Resend(apiKey)
    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      html,
      text,
    })

    if (result.error) {
      console.error("[contact] Resend error:", result.error)
      return NextResponse.json(
        { success: false, message: "Impossible d'envoyer l'email pour le moment." },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true, message: "Message envoyé." })
  } catch (err) {
    console.error("[contact] Unexpected error:", err)
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    )
  }
}
