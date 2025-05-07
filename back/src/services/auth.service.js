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
            throw new Error('Le rôle utilisateur n\'existe pas. Veuillez contacter l\'administrateur.');
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
            message: "Inscription réussie. Veuillez vérifier votre email pour activer votre compte."
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
        throw new Error('Veuillez vérifier votre email avant de vous connecter');
    }

    // Récupérer le rôle de l'utilisateur
    const userRole = await getUserRole(user.id);
    
    // Générer les tokens d'authentification
    const tokens = generateAuthTokens(user);

    console.log("Tokens générés:", tokens);

    // Structurer la réponse pour inclure clairement le token
    return {
        user: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: userRole
        },
        token: tokens.accessToken  // Utiliser accessToken au lieu de token
    };
}

// Vérifier l'email d'un utilisateur
async function verifyEmail(token) {
    try {
        // Vérifier le token et son type
        const decoded = verifyToken(token, 'email');

        // Trouver l'utilisateur avec l'email du token
        const user = await prisma.user.findUnique({
            where: { 
                email: decoded.email,
                emailVerificationToken: token
            }
        });

        if (!user) {
            throw new Error('Token de vérification invalide ou expiré');
        }

        if (user.isVerified) {
            return { message: 'Email déjà vérifié' };
        }

        // Mettre à jour l'utilisateur
        await prisma.user.update({
            where: { id: user.id },
            data: { 
                isVerified: true,
                emailVerificationToken: null
            }
        });

        return { message: 'Email vérifié avec succès' };
    } catch (error) {
        console.error('Erreur de vérification:', error);
        throw new Error(error.message || 'Erreur lors de la vérification de l\'email');
    }
}

// Mot de passe oublié
async function forgotPassword(email) {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
        return { message: 'Si un compte existe avec cet email, vous recevrez les instructions de réinitialisation.' };
    }

    const resetToken = generatePasswordResetToken(email);

    // Sauvegarder le token
    await prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordToken: resetToken }
    });

    try {
        // Envoyer l'email avec le lien de réinitialisation
        const success = await sendPasswordResetEmail(email, resetToken);
        
        if (!success) {
            throw new Error('Erreur lors de l\'envoi de l\'email de réinitialisation');
        }
        
        return { message: 'Si un compte existe avec cet email, vous recevrez les instructions de réinitialisation.' };
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

// Récupérer le profile d'un utilisateur
async function getUserProfile(id) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            birthDate: true,
            phoneNumber: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if (!user) return null;

    return {
        ...user,
        birthDate: user.birthDate ? formatDate(user.birthDate) : null,
        createdAt: formatDateTime(user.createdAt),
        updatedAt: formatDateTime(user.updatedAt)
    };
}

// Modifier le profile d'un utilisateur
async function updateUser(id, data) {
    return await prisma.user.update({
        where: { id },
        data
    });
}

// Envoyer un email de vérification
async function sendEmailVerification(email) {
    // Vérifier si l'utilisateur existe
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error('Utilisateur non trouvé');
    }
    
    const token = generateEmailVerificationToken(email);
    const verificationLink = `${env.APP_URL}/verify-email?token=${token}`;
    
    // Envoyer l'email de vérification
    await sendVerificationEmailUtil(email);
    
    return { message: 'Email de vérification envoyé' };
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

        if (!userWithRole) {
            console.error("Utilisateur non trouvé pour le rôle:", userId);
            return 'user'; // Rôle par défaut
        }

        if (!userWithRole.role || !userWithRole.role.role) {
            console.log("Aucun rôle trouvé pour l'utilisateur, utilisation du rôle par défaut");
            return 'user';
        }

        console.log("Rôle trouvé pour l'utilisateur:", userWithRole.role.role.name);
        return userWithRole.role.role.name;
    } catch (error) {
        console.error("Erreur lors de la récupération du rôle:", error);
        return 'user'; // Rôle par défaut en cas d'erreur
    }
}

export default { 
    register, 
    login, 
    forgotPassword, 
    resetPassword,
    getUserById, 
    getUserProfile, 
    updateUser, 
    sendEmailVerification, 
    findUserByEmail, 
    verifyEmail,
    getUserRole
};
