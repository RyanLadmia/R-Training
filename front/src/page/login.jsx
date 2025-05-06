/*Login*/
'use client'

import { signIn } from "@/api/auth"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from 'react-router-dom'
import LoginForm from '@/components/auth/LoginForm'

const LoginPage = () => {
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      return await signIn(data)
    },
    onSuccess: (data) => {
      // Stocker le token dans le localStorage
      localStorage.setItem('accessToken', data.token)
      // Redirection vers le dashboard ou la page d'accueil
      navigate('/')
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





