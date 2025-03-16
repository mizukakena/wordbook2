import { CreateWordbookForm } from "@/components/create-wordbook-form"

export default function CreateWordbookPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Create New Wordbook</h1>
      <CreateWordbookForm />
    </div>
  )
}

