import { ObjectId } from "mongodb";

export interface Users_servers {
    server_id: ObjectId
    users: {
      idUser: ObjectId
    }[]
}