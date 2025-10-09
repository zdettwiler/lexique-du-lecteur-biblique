import { NextResponse, type NextRequest } from 'next/server'
import sanitiseRef from '@/utils/sanitiseRef'
import { db } from '@/lib/db'

import type { BibleWithLLB } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { ref: [string, string, string] } }
) {
  const {
    ref: [bookParam, chaptersParam, occurrencesParam]
  } = await params
  const sainRef = sanitiseRef(bookParam, chaptersParam, occurrencesParam, true)

  if (!sainRef) {
    return NextResponse.json(
      { error: 'Erreur: Problème de paramètres.' },
      { status: 400 }
    )
  }

  try {
    const words: BibleWithLLB[] = await db.bible.findMany({
      orderBy: { id: 'asc' },
      where: {
        book: { equals: sainRef.book },
        chapter:
          sainRef.chapters !== '*'
            ? { in: sainRef.chapters as number[] }
            : undefined,
        llbword: {
          freq:
            sainRef.occurrences && typeof sainRef.occurrences === 'number'
              ? { lte: sainRef.occurrences }
              : undefined,
          pegonduff:
            sainRef.occurrences === 'pegonduff' ? { is: null } : undefined
        }
      },
      include: {
        llbword: {
          select: {
            gloss: true,
            freq: true
          }
        }
      }
    })

    const lexicon = words.reduce((lexicon: BibleWithLLB[], word) => {
      const isSameWordInVerse = lexicon.find(
        (lexiconWord) =>
          lexiconWord.chapter === word.chapter &&
          lexiconWord.verse === word.verse &&
          lexiconWord.strong === word.strong
      )
      if (!isSameWordInVerse) {
        lexicon.push(word)
      }
      return lexicon
    }, [])

    return NextResponse.json({ lexicon }, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack)
    }
    return NextResponse.json(
      { msg: 'Erreur: Oups! Il y a eu un problème!' },
      { status: 500 }
    )
  }
}
