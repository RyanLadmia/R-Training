import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, logoutUser } from '../api/auth';

// Créer le contexte
export const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        
        if (userData && userData.user) {
          setIsAuthenticated(true);
          setUser(userData.user);
          setUserRole(userData.user.role);
        } else {
          // Réinitialisation silencieuse de l'état
          setIsAuthenticated(false);
          setUser(null);
          setUserRole(null);
        }
      } catch (error) {
        // Ne rien logger pour les erreurs 401
        if (!error.response || error.response.status !== 401) {
          console.error("Erreur lors de la vérification de l'authentification:", error);
        }
        // Réinitialisation silencieuse de l'état
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Écouter les changements d'authentification
    window.addEventListener('authChange', checkAuth);
    
    return () => {
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);
  
  // Fonction de connexion
  const login = async (userData) => {
    try {
      setUser(userData);
      setUserRole(userData.role);
      setIsAuthenticated(true);
      window.dispatchEvent(new Event('authChange'));
    } catch (error) {
      if (!error.response || error.response.status !== 401) {
        console.error('Erreur lors de la connexion:', error);
      }
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
      // Ne logger que les erreurs non liées à l'authentification
      if (!error.response || error.response.status !== 401) {
        console.error('Erreur lors de la déconnexion:', error);
      }
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