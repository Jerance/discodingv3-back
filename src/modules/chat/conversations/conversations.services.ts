// conversations.services.ts
import { Conversation } from '@/db/models/Conversations';
import { ObjectId } from "mongodb";

export async function createConversation(userIds: ObjectId[]): Promise<ObjectId | null> {
    try {
        const conversation = {
            users: userIds,
            updatedAt: new Date(),
        };

        const result = await Conversation.insertOne(conversation);

        if (result.insertedId) {
            return result.insertedId;
        }

        return null;
    } catch (error) {
        console.error("Error creating conversation:", error);
        return null;
    }
}

export async function getConversation(userIds: ObjectId[]) {
    try {
        const result = await Conversation.findOne({ users: { $all: userIds } });

        console.log(result)

        if (result) {
            return result
        }
        return null;
    } catch (error) {
        console.error("Error creating conversation:", error);
        return null;
    }
}
