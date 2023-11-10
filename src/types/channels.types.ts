import { ObjectId } from "mongodb";

export interface Channels {
    id_server: ObjectId
    name: string
    type: string
}