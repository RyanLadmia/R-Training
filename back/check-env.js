import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');

console.log("Chemin du fichier .env:", envPath);

try {
  // Lire le contenu du fichier .env
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Afficher le contenu
  console.log("Contenu du fichier .env:");
  console.log(envContent);
  
  // Vérifier la présence de caractères spéciaux ou de BOM
  const hexContent = Buffer.from(envContent).toString('hex');
  console.log("\nHex du début du fichier:");
  console.log(hexContent.substring(0, 50) + "...");
  
  // Créer un nouveau fichier .env.fixed sans BOM ou caractères spéciaux
  const fixedContent = envContent.replace(/^\uFEFF/, ''); // Supprime le BOM UTF-8 si présent
  
  console.log("\nProposition de nouveau contenu .env:");
  console.log(fixedContent);

  // Écrire le contenu corrigé dans un nouveau fichier
  fs.writeFileSync(path.resolve(__dirname, '.env.fixed'), fixedContent, 'utf8');
  console.log("\nFichier .env.fixed créé avec succès");
  
} catch (error) {
  console.error("Erreur lors de la lecture du fichier .env:", error);
} 