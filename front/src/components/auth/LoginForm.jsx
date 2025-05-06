'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from 'react-router-dom'

export default function LoginForm({ onLogin, isPending }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    
    // Réinitialiser les erreurs
    const newErrors = { ...errors }
    Object.keys(newErrors).forEach(key => newErrors[key] = '')
    
    // Validation côté client
    let isValid = true
    
    if (!email) {
      newErrors.email = 'L\'email est requis'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Format d\'email invalide'
      isValid = false
    }
    
    if (!password) {
      newErrors.password = 'Le mot de passe est requis'
      isValid = false
    } else if (password.length < 10) {
      newErrors.password = 'Le mot de passe doit contenir au moins 10 caractères'
      isValid = false
    }
    
    setErrors(newErrors)
    
    if (!isValid) return
    
    // Formatage des données
    const loginData = {
      email: email.trim().toLowerCase(),
      password
    }
    
    // Appeler la fonction de callback avec les données formatées
    onLogin(loginData)
  }

  // Fonction pour gérer les erreurs externes (du serveur)
  const setServerErrors = (error) => {
    const newErrors = { ...errors }
    
    // Réinitialiser les erreurs
    Object.keys(newErrors).forEach(key => newErrors[key] = '')
    
    if (error.response?.data?.error) {
      // Selon le message d'erreur, on peut le diriger vers le bon champ
      const errorMessage = error.response.data.error;
      
      if (errorMessage.includes('Email ou mot de passe incorrect')) {
        newErrors.general = 'Email ou mot de passe incorrect';
      } else if (errorMessage.includes('Veuillez vérifier votre email')) {
        newErrors.general = 'Veuillez vérifier votre email avant de vous connecter';
      } else {
        newErrors.general = errorMessage;
      }
    } else {
      // Erreur générique
      newErrors.general = 'Une erreur est survenue lors de la connexion';
    }
    
    setErrors(newErrors);
  }

  return (
    <Card className="w-full max-w-md bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
        <CardDescription>Connectez-vous à votre compte</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Adresse email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Entrez votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "border-red-500" : ""}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Mot de passe
              </label>
              <Link 
                to="/auth/forgot-password" 
                className="text-xs text-blue-600 hover:underline"
              >
                Mot de passe oublié?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "border-red-500" : ""}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          {errors.general && (
            <div className="text-red-500 text-sm text-center">
              {errors.general}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isPending}
          >
            {isPending ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
          <div className="text-sm text-center">
            Vous n'avez pas de compte?{' '}
            <Link 
              to="/auth/register" 
              className="text-blue-600 hover:underline"
            >
              Créer un compte
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
