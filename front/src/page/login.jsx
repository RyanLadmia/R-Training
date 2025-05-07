/*Login*/
'use client'

import { signIn } from "@/api/auth"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/authContext'
import LoginForm from '@/components/auth/LoginForm'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      return await signIn(data)
    },
    onSuccess: (data) => {
      console.log("Données de réponse:", data);
      
      // Vérifier que les données utilisateur existent
      if (!data.user) {
        console.error("Données utilisateur manquantes dans la réponse");
        return;
      }
      
      // Stocker l'ID utilisateur pour les requêtes futures
      localStorage.setItem('userId', data.user.id);
      
      // Utiliser la fonction login du contexte d'authentification
      authLogin(data.token, data.user);
      
      // Rediriger l'utilisateur selon son rôle
      if (data.user.role === 'admin') {
        navigate('/admin/profile');
      } else if (data.user.role === 'trainer') {
        navigate('/trainer/profile');
      } else {
        navigate('/user/profile');
      }
    },
    onError: (error) => {
      // L'erreur sera gérée par le composant de formulaire
      console.error("Erreur de connexion:", error)
    }
  })

  const handleLogin = (formData) => {
    loginMutation.mutate(formData)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm 
        onLogin={handleLogin} 
        isPending={loginMutation.isPending} 
      />
    </div>
  )
}

export default LoginPage





