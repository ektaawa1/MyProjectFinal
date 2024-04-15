import { MongoClient } from "mongodb"
import {MONGO_CONNECTION_URI} from "../settings.js"
import { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_NAME } from "../settings.js"


const uri = process.env.MONGO_CONNECTION_URI
let databaseClient;

export async function connectToDatabase() {
    try {
        const client = new MongoClient(uri)
        await client.connect()

        databaseClient =client.db('people-info-2024')
        console.log("database connected successfully...")

        console.log(databaseClient.databaseName)
        return databaseClient
    }
    catch(error){
        console.error(error)
    }
}

export function getPeopleInfo2024Database(){
    return databaseClient
}
