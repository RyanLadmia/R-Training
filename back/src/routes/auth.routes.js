import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authGuard } from '../middlewares/auth.middleware.js'

const authRoutes = new Hono()

// Inscription
authRoutes.post(
    "/register", zValidator('json',
        z.object({
            firstName: z.string().min(2),
            lastName: z.string().min(2),
            email: z.string().email("Adresse e-mail invalide"),
            password: z.string()
                .min(10, "Le mot de passe doit contenir au moins 10 caractères")
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre."),
            confirmPassword: z.string()
        }).refine((data) => data.password === data.confirmPassword, {
            message: "Les mots de passe ne correspondent pas",
            path: ["confirmPassword"] // L'erreur s'affiche sur le champs confirmPassword
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
authGuardRoutes.post(
    "/send-verification-email",
    zValidator('json',
        z.object({
            email: z.string().email("Adresse e-mail invalide."),
        })
    ),
    sendVerificationEmail
);

authRoutes.get(
    "verifit/:token",
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
            firstName: z.string().min(2).optional(),
            lastName: z.string().min(2).optional(),
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

export default authRoutes;



