import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, ArrowLeft } from "lucide-react"
import { getWordbook } from "@/lib/actions"
import { WordList } from "@/components/word-list"
import { AddWordDialog } from "@/components/add-word-dialog"

interface WordbookPageProps {
  params: {
    id: string
  }
}

export default async function WordbookPage({ params }: WordbookPageProps) {
  const wordbook = await getWordbook(params.id)

  if (!wordbook) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Wordbook Not Found</h1>
        <p className="mb-6">The wordbook you're looking for doesn't exist or has been deleted.</p>
        <Button asChild>
          <Link href="/wordbooks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Wordbooks
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-2">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/wordbooks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{wordbook.title}</h1>
      </div>

      {wordbook.description && <p className="text-muted-foreground mb-6">{wordbook.description}</p>}

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <AddWordDialog wordbookId={params.id} />
          <Button variant="outline" asChild>
            <Link href={`/wordbooks/${params.id}/suggest`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Suggest Words
            </Link>
          </Button>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/wordbooks/${params.id}/practice`}>Practice</Link>
        </Button>
      </div>

      <WordList wordbookId={params.id} words={wordbook.words || []} />
    </div>
  )
}

