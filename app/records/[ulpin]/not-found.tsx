import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function RecordNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="size-7 text-muted-foreground" aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-xl font-semibold">Land record not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        No parcel matches this ULPIN in the demo registry. Check the 14-character ULPIN and try again.
      </p>
      <Link href="/records" className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Back to Land Records
      </Link>
    </div>
  )
}
