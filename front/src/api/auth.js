import instance from './config';

async function signIn(data) {
    try {
        const response = await instance.post('/login', data);
        
        if (response.status !== 200) {
            throw new Error('Échec de la connexion');
        }
        
        if (!response.data.user) {
            throw new Error('Données utilisateur manquantes');
        }

        if (response.data.needsVerification) {
            return {
                needsVerification: true,
                message: "Un email vous a été envoyé pour confirmer votre adresse email."
            };
        }
        
        return response.data;
    } catch (error) {
        if (error.response?.data?.error === 'Veuillez vérifier votre email avant de vous connecter') {
            throw error;
        }
        throw error;
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
        throw error;
    }
}

async function forgotPassword(email) {
    try {
        const response = await instance.post('/forgot-password', { email });
        return response.data;
    } catch (error) {
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
        throw error;
    }
}

async function resendVerificationEmail(email) {
    try {
        const response = await instance.post('/resend-verification', { email });
        return response.data;
    } catch (error) {
        throw error;
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
