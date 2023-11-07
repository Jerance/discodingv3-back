import { ObjectId } from "mongodb";

export interface Conversations {
    user1: ObjectId
    user2: ObjectId
    updatedAt:Date
}