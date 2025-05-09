import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authGuard } from '../middlewares/authguard.js'
import {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail
} from '../controllers/auth.controller.js'

const authRoutes = new Hono()

// Inscription
authRoutes.post(
    "/register", 
    zValidator('json',
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
                .regex(/^(0[67][0-9]{8}|\+33[67][0-9]{8})$/, "Format de numéro invalide")
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

// Mot de passe oublié
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

// Vérification de l'email
authRoutes.get(
    "/verify-email/:token",
    verifyEmail
);

// Renvoyer l'email de vérification
authRoutes.post(
    "/resend-verification",
    zValidator('json',
        z.object({
            email: z.string().email("Adresse e-mail invalide")
        })
    ),
    resendVerificationEmail
);

export default authRoutes;



