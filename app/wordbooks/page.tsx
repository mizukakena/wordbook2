import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getAllWordbooks } from "@/lib/actions"
import { WordbookCard } from "@/components/wordbook-card"

export default async function WordbooksPage() {
  const wordbooks = await getAllWordbooks()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Wordbooks</h1>
        <Button asChild>
          <Link href="/wordbooks/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Wordbook
          </Link>
        </Button>
      </div>

      {wordbooks.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card">
          <h2 className="text-xl font-medium mb-2">No wordbooks yet</h2>
          <p className="text-muted-foreground mb-6">Create your first wordbook to get started</p>
          <Button asChild>
            <Link href="/wordbooks/create">Create Wordbook</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wordbooks.map((wordbook) => (
            <WordbookCard key={wordbook.id} wordbook={wordbook} />
          ))}
        </div>
      )}
    </div>
  )
}

