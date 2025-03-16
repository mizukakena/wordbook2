"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react"
import { suggestWords, addSuggestedWords } from "@/lib/actions"
import type { WordSuggestion } from "@/lib/types"

interface SuggestWordsPageProps {
  params: {
    id: string
  }
}

export default function SuggestWordsPage({ params }: SuggestWordsPageProps) {
  const router = useRouter()
  const [topic, setTopic] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<WordSuggestion[]>([])
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [isAdding, setIsAdding] = useState(false)

  async function handleSuggest() {
    if (!topic.trim()) return

    setIsLoading(true)
    try {
      const suggestedWords = await suggestWords(params.id, topic)
      setSuggestions(suggestedWords)
      setSelectedWords(suggestedWords.map((word) => word.id))
    } catch (error) {
      console.error("Failed to get suggestions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleToggleWord(wordId: string) {
    setSelectedWords((prev) => (prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId]))
  }

  async function handleAddSelected() {
    if (selectedWords.length === 0) return

    setIsAdding(true)
    try {
      await addSuggestedWords(params.id, selectedWords)
      router.push(`/wordbooks/${params.id}`)
    } catch (error) {
      console.error("Failed to add words:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild className="mr-4">
          <Link href={`/wordbooks/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Wordbook
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Suggest Words</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>AI Word Suggestions</CardTitle>
          <CardDescription>
            Enter a topic or theme to get AI-powered word suggestions for your wordbook.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter a topic (e.g., 'travel', 'technology', 'cooking')"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSuggest} disabled={isLoading || !topic.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Suggest Words
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Words</CardTitle>
            <CardDescription>Select the words you want to add to your wordbook.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex items-start space-x-3 p-3 rounded-md border">
                  <Checkbox
                    id={suggestion.id}
                    checked={selectedWords.includes(suggestion.id)}
                    onCheckedChange={() => handleToggleWord(suggestion.id)}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={suggestion.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {suggestion.term}
                      {suggestion.partOfSpeech && (
                        <span className="ml-2 text-xs text-muted-foreground">({suggestion.partOfSpeech})</span>
                      )}
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">{suggestion.definition}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setSelectedWords([])}>
              Clear Selection
            </Button>
            <Button onClick={handleAddSelected} disabled={selectedWords.length === 0 || isAdding}>
              {isAdding ? "Adding..." : `Add ${selectedWords.length} Selected Words`}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

