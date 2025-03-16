import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Wordbooks table
export const wordbooks = pgTable("wordbooks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  language: text("language").notNull(),
  userId: text("user_id").notNull(),
  wordCount: integer("word_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Words table
export const words = pgTable("words", {
  id: uuid("id").defaultRandom().primaryKey(),
  wordbookId: uuid("wordbook_id").references(() => wordbooks.id, { onDelete: "cascade" }),
  term: text("term").notNull(),
  definition: text("definition").notNull(),
  partOfSpeech: text("part_of_speech"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Define relations
export const wordbooksRelations = relations(wordbooks, ({ many }) => ({
  words: many(words),
}))

export const wordsRelations = relations(words, ({ one }) => ({
  wordbook: one(wordbooks, {
    fields: [words.wordbookId],
    references: [wordbooks.id],
  }),
}))

