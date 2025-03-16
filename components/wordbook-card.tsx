import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Pencil, Trash2 } from "lucide-react"
import type { Wordbook } from "@/lib/types"

interface WordbookCardProps {
  wordbook: Wordbook
}

export function WordbookCard({ wordbook }: WordbookCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{wordbook.title}</span>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/wordbooks/${wordbook.id}/edit`}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </CardTitle>
        <CardDescription>{wordbook.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline">{wordbook.language}</Badge>
          <Badge variant="secondary">{wordbook.wordCount} words</Badge>
          {wordbook.lastUpdated && (
            <Badge variant="outline" className="ml-auto">
              Updated {new Date(wordbook.lastUpdated).toLocaleDateString()}
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {wordbook.recentWords && wordbook.recentWords.length > 0 ? (
            <div>
              <p className="mb-2">Recent words:</p>
              <div className="flex flex-wrap gap-2">
                {wordbook.recentWords.map((word, index) => (
                  <Badge key={index} variant="secondary">
                    {word}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <p>No words added yet</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/wordbooks/${wordbook.id}`}>
            <BookOpen className="mr-2 h-4 w-4" />
            Open Wordbook
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

