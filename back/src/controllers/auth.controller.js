import authService from "../services/auth.service.js";

// Controller de l'authentification :

// Inscription
async function register(c) {
    try {
        const data = c.req.valid('json')
        const result = await authService.register(data)
        return c.json(result, 201)
    } catch (error) {
        return c.json({ 
            error: error.message || "Échec de l'inscription",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, 400)
    }
}

// Connexion
async function login(c) {
    try {
        const { email, password } = c.req.valid('json')
        const result = await authService.login(email, password)

        // Si l'utilisateur doit vérifier son email
        if (result.needsVerification) {
            return c.json(result, 400)
        }

        const cookieOptions = [
            `accessToken=${result.token}`,
            'HttpOnly',
            process.env.NODE_ENV === 'production' ? 'Secure' : '',
            'SameSite=Lax',
            `Max-Age=${60 * 60 * 24 * 7}`, // 7 jours
            'Path=/',
        ].filter(Boolean).join('; ');

        c.header('Set-Cookie', cookieOptions);

        return c.json({ 
            message: 'Connexion réussie',
            user: result.user
        })
    } catch (error) {
        console.error('Erreur de connexion:', error);
        return c.json({ 
            error: error.message || "Une erreur est survenue lors de la connexion"
        }, 400)
    }
}

// Déconnexion
async function logout(c) {
    try {
        const cookieOptions = [
            'accessToken=',
            'HttpOnly',
            process.env.NODE_ENV === 'production' ? 'Secure' : '',
            'SameSite=Lax',
            'Max-Age=0',
            'Path=/'
        ].filter(Boolean).join('; ');

        c.header('Set-Cookie', cookieOptions);
        
        return c.json({ 
            message: 'Déconnexion réussie'
        });
    } catch (error) {
        return c.json({ 
            error: "Erreur lors de la déconnexion",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, 500);
    }
}

// Mot de passe oublié
async function forgotPassword(c) {
    try {
        const { email } = c.req.valid('json')
        await authService.forgotPassword(email)
        return c.json({
            message: "Instructions de réinitialisation envoyées par email."
        })
    } catch (error) {
        return c.json({ 
            error: error.message || "Échec de la demande de réinitialisation."
        }, 400)
    }
}

// Réinitialisation du mot de passe
async function resetPassword(c) {
    try {
        const { token, password } = c.req.valid('json')
        await authService.resetPassword(token, password)
        return c.json({
            message: "Mot de passe réinitialisé avec succès"
        })
    } catch (error) {
        return c.json({ error: "Échec de la réinitialisation du mot de passe" }, 400)
    }
}

// Vérification de l'email
async function verifyEmail(c) {
    try {
        const token = c.req.param('token');
        console.log('Contrôleur - Token reçu:', token);
        
        if (!token) {
            return c.json({ error: "Token manquant" }, 400);
        }

        const result = await authService.verifyEmail(token);
        console.log('Contrôleur - Résultat:', result);
        
        return c.json(result);
    } catch (error) {
        console.error('Contrôleur - Erreur de vérification:', error);
        return c.json({ 
            error: error.message || "Échec de la vérification de l'email",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, 400);
    }
}

// Renvoyer l'email de vérification
async function resendVerificationEmail(c) {
    try {
        const { email } = c.req.valid('json');
        const result = await authService.sendEmailVerification(email);
        return c.json(result);
    } catch (error) {
        return c.json({ 
            error: error.message || "Échec de l'envoi de l'email de vérification",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, 400);
    }
}

export {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail
};


