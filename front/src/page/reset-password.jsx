'use client'

import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { resetPassword } from '@/api/auth'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/auth/login')
    }
  }, [token, navigate])

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, password, confirmPassword }) => {
      return await resetPassword(token, password, confirmPassword)
    },
    onSuccess: () => {
      setIsSuccess(true)
      setError('')
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate('/auth/login')
      }, 3000)
    },
    onError: (error) => {
      if (error.response?.data?.error?.issues) {
        // Gestion des erreurs Zod
        const zodError = error.response.data.error.issues[0];
        setError(zodError.message || 'Une erreur est survenue lors de la validation');
      } else {
        setError(error.response?.data?.error || 'Une erreur est survenue');
      }
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!password) {
      setError('Le mot de passe est requis')
      return
    }
    if (password.length < 10) {
      setError('Le mot de passe doit contenir au moins 10 caractères')
      return
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      setError('Le mot de passe doit contenir une majuscule, une minuscule et un chiffre')
      return
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    resetPasswordMutation.mutate({ token, password, confirmPassword })
  }

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Mot de passe réinitialisé</CardTitle>
            <CardDescription>Vous allez être redirigé vers la page de connexion</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-green-600">
              Votre mot de passe a été réinitialisé avec succès.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Réinitialiser le mot de passe</CardTitle>
          <CardDescription>
            Créez un nouveau mot de passe pour votre compte
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Nouveau mot de passe
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Entrez votre nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? "border-red-500" : ""}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium leading-none">
                Confirmer le mot de passe
              </label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirmez votre nouveau mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={error ? "border-red-500" : ""}
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 