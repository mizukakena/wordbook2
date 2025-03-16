"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { revalidatePath } from "next/cache"
import { supabase } from "./db/supabase"
import { cookies } from "next/headers"
import type { CreateWordbookData, AddWordData } from "./types"

// Get the current user ID from the session
async function getUserId() {
  const cookieStore = cookies()
  const supabaseClient = supabase.withSession(cookieStore)

  const {
    data: { session },
  } = await supabaseClient.auth.getSession()
  if (!session) {
    throw new Error("Not authenticated")
  }

  return session.user.id
}

export async function getWordbooks() {
  try {
    const userId = await getUserId()

    const { data, error } = await supabase
      .from("wordbooks")
      .select(`
        id, 
        title, 
        description, 
        language, 
        updated_at,
        (select count(*) from words where wordbook_id = wordbooks.id) as word_count
      `)
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) throw error

    // Get recent words for each wordbook
    const wordbooksWithRecentWords = await Promise.all(
      data.map(async (wordbook) => {
        const { data: recentWords } = await supabase
          .from("words")
          .select("term")
          .eq("wordbook_id", wordbook.id)
          .order("created_at", { ascending: false })
          .limit(5)

        return {
          ...wordbook,
          wordCount: wordbook.word_count,
          lastUpdated: wordbook.updated_at,
          recentWords: recentWords?.map((word) => word.term) || [],
        }
      }),
    )

    return wordbooksWithRecentWords
  } catch (error) {
    console.error("Error fetching wordbooks:", error)
    return []
  }
}

export async function getAllWordbooks() {
  try {
    const userId = await getUserId()

    const { data, error } = await supabase
      .from("wordbooks")
      .select(`
        id, 
        title, 
        description, 
        language, 
        updated_at,
        (select count(*) from words where wordbook_id = wordbooks.id) as word_count
      `)
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) throw error

    // Get recent words for each wordbook
    const wordbooksWithRecentWords = await Promise.all(
      data.map(async (wordbook) => {
        const { data: recentWords } = await supabase
          .from("words")
          .select("term")
          .eq("wordbook_id", wordbook.id)
          .order("created_at", { ascending: false })
          .limit(5)

        return {
          ...wordbook,
          wordCount: wordbook.word_count,
          lastUpdated: wordbook.updated_at,
          recentWords: recentWords?.map((word) => word.term) || [],
        }
      }),
    )

    return wordbooksWithRecentWords
  } catch (error) {
    console.error("Error fetching all wordbooks:", error)
    return []
  }
}

export async function getWordbook(id: string) {
  try {
    const userId = await getUserId()

    // Get the wordbook
    const { data: wordbook, error: wordbookError } = await supabase
      .from("wordbooks")
      .select("id, title, description, language, updated_at")
      .eq("id", id)
      .eq("user_id", userId)
      .single()

    if (wordbookError) throw wordbookError

    // Get the words in the wordbook
    const { data: words, error: wordsError } = await supabase
      .from("words")
      .select("id, term, definition, part_of_speech, notes, created_at")
      .eq("wordbook_id", id)
      .order("term", { ascending: true })

    if (wordsError) throw wordsError

    return {
      ...wordbook,
      lastUpdated: wordbook.updated_at,
      words: words.map((word) => ({
        id: word.id,
        term: word.term,
        definition: word.definition,
        partOfSpeech: word.part_of_speech,
        notes: word.notes,
        createdAt: word.created_at,
      })),
      wordCount: words.length,
    }
  } catch (error) {
    console.error("Error fetching wordbook:", error)
    return null
  }
}

export async function getWordbookForPractice(id: string) {
  try {
    const userId = await getUserId()

    // Verify the wordbook belongs to the user
    const { data: wordbook, error: wordbookError } = await supabase
      .from("wordbooks")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .single()

    if (wordbookError) throw wordbookError

    // Get the words in the wordbook
    const { data: words, error: wordsError } = await supabase
      .from("words")
      .select("id, term, definition, part_of_speech, notes, created_at")
      .eq("wordbook_id", id)

    if (wordsError) throw wordsError

    return words.map((word) => ({
      id: word.id,
      term: word.term,
      definition: word.definition,
      partOfSpeech: word.part_of_speech,
      notes: word.notes,
      createdAt: word.created_at,
    }))
  } catch (error) {
    console.error("Error fetching wordbook for practice:", error)
    return null
  }
}

