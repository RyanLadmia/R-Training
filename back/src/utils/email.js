import { sign } from 'hono/jwt'
import env from '../config/env.js'
import { sendEmail } from './mailer.js'

/**
 * Sends a verification email to the user
 * @param userEmail The email address of the user
 * @param verificationToken The verification token
 * @returns Promise<boolean> True if email was sent successfully
 */
export async function sendVerificationEmail(userEmail, verificationToken) {
  const verificationUrl = `${env.APP_URL}/auth/verify-email/${verificationToken}`
  const html = `
        <h1>Vérification de l'email</h1>
        <p>Bienvenue ! Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Vérifier mon email</a>
        <p>Ce lien expirera dans 24 heures.</p>
        <p>Si vous n'avez pas créé de compte, veuillez ignorer cet email.</p>
        <p>À bientôt !</p>
      `
  try {
    await sendEmail(userEmail, 'Vérifiez votre adresse email', html)
    return true
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de vérification :', error)
    return false
  }
}

export async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${env.APP_URL}/auth/reset-password?token=${resetToken}`
  const html = `
        <h1>Réinitialisation de mot de passe</h1>
        <p>Bonjour,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour procéder :</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Réinitialiser mon mot de passe
        </a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
        <p>À bientôt !</p>
      `
  try {
    await sendEmail(email, 'Réinitialisation de votre mot de passe', html)
    return true
  } catch (error) {
    console.error('Error sending reset password email:', error)
    return false
  }
}
