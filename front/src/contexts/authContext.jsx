import { createContext, useState, useEffect, useContext } from 'react';
import { logoutUser } from '../api/auth';

// Créer le contexte
export const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth === 'true';
  });
  
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [userRole, setUserRole] = useState(() => {
    const storedRole = localStorage.getItem('userRole');
    return storedRole || null;
  });
  
  const [loading, setLoading] = useState(false);

  // Effet pour sauvegarder les données d'authentification
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    }
  }, [isAuthenticated, user, userRole]);
  
  // Fonction de connexion
  const login = async (userData) => {
    try {
      setUser(userData);
      setUserRole(userData.role);
      setIsAuthenticated(true);
      window.dispatchEvent(new Event('authChange'));
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
    }
  };
  
  // Fonction de déconnexion
  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
      localStorage.clear(); // Nettoyer le localStorage
      window.dispatchEvent(new Event('authChange'));
    }
  };
  
  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    if (!userRole) return false;
    
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    
    return userRole === role;
  };
  
  const value = {
    isAuthenticated,
    user,
    userRole,
    loading,
    login,
    logout,
    hasRole
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 