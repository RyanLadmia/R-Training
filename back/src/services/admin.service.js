import { prisma } from '../config/prisma.js';
import { formatDate, formatDateTime } from '../utils/date.js';


// Partie gestion du profil de l'admin :

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

// Partie gestion des utilisateurs :

// Récupérer tous les utilisateurs
async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            include: {
                role: {
                    include: {
                        role: true
                    }
                }
            }
        });

        return users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return {
                ...userWithoutPassword,
                role: user.role?.role?.name || 'user',
                createdAt: formatDateTime(user.createdAt),
                updatedAt: formatDateTime(user.updatedAt),
                birthDate: user.birthDate ? formatDate(user.birthDate) : null
            };
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        throw error;
    }
}

// Récupérer un utilisateur par son ID
async function getUserById(userId) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
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

        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            role: user.role?.role?.name || 'user',
            createdAt: formatDateTime(user.createdAt),
            updatedAt: formatDateTime(user.updatedAt),
            birthDate: user.birthDate ? formatDate(user.birthDate) : null
        };
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        throw error;
    }
}

// Mettre à jour un utilisateur
async function updateUser(userId, userData) {
    try {
        // Vérifier si l'utilisateur existe
        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });

        if (!existingUser) {
            throw new Error('Utilisateur non trouvé');
        }

        // Préparer les données de mise à jour
        const updateData = {
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            birthDate: userData.birthDate ? new Date(userData.birthDate) : null,
            phoneNumber: userData.phoneNumber,
            isActive: userData.isActive
        };

        // Si le rôle doit être modifié
        if (userData.role) {
            // Récupérer l'ID du rôle
            const roleRecord = await prisma.role.findFirst({
                where: { name: userData.role }
            });

            if (!roleRecord) {
                throw new Error('Rôle invalide');
            }

            // Mettre à jour ou créer l'association UserRole
            await prisma.userRole.upsert({
                where: {
                    userId: parseInt(userId)
                },
                update: {
                    roleId: roleRecord.id
                },
                create: {
                    userId: parseInt(userId),
                    roleId: roleRecord.id
                }
            });
        }

        // Mettre à jour l'utilisateur
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: updateData,
            include: {
                role: {
                    include: {
                        role: true
                    }
                }
            }
        });

        const { password, ...userWithoutPassword } = updatedUser;
        return {
            ...userWithoutPassword,
            role: updatedUser.role?.role?.name || 'user',
            createdAt: formatDateTime(updatedUser.createdAt),
            updatedAt: formatDateTime(updatedUser.updatedAt),
            birthDate: updatedUser.birthDate ? formatDate(updatedUser.birthDate) : null
        };
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        throw error;
    }
}

// Supprimer un utilisateur
async function deleteUser(userId) {
    try {
        // Vérifier si l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });

        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        // Supprimer d'abord les relations (UserRole)
        await prisma.userRole.deleteMany({
            where: { userId: parseInt(userId) }
        });

        // Supprimer l'utilisateur
        await prisma.user.delete({
            where: { id: parseInt(userId) }
        });

        return { message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        throw error;
    }
}

export default {
    getAdminProfile,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};