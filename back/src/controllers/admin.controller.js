import adminService from "../services/admin.service.js";
import authService from "../services/auth.service.js";
import { formatDate } from "../utils/date.js";

// Récupérer le profil d'un administrateur par son ID
async function getAdminProfileById(c) {
    try {
        const userId = c.req.param('userId');
        console.log('Récupération du profil admin pour l\'utilisateur:', userId);

        // Vérifier que l'utilisateur existe et est un admin
        const user = await authService.getUserById(parseInt(userId));
        if (!user) {
            console.error("Utilisateur non trouvé", userId);
            return c.json({ error: "Utilisateur non trouvé" }, 404);
        }
        
        // Vérifier le rôle de l'utilisateur
        const userRole = await authService.getUserRole(parseInt(userId));
        console.log("Rôle de l'utilisateur:", userRole);
        
        // Formater la date de création
        const createdAt = user.createdAt ? formatDate(user.createdAt) : null;
        
        // Construire l'objet de profil
        const profile = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: userRole,
            createdAt: createdAt
        };
        
        console.log("Profil admin récupéré:", profile);
        
        return c.json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du profil admin:", error);
        return c.json({ 
            success: false,
            error: error.message || "Erreur lors de la récupération du profil"
        }, 500);
    }
}

// Mettre à jour le profil d'un administrateur
async function updateAdminProfile(c) {
    try {
        const userId = c.req.param('userId');
        const data = await c.req.json();
        
        // Vérifier que l'utilisateur existe et est un admin
        const user = await authService.getUserById(parseInt(userId));
        if (!user) {
            return c.json({ error: "Utilisateur non trouvé" }, 404);
        }
        
        // Vérifier le rôle de l'utilisateur
        const userRole = await authService.getUserRole(parseInt(userId));
        if (userRole !== 'admin') {
            return c.json({ error: "L'utilisateur n'est pas un administrateur" }, 403);
        }

        // Mettre à jour le profil
        const updatedUser = await authService.updateUser(parseInt(userId), data);
        
        return c.json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil admin:", error);
        return c.json({ 
            success: false,
            error: error.message || "Erreur lors de la mise à jour du profil"
        }, 500);
    }
}

// Récupérer tous les utilisateurs
async function getAllUsers(c) {
    try {
        const users = await adminService.getAllUsers();
        return c.json(users);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        return c.json({ 
            error: error.message || "Erreur lors de la récupération des utilisateurs"
        }, 500);
    }
}

// Récupérer un utilisateur par son ID
async function getUserById(c) {
    try {
        const userId = c.req.param('userId');
        const user = await adminService.getUserById(userId);
        return c.json(user);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        return c.json({ 
            error: error.message || "Erreur lors de la récupération de l'utilisateur"
        }, error.message.includes('non trouvé') ? 404 : 500);
    }
}

// Mettre à jour un utilisateur
async function updateUser(c) {
    try {
        const userId = c.req.param('userId');
        const userData = await c.req.json();
        const updatedUser = await adminService.updateUser(userId, userData);
        return c.json(updatedUser);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
        return c.json({ 
            error: error.message || "Erreur lors de la mise à jour de l'utilisateur"
        }, error.message.includes('non trouvé') ? 404 : 500);
    }
}

// Supprimer un utilisateur
async function deleteUser(c) {
    try {
        const userId = c.req.param('userId');
        await adminService.deleteUser(userId);
        return c.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur:", error);
        return c.json({ 
            error: error.message || "Erreur lors de la suppression de l'utilisateur"
        }, error.message.includes('non trouvé') ? 404 : 500);
    }
}

export {
    getAdminProfileById,
    updateAdminProfile,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
