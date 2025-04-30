import dotenv from "dotenv";
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire racine
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

console.log("Chargement des variables d'environnement depuis:", envPath);

// Charger les variables d'environnement en spécifiant le chemin
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("Erreur lors du chargement du fichier .env:", result.error);
  console.log("Continuons avec les valeurs par défaut...");
}

// Afficher toutes les variables d'environnement pour le débogage
console.log("Variables d'environnement dans process.env:", {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  // Autres variables...
});

// Définir le schéma de validation avec des valeurs par défaut
const envSchema = z.object({
  PORT: z.string().transform(val => parseInt(val) || 3003),
  JWT_SECRET: z.string().optional().default("default_jwt_secret_for_dev"),
  SMTP_HOST: z.string().optional().default("smtp.example.com"),
  SMTP_PORT: z.string().transform(val => parseInt(val) || 587),
  SMTP_USERNAME: z.string().optional().default("user"),
  SMTP_PASSWORD: z.string().optional().default("password"),
  APP_URL: z.string().optional().default("http://localhost:3000"),
  FROM_EMAIL: z.string().optional().default("noreply@example.com"),
  JWT_EXPIRES_IN: z.string().transform(val => parseInt(val) || 1440),
  JWT_REFRESH_EXPIRES_IN: z.string().transform(val => parseInt(val) || 10080)
});

let env;
try {
  env = envSchema.parse(process.env);
  console.log("Variables d'environnement validées avec succès");
} catch (err) {
  console.error("Erreur lors de la validation des variables d'environnement:", err.format());
  process.exit(1);
}

export default {
  env,
};
