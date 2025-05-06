import { prisma } from '../config/prisma.js';
import jwt from 'jsonwebtoken';
import env from '../config/env.js'
import { comparePassword, hashPassword } from '../utils/password.js';
import { sendVerificationEmail as sendVerificationEmailUtil } from '../utils/email.js';


// Générer un token JWT
function generateToken(payload) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement');
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h'});
    return { token };
}

// Vérifier un token JWT    
function verifyToken(token) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement');
    }
    return jwt.verify(token, process.env.JWT_SECRET);
}



// Générer un token de réinitialisation de mot de passe
function generateResetToken(payload) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement');
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h'});
}

// Vérifier un token de réinitialisation de mot de passe
function verifyResetToken(token) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement');
    }
    return jwt.verify(token, process.env.JWT_SECRET);
}


// Générer un token de vérification d'email
function generateVerificationToken(payload) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement');
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h'});
}

// Vérifier un token de vérification d'email
function verifyVerificationToken(token) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement');
    }
    return jwt.verify(token, process.env.JWT_SECRET);
}




// Enregistrer un nouvel utilisateur
async function register(data) {
    const { firstname, lastname, email, password } = data;
    console.log("Service - Données reçues:", data);

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        // Vérifier si le rôle existe
        const userRole = await prisma.role.findUnique({
            where: { id: 3 }
        });

        if (!userRole) {
            throw new Error('Role user not found');
        }

        // Générer le token de vérification
        const emailVerificationToken = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Hacher le mot de passe
        const hashedPassword = await hashPassword(password);

        // Créer un nouvel utilisateur
        const user = await prisma.user.create({
            data: {
                firstname,
                lastname,
                email,
                password: hashedPassword,
                isVerified: false,
                emailVerificationToken
            }
        });
        console.log("Service - Utilisateur créé:", user);

        // Ajouter le rôle utilisateur
        await prisma.userRole.create({
            data: {
                userId: user.id,
                roleId: 3 // ID 3 correspond au rôle 'user'
            }
        });
        
        console.log("Service - Rôle ajouté");
        
        // Envoyer l'email de vérification
        try {
            await sendVerificationEmailUtil(user.email, emailVerificationToken);
            console.log("Service - Email envoyé");
        } catch (emailError) {
            console.error("Service - Erreur envoi email:", emailError);
            // Continuons même si l'email n'a pas pu être envoyé
        }

        return {
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
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
    // Vérifier si l'utilisateur existe
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

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier si l'email est vérifié
    if (!user.isVerified) {
        throw new Error('Veuillez vérifier votre email avant de vous connecter');
    }

    // Générer des tokens JWT
    const tokens = await generateToken({
        id: user.id,
        email: user.email,
        role: user.role?.role?.name || 'USER'
    });

    return {
        user: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role?.role?.name
        },
        ...tokens
    };
}


// Mot de passe oublié
async function forgotPassword(email) {
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
        where: { email }
    });
}


// Récupérer un utilisateur par son id
async function getUserById(id) {
    return await prisma.user.findUnique({
        where: { id }
    });
}


// Récupérer le profile d'un utilisateur
async function getUserProfile(id) {
    return await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            createdAt: true,
            updatedAt: true
        }
    })
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
    
    const token = generateVerificationToken({ email });
    const verificationLink = `${env.FRONTEND_URL}/verify-email?token=${token}`;
    
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

// Vérifier l'email d'un utilisateur
async function verifyEmail(token) {
    try {
        // Trouver l'utilisateur avec ce token
        const user = await prisma.user.findFirst({
            where: { emailVerificationToken: token }
        });

        if (!user) {
            throw new Error('Token de vérification invalide ou expiré');
        }

        // Vérifier si l'email est déjà vérifié
        if (user.isVerified) {
            return { message: 'Email déjà vérifié' };
        }

        try {
            // Vérifier le token
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Token de vérification invalide ou expiré');
        }

        // Mettre à jour l'utilisateur
        await prisma.user.update({
            where: { id: user.id },
            data: { 
                isVerified: true,
                emailVerificationToken: null // Effacer le token après utilisation
            }
        });

        return { message: 'Email vérifié avec succès' };
    } catch (error) {
        throw new Error('Erreur lors de la vérification de l\'email: ' + error.message);
    }
}

export default { register, login, forgotPassword, getUserById, getUserProfile, updateUser, sendEmailVerification, findUserByEmail, verifyEmail };
