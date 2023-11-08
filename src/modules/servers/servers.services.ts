import { Servers } from "@/db/models/Servers"
import { ObjectId } from "mongodb";
import { UsersServers } from "@/db/models/Users_servers";
import { Request } from "express";
import { Users } from "@/db/models/User";

export async function createServer(req: Request) {
    const server = await Servers.insertOne({
        iconUrl: req.body.iconUrl,
        name: req.body.name,
        roles: req.body.roles
    })

    await UsersServers.insertOne({ server_id: new ObjectId(server.insertedId), users: [new ObjectId(req.user?._id)] })

    if(!server) {
        return { success: false }
    }

    return { success: true, server }
}

export async function findServerById(id: string) {
    const serv = await Servers.findOne({ _id: new ObjectId(id) })

    if(!serv) {
        return { success: false }
    }

    return { success: true, serv }
}

export async function joinServer(req: Request) {
    const join = await UsersServers.updateOne({ server_id: new ObjectId(req.params.idServer) }, { $push: { users: new ObjectId(req.user?._id) }})

    const userUpdate = await Users.updateOne({ _id: new ObjectId(req.user?._id) }, { $push: { servers: new ObjectId(req.params.idServer) } })

    if(!join || !userUpdate) {
        return { success: false }
    }

    return { success: true, join }
}