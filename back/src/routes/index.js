import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
import { verify } from 'hono/jwt'
import env from '../config/env.js'

const app = new Hono()

app.get('/', (c) => c.text('Hello from Hono!'))


export default app
