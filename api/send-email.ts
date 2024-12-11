import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const { name, surname, email, phone, message, siteType } = data;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: import.meta.env.EMAIL,
      pass: import.meta.env.EMAIL_PASSWORD,
    },
  });

  const contactMailOptions = {
    from: email,
    to: import.meta.env.EMAIL,
    subject: `Nouveau message de contact : ${siteType}`,
    text: `Nom: ${name} ${surname}\nEmail: ${email}\nTéléphone: ${phone}\nMessage: ${message}`,
  };

  const confirmationMailOptions = {
    from: import.meta.env.EMAIL,
    to: email,
    subject: "Merci de nous avoir contacté",
    html: `
            <p>Bonjour ${name},</p>
            <p>Merci de m'avoir contacté. Nous avons bien reçu votre message et nous reviendrons vers vous sous peu.</p>
            <p>Cordialement,</p>
            <p>Votre équipe</p>
        `,
  };

  try {
    await transporter.sendMail(contactMailOptions);
    await transporter.sendMail(confirmationMailOptions);

    return new Response(
      JSON.stringify({ message: "Email envoyé avec succès!" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Une erreur inconnue est survenue",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
