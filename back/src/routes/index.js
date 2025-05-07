import { Hono } from 'hono'
import authRoutes from './auth.routes.js'
import adminRoutes from './admin.routes.js'
import { authGuard } from '../middlewares/authguard.js'

const app = new Hono()

app.get('/', (c) => c.text('Hello from Hono!'))
app.route('/api', authRoutes)
app.route('/api', adminRoutes)
app.get(
    '/api/authenticated',
    authGuard(),
    (c) => {
        const user = c.get('user')
        return c.text('Authentificated route, hi ' + user.email)
    }
)


export default app
