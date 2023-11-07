import { Express, Request, Response } from "express";
import { requireLogin } from "../auth/auth.middleware";
import { getAllFriends, sendAddFriendRequest, acceptFriendRequest, refuseFriendRequest, blockFriend } from "./friends.services";

export function actionsFriendRoutes(app: Express) {

    app.get('/all-friends', requireLogin, async (req: Request, res: Response) => {
        const { userId, tabName } = req.body;
        const friends = await getAllFriends(userId, tabName);

        if (friends !== null) {
            res.json({ success: true, friends });
        } else {
            res.status(400).json({ success: false, message: 'User not found' });
        }
    });

    app.post('/send-request-friend', requireLogin, async (req: Request, res: Response) => {
        const { userId, friendUsername } = req.body;
        const success = await sendAddFriendRequest(userId, friendUsername);

        if (success) {
            res.json({ success: true, message: "Demande d'mi envoyé avec succès"});
        } else {
            res.status(400).json({ success: false, message: 'Impossible d\'ajouter l\'ami' });
        }
    });

    app.post('/accept-friend-request', requireLogin, async (req: Request, res: Response) => {
        const { userId, friendId } = req.body;
        const success = await acceptFriendRequest(userId, friendId);

        if (success) {
            res.json({ success: true, message: 'Demande d\'ami acceptée avec succès' });
        } else {
            res.status(400).json({ success: false, message: 'Impossible d\'accepter la demande d\'ami' });
        }
    });

    app.post('/refuse-friend-request', requireLogin, async (req: Request, res: Response) => {
        const { userId, friendId } = req.body;
        const success = await refuseFriendRequest(userId, friendId);

        if (success) {
            res.json({ success: true, message: 'Demande d\'ami refusée avec succès' });
        } else {
            res.status(400).json({ success: false, message: 'Impossible de refuser la demande d\'ami' });
        }
    });

    app.post('/block-friend', requireLogin, async (req: Request, res: Response) => {
        const { userId, friendId } = req.body;
        const success = await blockFriend(userId, friendId);

        if (success) {
            res.json({ success: true, message: 'Ami bloqué avec succès' });
        } else {
            res.status(400).json({ success: false, message: 'Impossible de bloquer l\'ami' });
        }
    });
}
