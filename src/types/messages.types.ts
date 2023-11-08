import { ObjectId } from "mongodb";

export interface Messages {
    senderId: ObjectId
    idSrc: ObjectId
    content: string
    createdAt: Date
}