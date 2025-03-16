import { createClient } from "@supabase/supabase-js"
import { dbConfig } from "../db-config"
import type { Database } from "./supabase-types"

// Create a single supabase client for the entire app
export const supabase = createClient<Database>(dbConfig.supabase.url, dbConfig.supabase.key)

// Type definitions for our tables
export type Tables = Database["public"]["Tables"]
export type Wordbook = Tables["wordbooks"]["Row"]
export type Word = Tables["words"]["Row"]

