import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { exercisesRoutes } from './routes/exercises.routes.js';

const app = new Hono();

// Middleware
app.use('/*', cors());

// Routes
app.route('/api/exercises', exercisesRoutes);

export default app; 