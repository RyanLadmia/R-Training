import { prisma } from '../config/prisma.js';
import env from '../config/env.js'
import { comparePassword, hashPassword } from '../utils/password.js';
import { sendVerificationEmail as sendVerificationEmailUtil } from '../utils/email.js';
import { formatDate, formatDateTime } from '../utils/date.js';
import { 
    generateAuthTokens,
    generateEmailVerificationToken,
    generatePasswordResetToken,
    verifyToken
} from '../utils/jwt.js';
import { sendPasswordResetEmail } from '../utils/email.js';

// Enregistrer un nouvel utilisateur
async function register(data) {
    const { firstname, lastname, email, password, birthDate, phoneNumber } = data;
    console.log("Service - Données reçues:", data);

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new Error('Cette adresse email est déjà utilisée');
        }

        // Vérifier si le rôle existe
        const userRole = await prisma.role.findFirst({
            where: { name: 'user' }
        });

        if (!userRole) {
            throw new Error('Le rôle utilisateur n\'existe pas');
        }

        // Générer le token de vérification
        const emailVerificationToken = generateEmailVerificationToken(email);

        // Hacher le mot de passe
        const hashedPassword = await hashPassword(password);

        // Créer un nouvel utilisateur
        const user = await prisma.user.create({
            data: {
                firstname,
                lastname,
                email,
                password: hashedPassword,
                birthDate: birthDate ? new Date(birthDate) : undefined,
                phoneNumber,
                isVerified: false,
                emailVerificationToken
            }
        });
        console.log("Service - Utilisateur créé:", user);

        // Ajouter le rôle utilisateur
        await prisma.userRole.create({
            data: {
                userId: user.id,
                roleId: userRole.id
            }
        });
        
        console.log("Service - Rôle ajouté");
        
        // Envoyer l'email de vérification
        try {
            await sendVerificationEmailUtil(user.email, emailVerificationToken);
            console.log("Service - Email envoyé");
        } catch (emailError) {
            console.error("Service - Erreur envoi email:", emailError);
        }

        return {
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                birthDate: user.birthDate ? formatDate(user.birthDate) : null,
                phoneNumber: user.phoneNumber
            },
            message: "Inscription réussie. Veuillez vérifier votre email."
        };
    } catch (error) {
        console.error("Service - Erreur lors de l'inscription:", error);
        throw error;
    }
}

// Connexion d'un utilisateur
async function login(email, password) {
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            role: {
                include: {
                    role: true
                }
            }
        }
    });

    if (!user) {
        throw new Error('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect');
    }

    if (!user.isVerified) {
        // Générer un nouveau token de vérification
        const emailVerificationToken = generateEmailVerificationToken(email);
        
        // Mettre à jour le token de vérification
        await prisma.user.update({
            where: { id: user.id },
            data: { emailVerificationToken }
        });
        
        // Envoyer l'email de vérification
        const emailSent = await sendVerificationEmailUtil(email, emailVerificationToken);
        
        if (!emailSent) {
            // Si l'envoi échoue, on renvoie quand même un message positif
            // car le token a été mis à jour et l'utilisateur peut utiliser le lien de renvoi
            return {
                needsVerification: true,
                message: "Votre compte n'est pas encore vérifié. Veuillez vérifier vos emails ou utiliser l'option 'Renvoyer le lien de vérification' si vous n'avez pas reçu l'email."
            };
        }

        return {
            needsVerification: true,
            message: "Un email de vérification vient de vous être envoyé. Veuillez vérifier votre boîte de réception et cliquer sur le lien pour activer votre compte."
        };
    }

    // Récupérer le rôle de l'utilisateur
    const userRole = await getUserRole(user.id);
    
    // Générer les tokens d'authentification
    const tokens = generateAuthTokens(user);

    // Structurer la réponse pour inclure clairement le token
    return {
        user: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: userRole
        },
        token: tokens.accessToken
    };
}

