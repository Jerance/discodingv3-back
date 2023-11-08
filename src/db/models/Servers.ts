import { ServersType } from "@/types/servers.types";
import { db } from "../mongo";

export const Servers = db!.collection<ServersType>('servers')
