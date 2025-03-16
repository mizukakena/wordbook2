import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { dbConfig } from "../db-config"
import * as schema from "./schema"

// Create a neon client
const sql = neon(dbConfig.neon.connectionString)

// Create a drizzle client
export const db = drizzle(sql, { schema })

