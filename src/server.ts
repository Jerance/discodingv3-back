import { createServer } from 'node:http'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { isLogin } from './modules/auth/auth.middleware'
import { initSocketio } from './websocket'

import { registerAuthRoutes } from './modules/auth/auth.controller'
import { actionsFriendRoutes } from './modules/friends/friends.controller'
import { registerServerRoutes } from "@/modules/servers/servers.controller";
import { messageRoutes } from './modules/chat/messages/message.controller'

export function initWebServer() {
    // Creation du serveur http
    const app = express()
    const server = createServer(app)

    // init socket.io server
    initSocketio(server)

    // Utilise le plugin CORS
    app.use(cors({
        credentials: true,
        origin(_, callback) {
            callback(null, true)
        },
    }))

    // lire les cookies
    app.use(cookieParser())

    // permet de décoder le contenu des requetes http (de type JSON)
    app.use(express.json())

    // Add isLogin middleware
    app.use(isLogin)

    // On enregistre nos controllers
    registerAuthRoutes(app)

    registerServerRoutes(app)

    actionsFriendRoutes(app)

    messageRoutes(app)

    // On ecoute sur le port configuré avec le .env
    server.listen(process.env.NODE_PORT, () => {
        console.log(`Listening on http://localhost:${process.env.NODE_PORT}`)
    })

    return { server, app };
}
