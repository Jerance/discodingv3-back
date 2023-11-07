import { ObjectId } from "mongodb";

export interface Messages {
    senderId: ObjectId
    receiverId: ObjectId
    content:string
    createdAt:Date
}