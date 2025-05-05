import authService from "../services/auth.service.js";
import { comparePassword, hashPassword} from "../utils/password.js";

// Inscription
async function register(c) {
    try{
        const data = c.req.valid('json')
        await authService.register(data)
        return c.json({
            message: "Registration succesful. Please check your email for  verification."
        }, 201)
    } catch (error) {
        console.log(error)
            return c.json({ error: "Registrration failed"}, 400)
    }
}

// Connexion
async function login(c) {
    try {
        const { email, password } = c.req.valid('json')
        const token = await authService.login(email, password)
        console.log("token:", token)

        return c.json({ message: 'login succesful', token})
    } catch (error) {
        console.log("error:",error.message)
        return c.json({ error: error.message}, 400)
    }
}

// Mot de passe oublié
async function forgotPassword(c) {
    try {
        const { email } = c.req.valid('json')
        await authService.forgotPassword(email)
        return c.json({
            message: "Password reset instruction sent to your e-mail."
        })
    } catch (error) {
        console.error(error)
        return c.json({ error: "Password reset request failed."}, 400)
    }
}

// Récupérer un utilisateur par son id
async function getUserId(c) {
    try {
        const od = c.req.param('id');
        console.log("Récupération du profil pour l'utilisateur:", id);

        const user = await authService.getUserById(id);
        if (!user) {
            console.log("Utilisateur non trouvé");
            return c.json({ error: "Utilisateur non trouvé "}, 404);
        }

        // Ne pas retourner le mot de passe
        delete user.password;
        console.log("Utilisateur récupéré:", user);

        return c.json(user);
    } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        return c.json({ error: "Erreur lors de la récupération du profil"}, 500);
    }
}

// Récupérer le profile d'un utiliasteur
async function getUserProfile(c) {
    try {
        const userId = c.req.param('id');
        console.log('Recupération du profil pour l\'utilisateur:', userId);

        // Vérifier que l'utilisateur accède à son profil
        const authUser = c.get('user');
        console.log('Utilisateur authentifié:', authUser);

        if (!authUser) {
            console.error("Utilisateur non authentifié");
            return c.json({ error: 'Non authentifié'}, 401);
        }

        if (authUser.id !== parseInt(userId)) {
            console.error("Accèes non autorisé au profil");
            return c.json({ error: 'Non autorisé à accéder à ce profil'}, 403);
        }

        console.log('Récupération des données de l\'utilisateur:', userId);
        const user = await authService.getUserById(userId);
        if (!user) {
            console.error("Utilisateur non trouvé", userId);
            return c.json({error: "Utilisateur non trouvé" }, 404);
        }

        // Ne pas retourner le mot de passe
        delete user.password;

        console.log('Profile utilisateur récupéré:, user');
        return c.json(user);
    } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        return c.json({ 
            error: error.message || "Erreur lors de la récupération du profil",
        details: process.env.NODE_ENV === 'developpement' ? error.stack : undefined
        }, 500);
    }
}

// Envoi d'un email de vérification
async function sendVerificationEmail(c) {
    try {
        const { email } = c.req.valid('json')
        await authService.sendEmailerification(email)
        return c.json({
            message: "Verification email sent"
        })
    } catch (error) {
        console.error(error)
        return c.json({ error: "Verification email couldn't be sent" }, 400)
    }
}

// Réinitialiser le mot de passe
async function resetPassword(c) {
    try {
        const { token, newPassword } = c.req.valid('json')
        await authService.resetPassword(token, newPassword)
        return c.json({
            message: "Password reset succesful"
        })
    } catch (error) {
        console.error(error)
        return c.json({ error: "Password reset failed" }, 400)
    }
}

// Vérifier l'email d'un utilisateur
async function verifyEmail(c) {
    try {
        const token = c.req.param('token')
        console.log("token:", token)
        await authService.verifyEmail(token)
        return c.json({ message: "Email verified successfully"})
    } catch (error) {
        console.error("error:", error)
        return c.json({ error: "Email verification failed"}, 400)
    }
}

// Modification du profil d'un utilisateur
async function updateUserProfile(c) {
    try {
        const userId = c.req.param('id');
        const data = c.req.valid('json');
        console.log('Données reçues de client;', data);

        // Vérifier que l'utilisateur modifie son profil
        const auhUser = c.get('user');
        console.log('Utilisateur authentifié', authUser);

        if (authUser.id !== parseInt(userId)) {
            return c.json({ error: "Non autorisé à modifier ce profil "}, 403);
        }

        // Créer un nouvel objet avec les données reçues
        const updateData = {};

        // Copier les champs de base s'ils existent
        if (data.firstname) updateData.firstname = data.firstname;
        if (data.lastname) updateData.lastname = data.lastname;
        if (data.email) updateData.email = data.email;

        // Si changement de mot de passe demandé
        if (data.newPassword && data.currentPassword) {
            console.log('Tentative de changement de mot de passe');
            const user = await authService.getUserById(userId);
            if (!user) {
                console.error("Utilisateur non trouvé", userId);
                return c.json({ error: "Utilisateur non trouvé"}, 404);
            }

            if (!user.password) {
                console.error('Mot de passe no trouvé dans les données utilisateur');
                return c.json({ error: "Erreur de configuration du compte"}, 500);
            }

            console.log('Vérification du mot de passe actuel');
            try {
                const isPasswordValid = await comparePassword(data.currentPassword, user.password);
                if(!isPasswordValid) {
                    console.error('Mot de passe actuel incorrect');
                    return c.json({ error: "Mot de passe actuel incorrect" }, 400);
                }
            } catch (error) {
                console.error('Erreur lors de la vérification du mot de passe', error);
                return c.json({ error: "Erreur lors de la vérification du mot de passe"}, 500);
            }

            console.log('Hashage du nouveau mot de passe');
            try {
                updateData.password = await hashPassword(data.newPassword);
            } catch (error) {
                console.error('Erreur lors du hashage de mot de passe:', error);
                return c.json({ error: "Erreur lors du hashage de mot de passe"}, 500);
            }
        }
        console.log('Données à mettre à jour:', updateData);

        // Ne faire la mise à jour que si des données ont été modifiées
        if (Object.keys(updateData).length === 0) {
            return c.json({ error: "Aucune donnée à mettre à jour"}, 400);
        }

        const updatedUser = await authService.updateUser(userId, updateData);
        if (!updatedUser) {
            console.error("Erreur lors de la mise à jour du profil", userId);
            return c.json({ error: "Erreur lors de la mise à jour du profil"}, 500);
        }
        
        // Ne pas retourner le mot de passe
        delete updatedUser.password;
        console.log('Profil mis à jour avec succès:', updatedUser);
        return c.json(updatedUser);
    } catch (error) {
        console.error("Erreur détaillée:", error);
        return c.json({
            error: error.message || "Erreur lors de la mise à jour du profil",
            details: process.env.NODE_ENV === 'developpement' ? error.stack : undefined
        }, 500);
    }
}

export {
    register,
    login,
    forgotPassword,
    getUserId,
    getUserProfile,
    sendVerificationEmail,
    resetPassword,
    verifyEmail,
    updateUserProfile
}


