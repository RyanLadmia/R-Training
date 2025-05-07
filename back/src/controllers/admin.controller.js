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

export {
    getAdminProfileById
};
