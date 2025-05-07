import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import router from './routes/index.js'
import env from './config/env.js'

const app = new Hono()

app.use('/api/*', cors({
  origin: env.NODE_ENV === 'production' 
    ? env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true, // Permet l'envoi de cookies avec les requêtes
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

app.route('/', router)

const port = env.PORT

// Log pour vérifier les variables d'environnement
console.log('Variables d\'environnement chargées :', {
    PORT: env.PORT,
    NODE_ENV: env.NODE_ENV,
    SMTP_HOST: env.SMTP_HOST,
    SMTP_USERNAME: env.SMTP_USERNAME ? '✓' : '✗',
    SMTP_PASSWORD: env.SMTP_PASSWORD ? '✓' : '✗',
});

// Utiliser la variable d'environnement PORT depuis le fichier .env
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})