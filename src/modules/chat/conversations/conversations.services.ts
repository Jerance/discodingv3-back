// conversations.services.ts

import { Conversation } from '@/db/models/Conversations';
import { ObjectId } from "mongodb";

export async function createConversation(userIds: [ObjectId]): Promise<ObjectId | null> {
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

export async function getExistingConversation(conversationId: ObjectId): Promise<ObjectId | null> {
    try {
        const conversation = await Conversation.findOne({
            _id: new ObjectId(conversationId),
        });

        if (conversation) {
            return conversation._id;
        }

        return null;
    } catch (error) {
        console.error("Error checking for existing conversation:", error);
        return null;
    }
}
