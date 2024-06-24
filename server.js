import express, { urlencoded, json } from 'express';
import sendEmail from './api/send-email.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS
app.use(cors({
    origin: 'http://localhost:4321', // Autorisez l'origine du client
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Méthodes autorisées
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers autorisés
    optionsSuccessStatus: 200 // Pour les navigateurs anciens qui ne prennent pas en charge les statuts 204
}));


// Middleware pour parser les données POST
app.use(urlencoded({ extended: true }));
app.use(json());

// Route pour gérer les requêtes POST du formulaire
app.post('/send-email', sendEmail);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
