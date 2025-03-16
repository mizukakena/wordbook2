import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SetupPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Database Setup</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Choose a Database Provider</CardTitle>
          <CardDescription>Select a database provider to store your wordbooks and words.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Wordbook needs a database to store your wordbooks and words. Choose one of the following providers:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Supabase</CardTitle>
                <CardDescription>PostgreSQL + Auth + Storage</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Supabase provides PostgreSQL, authentication, and storage in one platform.</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="https://supabase.com/dashboard/new">Set up Supabase</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vercel Postgres</CardTitle>
                <CardDescription>Serverless PostgreSQL</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Vercel Postgres is a serverless PostgreSQL database built for Next.js.</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="https://vercel.com/dashboard/stores">Set up Vercel Postgres</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            After setting up your database, you'll need to configure your environment variables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Once you've set up your database, you'll need to add the following environment variables to your Vercel
            project:
          </p>

          <div className="bg-muted p-4 rounded-md mb-4">
            <pre className="text-sm whitespace-pre-wrap">
              {`# For Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# For Vercel Postgres
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling
POSTGRES_USER=your_postgres_user
POSTGRES_HOST=your_postgres_host
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database`}
            </pre>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link href="/wordbooks">Continue to Wordbooks</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

