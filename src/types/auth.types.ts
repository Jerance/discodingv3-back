export interface AuthRegisterBody {
    username: string
    password: string
    avatarUrl:string
    email:string
    birthdate:Date
}

export interface User {
    username: string
    avatarUrl:string
    password: string
    email:string
    birthdate:Date
    token: string
    status:string
    createdAt: Date
}

export interface SimpleUser {
    username: string
    createdAt: Date
}
