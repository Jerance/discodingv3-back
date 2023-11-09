import { Express, Request } from "express";
// import { requireLogin } from "../auth/auth.middleware";
import { createServer, deleteServer, findServerById, joinServer, quitServer } from "@/modules/servers/servers.services";
import { isLogin, requireLogin } from "@/modules/auth/auth.middleware";

export function registerServerRoutes(app: Express) {

    app.post('/server', isLogin, requireLogin, async (req, res)  => {
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

    app.post('/server/:idServer/join', isLogin, requireLogin , async (req, res) => {
        const join = await joinServer(req)

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

    app.delete('/server/:idServer/quit', isLogin, requireLogin, async (req, res) => {
        const quit = await quitServer(req)

        if(quit.success) {
            return res.status(200).send({
                status: 200,
                quit
            })
        }

        return res.status(500).send({ message: "error" })
    })

    app.delete('/server/:idServer', isLogin, requireLogin, async (req, res) => {
        const deleted = await deleteServer(req)

        if(deleted.success){
            return res.status(200).send({
                status: 200
            })
        }

        return res.status(500).send({ message: "error" })

    })

}
