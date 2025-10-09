import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { BookName } from '@/types'
import { books, bookMeta } from '@/utils/booksMetadata'

type Props = {
  book: BookName
  chapter: number
  occurences: string
}

export default function ReferenceNavButtons({
  book,
  chapter,
  occurences
}: Props) {
  function getRef(
    dir: 'prev' | 'next',
    book: BookName,
    chapter: number
  ): { book: BookName; chapter: number } {
    const bookNbChap = bookMeta[book].nbChap

    if (dir === 'prev' && Number(chapter) === 1) {
      // go to last chapter of previous book
      const bookIndex = books.indexOf(book)
      const prevBook = books[bookIndex === 0 ? books.length - 1 : bookIndex - 1] // if book = Gn, go to Ap
      const prevBookNbChap = bookMeta[prevBook].nbChap

      return {
        book: prevBook,
        chapter: prevBookNbChap
      }
    } else if (dir === 'next' && Number(chapter) === bookNbChap) {
      // go to fist chapter of next book
      const bookIndex = books.indexOf(book)
      const nextBook = books[bookIndex === books.length - 1 ? 0 : bookIndex + 1] // if book = Ap, go to Gn

      return {
        book: nextBook,
        chapter: 1
      }
    } else if (dir === 'prev') {
      return {
        book,
        chapter: Number(chapter) - 1
      }
    } else {
      // if (dir === "next")
      return {
        book,
        chapter: Number(chapter) + 1
      }
    }
  }

  const prevRef = getRef('prev', book, chapter)
  const nextRef = getRef('next', book, chapter)

  return (
    <div className="flex flex-row justify-between mt-10">
      <Button
        type="submit"
        size="xs"
        variant="outline"
        className="font-sans"
        asChild
      >
        <Link href={`/${prevRef.book}/${prevRef.chapter}/${occurences}`}>
          <ArrowLeft /> {bookMeta[prevRef.book].label} {prevRef.chapter}
        </Link>
      </Button>
      <Button
        type="submit"
        size="xs"
        variant="outline"
        className="font-sans"
        asChild
      >
        <Link href={`/${nextRef.book}/${nextRef.chapter}/${occurences}`}>
          {bookMeta[nextRef.book].label} {nextRef.chapter} <ArrowRight />
        </Link>
      </Button>
    </div>
  )
}