export async function createWordbook(data: CreateWordbookData) {
  try {
    const userId = await getUserId()

    const { data: wordbook, error } = await supabase
      .from("wordbooks")
      .insert({
        title: data.title,
        description: data.description,
        language: data.language,
        user_id: userId,
      })
      .select("id")
      .single()

    if (error) throw error

    revalidatePath("/wordbooks")
    return wordbook.id
  } catch (error) {
    console.error("Error creating wordbook:", error)
    throw new Error("Failed to create wordbook")
  }
}

export async function addWord(wordbookId: string, data: AddWordData) {
  try {
    const userId = await getUserId()

    // Verify the wordbook belongs to the user
    const { data: wordbook, error: wordbookError } = await supabase
      .from("wordbooks")
      .select("id")
      .eq("id", wordbookId)
      .eq("user_id", userId)
      .single()

    if (wordbookError) throw wordbookError

    // Add the word
    const { error: wordError } = await supabase.from("words").insert({
      wordbook_id: wordbookId,
      term: data.term,
      definition: data.definition,
      part_of_speech: data.partOfSpeech,
      notes: data.notes,
    })

    if (wordError) throw wordError

    // Update the wordbook's updated_at timestamp
    await supabase.from("wordbooks").update({ updated_at: new Date().toISOString() }).eq("id", wordbookId)

    revalidatePath(`/wordbooks/${wordbookId}`)
  } catch (error) {
    console.error("Error adding word:", error)
    throw new Error("Failed to add word")
  }
}

export async function generateExampleSentence(wordbookId: string, wordId: string, term: string) {
  try {
    const userId = await getUserId()

    // Verify the wordbook belongs to the user
    const { data: wordbook, error: wordbookError } = await supabase
      .from("wordbooks")
      .select("id, language")
      .eq("id", wordbookId)
      .eq("user_id", userId)
      .single()

    if (wordbookError) throw wordbookError

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Generate a natural, contextually appropriate example sentence using the word "${term}" in the context of ${wordbook.language}. The sentence should be clear and helpful for someone learning this word. Only return the sentence, nothing else.`,
    })

    return text.trim()
  } catch (error) {
    console.error("Error generating example sentence:", error)
    return `Example sentence for "${term}" could not be generated.`
  }
}

export async function suggestWords(wordbookId: string, topic: string) {
  try {
    const userId = await getUserId()

    // Verify the wordbook belongs to the user
    const { data: wordbook, error: wordbookError } = await supabase
      .from("wordbooks")
      .select("id, language")
      .eq("id", wordbookId)
      .eq("user_id", userId)
      .single()

    if (wordbookError) throw wordbookError

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Generate 10 words related to "${topic}" in the context of ${wordbook.language}. For each word, provide:
      1. The word itself
      2. A clear, concise definition
      3. The part of speech (noun, verb, adjective, etc.)
      
      Format your response as a JSON array of objects with the properties: term, definition, and partOfSpeech.
      Make sure the JSON is valid and can be parsed.`,
    })

    try {
      const suggestions = JSON.parse(text) as Array<{
        term: string
        definition: string
        partOfSpeech: string
      }>

      return suggestions.map((suggestion) => ({
        id: crypto.randomUUID(),
        ...suggestion,
      }))
    } catch (error) {
      console.error("Error parsing suggestions:", error)
      throw new Error("Failed to parse word suggestions")
    }
  } catch (error) {
    console.error("Error generating word suggestions:", error)
    throw new Error("Failed to generate word suggestions")
  }
}

export async function addSuggestedWords(wordbookId: string, wordIds: string[]) {
  // In a real implementation, you would store the suggested words temporarily
  // and then add the selected ones to the database

  revalidatePath(`/wordbooks/${wordbookId}`)
}

