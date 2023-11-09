// auth.types.ts

import { ObjectId } from "mongodb"

export interface AuthRegisterBody {
    username: string
    password: string
    avatarUrl: string
    email: string
    birthdate: Date
}

export interface User {
    username: string
    avatarUrl: string
    password: string
    email: string
    birthdate: Date
    token: string
    status: string
    friends: {
        id: ObjectId;
        status: "pending" | "friend" | "blocked";
    }[]
    createdAt: Date
    servers: {
        idServer: ObjectId;
        roles: Array<string>,
        banStatus: true | false
    }[]
}

export interface SimpleUser {
    username: string
    createdAt: Date
}
