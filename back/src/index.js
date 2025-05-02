import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import router from './routes/index.js'
import { env } from "./config/env.js";

const app = new Hono()

app.use('/api/*', cors())
app.route('/', router)

// Utiliser la variable d'environnement PORT depuis le fichier .env
const port = env.PORT
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})