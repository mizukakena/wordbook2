// Database configuration
export const dbConfig = {
  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL || "",
    key: process.env.SUPABASE_ANON_KEY || "",
  },

  // Neon PostgreSQL configuration
  neon: {
    connectionString: process.env.DATABASE_URL || "",
  },

  // MongoDB configuration
  mongodb: {
    uri: process.env.MONGODB_URI || "",
    dbName: process.env.MONGODB_DB_NAME || "wordbook",
  },
}

