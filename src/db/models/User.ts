import { User } from "@/types/auth.types";
import { db } from "../mongo";

export const Users = db!.collection<User>('users')
