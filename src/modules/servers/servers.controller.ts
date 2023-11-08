import { Express, Request } from "express";
// import { requireLogin } from "../auth/auth.middleware";
import { createServer, findServerById, joinServer } from "@/modules/servers/servers.services";
import { isLogin, requireLogin } from "@/modules/auth/auth.middleware";

export function registerServerRoutes(app: Express) {

    app.post('/server', isLogin, requireLogin, async (req, res)  => {
        const server = await createServer(req)

        console.log("tth")
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

    app.post('/server/join', isLogin, requireLogin , async (req, res) => {
        const join = await joinServer(req)

        if(join.success) {
            return res.send({
                status: 200,
                // join: join.join
            })
        }

        return res.status(500).send({ message: "error" })
    })

    app.get('/server', async (req: Request<unknown, unknown, unknown, { id: string }>, res) => {

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
}
