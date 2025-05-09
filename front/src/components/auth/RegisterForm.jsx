'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from 'react-router-dom'

export default function RegisterForm({ onRegister, isPending }) {
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    phoneNumber: '',
    general: ''
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    // Réinitialiser les erreurs
    const newErrors = { ...errors }
    Object.keys(newErrors).forEach(key => newErrors[key] = '')
    
    // Validation côté client
    let isValid = true
    
    if (!firstname) {
      newErrors.firstname = 'Le prénom est requis'
      isValid = false
    }
    
    if (!lastname) {
      newErrors.lastname = 'Le nom est requis'
      isValid = false
    }
    
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
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      newErrors.password = 'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre'
      isValid = false
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
      isValid = false
    }
    
    if (phoneNumber && !/^(0[67][0-9]{8}|\+33[67][0-9]{8})$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Format de numéro de téléphone invalide'
      isValid = false
    }
    
    setErrors(newErrors)
    
    if (!isValid) return
    
    // Mettre en majuscule la première lettre du prénom et du nom
    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    
    const formattedFirstname = firstname ? capitalizeFirstLetter(firstname) : '';
    const formattedLastname = lastname ? capitalizeFirstLetter(lastname) : '';
    
    // Préparer les données formatées
    const formattedData = {
      firstname: formattedFirstname,
      lastname: formattedLastname,
      email: email.trim().toLowerCase(),
      password,
      confirmPassword,
      birthDate: birthDate ? birthDate : undefined,
      phoneNumber: phoneNumber || undefined
    }
    
    try {
      // Appeler la fonction de callback avec les données formatées
      await onRegister(formattedData);
      setIsRegistered(true);
    } catch (error) {
      setServerErrors(error);
    }
  }

  // Fonction pour gérer les erreurs externes (du serveur)
  const setServerErrors = (error) => {
    const newErrors = { ...errors }
    
    // Réinitialiser les erreurs
    Object.keys(newErrors).forEach(key => newErrors[key] = '')
    
    if (error.response?.data?.error?.issues) {
      // Erreurs de validation Zod
      const issues = error.response.data.error.issues;
      issues.forEach(issue => {
        const field = issue.path[0];
        if (newErrors.hasOwnProperty(field)) {
          newErrors[field] = issue.message;
        } else {
          newErrors.general = newErrors.general 
            ? `${newErrors.general}\n${issue.message}` 
            : issue.message;
        }
      });
    } else if (error.response?.data?.error) {
      // Erreur du serveur avec message
      newErrors.general = error.response.data.error;
    } else {
      // Erreur générique
      newErrors.general = 'Une erreur est survenue lors de l\'inscription';
    }
    
    setErrors(newErrors);
  }

  if (isRegistered) {
    return (
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Inscription réussie !</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-green-600">
              Veuillez consulter vos emails pour confirmer votre adresse email.
            </p>
            <p className="text-gray-600">
              Un email de confirmation a été envoyé à l'adresse {email}.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/auth/login">
            <Button variant="outline">
              Aller à la page de connexion
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Inscription</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="firstname" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Prénom
            </label>
            <Input
              id="firstname"
              type="text"
              placeholder="Entrez votre prénom"
              value={firstname}
              onChange={(e) => {
                const value = e.target.value;
                setFirstname(value);
              }}
              className={errors.firstname ? "border-red-500" : ""}
            />
            {errors.firstname && (
              <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="lastname" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Nom
            </label>
            <Input
              id="lastname"
              type="text"
              placeholder="Entrez votre nom"
              value={lastname}
              onChange={(e) => {
                const value = e.target.value;
                setLastname(value);
              }}
              className={errors.lastname ? "border-red-500" : ""}
            />
            {errors.lastname && (
              <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
            )}
          </div>
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
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="birthDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Date de naissance (optionnel)
            </label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={errors.birthDate ? "border-red-500" : ""}
            />
            {errors.birthDate && (
              <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Numéro de téléphone (optionnel)
            </label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Entrez votre numéro de téléphone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Créer votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Confirmation du mot de passe
            </label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirmer votre mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          {errors.general && (
            <div className="text-red-500 text-sm whitespace-pre-line">
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
            {isPending ? 'Inscription en cours...' : 'S\'inscrire'}
          </Button>
          <div className="text-sm text-center">
            Vous avez déjà un compte ?{' '}
            <Link
              to="/auth/login"
              className="text-blue-600 hover:underline"
            >
              Se connecter
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
