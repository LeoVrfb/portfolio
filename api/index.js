import express, { urlencoded, json } from 'express';
import sendEmail from './send-email.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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
app.use(urlencoded({ extended: true }));
app.use(json());

app.post('/send-email', sendEmail);

export default app;
