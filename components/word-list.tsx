"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Search, X } from "lucide-react"
import { generateExampleSentence } from "@/lib/actions"
import type { Word } from "@/lib/types"

interface WordListProps {
  wordbookId: string
  words: Word[]
}

export function WordList({ wordbookId, words }: WordListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [loadingExamples, setLoadingExamples] = useState<Record<string, boolean>>({})
  const [examples, setExamples] = useState<Record<string, string>>({})

  const filteredWords = words.filter(
    (word) =>
      word.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedWords = [...filteredWords].sort((a, b) => {
    if (activeTab === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    return a.term.localeCompare(b.term)
  })

  async function handleGenerateExample(wordId: string, term: string) {
    setLoadingExamples((prev) => ({ ...prev, [wordId]: true }))
    try {
      const example = await generateExampleSentence(wordbookId, wordId, term)
      setExamples((prev) => ({ ...prev, [wordId]: example }))
    } catch (error) {
      console.error("Failed to generate example:", error)
    } finally {
      setLoadingExamples((prev) => ({ ...prev, [wordId]: false }))
    }
  }

  if (words.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-card">
        <h2 className="text-xl font-medium mb-2">No words added yet</h2>
        <p className="text-muted-foreground mb-6">Add your first word to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search words..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
        </div>
        <Tabs defaultValue="all" className="w-[300px]" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">Alphabetical</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {sortedWords.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">No words match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedWords.map((word) => (
            <Card key={word.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{word.term}</span>
                  {word.partOfSpeech && (
                    <span className="text-sm font-normal text-muted-foreground">{word.partOfSpeech}</span>
                  )}
                </CardTitle>
                <CardDescription>{word.definition}</CardDescription>
              </CardHeader>
              <CardContent>
                {word.notes && <p className="text-sm mb-4">{word.notes}</p>}

                {examples[word.id] ? (
                  <div className="bg-muted p-3 rounded-md mb-4">
                    <p className="text-sm italic">"{examples[word.id]}"</p>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mb-4"
                    onClick={() => handleGenerateExample(word.id, word.term)}
                    disabled={loadingExamples[word.id]}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {loadingExamples[word.id] ? "Generating..." : "Generate Example"}
                  </Button>
                )}

                <div className="text-xs text-muted-foreground">
                  Added {new Date(word.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

