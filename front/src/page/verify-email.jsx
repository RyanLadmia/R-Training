import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { verifyEmail, resendVerificationEmail } from '@/api/auth'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

export default function VerifyEmail() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const { toast } = useToast()

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      return await verifyEmail(token)
    },
    onSuccess: () => {
      setTimeout(() => {
        navigate('/auth/login')
      }, 3000)
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Une erreur est survenue lors de la vérification')
    }
  })

  const resendEmailMutation = useMutation({
    mutationFn: async () => {
      return await resendVerificationEmail(email)
    },
    onSuccess: () => {
      toast({
        title: "Email envoyé",
        description: "Un nouveau lien de vérification a été envoyé à votre adresse email.",
        variant: "success"
      })
      setEmail('')
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Une erreur est survenue lors de l'envoi de l'email",
        variant: "destructive"
      })
    }
  })

  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate()
    }
  }, [token])

  const handleResendEmail = (e) => {
    e.preventDefault()
    if (!email) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre adresse email",
        variant: "destructive"
      })
      return
    }
    resendEmailMutation.mutate()
  }

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
              <form onSubmit={handleResendEmail} className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Si vous n'avez pas reçu le lien ou s'il a expiré, vous pouvez en demander un nouveau :
                  </p>
                  <Input
                    type="email"
                    placeholder="Entrez votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={resendEmailMutation.isPending}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={resendEmailMutation.isPending}
                >
                  {resendEmailMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Renvoyer le lien de vérification"
                  )}
                </Button>
              </form>
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