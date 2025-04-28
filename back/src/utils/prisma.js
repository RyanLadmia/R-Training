import { PrismaClient } from '@prisma/client';

// Création d'une instance Prisma partagée à travers l'application
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Fonction qui sera exécutée lors de l'arrêt de l'application
async function disconnectPrisma() {
  await prisma.$disconnect();
  console.log('Disconnected from database');
}

// Gestion de la fermeture propre des connexions
process.on('SIGINT', disconnectPrisma);
process.on('SIGTERM', disconnectPrisma);

export default prisma; 