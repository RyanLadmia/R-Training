import { createMiddleware } from "hono";
import { verify } from "hono/jwt";
import env from "../config/env.js";
import authService from "../services/auth.service.js";

export function authGuard() {
    return createMiddleware(async (c, next) => {
        const [prefix, token] = c.req.header("Authorization")?.split(" ") || [
            null,
            undefined,
        ];
        if (prefix !== "Bearer") {
            return c.json({ error: "No Bearer token" }, 401);
        }
        if (!token) {
            return c.json({ error: "You must be authenticated to access this resource" }, 401);
        }
        try {
            const decoded = await verify(token, env.JWT_SECRET);
            if (!decoded) {
            return C.json({ error: "Invalid Payload" }, 401);
        }

        const user = await authService.findUserByEmail(decoded.email);
        if (user) {
            c.set("user", user);
            await next();
        } else {
            return c.json({ error: "Permission denied, you are not authorized to access this resource" }, 401);
        }
    } catch (error) {
        return c.json({ 
            error: "Internal server error" 
        }, 500);
    } 
    });
}

export function roleMiddleware(requiredRole) {
    return createMiddleware(async (c, next) => {
        const [prefix, token] = c.req.header("Authorization")?.split(" ") || [
            null, 
            undefined,
        ];
        if (prefix !== "Bearer") {
            return c.json({ error: "NoBearer token"}, 401);
        }
        if (!token) {
            return c.json({ error: "You must be authenticated to access this resource"}, 401);
        }
        try {
            const decoded = await verify(token, env.JWT_SECRET);
            if (!decoded) {
                return c.json({ error: "Invalid Payload"}, 401);
            }

            const userRoles = await authService.getUserRoles(decoded.id);
            if (!userRoles.includes(requiredRole)) {
                return c.json({ error: "Vous n'avez pas accès à cette ressource."}, 403);               
            }
            await next();
        } catch (error) {
            return c.json({
                error: "Internal server error"
            }, 500);
        }
    });
}
