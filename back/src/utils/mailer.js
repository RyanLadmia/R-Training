import nodemailer from 'nodemailer'
import env from '../config/env.js'

const transporter = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: env.SMTP_PORT,
	secure: false, // true pour 465, false pour d'autres ports
	auth: {
		user: env.SMTP_USERNAME,
		pass: env.SMTP_PASSWORD,
	},
})

export const sendEmail = async (to, subject, text) => {
	const mailOptions = {
		from: env.FROM_EMAIL,
		to,
		subject,
		text,
	}

	try {
		const info = await transporter.sendMail(mailOptions)
		console.log('Email sent: ' + info.response)
	} catch (error) {
		console.error('Error sending email:', error)
	}
}
