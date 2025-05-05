import { prisma } from '../config/prisma.js';
import { sign, verify } from 'hono/jwt.js';
import jwt from 'jsonwebtoken';
import env from '../config/env.js'
import { comparePassword, hashPassword } from '../utils/password.js';
import { sendEmail, sendVerificationEmail } from '../utils/email.js';
import { decodeToken } from '../utils/jwt.js';


// Générer un token JWT
function generateToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1h'});
}

// Vérifier un token JWT    
function verifyToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
}



// Générer un token de réinitialisation de mot de passe
function generateResetToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1h'});
}

// Vérifier un token de réinitialisation de mot de passe
function verifyResetToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
}


// Générer un token de vérification d'email
function generateVerificationToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1h'});
}

// Vérifier un token de vérification d'email
function verifyVerificationToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
}




// Enregistrer un nouvel utilisateur
async function register(data) {
    const { firstname, lastname, email, password } = data;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer un nouvel utilisateur
    const user = await prisma.user.create({
        data: {
            
        }
    })
    
}

// Connexion d'un utilisateur
async function login(email, password) {
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error('Utilisateur non trouvé');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Mot de passe incorrect');
    }

    // Générer un token JWT
    const token = generateToken({ id: user.id, email: user.email });

    return token;
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
async function updateUserProfile(id, data) {
    return await prisma.user.update({
        where: { id },
        
    })
}


// Envoyer un email de vérification
async function sendEmailVerification(email) {
    const token = generateVerificationToken({ email });
    const verificationLink = `${env.FRONTEND_URL}/verify-email?token=${token}`;
    
}
