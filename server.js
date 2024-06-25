import express, { urlencoded, json } from 'express';
import sendEmail from './api/send-email.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS
const allowedOrigins = ['http://localhost:4321', 'https://portfolio-leo-vrfb.vercel.app'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const origin = req.headers.origin;
if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
}

if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
}


// Middleware pour parser les données POST
app.use(urlencoded({ extended: true }));
app.use(json());

// Route pour gérer les requêtes POST du formulaire
app.post('/send-email', sendEmail);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
