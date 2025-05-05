import { sign } from 'hono/jwt'
import env from '../config/env.js'
import { sendEmail } from './mailer.js'

/**
 * Sends a verification email to the user
 * @param userEmail The email address of the user
 * @returns Promise<boolean> True if email was sent successfully
 */
export async function sendVerificationEmail(userEmail) {
  const verificationToken = await sign(
    {
      email: userEmail,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
    },
    env.JWT_SECRET,
  )
  const verificationUrl = `http://127.0.0.1:3003/verify/${verificationToken}`
  const html = `
        <h1>Vérification de l'email</h1>
        <p>Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email :</p>
        <a href="${verificationUrl}">Vérifier l'email</a>
        <p>Ce lien expirera dans 24 heures.</p>
        <p>Si vous n'avez pas demandé cette vérification, veuillez ignorer cet email.</p>
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
