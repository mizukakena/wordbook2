import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, BookOpen, Sparkles } from "lucide-react"
import { WordbookList } from "@/components/wordbook-list"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-primary">Wordbook</span>
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl">
          Create custom wordbooks for languages or technical terms with AI-powered example sentences and vocabulary
          suggestions.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/wordbooks/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Wordbook
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/wordbooks">
              <BookOpen className="mr-2 h-4 w-4" />
              My Wordbooks
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <BookOpen className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">Custom Wordbooks</h3>
            <p className="text-muted-foreground">Create personalized wordbooks for any language or technical domain</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <Sparkles className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">AI-Powered Examples</h3>
            <p className="text-muted-foreground">Generate contextual example sentences for any word with GPT</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <PlusCircle className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">Vocabulary Suggestions</h3>
            <p className="text-muted-foreground">Get AI-powered vocabulary suggestions to expand your wordbooks</p>
          </div>
        </div>
      </section>

      <WordbookList />
    </main>
  )
}

