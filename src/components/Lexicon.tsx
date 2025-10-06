import { Pencil } from 'lucide-react'
import PDFDownloadButton from '@/components/PDFDownloadButton'
import LexiconWord from '@/components/LexiconWord'
import ReferenceNavButtons from '@/components/ReferenceNavButtons'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { BookName, BibleWithLLB } from '@/types'
import sanitiseRef from '@/utils/sanitiseRef'

type Props = {
  book: BookName | undefined,
  chapter: number | undefined,
  occurences: string | undefined
}

export default async function Lexicon({ book, chapters, occurences }: Props) {
  if (!book || !chapters || !occurences) {
    return
  }

  const sainRef = sanitiseRef(book, String(chapters), occurences, true)
  const singleChapter = sainRef.chapters[0]

  console.log(`lexicon fetch /api/llb/ref/${sainRef.book}/${singleChapter}/${sainRef.occurences}`)

  const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/llb/ref/${sainRef.book}/${singleChapter}/${sainRef.occurences}`)
  const { lexicon }: { lexicon: BibleWithLLB[] } = await data.json()

  if (!lexicon) return []

  const lang = lexicon[0].strong[0]
  const testament = lang === 'H' ? "l'Ancien Testament" : 'le Nouveau Testament'

  return (
    <div className='container max-w-[600px] mx-auto px-4 mt-10'>
      <PDFDownloadButton section={`${book} ${chapters}`} />

      <div className='font-serif text-center mb-7'>
        <h3 className='font-serif text-xl text-center italic uppercase tracking-[5px] mt-5 mb-3'>{book} {singleChapter}</h3>

        <p className='italic mt-3'>
          Mots apparaissant moins de {occurences} fois dans {testament}. <br />
          Entre parenthèses figure le nombre d&apos;occurences du mot dans {testament}.
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
        const verse = prevVerse !== word.verse
          ? word.verse
          : null

        return (
          <LexiconWord
            key={id}
            verseNb={verse}
            word={word}
          />
        )
      })}

      <ReferenceNavButtons
        book={book}
        chapter={singleChapter}
        occurences={occurences}
      />
    </div>
  )
}
