"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, ArrowRight } from "lucide-react"
import { getWordbooks } from "@/lib/actions"
import type { Wordbook } from "@/lib/types"

export function WordbookList() {
  const [wordbooks, setWordbooks] = useState<Wordbook[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWordbooks() {
      try {
        const data = await getWordbooks()
        setWordbooks(data)
      } catch (error) {
        console.error("Failed to fetch wordbooks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWordbooks()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Recent Wordbooks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!wordbooks || wordbooks.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold tracking-tight mb-2">No wordbooks yet</h2>
        <p className="text-muted-foreground mb-6">Create your first wordbook to get started</p>
        <Button asChild>
          <Link href="/wordbooks/create">Create Wordbook</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Recent Wordbooks</h2>
        <Button variant="ghost" asChild>
          <Link href="/wordbooks">
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wordbooks.slice(0, 3).map((wordbook) => (
          <Card key={wordbook.id}>
            <CardHeader>
              <CardTitle>{wordbook.title}</CardTitle>
              <CardDescription>{wordbook.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{wordbook.language}</Badge>
                <Badge variant="secondary">{wordbook.wordCount} words</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/wordbooks/${wordbook.id}`}>Open Wordbook</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

