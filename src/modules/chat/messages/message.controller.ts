import { Messages } from "@/types/messages.types";
import { Express, Request, Response } from "express";
import { getAllMessagesInConversation, sendMessage, editMessage, deleteMessage } from "./message.services";
import { ObjectId } from "mongodb";

export function messageRoutes(app: Express) {

    app.get('/messages/:conversationId', async (req, res) => {
        try {
            const conversationId = req.params.conversationId;

            if (!conversationId) {
                res.status(400).json({ success: false, message: "Conversation ID is missing" });
                return;
            }

            const messages = await getAllMessagesInConversation(conversationId);

            res.json({ success: true, messages });
        } catch (error) {
            console.error("Error fetching messages:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    });

    app.post('/message', async (req: Request<unknown, unknown, Messages>, res: Response) => {
        try {
            const newMessage: Messages = req.body;
            newMessage.senderId = new ObjectId(newMessage.senderId);
            newMessage.idSrc = new ObjectId(newMessage.idSrc);

            const result = await sendMessage(newMessage);

            if (result) {
                res.json({ success: true, message: "Message sent successfully" });
            } else {
                res.status(400).json({ success: false, message: "Failed to send the message" });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    });

    app.put('/message/:messageId', async (req, res) => {
        try {
            const messageId: ObjectId = new ObjectId(req.params.messageId);
            const updatedMessage: Messages = req.body;
            updatedMessage.senderId = new ObjectId(updatedMessage.senderId);
            updatedMessage.idSrc = new ObjectId(updatedMessage.idSrc);

            const result = await editMessage(messageId, updatedMessage);

            if (result) {
                res.json({ success: true, message: "Message edited successfully" });
            } else {
                res.status(400).json({ success: false, message: "Failed to edit the message" });
            }
        } catch (error) {
            console.error("Error editing message:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    });

    app.delete('/message/:messageId', async (req, res) => {
        try {
            const messageId: ObjectId = new ObjectId(req.params.messageId);

            const result = await deleteMessage(messageId);

            if (result) {
                res.json({ success: true, message: "Message deleted successfully" });
            } else {
                res.status(400).json({ success: false, message: "Failed to delete the message" });
            }
        } catch (error) {
            console.error("Error deleting message:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    });
}
