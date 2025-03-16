export interface Wordbook {
  id: string
  title: string
  description?: string
  language: string
  wordCount: number
  lastUpdated?: string
  recentWords?: string[]
  words?: Word[]
}

export interface Word {
  id: string
  term: string
  definition: string
  partOfSpeech?: string
  notes?: string
  createdAt: string
}

export interface WordSuggestion {
  id: string
  term: string
  definition: string
  partOfSpeech?: string
}

export interface CreateWordbookData {
  title: string
  description?: string
  language: string
}

export interface AddWordData {
  term: string
  definition: string
  partOfSpeech?: string
  notes?: string
}

