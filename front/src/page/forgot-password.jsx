'use client'

import { useState } from 'react'
import { useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
import { forgotPassword } from '@/api/auth'
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email) => {
      return await forgotPassword(email)
    },
    onSuccess: () => {
      setIsEmailSent(true)
      setError('')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || "Une erreur est survenue"
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError("Veuillez saisir votre adresse email")
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre adresse email",
        variant: "destructive"
      })
      return
    }
    setError('')
    forgotPasswordMutation.mutate(email)
  }

  if (isEmailSent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Email envoyé</CardTitle>
            <CardDescription>Instructions de réinitialisation envoyées</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Si un compte existe avec l'adresse {email}, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/auth/login">
              <Button variant="outline">
                Retour à la connexion
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Mot de passe oublié</CardTitle>
          <CardDescription>
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
                Adresse email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error ? "border-red-500" : ""}
              />
              {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              type="submit" 
              className="w-full"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending ? 'Envoi en cours...' : 'Envoyer les instructions'}
            </Button>
            <div className="text-sm text-center">
              <Link
                to="/auth/login"
                className="text-blue-600 hover:underline"
              >
                Retour à la connexion
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
