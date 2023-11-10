import { Express } from "express";
import { requireLogin } from "@/modules/auth/auth.middleware";
import { createChannel, getAllChannelByIdServer, getChannel } from "@/modules/channels/channels.services";

export function registerChannelRoutes(app: Express){
    app.get('/channels/:idServer', requireLogin, async (req, res) => {
        const channels = await getAllChannelByIdServer(req.params.idServer)

        if (channels.success) {
            return res.status(200).send({
                success: channels.success,
                channels
            })
        }

        return res.status(500).send({ message: "error" })
    })

    app.get('/channels/:id', requireLogin, async (req, res) => {
        const channel = await getChannel(req.params.id)

        if (channel.success) {
            return res.status(200).send(channel)
        }

        return res.status(500).send({ message: "error" })
    })

    app.post('/channels/:idServer', requireLogin, async (req, res) => {
        const channel = await createChannel(req)

        if (channel.success) {
            return res.status(200).send({
                success: channel.success,
                channel
            })
        }

        return res.status(500).send({ message: "error" })
    })
}