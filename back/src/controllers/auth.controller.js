import authService from "../services/auth.service.js";
import { comparePassword, hashPassword} from "../utils/password.js";

// Inscription
async function register(c) {
    try{
        const data = c.req.valid('json')
        await authService.register(data)
        return c.json({
            message: "Registration succesful. Please check your email for  verification."
        }, 201)
    } catch (error) {
        console.log(error)
            return c.json({ error: "Registrration failed"}, 400)
    }
}

// Connexion




