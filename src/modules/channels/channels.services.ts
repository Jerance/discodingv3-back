import { Channel } from "@/db/models/Channels";
import { ObjectId } from "mongodb";
import { Request } from "express";

export async function createChannel(req: Request){
    const channel = await Channel.insertOne({
        id_server: new ObjectId(req.params.idServer),
        name: req.body.name,
        type: req.body.type
    })

    if (channel) {
        return { success: true, channel }
    }

    return { success: false }
}

export async function editChannelName(id: string, name: string){
    const channel = await Channel.updateOne({_id: new ObjectId(id)}, { $set : { name: name}})

    if (channel) {
        return { success: true, channel }
    }

    return { success: false }
}

export async function deleteChannel(id: string) {
    const channel = await Channel.deleteOne({ _id: new ObjectId(id) })

    if (channel) {
        return { success: true, channel }
    }

    return { success: false }
}

export async function getAllChannelByIdServer(idServer: string){
    const channels = await Channel.find({ id_server : new ObjectId(idServer) }).toArray()

    if (channels) {
        return { success: true, channels }
    }

    return { succes: false }
}

// export async function getChannelMessages(id) {
//     // const messages =
// }

export async function getChannel(idChannel: string){
    const channel = await Channel.findOne({ _id: new ObjectId(idChannel) })

    if(channel){
        return { success: true, channel }
    }

    return { success: false }
}