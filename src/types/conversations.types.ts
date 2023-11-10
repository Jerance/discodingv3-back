import { ObjectId } from "mongodb";

export interface Conversations {
    users: ObjectId[]
    updatedAt: Date
}