// Vérifier l'email d'un utilisateur
async function verifyEmail(token) {
    try {
        console.log('Token reçu:', token);
        
        // Vérifier le token et son type
        const decoded = verifyToken(token, 'email');
        console.log('Token décodé:', decoded);

        // Trouver l'utilisateur avec l'email du token
        const user = await prisma.user.findUnique({
            where: { email: decoded.email }
        });
        console.log('Utilisateur trouvé:', user);

        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        if (user.isVerified) {
            return { message: 'Email déjà vérifié' };
        }

        // Mettre à jour l'utilisateur
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { 
                isVerified: true,
                emailVerificationToken: null
            }
        });
        console.log('Utilisateur mis à jour:', updatedUser);

        return { message: 'Email vérifié avec succès' };
    } catch (error) {
        console.error('Erreur détaillée de vérification:', error);
        throw new Error(error.message || 'Erreur lors de la vérification de l\'email');
    }
}

// Mot de passe oublié
async function forgotPassword(email) {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error('Aucun compte n\'existe avec cette adresse email');
    }

    const resetToken = generatePasswordResetToken(email);

    // Sauvegarder le token
    await prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordToken: resetToken }
    });

    try {
        // Envoyer l'email avec le lien de réinitialisation
        await sendPasswordResetEmail(email, resetToken);
        
        return { message: 'Instructions de réinitialisation envoyées.' };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
        throw new Error('Erreur lors de l\'envoi de l\'email de réinitialisation');
    }
}

// Réinitialiser le mot de passe
async function resetPassword(token, password) {
    try {
        // Vérifier le token et son type
        const decoded = verifyToken(token, 'reset');
        
        // Trouver l'utilisateur avec l'email du token et le token de réinitialisation
        const user = await prisma.user.findFirst({
            where: { 
                email: decoded.email,
                resetPasswordToken: token
            }
        });

        if (!user) {
            throw new Error('Token de réinitialisation invalide ou expiré');
        }

        // Hacher le nouveau mot de passe
        const hashedPassword = await hashPassword(password);

        // Mettre à jour l'utilisateur
        await prisma.user.update({
            where: { id: user.id },
            data: { 
                password: hashedPassword,
                resetPasswordToken: null // Invalider le token après utilisation
            }
        });

        return { message: 'Mot de passe réinitialisé avec succès' };
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        throw new Error(error.message || 'Erreur lors de la réinitialisation du mot de passe');
    }
}

// Récupérer un utilisateur par son id
async function getUserById(id) {
    return await prisma.user.findUnique({
        where: { id }
    });
}

// Envoyer un email de vérification
async function sendEmailVerification(email) {
    try {
        // Vérifier si l'utilisateur existe
        const user = await findUserByEmail(email);
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        if (user.isVerified) {
            throw new Error('Cet email est déjà vérifié');
        }
        
        const token = generateEmailVerificationToken(email);

        // Mettre à jour l'utilisateur avec le nouveau token
        await prisma.user.update({
            where: { id: user.id },
            data: { emailVerificationToken: token }
        });
        
        // Envoyer l'email de vérification avec le token
        await sendVerificationEmailUtil(email, token);
        
        return { 
            message: 'Un nouveau lien de vérification a été envoyé à votre adresse email',
            success: true
        };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
        throw new Error(error.message || 'Erreur lors de l\'envoi de l\'email de vérification');
    }
}

// Trouver un utilisateur par son email
async function findUserByEmail(email) {
    return await prisma.user.findUnique({
        where: { email }
    });
}

// Récupérer le rôle d'un utilisateur
async function getUserRole(userId) {
    try {
        const userWithRole = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!userWithRole?.role?.role) {
            return 'user';
        }

        return userWithRole.role.role.name;
    } catch (error) {
        return 'user';
    }
}

export default { 
    register, 
    login, 
    forgotPassword, 
    resetPassword,
    getUserById,
    sendEmailVerification, 
    findUserByEmail, 
    verifyEmail,
    getUserRole
};
