import { Hono } from 'hono'
import authRoutes from './auth.routes.js'

const app = new Hono()

app.get('/', (c) => c.text('Hello from Hono!'))
app.route('/api', authRoutes)


export default app
