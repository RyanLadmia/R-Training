import { verify } from "hono/jwt";
import { createMiddleware } from "hono/factory";
import env from "../config/env.js";
import authService from "../services/auth.service.js";
import jwt from 'jsonwebtoken';
import { generateAuthTokens } from "../utils/jwt.js";

// Fonction pour vérifier si un token est proche de son expiration
function isTokenNearExpiration(decodedToken, thresholdMinutes = 10) {
    if (!decodedToken.exp) return false;
    
    const expirationTime = decodedToken.exp * 1000; // Convertir en millisecondes
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;
    
    // Si le token expire dans moins de X minutes
    return timeUntilExpiration < thresholdMinutes * 60 * 1000;
}

export function authGuard() {
    return createMiddleware(async (c, next) => {
        try {
            // Récupérer le token depuis le cookie HTTP-only
            const cookies = c.req.header('cookie');
            let token = null;
            
            if (cookies) {
                const cookieArray = cookies.split(';');
                const accessTokenCookie = cookieArray.find(cookie => cookie.trim().startsWith('accessToken='));
                if (accessTokenCookie) {
                    token = accessTokenCookie.split('=')[1].trim();
                }
            }
            
            // Vérifier si on a un token Bearer dans l'en-tête (pour compatibilité avec l'ancien système)
            let headerToken;
            const authHeader = c.req.header("Authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                headerToken = authHeader.split(" ")[1];
            }

            // Utiliser le token du cookie ou celui de l'en-tête
            const accessToken = token || headerToken;

            if (!accessToken) {
                return c.json({ error: "Vous devez être authentifié pour accéder à cette ressource" }, 401);
            }

            // Vérifier la validité du token avec des options de sécurité renforcées
            let decoded;
            try {
                decoded = await verify(accessToken, env.JWT_SECRET);
            } catch (error) {
                console.error("Erreur de vérification du token:", error);
                return c.json({ error: "Token invalide ou expiré" }, 401);
            }

            if (!decoded) {
                return c.json({ error: "Token invalide" }, 401);
            }
            
            // Vérifications supplémentaires sur le contenu du token
            if (!decoded.email || !decoded.id) {
                return c.json({ error: "Token malformé" }, 401);
            }
            
            // Vérifier que le type de token est correct (auth)
            if (decoded.type !== 'auth') {
                return c.json({ error: "Type de token incorrect" }, 401);
            }
            
            // Vérifier si le token est expiré
            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp < currentTime) {
                return c.json({ error: "Token expiré" }, 401);
            }
            
            // Récupérer l'utilisateur associé au token
            const user = await authService.findUserByEmail(decoded.email);
            if (!user) {
                return c.json({ error: "Utilisateur non trouvé" }, 401);
            }
            
            // Vérifier que l'ID de l'utilisateur correspond à celui dans le token
            if (user.id !== decoded.id) {
                return c.json({ error: "Token invalide" }, 401);
            }
            
            // Vérifier si le token approche de son expiration
            if (token && isTokenNearExpiration(decoded)) {
                // Générer un nouveau token
                const { accessToken: newToken } = generateAuthTokens(user);
                
                // Définir le nouveau token comme cookie
                const cookieOptions = [
                    `accessToken=${newToken}`,
                    'HttpOnly',
                    process.env.NODE_ENV === 'production' ? 'Secure' : '',
                    'SameSite=Lax',
                    `Max-Age=${60 * 60}`, // 1 heure en secondes
                    'Path=/'
                ].filter(Boolean).join('; ');

                c.header('Set-Cookie', cookieOptions);
            }
            
            // Stocker l'utilisateur dans le contexte
            c.set("user", user);
            
            // Continuer vers la route protégée
            await next();
        } catch (error) {
            console.error("Erreur dans authGuard:", error);
            return c.json({ 
                error: "Erreur d'authentification",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }, 500);
        } 
    });
}

export function roleMiddleware(requiredRole) {
    return async (c, next) => {
        // Récupérer le token depuis le cookie HTTP-only
        const token = c.req.cookie('accessToken');
        
        // Vérifier si on a un token Bearer dans l'en-tête (pour compatibilité avec l'ancien système)
        let headerToken;
        const authHeader = c.req.header("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            headerToken = authHeader.split(" ")[1];
        }

        // Utiliser le token du cookie ou celui de l'en-tête
        const accessToken = token || headerToken;

        if (!accessToken) {
            return c.json({ error: "Vous devez être authentifié pour accéder à cette ressource" }, 401);
        }

        try {
            // Vérifier la validité du token
            const decoded = await verify(accessToken, env.JWT_SECRET);
            if (!decoded) {
                return c.json({ error: "Token invalide" }, 401);
            }
            
            // Vérifications supplémentaires sur le contenu du token
            if (!decoded.email || !decoded.id) {
                return c.json({ error: "Token malformé" }, 401);
            }
            
            // Vérifier que le type de token est correct (auth)
            if (decoded.type !== 'auth') {
                return c.json({ error: "Type de token incorrect" }, 401);
            }
            
            // Vérifier si le token est expiré
            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp < currentTime) {
                return c.json({ error: "Token expiré" }, 401);
            }

            // Vérifier le rôle de l'utilisateur
            const userRoles = await authService.getUserRoles(decoded.id);
            if (!userRoles.includes(requiredRole)) {
                return c.json({ error: "Vous n'avez pas accès à cette ressource." }, 403);               
            }
            
            // Rotation du token si nécessaire (comme dans authGuard)
            if (token && isTokenNearExpiration(decoded)) {
                const user = await authService.findUserByEmail(decoded.email);
                if (user) {
                    // Générer un nouveau token
                    const { accessToken: newToken } = generateAuthTokens(user);
                    
                    // Définir le nouveau token comme cookie
                    c.cookie('accessToken', newToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: 60 * 60 * 1000, // 1 heure en millisecondes
                        path: '/'
                    });
                }
            }
            
            await next();
        } catch (error) {
            return c.json({
                error: "Erreur interne du serveur",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }, 500);
        }
    };
}
