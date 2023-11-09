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

    await UsersServers.insertOne({ server_id: new ObjectId(server.insertedId), users: [{ idUser: new ObjectId(req.user?._id) }] })

    await Users.updateOne({ _id: new ObjectId(req.user?._id) }, { $push: { servers: { idServer: new ObjectId(server.insertedId), banStatus: false, roles: ["owner", "admin"] } } })

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
    const join = await UsersServers.updateOne({ server_id: new ObjectId(req.params.idServer) }, { $push: { users: { idUser: new ObjectId(req.user?._id) } }})

    const userUpdate = await Users.updateOne({ _id: new ObjectId(req.user?._id) }, { $push: { servers: { idServer: new ObjectId(req.params.idServer), banStatus: false, roles: ["member"] } } })

    if(!join || !userUpdate) {
        return { success: false }
    }

    return { success: true, join }
}

export async function quitServer(req: Request){

    if(req.user?._id && req.params.idServer){
        await Users.updateOne({ _id: req.user?._id },{ $pull: { servers: { idServer: new ObjectId(req.params.idServer) } } })
        await UsersServers.updateOne({ server_id: new ObjectId(req.params.idServer)}, { $pull: { users: { idUser: req.user?._id } } })

        return { success: true }
    }

    return { success: false }
}

export async function deleteServer(req: Request){

    if(req.params.idServer) {

        await Users.updateMany({ "servers.idServer": new ObjectId(req.params.idServer) }, { $pull: { servers: { idServer: new ObjectId(req.params.idServer) } } })

        await UsersServers.deleteOne({ server_id: new ObjectId(req.params.idServer) })

        await Servers.deleteOne({ _id: new ObjectId(req.params.idServer) })

        return { success: true }
    }

    return { success: false }
}