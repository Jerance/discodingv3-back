import { Message } from '@/db/models/Messages';
import { ObjectId } from "mongodb";
import { Messages } from "@/types/messages.types";
import { createConversation, getExistingConversation } from '../conversations/conversations.services';

export async function getAllMessagesInConversation(conversationId: string): Promise<Messages[] | null> {
    try {
        const messages = await Message.find({ idSrc: new ObjectId(conversationId), content: { $exists: true } }).toArray();
        return messages;
    } catch (error) {
        console.error("Error fetching messages in conversation:", error);
        return null;
    }
}

export async function sendMessage(newMessage: Messages): Promise<boolean> {
    try {
        newMessage.senderId = new ObjectId(newMessage.senderId);
        newMessage.createdAt = new Date();

        const existingConversation = await getExistingConversation(newMessage.senderId);

        if (!existingConversation) {
            const newConversation = await createConversation([newMessage.senderId]);
            if (newConversation) {
                newMessage.idSrc = newConversation;
            } else {
                console.error("Error creating conversation");
                return false;
            }
        } else {
            newMessage.idSrc = existingConversation;
        }

        await Message.insertOne(newMessage);
        return true;
    } catch (error) {
        console.error("Error sending message:", error);
        return false;
    }
}

export async function editMessage(messageId: ObjectId, updatedMessage: Messages): Promise<boolean> {
    try {
        updatedMessage.senderId = new ObjectId(updatedMessage.senderId);
        updatedMessage.idSrc = new ObjectId(updatedMessage.idSrc);
        updatedMessage.createdAt = new Date();

        const result = await Message.updateOne(
            { _id: messageId },
            { $set: updatedMessage }
        );

        return result.modifiedCount === 1;
    } catch (error) {
        console.error("Error editing message:", error);
        return false;
    }
}

export async function deleteMessage(messageId: ObjectId): Promise<boolean> {
    try {
        const result = await Message.deleteOne({ _id: messageId });
        return result.deletedCount === 1;
    } catch (error) {
        console.error("Error deleting message:", error);
        return false;
    }
}
