import { AuthRegisterBody, SimpleUser } from "@/types/auth.types";
import { Users } from "@/db/models/User";
import crypto from 'crypto'
import { ObjectId, WithId } from 'mongodb';
import { Request, Response } from "express";

export async function getUserById(userId: string) {
    return Users.findOne<WithId<SimpleUser>>({ _id: new ObjectId(userId) }, { projection: { password: 0, token: 0 } });
}

export async function register(body: AuthRegisterBody) {
    const alreadyExist = await Users.findOne({ username: body.username })
    if (alreadyExist) {
        return { success: false, message: 'User already exists' }
    }

    const hashedPassword = crypto.createHash('sha256').update(body.password).digest('hex')
    const token = crypto.randomBytes(32).toString('hex')

    await Users.insertOne({
        username: body.username,
        password: hashedPassword,
        avatarUrl: body.avatarUrl,
        birthdate: body.birthdate,
        email: body.email,
        status: "",
        friends: [],
        token: token,
        createdAt: new Date(),
        servers: []
    })

    return { success: true, token }
}

export async function login(body: AuthRegisterBody) {
    const user = await Users.findOne({ username: body.username })
    if (!user) {
        return { success: false, message: 'Bad password' }
    }

    const hashedPassword = crypto.createHash('sha256').update(body.password).digest('hex')
    if (user.password !== hashedPassword) {
        return { success: false, message: 'Bad password' }
    }

    const token = crypto.randomBytes(32).toString('hex')
    await Users.updateOne({ _id: user._id }, { $set: { token } })

    return { success: true, token }
}

export function findByToken(token: string) {
    return Users.findOne<WithId<SimpleUser>>({ token }, { projection: { password: 0, token: 0 } })
}

export async function logout(req: Request, res: Response) {
    try {
        console.log('Request object:', req);
        res.clearCookie('token');
        res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}