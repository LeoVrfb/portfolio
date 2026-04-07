import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom, email, activite, formule, message } = body;

    if (!nom || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Champs requis manquants." },
        { status: 400 }
      );
    }

    // TODO: intégrer Resend quand le domaine est vérifié
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ ... });

    console.log("Contact form submission:", { nom, email, activite, formule, message });

    return NextResponse.json({ success: true, message: "Message envoyé." });
  } catch {
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}
