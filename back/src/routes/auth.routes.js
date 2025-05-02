import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import dotenv from 'dotenv';
import authController from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { auth } from '../middlewares/auth.js';

dotenv.config();
const prisma = new PrismaClient();
const authRoutes = new Hono();

// Schémas de validation
const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  firstname: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastname: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phoneNumber: z.string().optional(),
  birthDate: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
});

const refreshTokenSchema = z.object({
  refreshToken: z.string()
});

// Génération des tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Middleware d'authentification
export const authMiddleware = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Non autorisé' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    c.set('userId', decoded.userId);
    await next();
  } catch (error) {
    return c.json({ error: 'Token invalide' }, 401);
  }
};

// Routes
authRoutes.post('/register', validateRequest(registerSchema), (c) => authController.register(c));
authRoutes.post('/login', validateRequest(loginSchema), (c) => authController.login(c));
authRoutes.post('/refresh-token', validateRequest(refreshTokenSchema), (c) => authController.refreshToken(c));
authRoutes.post('/logout', auth, (c) => authController.logout(c));
authRoutes.get('/me', auth, (c) => authController.getMe(c));

export { authRoutes }; 