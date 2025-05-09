/*Login*/
'use client'

import { signIn } from "@/api/auth"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/authContext'
import LoginForm from '@/components/auth/LoginForm'
import { useState, useRef } from 'react'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()
  const [verificationMessage, setVerificationMessage] = useState(null)
  const loginFormRef = useRef(null)

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      return await signIn(data)
    },
    onSuccess: (data) => {
      console.log("Données de réponse:", data);
      
      // Si l'utilisateur n'est pas vérifié, afficher le message mais ne pas le connecter
      if (data.needsVerification) {
        setVerificationMessage(data.message);
        return;
      }
      
      // Vérifier que les données utilisateur existent
      if (!data.user) {
        console.error("Données utilisateur manquantes dans la réponse");
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
      console.error("Erreur de connexion:", error);
      // Appeler la fonction setServerErrors du LoginForm
      loginFormRef.current?.setServerErrors(error);
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
        ref={loginFormRef}
        onLogin={handleLogin} 
        isPending={loginMutation.isPending} 
      />
    </div>
  )
}

export default LoginPage





