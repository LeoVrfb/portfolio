import express, { urlencoded, json } from 'express';
import sendEmail from './send-email.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS
const allowedOrigins = ['https://portfolio-leo-vrfb.vercel.app', 'http://localhost:4321'];

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

// Middleware pour parser les données POST
app.use(urlencoded({ extended: true }));
app.use(json());

// Route pour gérer les requêtes POST du formulaire
app.post('/send-email', sendEmail);

// Exporter le serveur pour Vercel
export default app;
