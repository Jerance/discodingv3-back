import { Messages } from "@/types/messages.types";
import { db } from "../mongo";

export const Message = db!.collection<Messages>('messages')
