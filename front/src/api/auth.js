import instance from './config';

async function signIn(data) {
    try {
        const response = await instance.post('/login', data);
        console.log("Response from sign in:", response.data);
        
        if (response.status !== 200) {
            throw new Error('Échec de la connexion');
        }
        
        if (!response.data.user) {
            throw new Error('Données utilisateur manquantes');
        }

        // Si l'utilisateur n'est pas vérifié, on retourne un indicateur spécial
        if (response.data.needsVerification) {
            return {
                needsVerification: true,
                message: "Un email vous a été envoyé pour confirmer votre adresse email."
            };
        }
        
        return response.data;
    } catch (error) {
        // Si l'erreur concerne la vérification de l'email, on la propage telle quelle
        if (error.response?.data?.error === 'Veuillez vérifier votre email avant de vous connecter') {
            throw error;
        }
        console.error("Error during sign in:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function signUp(data) {
    try {
        console.log("Data to be inserted:", data);
        const response = await instance.post("/register", data);
        console.log("Response from database insert:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error during sign up:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function updateProfile(userId, data) {
    try {
        const response = await instance.put(`/auth/users/${userId}`, data);
        if (!response.data) {
            throw new Error('Erreur lors de la mise à jour du profil');
        }
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error.response?.data || error.message);
        throw error;
    }
}

async function getCurrentUser() {
    try {
        const response = await instance.get('/me');
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Si l'erreur est 401, c'est normal quand l'utilisateur n'est pas connecté
            // On retourne null au lieu de lancer une erreur
            return null;
        }
        // Pour les autres erreurs, on les log et on les propage
        console.error("Erreur lors de la récupération de l'utilisateur:", error.response?.data || error.message);
        throw error;
    }
}

async function logoutUser() {
    try {
        const response = await instance.post('/logout');
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error.response?.data || error.message);
        throw error;
    }
}

async function verifyEmail(token) {
    try {
        const response = await instance.get(`/verify-email/${token}`);
        return response.data;
    } catch (error) {
        console.error("Error during email verification:", error.response?.data?.error || error.message);
        throw error;
    }
}

async function forgotPassword(email) {
    try {
        const response = await instance.post('/forgot-password', { email });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la demande de réinitialisation:", error.response?.data?.error || error.message);
        throw error;
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
        console.error("Erreur lors de la réinitialisation du mot de passe:", error.response?.data?.error || error.message);
        throw error;
    }
}

export { 
    signIn, 
    signUp, 
    updateProfile, 
    getCurrentUser, 
    logoutUser, 
    verifyEmail,
    forgotPassword, 
    resetPassword 
};
