import { createContext, useState, useEffect, useContext } from 'react';
import { logoutUser } from '../api/auth';

// Créer le contexte
export const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);
  
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