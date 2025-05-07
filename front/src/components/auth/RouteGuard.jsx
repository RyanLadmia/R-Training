import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/authContext';

// Composant pour protéger les routes en fonction du rôle
export function RoleGuard({ children, allowedRoles }) {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();

  // Afficher un indicateur de chargement pendant la vérification
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Vérifier si l'utilisateur a un rôle autorisé
  if (!allowedRoles || hasRole(allowedRoles)) {
    return children;
  }

  // Rediriger vers une page d'accès non autorisé
  return <Navigate to="/unauthorized" replace />;
}

// Garde simple pour vérifier l'authentification sans vérifier le rôle
export function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
} 