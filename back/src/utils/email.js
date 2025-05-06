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
  const verificationUrl = `${process.env.APP_URL || 'http://localhost:5174'}/verify-email/${verificationToken}`
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
  const verificationUrl = `${env.APP_URL}/reset-password?token=${resetToken}`
  const html = `
        <h1>Reset password</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${verificationUrl}">Reset password</a>
        <p>This link will expire in 24 hours.</p>
      `
  try {
    await sendEmail(email, 'Verify your email address', html)
    return true
  } catch (error) {
    console.error('Error sending verification email:', error)
    return false
  }
}
