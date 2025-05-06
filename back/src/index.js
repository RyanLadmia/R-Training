import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { prettyJSON } from 'hono/pretty-json'
import { logger } from 'hono/logger'
import { jwt } from 'hono/jwt'
import router from './routes/index.js'
import env from "./config/env.js";

const app = new Hono()

app.use('/api/*', cors())
app.route('/', router)

// Log pour vérifier les variables d'environnement
console.log('Variables d\'environnement chargées :', {
    PORT: env.PORT,
    NODE_ENV: env.NODE_ENV,
    SMTP_HOST: env.SMTP_HOST,
    SMTP_USERNAME: env.SMTP_USERNAME ? '✓' : '✗',
    SMTP_PASSWORD: env.SMTP_PASSWORD ? '✓' : '✗',
});

// Utiliser la variable d'environnement PORT depuis le fichier .env
const port = env.PORT
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})