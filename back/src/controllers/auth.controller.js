import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authService from '../services/auth.service.js';

class AuthController {
  async register(c) {
    try {
      const userData = await c.req.json();
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await authService.findUserByEmail(userData.email);
      if (existingUser) {
        return c.json({ error: 'Cet email est déjà utilisé' }, 400);
      }

      // Créer l'utilisateur
      const user = await authService.createUser(userData);
      
      // Générer les tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);
      
      // Sauvegarder le refresh token
      await authService.updateRefreshToken(user.id, refreshToken);

      return c.json({
        user: { ...user, password: undefined },
        accessToken,
        refreshToken
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return c.json({ error: 'Erreur lors de l\'inscription' }, 500);
    }
  }

  async login(c) {
    try {
      const { email, password } = await c.req.json();

      // Trouver l'utilisateur
      const user = await authService.findUserByEmail(email);
      if (!user) {
        return c.json({ error: 'Email ou mot de passe incorrect' }, 401);
      }

      // Vérifier le mot de passe
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return c.json({ error: 'Email ou mot de passe incorrect' }, 401);
      }

      // Générer les tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);
      
      // Sauvegarder le refresh token
      await authService.updateRefreshToken(user.id, refreshToken);

      return c.json({
        user: { ...user, password: undefined },
        accessToken,
        refreshToken
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return c.json({ error: 'Erreur lors de la connexion' }, 500);
    }
  }

  async refreshToken(c) {
    try {
      const { refreshToken } = await c.req.json();
      
      if (!refreshToken) {
        return c.json({ error: 'Refresh token manquant' }, 401);
      }

      // Vérifier et décoder le refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await authService.findUserById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        return c.json({ error: 'Refresh token invalide' }, 401);
      }

      // Générer un nouveau access token
      const accessToken = this.generateAccessToken(user);

      return c.json({ accessToken });
    } catch (error) {
      console.error('Erreur lors du refresh token:', error);
      return c.json({ error: 'Erreur lors du refresh token' }, 500);
    }
  }

  async logout(c) {
    try {
      const { userId } = c.req.user;
      await authService.removeRefreshToken(userId);
      return c.json({ message: 'Déconnexion réussie' });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      return c.json({ error: 'Erreur lors de la déconnexion' }, 500);
    }
  }

  async getMe(c) {
    try {
      const { userId } = c.req.user;
      const user = await authService.findUserById(userId);
      
      if (!user) {
        return c.json({ error: 'Utilisateur non trouvé' }, 404);
      }

      return c.json({ ...user, password: undefined });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return c.json({ error: 'Erreur lors de la récupération du profil' }, 500);
    }
  }

  // Méthodes utilitaires pour la génération des tokens
  generateAccessToken(user) {
    return jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
  }
}

export default new AuthController();
