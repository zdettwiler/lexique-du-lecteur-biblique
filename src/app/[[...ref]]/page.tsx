import Title from '@/components/Title'
import LexiconForm from '@/components/LexiconForm'
import PDFLexicon from '@/components/PDFLexicon'
import Lexicon from '@/components/Lexicon'
import { Suspense } from 'react'
import { LoaderCircle } from 'lucide-react'
import type { BookName } from '@/types'

export default async function Home({
  params
}: {
  params: { ref?: [BookName, string, string] }
}) {
  const ref = await params

  const [book, chapters, occurrences] =
    Array.isArray(ref.ref) && ref.ref.length === 3
      ? [
          decodeURIComponent(ref.ref[0]) as BookName,
          decodeURIComponent(ref.ref[1]),
          decodeURIComponent(ref.ref[2])
        ]
      : [undefined, undefined, undefined]

  const isChapterRange =
    chapters === '' ||
    chapters === '*' ||
    chapters?.includes(',') ||
    chapters?.includes('-')

  return (
    <main className="container mx-auto dark:bg-red">
      <Title />
      <LexiconForm book={book} chapters={chapters} occurrences={occurrences} />
      <Suspense
        fallback={
          <LoaderCircle className="animate-spin size-10 text-primary text-center mx-auto mt-10" />
        }
      >
        {isChapterRange ? (
          // if a range of chapters or whole book is selected, generate and display PDF
          <PDFLexicon
            book={book}
            chapters={chapters}
            occurrences={occurrences}
          />
        ) : (
          // if a single chapter is selected, display lexicon in browser (button available for optional download)
          <Lexicon
            book={book}
            chapter={Number(chapters)}
            occurrences={occurrences}
          />
        )}
      </Suspense>
    </main>
  )
}
