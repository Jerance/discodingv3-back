import { ObjectId } from "mongodb";

export interface Friends {
    user1: ObjectId
    user2: ObjectId
    blocked:boolean
}