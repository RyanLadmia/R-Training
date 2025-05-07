import { createContext, useState, useEffect, useContext } from 'react';

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
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');
      const storedUserData = localStorage.getItem('userData');
      
      setIsAuthenticated(!!token);
      
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          setUser(userData);
          setUserRole(userData.role);
        } catch (e) {
          console.error('Erreur lors de la lecture des données utilisateur:', e);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
    
    // Écouter les changements d'authentification
    window.addEventListener('authChange', checkAuth);
    
    return () => {
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);
  
  // Fonction de connexion
  const login = (token, userData) => {
    localStorage.setItem('accessToken', token);
    
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userId', userData.id);
      setUser(userData);
      setUserRole(userData.role);
    }
    
    setIsAuthenticated(true);
    window.dispatchEvent(new Event('authChange'));
  };
  
  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
    window.dispatchEvent(new Event('authChange'));
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