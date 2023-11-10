import { Express, Request } from "express";
// import { requireLogin } from "../auth/auth.middleware";
import {
    createServer,
    deleteServer,
    findServerById,
    getMyServer,
    joinServer,
    quitServer
} from "@/modules/servers/servers.services";
import { requireLogin } from "@/modules/auth/auth.middleware";

export function registerServerRoutes(app: Express) {

    app.post('/server', requireLogin, async (req, res)  => {
        const server = await createServer(req)

        if (server.success) {
            return res.send({
                status: 200,
                server: server.server
            })
        }
        else {
            return res.status(500).send({ message: "error" })
        }
    })

    app.post('/server/:idServer/join', requireLogin , async (req, res) => {
        const join = await joinServer(req)

        console.log(req.params)
        if(join.success) {
            return res.send({
                status: 200,
                // join: join.join
            })
        }

        return res.status(500).send({ message: "error" })
    })

    app.get('/server', requireLogin,async (req: Request<unknown, unknown, unknown, { id: string }>, res) => {

        if (!req.query.id){
            return res.status(400).send({
                message: "bad request"
            })
        }

        const serv = await findServerById(req.query.id)

        if(serv.success) {
            return res.status(200).send({
                status: 200,
                serv
            })
        }

        return res.status(500).send({ message: "error" })
    })

    app.delete('/server/:idServer/quit', requireLogin, async (req, res) => {
        const quit = await quitServer(req)

        if(quit.success) {
            return res.status(200).send({
                status: 200,
                quit
            })
        }

        return res.status(500).send({ message: "error" })
    })

    app.delete('/server/:idServer', requireLogin, async (req, res) => {
        const deleted = await deleteServer(req)

        if(deleted.success){
            return res.status(200).send({
                status: 200
            })
        }

        return res.status(500).send({ message: "error" })

    })

    app.get('/servers/me', requireLogin, async (req, res) => {
        const servs = await getMyServer(req)

        console.log(servs)
        if(servs.success){
            return res.status(200).send({
                status: 200,
                servers: servs.servers
            })
        }

        return res.status(500).send({ message: "error" })

    })

}
