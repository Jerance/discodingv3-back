import { Channels } from "@/types/channels.types";
import { db } from "../mongo";

export const Channel = db!.collection<Channels>('channels')
