import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authGuard } from '../middlewares/authguard.js'
import adminService from '../services/admin.service.js'
import {
    getAdminProfileById,
    updateAdminProfile,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/admin.controller.js'

const adminRoutes = new Hono()

// Schéma de validation pour la mise à jour d'un utilisateur
const updateUserSchema = z.object({
    firstname: z.string().min(2).optional(),
    lastname: z.string().min(2).optional(),
    email: z.string().email().optional(),
    birthDate: z.string().optional().nullable(),
    phoneNumber: z.string().optional().nullable(),
    role: z.enum(['user', 'admin', 'trainer']).optional(),
    isActive: z.boolean().optional()
})

// Schéma de validation pour la mise à jour du profil admin
const updateAdminProfileSchema = z.object({
    firstname: z.string().min(2).optional(),
    lastname: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(10).optional(),
    confirmPassword: z.string().optional()
}).refine((data) => {
    if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
});

// Middleware pour vérifier le rôle admin
const adminGuard = async (c, next) => {
    const user = c.get('user');
    if (!user || user.role !== 'admin') {
        return c.json({ error: 'Accès non autorisé' }, 403);
    }
    await next();
}

// Routes protégées par authentification et rôle admin
adminRoutes.use('/admin/*', authGuard(), adminGuard);

// Routes de profil admin
adminRoutes.get("/admin/profile/:userId", getAdminProfileById);
adminRoutes.put("/admin/profile/:userId", zValidator('json', updateAdminProfileSchema), updateAdminProfile);

// Routes de gestion des utilisateurs
adminRoutes.get("/admin/users", getAllUsers);
adminRoutes.get("/admin/users/:userId", getUserById);
adminRoutes.put("/admin/users/:userId", zValidator('json', updateUserSchema), updateUser);
adminRoutes.delete("/admin/users/:userId", deleteUser);

export default adminRoutes;
