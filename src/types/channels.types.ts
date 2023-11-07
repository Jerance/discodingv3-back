import { ObjectId } from "mongodb";

export interface Channels {
    senderId: ObjectId
    name: string
    type: string
}