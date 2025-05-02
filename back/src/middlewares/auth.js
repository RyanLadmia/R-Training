import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const auth = async (c, next) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ 
        error: 'Token d\'authentification manquant' 
      }, 401);
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
      
      // Ajouter les informations de l'utilisateur à la requête
      c.set('user', {
        userId: decoded.id
      });
      
      await next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return c.json({ 
          error: 'Token expiré',
          code: 'TOKEN_EXPIRED'
        }, 401);
      }
      
      return c.json({ 
        error: 'Token invalide',
        code: 'INVALID_TOKEN'
      }, 401);
    }
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return c.json({ 
      error: 'Erreur d\'authentification',
      code: 'AUTH_ERROR'
    }, 500);
  }
}; 