import { Conversations } from "@/types/conversations.types";
import { db } from "../mongo";

export const Conversation = db!.collection<Conversations>('conversations')
