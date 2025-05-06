// Importation du client Prisma généré directement
import { PrismaClient } from '../../generated/prisma/index.js';

// Création d'une instance Prisma partagée à travers l'application
const prisma = new PrismaClient({
  log: ['error'],
});

// Fonction qui sera exécutée lors de l'arrêt de l'application
async function disconnectPrisma() {
  await prisma.$disconnect();
  console.log('Disconnected from database');
}

// Gestion de la fermeture propre des connexions
process.on('SIGINT', disconnectPrisma);
process.on('SIGTERM', disconnectPrisma);

export { prisma }; 