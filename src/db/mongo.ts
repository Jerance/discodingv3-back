import { Db, MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI ?? ''
const mongoDbName = process.env.MONGO_DBNAME ?? ''

export let db: Db | undefined;

export async function initDb() {
    console.log('Tentative de connexion à mongo')
    const mongoClient = new MongoClient(mongoUri)
    await mongoClient.connect()
    
    db = mongoClient.db(mongoDbName)
    console.log('Connexion réussie')
}
