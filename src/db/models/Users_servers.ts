import { Users_servers } from "@/types/users_servers.types";
import { db } from "../mongo";

export const UsersServers = db!.collection<Users_servers>('users_servers')
