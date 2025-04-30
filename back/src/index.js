import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import router from './routes/index.js'
import { exercisesRoutes } from './routes/exercises.routes.js'
import config from './config/env.js'

const app = new Hono()

app.use('/api/*', cors())
app.route('/', router)
app.route('/api/exercises', exercisesRoutes)

// Utiliser la variable d'environnement PORT depuis le fichier .env
const port = config.env.PORT
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})