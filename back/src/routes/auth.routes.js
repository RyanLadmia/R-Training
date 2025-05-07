import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authGuard } from '../middlewares/authguard.js'
import authService from '../services/auth.service.js'
import {
    register,
    login,
    logout,
    forgotPassword,
    getUserProfile,
    sendVerificationEmail,
    resetPassword,
    verifyEmail as verifyUserEmail,
    updateUserProfile,
    getCurrentUser
} from '../controllers/auth.controller.js'

const authRoutes = new Hono()

// Inscription
authRoutes.post(
    "/register", zValidator('json',
        z.object({
            firstname: z.string().min(2),
            lastname: z.string().min(2),
            email: z.string().email("Adresse e-mail invalide"),
            password: z.string()
                .min(10, "Le mot de passe doit contenir au moins 10 caractères")
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre."),
            confirmPassword: z.string(),
            birthDate: z.string()
                .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (AAAA-MM-JJ)")
                .optional(),
            phoneNumber: z.string()
                .regex(/^(0[67][0-9]{8}|\+33[67][0-9]{8})$/, "Le numéro doit commencer par 06/07 ou +336/+337 et contenir 9 chiffres après le préfixe")
                .optional()
              
        }).refine((data) => data.password === data.confirmPassword, {
            message: "Les mots de passe ne correspondent pas",
            path: ["confirmPassword"]
        })
    ),
    register
);

// Connexion
authRoutes.post(
    "/login",
    zValidator('json',
        z.object({
            email: z.string().email("Adresse e-mail invalide"),
            password: z.string().min(10, "Le mot de passe doit contenir au moins 10 caractères")
        })
    ),
    login
);

// Déconnexion
authRoutes.post(
    "/logout",
    authGuard(),
    logout
);

// Récupérer l'utilisateur courant
authRoutes.get(
    "/me",
    authGuard(),
    async (c) => {
        try {
            const user = c.get('user');
            if (!user) {
                return c.json({ error: "Utilisateur non authentifié" }, 401);
            }

            // Récupérer le rôle de l'utilisateur
            const userRole = await authService.getUserRole(user.id);

            // Ne pas renvoyer le mot de passe
            const userData = { ...user };
            delete userData.password;

            return c.json({ 
                user: {
                    ...userData,
                    role: userRole
                }
            });
        } catch (error) {
            console.error("Erreur dans la route /me:", error);
            return c.json({ 
                error: "Erreur lors de la récupération des informations utilisateur",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined 
            }, 500);
        }
    }
);

authRoutes.post(
    "/forgot-password",
    zValidator('json',
        z.object({
            email: z.string().email("Adresse e-mail invalide")
        })
    ),
    forgotPassword
);

// Réinitialisation du mot de passe
authRoutes.post(
    "/reset-password",
    zValidator('json',
        z.object({
            token: z.string(),
            password: z.string()
                .min(10, "Le mot de passe doit contenir au moins 10 caractères")
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre."),
            confirmPassword: z.string()
        }).refine((data) => data.password === data.confirmPassword, {
            message: "Les mots de passe ne correspondent pas",
            path: ["confirmPassword"]
        })
    ),
    resetPassword
);

// Envoi d'un email de vérification
authRoutes.post(
    "/send-verification-email",
    authGuard(),
    zValidator('json',
        z.object({
            email: z.string().email("Adresse e-mail invalide."),
        })
    ),
    sendVerificationEmail
);

authRoutes.get(
    "/verify-email/:token",
    verifyUserEmail
);

// Récupération du profil de l'utilisateur
authRoutes.get(
    "/user/:id",
    authGuard(),
    getUserProfile
);

// Mise à jour du profil de l'utilisateur
authRoutes.put(
    "/user/:id",
    authGuard(),
    zValidator('json',
        z.object({
            firstname: z.string().min(2).optional(),
            lastname: z.string().min(2).optional(),
            email: z.string().email("Adresse e-mail invalide").optional(),
            newpassword: z.string().min(10, "Le mot de passe doit contenir au moins 10 caractères")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre.")
            .optional(),
            confirmPassword: z.string().optional()
        }).refine((data) => data.newpassword === data.confirmPassword, {
            message: "Les mots de passe ne correspondent pas",
            path: ["confirmPassword"]
        })
    ),
    updateUserProfile
);

// Récupération du profil de l'utilisateur courant
authRoutes.get(
    "/user/profile",
    authGuard(),
    (c) => {
        const user = c.get('user');
        if (!user) {
            return c.json({ error: "Utilisateur non authentifié" }, 401);
        }
        
        // Ne pas renvoyer le mot de passe
        const userData = { ...user };
        delete userData.password;
        
        return c.json({ 
            user: userData
        });
    }
);

export default authRoutes;



