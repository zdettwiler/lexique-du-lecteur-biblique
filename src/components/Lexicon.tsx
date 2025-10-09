import { Pencil, PaintbrushVertical } from 'lucide-react'
import ErrorAlert from '@/components/ErrorAlert'
import LexiconWord from '@/components/LexiconWord'
import PDFLexicon from '@/components/PDFLexicon'
import ReferenceNavButtons from '@/components/ReferenceNavButtons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { BookName, BibleWithLLB } from '@/types'

type Props = {
  book: BookName | undefined
  chapter: number | undefined
  occurrences: string | undefined
}

export default async function Lexicon({ book, chapter, occurrences }: Props) {
  if (!book || !chapter || !occurrences) {
    return
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/llb/ref/${book}/${chapter}/${occurrences}`
  )

  if (!res.ok) {
    return (
      <div className="container max-w-[600px] mx-auto px-4 mt-10">
        <ErrorAlert />
      </div>
    )
  }

  const { lexicon }: { lexicon: BibleWithLLB[] } = await res.json()

  const nbUniqueWords: number = new Set(lexicon.map((w) => w.strong)).size

  const lang = lexicon[0].strong[0]
  const testament = lang === 'H' ? "l'Ancien Testament" : 'le Nouveau Testament'

  return (
    <div className="container max-w-[600px] mx-auto px-4 mt-10">
      <div className="font-serif text-center mb-7">
        <h3 className="font-serif text-xl text-center italic uppercase tracking-[5px] mt-5 mb-3">
          {book} {chapter}
        </h3>
        <PDFLexicon
          book={book}
          chapters={String(chapter)}
          occurrences={occurrences}
          link
        />
        <p className="italic mt-3">
          {occurrences === 'pegonduff'
            ? `${nbUniqueWords} mots n'ont pas été appris dans les manuels de Pégon et Duff.`
            : `${nbUniqueWords} mots apparaissent moins de ${occurrences} fois dans ${testament}`}
          <br />
          Entre parenthèses figure le nombre d&apos;occurrences du mot dans{' '}
          {testament}.
        </p>
      </div>

      <Alert variant="default" className="has-[svg]:grid-cols-[auto_1fr] my-5">
        <Pencil />
        <AlertTitle>Contribuez au LLB!</AlertTitle>
        <AlertDescription>
          Cliquez sur une définition pour proposer une correction.
        </AlertDescription>
      </Alert>

      {lexicon.map((word: BibleWithLLB, id: number, data: BibleWithLLB[]) => {
        const prevVerse = id > 0 ? data[id - 1].verse : 0
        const verse = prevVerse !== word.verse ? word.verse : null

        return <LexiconWord key={id} verseNb={verse} word={word} />
      })}

      <ReferenceNavButtons
        book={book}
        chapter={chapter}
        occurrences={occurrences}
      />
    </div>
  )
}
