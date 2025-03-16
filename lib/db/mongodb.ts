import { MongoClient, ServerApiVersion } from "mongodb"
import { dbConfig } from "../db-config"

// Create a MongoClient with a MongoClientOptions object
const client = new MongoClient(dbConfig.mongodb.uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

// Connection function
async function connectToDatabase() {
  try {
    // Connect the client to the server
    await client.connect()
    console.log("Connected to MongoDB")
    return client.db(dbConfig.mongodb.dbName)
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    throw error
  }
}

// Database singleton
let cachedDb: any = null

export async function getDatabase() {
  if (cachedDb) {
    return cachedDb
  }

  cachedDb = await connectToDatabase()
  return cachedDb
}

export { client as mongoClient }

