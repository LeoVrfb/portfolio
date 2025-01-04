import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

type FormType = "contact" | "service" | "quote";

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();

  // Détermine le type de formulaire
  let formType: FormType = "contact";
  if ("projectType" in data) formType = "quote";
  else if ("service" in data) formType = "service";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: import.meta.env.EMAIL,
      pass: import.meta.env.EMAIL_PASSWORD,
    },
  });

  // Construit le contenu du mail selon le type
  const getEmailContent = () => {
    switch (formType) {
      case "quote":
        return `
Nouveau devis personnalisé

Informations client:
Nom: ${data.name} ${data.surname}
Email: ${data.email}
Téléphone: ${data.phone}
Entreprise: ${data.companyName || "Non spécifié"}

Détails du projet:
Type: ${data.projectType}
Description: ${data.projectDescription}
Public cible: ${data.targetAudience}
Fonctionnalités: ${data.features}
Préférences design: ${data.designPreferences || "Non spécifié"}

État du contenu: ${data.contentStatus}
Délai souhaité: ${data.timeline}
Budget prévu: ${data.budget}

Informations supplémentaires:
${data.additionalInfo || "Aucune"}`;

      case "service":
        return `
Nouvelle demande de service

Service: ${data.service}
Nom: ${data.name} ${data.surname}
Email: ${data.email}
Téléphone: ${data.phone}
Message: ${data.message}`;

      default:
        return `
Message de contact

Nom: ${data.name} ${data.surname}
Email: ${data.email}
Message: ${data.message}`;
    }
  };

  const getSubject = () => {
    switch (formType) {
      case "quote":
        return "Nouvelle demande de devis personnalisé";
      case "service":
        return `Nouveau message - Service: ${data.service}`;
      default:
        return "Nouveau message de contact";
    }
  };

  const getConfirmationHtml = () => {
    const greeting = `Bonjour ${data.name}`;
    switch (formType) {
      case "quote":
        return `
          <p>${greeting},</p>
          <p>Merci pour votre demande de devis personnalisé. Nous allons étudier attentivement votre projet et reviendrons vers vous avec une proposition détaillée sous 48 heures.</p>
          <p>Cordialement,</p>
          <p>Votre équipe</p>`;
      case "service":
        return `
          <p>${greeting},</p>
          <p>Merci de nous avoir contacté concernant notre service "${data.service}". Nous avons bien reçu votre message et nous reviendrons vers vous sous peu.</p>
          <p>Cordialement,</p>
          <p>Votre équipe</p>`;
      default:
        return `
          <p>${greeting},</p>
          <p>Merci pour votre message. Nous l'avons bien reçu et nous vous répondrons dans les plus brefs délais.</p>
          <p>Cordialement,</p>
          <p>Votre équipe</p>`;
    }
  };

  const mailOptions = {
    from: data.email,
    to: import.meta.env.EMAIL,
    subject: getSubject(),
    text: getEmailContent(),
  };

  const confirmationMailOptions = {
    from: import.meta.env.EMAIL,
    to: data.email,
    subject: "Merci de nous avoir contacté",
    html: getConfirmationHtml(),
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(confirmationMailOptions);

    return new Response(
      JSON.stringify({ message: "Email envoyé avec succès!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
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
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
