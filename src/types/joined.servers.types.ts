import { ObjectId } from "mongodb";

export interface JoinedServers {
    userId: ObjectId
    serverId: ObjectId
    banStatus:string
}