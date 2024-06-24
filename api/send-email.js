import { createTransport } from 'nodemailer';

export default async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const { name, surname, email, phone, message } = req.body;

    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Email de contact
    const contactMailOptions = {
        from: email,
        to: process.env.EMAIL,
        subject: 'Nouveau message de contact',
        text: `Nom: ${name} ${surname}\nEmail: ${email}\nTéléphone: ${phone}\nMessage: ${message}`
    };

    // Email de confirmation
    const confirmationMailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Merci de nous avoir contacté',
        html: `
            <p>Bonjour ${name},</p>
            <p>Merci de m'avoir contacté. Nous avons bien reçu votre message et nous reviendrons vers vous sous peu.</p>
            <p>Cordialement,</p>
            <p>Votre équipe</p>
        `
    };

    try {
        // Envoyer l'email de contact
        await transporter.sendMail(contactMailOptions);

        // Envoyer l'email de confirmation
        await transporter.sendMail(confirmationMailOptions);

        res.status(200).json({ message: 'Email envoyé avec succès!' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        res.status(500).json({ error: error.toString() });
    }
};
