import { prisma } from '../config/prisma.js';
import { formatDate, formatDateTime } from '../utils/date.js';

// Récupérer le profil d'un admin par son ID
async function getAdminProfile(userId) {
    try {
        // Récupérer l'utilisateur avec le rôle admin
        const user = await prisma.user.findUnique({
            where: { 
                id: parseInt(userId) 
            },
            include: {
                role: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        // Vérifier si l'utilisateur a le rôle admin
        const isAdmin = user.role?.role?.name === 'admin';
        if (!isAdmin) {
            throw new Error('L\'utilisateur n\'est pas un administrateur');
        }

        // Supprimer le mot de passe des données retournées
        const { password, ...userWithoutPassword } = user;

        return {
            ...userWithoutPassword,
            createdAt: formatDateTime(user.createdAt),
            updatedAt: formatDateTime(user.updatedAt),
            birthDate: user.birthDate ? formatDate(user.birthDate) : null
        };
    } catch (error) {
        console.error('Erreur lors de la récupération du profil admin:', error);
        throw error;
    }
}

export default {
    getAdminProfile
};