"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react"
import { getWordbookForPractice } from "@/lib/actions"
import type { Word } from "@/lib/types"

interface PracticePageProps {
  params: {
    id: string
  }
}

export default function PracticePage({ params }: PracticePageProps) {
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDefinition, setShowDefinition] = useState(false)
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [allCompleted, setAllCompleted] = useState(false)

  useEffect(() => {
    async function fetchWords() {
      try {
        const data = await getWordbookForPractice(params.id)
        if (data && data.length > 0) {
          // Shuffle the words
          const shuffled = [...data].sort(() => Math.random() - 0.5)
          setWords(shuffled)
        } else {
          setWords([])
        }
      } catch (error) {
        console.error("Failed to fetch words for practice:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWords()
  }, [params.id])

  const currentWord = words[currentIndex]
  const isLastWord = currentIndex === words.length - 1

  function handleNext() {
    if (!isLastWord) {
      setCurrentIndex((prev) => prev + 1)
      setShowDefinition(false)
    }
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setShowDefinition(false)
    }
  }

  function handleMarkCompleted(wordId: string, isCompleted: boolean) {
    setCompleted((prev) => ({
      ...prev,
      [wordId]: isCompleted,
    }))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading practice session...</p>
      </div>
    )
  }

  if (words.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">No Words Available</h1>
        <p className="mb-6">Add some words to your wordbook before practicing.</p>
        <Button asChild>
          <Link href={`/wordbooks/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Wordbook
          </Link>
        </Button>
      </div>
    )
  }

  if (allCompleted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md text-center">
        <Card>
          <CardHeader>
            <CardTitle>Practice Completed!</CardTitle>
            <CardDescription>You've gone through all the words in this practice session.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">Great job! You've practiced {words.length} words.</p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button asChild>
              <Link href={`/wordbooks/${params.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Wordbook
              </Link>
            </Button>
            <Button
              onClick={() => {
                setCurrentIndex(0)
                setCompleted({})
                setShowDefinition(false)
                // Reshuffle the words
                setWords((prev) => [...prev].sort(() => Math.random() - 0.5))
                setAllCompleted(false)
              }}
            >
              Practice Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" asChild>
          <Link href={`/wordbooks/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Wordbook
          </Link>
        </Button>
        <div className="text-sm text-muted-foreground">
          {currentIndex + 1} of {words.length}
        </div>
      </div>

      {currentWord && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-3xl">{currentWord.term}</CardTitle>
            {currentWord.partOfSpeech && (
              <CardDescription className="text-center">{currentWord.partOfSpeech}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="text-center">
            {showDefinition ? (
              <div className="p-4 bg-muted rounded-md">
                <p className="text-xl">{currentWord.definition}</p>
                {currentWord.notes && <p className="mt-4 text-sm text-muted-foreground">{currentWord.notes}</p>}
              </div>
            ) : (
              <Button variant="outline" className="mx-auto" onClick={() => setShowDefinition(true)}>
                Show Definition
              </Button>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="text-destructive"
                onClick={() => handleMarkCompleted(currentWord.id, false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Mark as incorrect</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-green-600"
                onClick={() => handleMarkCompleted(currentWord.id, true)}
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">Mark as correct</span>
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentIndex === 0}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button size="icon" onClick={handleNext} disabled={isLastWord}>
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {Object.keys(completed).length} of {words.length} completed
        </div>
        {isLastWord && <Button onClick={() => setAllCompleted(true)}>Finish Practice</Button>}
      </div>
    </div>
  )
}

