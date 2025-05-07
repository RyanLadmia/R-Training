import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authGuard } from '../middlewares/authguard.js'
import {
    getAdminProfileById
} from '../controllers/admin.controller.js'

const adminRoutes = new Hono()

// Récupérer le profil d'un admin
adminRoutes.get("/admin/profile/:userId", authGuard(), getAdminProfileById);

export default adminRoutes;
