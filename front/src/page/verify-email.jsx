import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { verifyEmail } from '@/api/auth'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function VerifyEmail() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      return await verifyEmail(token)
    },
    onSuccess: () => {
      // Redirection vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate('/auth/login')
      }, 3000)
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Une erreur est survenue lors de la vérification')
    }
  })

  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate()
    }
  }, [token])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Vérification de l'email</CardTitle>
          <CardDescription>Validation de votre adresse email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verifyEmailMutation.isPending && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-center text-gray-600">
                Vérification de votre adresse email en cours...
              </p>
            </div>
          )}

          {verifyEmailMutation.isSuccess && (
            <div className="text-center space-y-4">
              <p className="text-green-600 font-semibold">
                Votre email a été vérifié avec succès !
              </p>
              <p className="text-gray-600">
                Vous allez être redirigé vers la page de connexion dans quelques secondes...
              </p>
              <Button
                onClick={() => navigate('/auth/login')}
                className="w-full"
              >
                Aller à la page de connexion
              </Button>
            </div>
          )}

          {verifyEmailMutation.isError && (
            <div className="text-center space-y-4">
              <p className="text-red-600">{error}</p>
              <Button
                onClick={() => navigate('/auth/login')}
                variant="outline"
                className="w-full"
              >
                Retour à la page de connexion
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 