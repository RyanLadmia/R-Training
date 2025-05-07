import dotenv from "dotenv";
import { z } from 'zod';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Obtenir le chemin absolu du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..');

// Vérifier si le fichier .env existe
const envPath = join(rootDir, '.env');
if (!fs.existsSync(envPath)) {
    console.error(`Le fichier .env n'existe pas dans ${rootDir}`);
    process.exit(1);
}

// Charger les variables d'environnement depuis le fichier .env
const result = dotenv.config({ path: envPath });
if (result.error) {
    console.error('Erreur lors du chargement du fichier .env:', result.error);
    process.exit(1);
}

// Définir le schéma de validation
const envSchema = z.object({
    PORT: z.coerce.number().min(1000),
    APP_URL: z.string(),
    FRONTEND_URL: z.string().url().default('http://localhost:5173'), // URL du frontend
    JWT_SECRET: z.string().min(32, "JWT_SECRET doit contenir au moins 32 caractères"),
    JWT_EXPIRES_IN: z.coerce.number().default(60 * 24),
    
    // Configuration Base de données
    DATABASE_URL: z.string().url("L'URL de la base de données doit être une URL valide"),
    
    // Configuration SMTP
    SMTP_HOST: z.string(),
    SMTP_PORT: z.coerce.number(),
    SMTP_USERNAME: z.string(),
    SMTP_PASSWORD: z.string(),
    FROM_EMAIL: z.string().email(),

    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Validation et parsing des variables d'environnement
let env;
try {
    env = envSchema.parse(process.env);
    console.log('Variables d\'environnement chargées avec succès');
} catch (err) {
    console.error("Erreur de validation des variables d'environnement:", err.errors);
    process.exit(1);
}

export default {
    ...env,
}
