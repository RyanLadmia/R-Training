import dotenv from "dotenv";
import { z } from 'zod';

// Charge les variables d'environnement
dotenv.config();

// Définir le schéma de validation
const envSchema = z.object({
  PORT: z.coerce.number().min(1000), // Vérifie que PORT est un nombre valide et supérieur à 1000
  APP_URL: z.string(), // Vérifie que APP_URL est une chaîne de caractères
});

// Validation et parsing des variables d'environnement
let env;
try {
  env = envSchema.parse(process.env); // Valide les variables d'environnement
} catch (err) {
  console.log("err:", err); // Affiche l'erreur en cas d'échec
  process.exit(1); // Arrête l'application si la validation échoue
}

export { env }; // Exporte l'objet validé
