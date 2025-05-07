'use client'

import { signUp } from "@/api/auth"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from 'react-router-dom'
import RegisterForm from "@/components/auth/RegisterForm"

export default function Register() {
  const navigate = useNavigate()

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      return await signUp(data)
    },
    onSuccess: () => {
      // Redirection vers la page de connexion
      navigate('/auth/login')
    },
    onError: (error) => {
      // L'erreur sera gérée par le composant de formulaire
      console.error("Erreur d'inscription:", error);
    }
  })

  const handleRegister = (formData) => {
    registerMutation.mutate(formData)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <RegisterForm 
        onRegister={handleRegister} 
        isPending={registerMutation.isPending} 
      />
    </div>
  )
}