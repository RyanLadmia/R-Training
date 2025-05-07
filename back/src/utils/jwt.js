import jwt from 'jsonwebtoken';
import env from "../config/env.js";

/**
 * Génère un token JWT avec un type spécifique
 * @param {Object} payload Les données à inclure dans le token
 * @param {string} type Le type de token ('auth', 'email', 'reset')
 * @returns {string} Le token généré
 */
function generateToken(payload, type = 'auth') {
    if (!env.JWT_SECRET) {
        throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement');
    }

    const expiresIn = {
        'auth': '1h',        // Token d'authentification: 1 heure
        'email': '24h',      // Token de vérification email: 24 heures
        'reset': '1h',       // Token de réinitialisation: 1 heure
        'refresh': '7d'      // Token de rafraîchissement: 7 jours
    }[type] || '1h';

    return jwt.sign(
        { ...payload, type },
        env.JWT_SECRET,
        { expiresIn }
    );
}

/**
 * Génère un token d'authentification
 * @param {Object} user Les données de l'utilisateur
 * @returns {Object} Les tokens d'accès et de rafraîchissement
 */
function generateAuthTokens(user) {
    const accessToken = generateToken({
        id: user.id,
        email: user.email,
        role: user.role?.role?.name || 'user'
    }, 'auth');

    const refreshToken = generateToken({
        id: user.id,
        tokenType: 'refresh'
    }, 'refresh');

    return { accessToken, refreshToken };
}

/**
 * Génère un token de vérification d'email
 * @param {string} email L'email à vérifier
 * @returns {string} Le token de vérification
 */
function generateEmailVerificationToken(email) {
    return generateToken({ email }, 'email');
}

/**
 * Génère un token de réinitialisation de mot de passe
 * @param {string} email L'email de l'utilisateur
 * @returns {string} Le token de réinitialisation
 */
function generatePasswordResetToken(email) {
    return generateToken({ email }, 'reset');
}

/**
 * Vérifie et décode un token JWT
 * @param {string} token Le token à vérifier
 * @param {string} expectedType Le type de token attendu
 * @returns {Object} Le contenu décodé du token
 */
function verifyToken(token, expectedType = null) {
    if (!env.JWT_SECRET) {
        throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement');
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        
        // Vérifier le type de token si un type est attendu
        if (expectedType && decoded.type !== expectedType) {
            throw new Error('Type de token invalide');
        }

        return decoded;
    } catch (error) {
        throw new Error('Token invalide ou expiré');
    }
}

export {
    generateAuthTokens,
    generateEmailVerificationToken,
    generatePasswordResetToken,
    verifyToken
};
