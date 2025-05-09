import instance from './config';

async function signIn(data) {
    try {
        const response = await instance.post('/login', data);
        return response.data;
    } catch (error) {
        console.log('Détails de l\'erreur:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        // Si c'est une erreur 400 avec needsVerification
        if (error.response?.status === 400 && error.response?.data?.needsVerification) {
            return {
                needsVerification: true,
                message: error.response.data.message || "Un email de vérification vous a été envoyé."
            };
        }

        // Pour les autres erreurs
        throw new Error(error.response?.data?.error || 'Une erreur est survenue lors de la connexion');
    }
}

async function signUp(data) {
    try {
        const response = await instance.post("/register", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function logoutUser() {
    try {
        const response = await instance.post('/logout');
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function verifyEmail(token) {
    try {
        const response = await instance.get(`/verify-email/${token}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error('Utilisateur non trouvé');
        }
        throw error;
    }
}

async function forgotPassword(email) {
    try {
        const response = await instance.post('/forgot-password', { email });
        return response.data;
    } catch (error) {
        if (!error.response) {
            throw new Error('Erreur de connexion au serveur');
        }
        if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Une erreur est survenue lors de la réinitialisation du mot de passe');
    }
}

async function resetPassword(token, password, confirmPassword) {
    try {
        const response = await instance.post('/reset-password', {
            token,
            password,
            confirmPassword
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function resendVerificationEmail(email) {
    try {
        const response = await instance.post('/resend-verification', { email });
        return response.data;
    } catch (error) {
        console.log('Détails de l\'erreur:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        if (!error.response) {
            throw new Error('Erreur de connexion au serveur');
        }

        // Gestion spécifique des erreurs
        switch (error.response.status) {
            case 404:
                throw new Error('Utilisateur non trouvé');
            case 400:
                // Si l'email est invalide ou l'utilisateur n'existe pas
                throw new Error('Utilisateur non trouvé');
            default:
                throw new Error('Une erreur est survenue lors de l\'envoi de l\'email');
        }
    }
}

export { 
    signIn, 
    signUp, 
    logoutUser, 
    verifyEmail,
    forgotPassword, 
    resetPassword,
    resendVerificationEmail,
};
