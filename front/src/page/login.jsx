/*Login*/
'use client'

import { signIn } from "@/api/auth"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/authContext'
import LoginForm from '@/components/auth/LoginForm'
import { useState } from 'react'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()
  const [verificationMessage, setVerificationMessage] = useState(null)

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

      // Si l'utilisateur n'est pas vérifié, afficher le message mais ne pas le connecter
      if (data.needsVerification) {
        setVerificationMessage("Un email vous a été envoyé pour confirmer votre adresse email.");
        return;
      }
      
      // Utiliser la fonction login du contexte d'authentification
      authLogin(data.user);
      
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
      // Gérer spécifiquement l'erreur de vérification d'email
      if (error.response?.data?.error === 'Veuillez vérifier votre email avant de vous connecter') {
        setVerificationMessage("Un email vous a été envoyé pour confirmer votre adresse email.");
      } else {
        console.error("Erreur de connexion:", error);
      }
    }
  })

  const handleLogin = (formData) => {
    setVerificationMessage(null); // Réinitialiser le message à chaque tentative
    loginMutation.mutate(formData)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {verificationMessage && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
          {verificationMessage}
        </div>
      )}
      <LoginForm 
        onLogin={handleLogin} 
        isPending={loginMutation.isPending} 
      />
    </div>
  )
}

export default LoginPage





