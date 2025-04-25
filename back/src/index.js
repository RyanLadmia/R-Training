import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import router from './routes/index.js'
const app = new Hono()

app.use('/api/*', cors())
app.route('/', router)
const port = 3003
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
