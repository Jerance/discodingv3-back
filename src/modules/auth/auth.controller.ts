import { AuthRegisterBody } from "@/types/auth.types";
import { Express, Request, Response } from "express";
import { login, register } from "./auth.services";
import { requireLogin } from "./auth.middleware";

export function registerAuthRoutes(app: Express) {
    
    // on enregistre une route /auth/register
    // .                                        TypeParams, TypeQuery, TypeBody
    app.post('/auth/register', async (req: Request<unknown, unknown, AuthRegisterBody>, res: Response) => {
        
        // on call le service auth.register
        const result = await register(req.body)
        
        // on set un cookie si on a un token dans le result
        if (result.token) {
            res.cookie('token', result.token, { expires: new Date(+new Date() + 1000000000), sameSite: 'none' })
        }
        // on reponds a la requete http avec le result
        res.json(result)
    })
    
    app.post('/auth/login', async (req, res) => {
        const result = await login(req.body)
        // on set un cookie si on a un token dans le result
        if (result.token) {
            res.cookie('token', result.token, { expires: new Date(+new Date() + 1000000000), sameSite: 'none' })
        }
        res.json(result)
    })
    
    app.get('/auth/me', requireLogin, (req, res) => {
        res.json(req.user)
    })
}
