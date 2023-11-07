import { Users } from "@/db/models/User";
import { ObjectId } from "mongodb";

export async function sendAddFriendRequest(userId: string, friendUsername: string): Promise<boolean> {
    const currentUser = await Users.findOne({ _id: new ObjectId(userId) });

    if (!currentUser) {
        return false;
    }

    const friend = await Users.findOne({ username: friendUsername });

    if (!friend) {
        return false;
    }
    

    const existingFriend = currentUser?.friends?.find(f => f.id.toString() === friend._id.toString());

    if (existingFriend) {
        return false;
    }

    currentUser.friends?.push({
        id: friend._id,
        status: "pending"
    });

    friend.friends?.push({
        id: new ObjectId(userId),
        status: "pending"
    });

    await Users.updateOne({ _id: new ObjectId(userId) }, { $set: { friends: currentUser.friends } });
    await Users.updateOne({ _id: friend._id }, { $set: { friends: friend.friends } });

    return true;
}

export async function acceptFriendRequest(userId: ObjectId, friendId: ObjectId): Promise<boolean> {
    const currentUser = await Users.findOne({ _id: new ObjectId(userId) });
    const currentFriend = await Users.findOne({ _id: new ObjectId(friendId) });

    if (!currentUser || !currentFriend) {
        return false;
    }

    const friendIndex = currentUser.friends.findIndex(f => f.id.equals(friendId) && f.status === "pending");

    if (!currentUser.friends) {
        currentUser.friends = [];
    }

    if (currentUser.friends[friendIndex]) {
        currentUser.friends[friendIndex].status = "friend";
        await Users.updateOne({ _id: new ObjectId(userId) }, { $set: { friends: currentUser.friends } });

        currentFriend.friends.push({
            id: new ObjectId(userId),
            status: "friend"
        });

        await Users.updateOne({ _id: new ObjectId(friendId) }, { $set: { friends: currentFriend.friends } });
        
        return true;
    }

    return false;
}

export async function refuseFriendRequest(userId: ObjectId, friendId: ObjectId): Promise<boolean> {
    const currentUser = await Users.findOne({ _id: new ObjectId(userId) });
    const currentFriend = await Users.findOne({ _id: new ObjectId(friendId) });

    if (!currentUser || !currentFriend) {
        return false;
    }

    const currentUserFriendIndex = currentUser.friends.findIndex(f => f.id.equals(friendId) && f.status === "pending");
    const currentFriendUserIndex = currentFriend.friends.findIndex(f => f.id.equals(userId) && f.status === "pending");

    if (currentUserFriendIndex === -1 || currentFriendUserIndex === -1) {
        return false;
    }

    currentUser.friends.splice(currentUserFriendIndex, 1);
    currentFriend.friends.splice(currentFriendUserIndex, 1);

    await Users.updateOne({ _id: new ObjectId(userId) }, { $set: { friends: currentUser.friends } });
    await Users.updateOne({ _id: new ObjectId(friendId) }, { $set: { friends: currentFriend.friends } });

    return true;
}

export async function blockFriend(userId: ObjectId, friendId: ObjectId): Promise<boolean> {
    const currentUser = await Users.findOne({ _id: userId });

    if (!currentUser) {
        return false;
    }

    const friendIndex = currentUser.friends.findIndex(f => f.id === friendId);

    if (friendIndex === -1) {
        return false;
    }

    currentUser.friends[friendIndex].status = "blocked";

    await Users.updateOne({ _id: userId }, { $set: { friends: currentUser.friends } });

    return true;
}