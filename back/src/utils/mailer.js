import nodemailer from 'nodemailer'
import env from '../config/env.js'

let transporter;

// Créer le transporteur pour l'envoi d'emails seulement si les identifiants sont configurés
if (env.SMTP_USERNAME && env.SMTP_PASSWORD) {
	transporter = nodemailer.createTransport({
		host: env.SMTP_HOST,
		port: env.SMTP_PORT,
		secure: false, // true pour 465, false pour d'autres ports
		auth: {
			user: env.SMTP_USERNAME,
			pass: env.SMTP_PASSWORD,
		},
		// Paramètres supplémentaires pour le débogage
		logger: true,
		debug: process.env.NODE_ENV === 'development',
		// Désactiver la vérification du certificat en développement
		tls: {
			rejectUnauthorized: process.env.NODE_ENV === 'production'
		}
	})

	// Vérifier la configuration SMTP au démarrage
	transporter.verify(function(error, success) {
		if (error) {
			console.error('Erreur de configuration SMTP:', error);
		} else {
			console.log('Serveur SMTP prêt à envoyer des emails');
		}
	});
} else {
	console.log('Configuration SMTP non trouvée. Les emails ne seront pas envoyés en mode développement.');
}

/**
 * Envoie un email
 * @param {string} to - Adresse email du destinataire
 * @param {string} subject - Sujet de l'email
 * @param {string} html - Contenu HTML de l'email
 * @returns {Promise<boolean>} - true si l'email a été envoyé avec succès
 */
export const sendEmail = async (to, subject, html) => {
	// En développement, si pas de configuration SMTP, on simule l'envoi
	if (!transporter) {
		console.log('Email simulé en développement :');
		console.log('À:', to);
		console.log('Sujet:', subject);
		console.log('Contenu HTML:', html);
		return true;
	}

	const mailOptions = {
		from: `R-Training <${env.FROM_EMAIL}>`,
		to,
		subject,
		html,
		text: html.replace(/<[^>]*>/g, '') // Version texte de l'email
	}

	try {
		const info = await transporter.sendMail(mailOptions)
		console.log('Email envoyé avec succès:', info.messageId)
		return true
	} catch (error) {
		console.error('Erreur lors de l\'envoi de l\'email:', error)
		return false
	}
}
